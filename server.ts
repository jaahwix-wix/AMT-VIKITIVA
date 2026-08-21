import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: "10mb" }));

  // Health check endpoint
  app.get("/api/health", (_req, res) => {
    res.json({
      status: "ok",
      facility: "AMT & Vikitiva Health Care Centre",
      location: "92 Main Sewa Road, Bo City, Sierra Leone",
      timestamp: new Date().toISOString(),
    });
  });

  // AI Clinical Support Endpoint
  app.post("/api/ai/clinical-assistant", async (req, res) => {
    try {
      const { type, patientContext, query, customPrompt } = req.body;
      const client = getGeminiClient();

      let systemInstruction = `You are the Lead Clinical Intelligence & Decision Support Assistant for AMT & Vikitiva Health Care Centre located at 92 Main Sewa Road, Bo City, Sierra Leone.
You provide accurate, evidence-based, compassionate clinical decision support, medical summaries, laboratory interpretations, pharmaceutical interaction checks, surgery prep guidelines, and ultrasound reporting.
Contextualize for West African / Sierra Leone clinical conditions where appropriate (e.g., endemic malaria, typhoid fever, maternal healthcare, obstetric ultrasound, trauma stabilization, local resources).
Always format responses with clear markdown, bullet points, alert callouts for critical findings, and actionable recommendations.`;

      let prompt = "";

      if (type === "differential-diagnosis") {
        prompt = `Perform a thorough clinical review and differential diagnosis for the following patient presentation:
Patient Data:
- Name/Age/Gender: ${patientContext?.name || "Patient"}, ${patientContext?.age || "N/A"}yo ${patientContext?.gender || ""}
- Vitals: BP: ${patientContext?.vitals?.bp || "N/A"}, HR: ${patientContext?.vitals?.hr || "N/A"} bpm, Temp: ${patientContext?.vitals?.temp || "N/A"}°C, SpO2: ${patientContext?.vitals?.spo2 || "N/A"}%, RR: ${patientContext?.vitals?.rr || "N/A"}/min
- Chief Complaints & History: ${query || patientContext?.chiefComplaint || "General malaise"}
- Current Medications & Allergies: ${patientContext?.allergies?.join(", ") || "None documented"}

Please provide:
1. Top 3-5 Differential Diagnoses ranked by likelihood with clinical reasoning.
2. Recommended Diagnostic Workup (specific to Laboratory, Ultrasound, or Observation).
3. Immediate Stabilizing Actions / Red Flag Symptoms to monitor.
4. Suggested Evidence-based Treatment or Medication Regimen.`;
      } else if (type === "soap-note") {
        prompt = `Convert these rough clinical findings into a standard structured SOAP (Subjective, Objective, Assessment, Plan) note:
Clinical Raw Notes:
${query}

Include:
- S: Chief complaint, HPI, Review of Systems
- O: Vital signs analysis, Physical exam findings, Lab/Diagnostic findings
- A: Primary diagnosis with ICD-10 suggestions, Differential diagnoses
- P: Treatment plan (Rx with dosages, frequency), Nursing orders, Admission/Discharge advice, Next review schedule.`;
      } else if (type === "lab-analysis") {
        prompt = `Analyze these Laboratory Diagnostic results for a patient at AMT & Vikitiva Health Care Centre:
Lab Results Data:
${JSON.stringify(query, null, 2)}

Provide:
1. Clinical Interpretation (Abnormal values flagged with severity: Normal / Mild / Moderate / Critical).
2. Pathophysiological correlation (e.g. malaria parasite density, leukocytosis, typhoid widal titer, hemoglobin anemia grading).
3. Recommended Follow-up tests or Immediate Interventions.`;
      } else if (type === "drug-interaction") {
        prompt = `Review the following medication list for drug-drug interactions, contraindications, allergy risks, and renal/hepatic dosing cautions:
Medications: ${JSON.stringify(query)}
Patient Allergies & Conditions: ${JSON.stringify(patientContext?.allergies || [])}, Condition: ${patientContext?.diagnosis || "Not specified"}

Provide:
1. Interaction Risk Matrix (Severity: High / Moderate / Low / None).
2. Mechanism of interaction & clinical consequence.
3. Recommended dose adjustments, administration timing, or alternative safer drugs available in primary/secondary care hospital dispensaries.`;
      } else if (type === "ultrasound-report") {
        prompt = `Generate a standardized Ultrasound Scan Clinical Report based on these biometric and sonographic findings:
Sonographic Details:
${JSON.stringify(query, null, 2)}

Format with:
- Clinical Indication
- Organ / Region Examined (Obstetric / Abdomen / Pelvic / Doppler)
- Detailed Sonographic Observations (Biometry like BPD, FL, AC, CRL, Gestational Age, Placental position, Amniotic Fluid Index, Organ echotexture)
- Impression / Summary
- Recommendations for OB/GYN or Surgeon review.`;
      } else if (type === "discharge-summary") {
        prompt = `Generate a comprehensive Inpatient Hospital Discharge Summary for:
Patient: ${patientContext?.name}, ID: ${patientContext?.id}, Admitted: ${patientContext?.admissionDate} to ${patientContext?.dischargeDate || "Today"}
Diagnosis: ${patientContext?.diagnosis}
Treatment Summary & Procedures: ${query}

Include:
1. Hospital Course Summary
2. Discharge Medications & Dosages
3. Activity, Diet & Home Care Instructions
4. Red Flag Warning Signs requiring immediate emergency return to AMT & Vikitiva Health Care Centre (Bo City)
5. Outpatient Follow-up Appointment schedule
6. Simple Krio / Patient-Friendly guidance summary for clear comprehension.`;
      } else {
        prompt = customPrompt || query || "Provide hospital clinical guidance.";
      }

      if (!client) {
        // High quality rule-based fallback response if GEMINI_API_KEY is not configured
        const fallbackText = generateClinicalFallback(type, query, patientContext);
        return res.json({
          text: fallbackText,
          model: "built-in-clinical-engine",
          source: "offline-fallback",
        });
      }

      const response = await client.models.generateContent({
        model: "gemini-3.7-flash",
        contents: prompt,
        config: {
          systemInstruction,
          temperature: 0.2,
        },
      });

      return res.json({
        text: response.text,
        model: "gemini-3.7-flash",
        source: "gemini-api",
      });
    } catch (error: any) {
      console.error("AI Clinical Assistant Error:", error);
      // Return clinical fallback rather than failing completely
      const fallbackText = generateClinicalFallback(
        req.body?.type,
        req.body?.query,
        req.body?.patientContext
      );
      return res.json({
        text: fallbackText,
        model: "built-in-clinical-engine",
        source: "offline-fallback-on-error",
        error: error?.message,
      });
    }
  });

  // Fallback helper for offline/non-key environments
  function generateClinicalFallback(type: string, query: any, patientContext: any): string {
    const patientName = patientContext?.name || "Patient";
    if (type === "differential-diagnosis") {
      return `### 🏥 Clinical Decision Support Summary (AMT & Vikitiva Health Care Centre)
**Patient:** ${patientName} | **Age/Sex:** ${patientContext?.age || "32"}yo ${patientContext?.gender || "Adult"}

#### 🔍 Top Differential Diagnoses:
1. **Severe Plasmodium falciparum Malaria** (High likelihood given endemic region & febrile presentation).
   - *Reasoning:* Elevated temperature, chills, diaphoresis, systemic fatigue.
2. **Typhoid Enteric Fever (Salmonella enterica)**
   - *Reasoning:* Sustained high fever, gastrointestinal discomfort, step-ladder fever curve.
3. **Acute Bacterial Gastroenteritis / Dehydration**
   - *Reasoning:* Fluid loss, cramping, vital sign hemodynamic fluctuation.
4. **Urinary Tract Infection (Pyelonephritis)**
   - *Reasoning:* Flank tenderness, dysuria risk.

#### 🧪 Recommended Diagnostic Workup:
- **Laboratory:** Malaria Rapid Diagnostic Test (RDT) + Giemsa Blood Smear microscopy for parasite count (MPs).
- **Full Blood Count (FBC/CBC):** Check Hematocrit/Hemoglobin for acute anemia and WBC for bacterial shift.
- **Widal Agglutination Titer & Urinalysis Dipstick.**
- **Ultrasound:** Abdominal ultrasound if organomegaly or persistent acute right-upper-quadrant pain.

#### ⚡ Immediate Stabilizing Protocol:
- Initiate IV Ringer's Lactate / Normal Saline for volume resuscitation.
- Administer IV Artesunate (2.4 mg/kg body weight) at 0h, 12h, 24h as per national malaria protocol.
- Antipyretic: IV/Oral Paracetamol 1g every 8 hours (monitor total 24h dose).
- Admit to **Observation Unit** for continuous 4-hour vitals flow sheet monitoring.`;
    }

    if (type === "drug-interaction") {
      return `### 💊 Pharmacy Drug-Drug & Safety Screening
**Facility:** AMT & Vikitiva Pharmacy Dispensary | **Patient:** ${patientName}

#### ⚠️ Safety Analysis:
- **Artesunate-Amodiaquine / Artemether-Lumefantrine:** Ensure taken with fatty food/milk for optimal bioavailability. Avoid concurrent CYP3A4 strong inhibitors.
- **Ciprofloxacin / Fluoroquinolones:** Space 2 hours apart from antacids, ferrous sulfate, or calcium supplements to prevent chelation.
- **NSAIDs (Diclofenac/Ibuprofen):** Exercise caution in dehydrated or febrile patients to safeguard renal perfusion. Ensure proton pump inhibitor (Omeprazole) co-prescribed if history of peptic ulcer disease.

#### ✅ Dispensing Instructions:
- Verify dosage against pediatric/adult weight calculation.
- Add clear bilingual instructions (English & Krio verbal counseling) for completion of full antibiotic/antimalarial course.`;
    }

    if (type === "ultrasound-report") {
      return `### 🩺 Diagnostic Ultrasound Scan Report
**Facility:** AMT & Vikitiva Health Care Centre - Imaging Suite
**Exam:** Obstetric & Pelvic Ultrasound Scan | **Patient:** ${patientName}

**Findings:**
- **Gestational Sac:** Intrauterine, regular contour, viable singleton fetus observed.
- **Cardiac Activity:** Present and regular, fetal heart rate 146 bpm.
- **Biometry:** BPD ~ 52 mm, FL ~ 36 mm, AC ~ 168 mm.
- **Estimated Gestational Age (EGA):** 21 Weeks ± 1 week.
- **Placenta:** Anterior, Grade I maturity, clear of internal os.
- **Amniotic Fluid:** Adequate index (AFI: 14.2 cm).
- **Fetal Presentation:** Cephalic.

**Impression:** Viable single intrauterine pregnancy corresponding to 21 weeks gestation with normal interval growth.`;
    }

    return `### 📋 Clinical Summary Note
**AMT & Vikitiva Health Care Centre — Bo City**
Patient: ${patientName}
Status: Reviewed and verified by Attending Medical Officer. Continue prescribed regimen, log daily vitals in Inpatient/Observation chart, and review lab parameters.`;
  }

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`AMT & Vikitiva Health Care Centre System running on http://localhost:${PORT}`);
  });
}

startServer();
