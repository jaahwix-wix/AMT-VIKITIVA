import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  X,
  Send,
  Loader2,
  Copy,
  Check,
  Stethoscope,
  FlaskConical,
  Pill,
  Scan,
  FileText,
  AlertTriangle,
  User,
  RefreshCw,
  Zap,
  Info
} from 'lucide-react';
import { useHospital } from '../../context/HospitalContext';

interface AIAssistantModalProps {
  initialType?: string;
  patientContext?: any;
}

export const AIAssistantModal: React.FC<AIAssistantModalProps> = () => {
  const {
    isAiModalOpen,
    setIsAiModalOpen,
    aiModalInitialType,
    aiQueryContext,
    patients,
    selectedPatientId,
    setSelectedPatientId,
    selectedPatient,
    labOrders,
    pharmacyItems,
  } = useHospital();

  const [activeType, setActiveType] = useState<string>(aiModalInitialType || 'differential-diagnosis');
  const [patientId, setPatientId] = useState<string>(selectedPatientId || 'PT-2026-001');
  const [inputText, setInputText] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [aiResponse, setAiResponse] = useState<string>('');
  const [responseSource, setResponseSource] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);

  const currentPatient = patients.find((p) => p.id === patientId) || selectedPatient;

  useEffect(() => {
    if (aiModalInitialType) {
      setActiveType(aiModalInitialType);
    }
  }, [aiModalInitialType]);

  // Set default prompt template according to selected AI task
  useEffect(() => {
    if (aiQueryContext && typeof aiQueryContext === 'string') {
      setInputText(aiQueryContext);
      return;
    }

    if (activeType === 'differential-diagnosis') {
      setInputText(
        currentPatient
          ? `Patient ${currentPatient.name} (${currentPatient.age}yo ${currentPatient.gender}) presents with acute high-grade fever (38.8°C), severe headache, generalized body aches, abdominal cramping, and dark concentrated urine for 3 days. Known allergies: ${currentPatient.allergies.join(', ') || 'None'}.`
          : 'Patient presents with acute fever (38.5°C), chills, and body malaise.'
      );
    } else if (activeType === 'soap-note') {
      setInputText(
        `Subjective: 44yo male complaints of intense weakness, chills, fever spiking in afternoon, loss of appetite x 4 days.
Objective: Temp 38.6°C, BP 124/80, HR 88, SpO2 97%. Mild conjunctival pallor, soft abdomen, splenomegaly 2cm below costal margin.
Labs: Malaria BF positive +++ (32,000 parasites/uL), Hb 9.8 g/dL, Creatinine 1.4 mg/dL.
Assessment: Severe P. falciparum malaria with mild hemolytic anemia.`
      );
    } else if (activeType === 'lab-analysis') {
      setInputText(
        `Lab Investigation Panel:
1. Blood Film for Malaria: P. falciparum trophozoites +++ (32,000 / uL) [CRITICAL HIGH]
2. Full Blood Count: Hb 9.8 g/dL (Normal: 13-17), WBC 12.4 x10^9/L, Platelets 98 x10^9/L (Low)
3. Widal Titer: TO 1:80, TH 1:80 (Borderline)
4. Serum Creatinine: 1.4 mg/dL (Normal: 0.7-1.2 mg/dL)
5. Urinalysis: Trace protein, urobilinogen positive.`
      );
    } else if (activeType === 'drug-interaction') {
      setInputText(
        `Proposed Regimen for review:
1. IV Artesunate 120mg stat then 12h, 24h
2. Oral Artemether-Lumefantrine (Coartem) 80/480mg BD x 3 days
3. Ciprofloxacin 500mg BD x 7 days
4. Paracetamol 1000mg TDS
5. Ferrous Sulfate 200mg OD
Patient Allergies: ${currentPatient?.allergies.join(', ') || 'None'}.`
      );
    } else if (activeType === 'ultrasound-report') {
      setInputText(
        `Sonographic measurements:
- Biparietal Diameter (BPD): 72 mm (~28w4d)
- Femur Length (FL): 54 mm (~28w2d)
- Abdominal Circumference (AC): 242 mm (~28w3d)
- Head Circumference (HC): 265 mm (~28w5d)
- Estimated Fetal Weight (EFW): 1250 grams
- Amniotic Fluid Index (AFI): 14.8 cm (Normal)
- Placenta: Anterior, Grade II maturity, 3.8 cm from internal os
- Fetal Heart Rate: 148 bpm regular rhythm, cephalic presentation.`
      );
    } else if (activeType === 'discharge-summary') {
      setInputText(
        `Hospital Course:
Admitted on 2026-08-14 for Severe Falciparum Malaria with dehydration. Completed 3 doses IV Artesunate, followed by 3 days oral Coartem. IV fluids 2L normal saline administered.
Current Status: Afebrile x 48h, oral intake excellent, repeat blood film negative for malaria parasites, Hb stabilized at 10.4 g/dL.
Discharge Medications: Multivitamins 1 tab daily x 30d, Ferrous Sulfate 200mg daily x 30d.`
      );
    }
  }, [activeType, currentPatient, aiQueryContext]);

  if (!isAiModalOpen) return null;

  const handleGenerate = async () => {
    setIsLoading(true);
    setAiResponse('');
    try {
      const payload = {
        type: activeType,
        query: inputText,
        patientContext: currentPatient
          ? {
              id: currentPatient.id,
              name: currentPatient.name,
              age: currentPatient.age,
              gender: currentPatient.gender,
              allergies: currentPatient.allergies,
              diagnosis: currentPatient.status,
              vitals: { bp: '124/80', hr: 82, temp: 37.2, spo2: 98, rr: 18 },
            }
          : undefined,
      };

      const res = await fetch('/api/ai/clinical-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      setAiResponse(data.text || 'No response received from clinical model.');
      setResponseSource(data.source || 'gemini-api');
    } catch (err: any) {
      setAiResponse(
        `⚠️ Network error communicating with server: ${err.message}. Please check connection.`
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    if (!aiResponse) return;
    navigator.clipboard.writeText(aiResponse);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const tools = [
    {
      id: 'differential-diagnosis',
      name: 'Differential Diagnosis',
      icon: Stethoscope,
      description: 'Ranked clinical differentials & workup plan',
    },
    {
      id: 'soap-note',
      name: 'SOAP Note Builder',
      icon: FileText,
      description: 'Structured clinical documentation & ICD-10',
    },
    {
      id: 'lab-analysis',
      name: 'Lab Interpretation',
      icon: FlaskConical,
      description: 'Automated diagnostic analysis & flag alarms',
    },
    {
      id: 'drug-interaction',
      name: 'Drug Safety & Interactions',
      icon: Pill,
      description: 'Pharmacology checks, dosing & contraindications',
    },
    {
      id: 'ultrasound-report',
      name: 'Ultrasound Report',
      icon: Scan,
      description: 'Sonographic biometry & clinical impression',
    },
    {
      id: 'discharge-summary',
      name: 'Discharge & Care Plan',
      icon: Check,
      description: 'Discharge summary with English/Krio instructions',
    },
  ];

  return (
    <div
      id="ai-assistant-backdrop"
      className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4"
      onClick={() => setIsAiModalOpen(false)}
    >
      <div
        id="ai-assistant-modal"
        className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 bg-gradient-to-r from-indigo-950 via-slate-900 to-teal-950 text-white flex items-center justify-between border-b border-indigo-900/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/30 border border-indigo-400/40 flex items-center justify-center text-amber-300">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white">
                  Gemini Clinical Decision Support Assistant
                </h2>
                <span className="text-[10px] bg-amber-400 text-slate-950 px-2 py-0.5 rounded-full font-black uppercase tracking-wider">
                  Bo City Medical Intelligence
                </span>
              </div>
              <p className="text-xs text-indigo-200">
                Evidence-based differential diagnoses, laboratory analysis, pharmacology, and clinical reporting
              </p>
            </div>
          </div>

          <button
            id="close-ai-assistant-modal-btn"
            onClick={() => setIsAiModalOpen(false)}
            className="w-8 h-8 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tool Category Selector Tabs */}
        <div className="bg-slate-100 p-2 border-b border-slate-200 flex items-center gap-1.5 overflow-x-auto">
          {tools.map((t) => {
            const Icon = t.icon;
            const isSelected = activeType === t.id;
            return (
              <button
                key={t.id}
                onClick={() => {
                  setActiveType(t.id);
                  setAiResponse('');
                }}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-teal-700 text-white shadow-xs'
                    : 'bg-white text-slate-700 hover:bg-slate-200/80 border border-slate-200'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-teal-700'}`} />
                <span>{t.name}</span>
              </button>
            );
          })}
        </div>

        {/* Body Content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 grid grid-cols-1 lg:grid-cols-2 gap-6 bg-slate-50/50">
          {/* Left Column: Input and Patient Selector */}
          <div className="flex flex-col gap-4">
            {/* Patient Context Tag */}
            <div className="p-3 bg-white border border-slate-200 rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-2 min-w-0">
                <User className="w-4 h-4 text-teal-600 shrink-0" />
                <span className="text-xs font-medium text-slate-500">Patient:</span>
                <select
                  value={patientId}
                  onChange={(e) => {
                    setPatientId(e.target.value);
                    setSelectedPatientId(e.target.value);
                  }}
                  className="text-xs font-bold text-slate-800 bg-transparent border-none outline-none cursor-pointer truncate"
                >
                  {patients.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.id}) — {p.age}yo {p.gender}
                    </option>
                  ))}
                </select>
              </div>
              {currentPatient && (
                <span className="text-[11px] font-mono bg-teal-50 text-teal-800 border border-teal-200 px-2 py-0.5 rounded-md shrink-0">
                  {currentPatient.bloodGroup} / {currentPatient.genotype}
                </span>
              )}
            </div>

            {/* Clinical Prompt Area */}
            <div className="flex-1 flex flex-col bg-white border border-slate-200 rounded-xl p-3 shadow-2xs">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 mb-2">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <span>Clinical Case / Symptoms / Lab Data</span>
                </label>
                <button
                  onClick={() => setInputText('')}
                  className="text-[11px] text-slate-400 hover:text-slate-600"
                >
                  Clear
                </button>
              </div>

              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Enter patient symptoms, laboratory findings, medication lists, or biometrics..."
                className="w-full flex-1 min-h-[220px] text-xs font-mono leading-relaxed text-slate-800 bg-slate-50/50 border border-slate-200 rounded-lg p-3 outline-none focus:border-teal-500 focus:bg-white resize-none"
              />

              <div className="mt-3 flex items-center justify-between gap-2">
                <span className="text-[11px] text-slate-500 flex items-center gap-1">
                  <Info className="w-3 h-3 text-teal-600" />
                  Contextualized for West African primary/secondary care.
                </span>

                <button
                  id="run-gemini-clinical-btn"
                  onClick={handleGenerate}
                  disabled={isLoading || !inputText.trim()}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-teal-700 to-teal-800 hover:from-teal-800 hover:to-teal-900 disabled:opacity-50 text-white rounded-xl text-xs font-bold shadow-sm transition-all cursor-pointer"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Analyzing Case...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-amber-300" />
                      <span>Run Clinical Analysis</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: AI Output View */}
          <div className="flex flex-col bg-white border border-slate-200 rounded-xl p-4 shadow-2xs overflow-hidden">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></div>
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                  Clinical Intelligence Output
                </span>
                {responseSource && (
                  <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-mono">
                    {responseSource}
                  </span>
                )}
              </div>

              {aiResponse && (
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1 text-xs text-teal-700 hover:text-teal-900 font-semibold bg-teal-50 px-2.5 py-1 rounded-lg border border-teal-200 transition-colors"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Report</span>
                    </>
                  )}
                </button>
              )}
            </div>

            <div className="flex-1 overflow-y-auto pr-1">
              {isLoading ? (
                <div className="h-full min-h-[260px] flex flex-col items-center justify-center text-slate-400 gap-3">
                  <Loader2 className="w-8 h-8 text-teal-600 animate-spin" />
                  <p className="text-xs font-medium text-slate-600">
                    Querying clinical knowledge base & generating evidence-based findings...
                  </p>
                </div>
              ) : aiResponse ? (
                <div className="text-xs text-slate-800 leading-relaxed font-sans space-y-2 whitespace-pre-wrap selection:bg-teal-100">
                  {aiResponse}
                </div>
              ) : (
                <div className="h-full min-h-[260px] flex flex-col items-center justify-center text-slate-400 text-center p-6 gap-2">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-1">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <div className="text-xs font-bold text-slate-700">
                    Ready for Clinical Decision Support
                  </div>
                  <p className="text-[11px] text-slate-500 max-w-xs">
                    Select a tool tab above, review the patient symptoms, and click &quot;Run Clinical Analysis&quot; to receive structured diagnoses, differential rankings, or reports.
                  </p>
                </div>
              )}
            </div>

            {/* Disclaimer */}
            <div className="mt-3 pt-2 border-t border-slate-100 text-[10.5px] text-slate-400 flex items-center justify-between">
              <span>AMT & Vikitiva Health Care Centre (Bo City)</span>
              <span>For licensed clinician verification only</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
