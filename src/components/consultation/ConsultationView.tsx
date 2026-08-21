import React, { useState } from 'react';
import {
  Stethoscope,
  Plus,
  Search,
  CheckCircle,
  FileText,
  User,
  Sparkles,
  Calendar,
  Activity,
  Heart,
  Pill,
  FlaskConical,
  BedDouble,
  ArrowRight
} from 'lucide-react';
import { useHospital } from '../../context/HospitalContext';
import { ClinicalConsultation } from '../../types';

export const ConsultationView: React.FC = () => {
  const {
    consultations,
    patients,
    addConsultation,
    openAiAssistant,
    setActiveTab,
  } = useHospital();

  const [selectedConsultationId, setSelectedConsultationId] = useState<string>(consultations[0]?.id || '');
  const [isNewConsultationModalOpen, setIsNewConsultationModalOpen] = useState<boolean>(false);

  // Form states
  const [patientId, setPatientId] = useState<string>(patients[0]?.id || '');
  const [doctor, setDoctor] = useState<string>('Dr. A. Turay');
  const [subjective, setSubjective] = useState<string>(
    'Patient complaints of high fever for 3 days, frontal throbbing headache, bitter mouth taste, generalized joint pains, nausea, and dark urine.'
  );
  const [objective, setObjective] = useState<string>(
    'Temp 38.8°C, BP 118/76, HR 96 bpm, SpO2 97%. Mild conjunctival pallor, no jaundice. Soft abdomen, mild epigastric tenderness, mild hepatosplenomegaly.'
  );
  const [assessment, setAssessment] = useState<string>(
    '1. Acute Uncomplicated Falciparum Malaria\n2. Mild Dehydration\n3. Rule out Enteric (Typhoid) Fever'
  );
  const [plan, setPlan] = useState<string>(
    '1. STAT Malaria RDT and Blood Film for Parasites\n2. FBC & Widal titer\n3. Oral Coartem (Artemether-Lumefantrine) 80/480mg BD x 3 days\n4. Paracetamol 1g TDS x 3 days\n5. Oral rehydration salts (ORS) 1L daily'
  );

  const selectedCons = consultations.find((c) => c.id === selectedConsultationId) || consultations[0];

  const handleCreateConsultation = (e: React.FormEvent) => {
    e.preventDefault();
    const patient = patients.find((p) => p.id === patientId);
    if (!patient) return;

    addConsultation({
      patientId: patient.id,
      patientName: patient.name,
      doctor,
      soapNote: {
        subjective,
        objective,
        assessment,
        plan,
      },
    });

    setIsNewConsultationModalOpen(false);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-teal-800 text-white font-black text-xl flex items-center justify-center shadow-xs">
            <Stethoscope className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-slate-900">
                Outpatient Consultation & Clinical SOAP Documentation
              </h2>
              <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-teal-100 text-teal-800">
                Clinical Care Desk
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Structured Subjective, Objective, Assessment, and Plan notes with evidence-based AI decision support.
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsNewConsultationModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-bold shadow-sm transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>New Doctor Consultation</span>
        </button>
      </div>

      {/* Grid: Consultations List & SOAP Note */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left Column: List */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
          <h3 className="font-bold text-xs uppercase text-slate-700 tracking-wider pb-2 border-b">
            Consultation Records ({consultations.length})
          </h3>

          <div className="space-y-2">
            {consultations.map((c) => {
              const isSelected = c.id === selectedConsultationId;
              return (
                <div
                  key={c.id}
                  onClick={() => setSelectedConsultationId(c.id)}
                  className={`p-3 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-teal-50 border-teal-300 shadow-xs'
                      : 'bg-slate-50 hover:bg-slate-100 border-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 text-xs">{c.patientName}</span>
                    <span className="text-[10px] text-slate-400 font-mono">{c.date}</span>
                  </div>
                  <div className="text-[11px] text-teal-900 font-medium mt-1 truncate">
                    {c.soapNote.assessment.split('\n')[0]}
                  </div>
                  <div className="text-[10px] text-slate-500 mt-1">
                    {c.doctor} • {c.id}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: SOAP Clinical Viewer */}
        <div className="xl:col-span-2 space-y-4">
          {selectedCons ? (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-5 space-y-5">
              {/* Header */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-teal-100 text-teal-800 font-bold flex items-center justify-center text-sm">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-slate-900">{selectedCons.patientName}</h3>
                    <div className="text-xs text-slate-500 mt-0.5">
                      Attended by {selectedCons.doctor} on {selectedCons.date} • ({selectedCons.patientId})
                    </div>
                  </div>
                </div>

                <button
                  onClick={() =>
                    openAiAssistant(
                      'soap-note',
                      `Review and polish this clinical consultation:\nSubjective: ${selectedCons.soapNote.subjective}\nObjective: ${selectedCons.soapNote.objective}\nAssessment: ${selectedCons.soapNote.assessment}\nPlan: ${selectedCons.soapNote.plan}`
                    )
                  }
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-900 border border-indigo-200 rounded-lg text-xs font-bold transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>AI Polish & ICD-10 Coding</span>
                </button>
              </div>

              {/* S.O.A.P Breakdown */}
              <div className="space-y-3.5 text-xs">
                {/* Subjective */}
                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
                  <span className="font-bold text-teal-800 uppercase text-[10px] tracking-wider block mb-1">
                    S — Subjective (History of Presenting Complaint)
                  </span>
                  <p className="text-slate-800 leading-relaxed whitespace-pre-wrap">
                    {selectedCons.soapNote.subjective}
                  </p>
                </div>

                {/* Objective */}
                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
                  <span className="font-bold text-teal-800 uppercase text-[10px] tracking-wider block mb-1">
                    O — Objective (Physical Examination & Vitals)
                  </span>
                  <p className="text-slate-800 leading-relaxed whitespace-pre-wrap">
                    {selectedCons.soapNote.objective}
                  </p>
                </div>

                {/* Assessment */}
                <div className="p-3.5 bg-teal-50/60 border border-teal-200 rounded-xl">
                  <span className="font-bold text-teal-900 uppercase text-[10px] tracking-wider block mb-1">
                    A — Clinical Assessment & Diagnoses
                  </span>
                  <p className="text-slate-900 font-bold leading-relaxed whitespace-pre-wrap">
                    {selectedCons.soapNote.assessment}
                  </p>
                </div>

                {/* Plan */}
                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
                  <span className="font-bold text-teal-800 uppercase text-[10px] tracking-wider block mb-1">
                    P — Treatment Plan, Investigations & Prescriptions
                  </span>
                  <p className="text-slate-800 leading-relaxed whitespace-pre-wrap font-mono">
                    {selectedCons.soapNote.plan}
                  </p>
                </div>
              </div>

              {/* Department Direct Link buttons */}
              <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
                <span className="text-slate-500">Fast-track this patient to hospital service:</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setActiveTab('laboratory')}
                    className="flex items-center gap-1 px-3 py-1.5 bg-indigo-50 text-indigo-900 font-semibold rounded-lg hover:bg-indigo-100"
                  >
                    <FlaskConical className="w-3.5 h-3.5" />
                    <span>Lab Test</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('pharmacy')}
                    className="flex items-center gap-1 px-3 py-1.5 bg-emerald-50 text-emerald-900 font-semibold rounded-lg hover:bg-emerald-100"
                  >
                    <Pill className="w-3.5 h-3.5" />
                    <span>Pharmacy Rx</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('admission')}
                    className="flex items-center gap-1 px-3 py-1.5 bg-amber-50 text-amber-900 font-semibold rounded-lg hover:bg-amber-100"
                  >
                    <BedDouble className="w-3.5 h-3.5" />
                    <span>Inpatient Ward</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white p-12 rounded-2xl border text-center text-slate-400">
              Select a consultation note.
            </div>
          )}
        </div>
      </div>

      {/* Modal: New Consultation */}
      {isNewConsultationModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setIsNewConsultationModalOpen(false)}
        >
          <div
            className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl p-6 border space-y-4 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="font-bold text-base text-slate-900">Record Outpatient Clinical Consultation (SOAP)</h3>
            <form onSubmit={handleCreateConsultation} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Patient</label>
                  <select
                    value={patientId}
                    onChange={(e) => setPatientId(e.target.value)}
                    className="w-full p-2.5 border rounded-xl bg-slate-50 outline-none"
                  >
                    {patients.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} ({p.id}) — {p.age}yo {p.gender}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Consulting Doctor</label>
                  <input
                    type="text"
                    value={doctor}
                    onChange={(e) => setDoctor(e.target.value)}
                    className="w-full p-2.5 border rounded-xl bg-slate-50"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Subjective (Symptoms, Complaints & Duration)
                </label>
                <textarea
                  value={subjective}
                  onChange={(e) => setSubjective(e.target.value)}
                  className="w-full p-2.5 border rounded-xl bg-slate-50 h-16"
                  required
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Objective (Vitals, Physical Findings, Examination)
                </label>
                <textarea
                  value={objective}
                  onChange={(e) => setObjective(e.target.value)}
                  className="w-full p-2.5 border rounded-xl bg-slate-50 h-16"
                  required
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Assessment (Working Diagnosis, Differentials)
                </label>
                <textarea
                  value={assessment}
                  onChange={(e) => setAssessment(e.target.value)}
                  className="w-full p-2.5 border rounded-xl bg-slate-50 h-16"
                  required
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Plan (Investigations, Treatment, Prescriptions)
                </label>
                <textarea
                  value={plan}
                  onChange={(e) => setPlan(e.target.value)}
                  className="w-full p-2.5 border rounded-xl bg-slate-50 h-16 font-mono"
                  required
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsNewConsultationModalOpen(false)}
                  className="px-4 py-2 border rounded-xl font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-xl font-bold"
                >
                  Save Consultation Note
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
