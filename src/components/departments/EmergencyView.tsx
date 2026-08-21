import React, { useState } from 'react';
import {
  AlertTriangle,
  Plus,
  Search,
  Activity,
  User,
  Heart,
  Clock,
  Printer,
  Sparkles,
  BedDouble,
  Scissors,
  CheckCircle,
  AlertOctagon,
  PhoneCall
} from 'lucide-react';
import { useHospital } from '../../context/HospitalContext';
import { EmergencyCase } from '../../types';

export const EmergencyView: React.FC = () => {
  const {
    emergencies,
    patients,
    registerEmergencyCase,
    updateEmergencyStatus,
    openAiAssistant,
    openPrintReport,
    setActiveTab,
  } = useHospital();

  const [selectedErId, setSelectedErId] = useState<string>(emergencies[0]?.id || '');
  const [isNewErModalOpen, setIsNewErModalOpen] = useState<boolean>(false);
  const [filterCategory, setFilterCategory] = useState<string>('all');

  // Intake Form
  const [patientId, setPatientId] = useState<string>(patients[0]?.id || '');
  const [patientName, setPatientName] = useState<string>('Bockarie Conteh');
  const [age, setAge] = useState<number>(29);
  const [gender, setGender] = useState<'Male' | 'Female'>('Male');
  const [triageCategory, setTriageCategory] = useState<'RED (Immediate)' | 'YELLOW (Urgent)' | 'GREEN (Standard)'>('RED (Immediate)');
  const [complaint, setComplaint] = useState<string>('Severe blunt abdominal trauma post-motorcycle accident, hypotension');
  const [intervention, setIntervention] = useState<string>('High-flow O2, two 16G IV lines, 1L Normal Saline bolus, urgent FAST scan');
  const [assignedBed, setAssignedBed] = useState<string>('Trauma Bay 1');
  const [triageNurse, setTriageNurse] = useState<string>('Nurse F. Koroma');

  const filteredEmergencies = emergencies.filter((e) => {
    if (filterCategory === 'all') return true;
    return e.triageCategory.includes(filterCategory.toUpperCase());
  });

  const selectedEr = emergencies.find((e) => e.id === selectedErId) || emergencies[0];

  const handleRegisterEmergency = (e: React.FormEvent) => {
    e.preventDefault();
    registerEmergencyCase({
      patientId,
      patientName,
      age,
      gender,
      triageCategory,
      chiefComplaint: complaint,
      vitalSigns: {
        id: `v-${Date.now()}`,
        timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
        bp: '85/50',
        hr: 128,
        temp: 36.4,
        spo2: 92,
        rr: 28,
        notes: 'Emergency admission triage vitals',
      },
      immediateIntervention: intervention,
      assignedBed,
      triageNurse,
      outcome: 'under-stabilization',
    });

    setIsNewErModalOpen(false);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Signboard Service 7 Header */}
      <div className="bg-red-700 p-5 rounded-2xl text-white shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-white text-red-700 font-black text-xl flex items-center justify-center shadow-xs">
            7
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <AlertOctagon className="w-5 h-5 animate-pulse" />
                Emergency & Accident Trauma Centre
              </h2>
              <span className="text-xs px-2.5 py-0.5 rounded-full font-black bg-red-900 text-red-100 uppercase tracking-wide">
                24/7 Red Line Active
              </span>
            </div>
            <p className="text-xs text-red-100 mt-0.5">
              Immediate triage, motorcycle accident trauma, acute obstetric emergencies, shock resuscitation, and surgical transfer.
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsNewErModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-white text-red-700 hover:bg-red-50 rounded-xl text-xs font-black shadow-md transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Intake Emergency Trauma Case</span>
        </button>
      </div>

      {/* Triage Category Filter */}
      <div className="flex items-center justify-between bg-white p-3 rounded-2xl border border-slate-200">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilterCategory('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              filterCategory === 'all'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            All Emergency Cases ({emergencies.length})
          </button>
          <button
            onClick={() => setFilterCategory('red')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              filterCategory === 'red'
                ? 'bg-red-600 text-white shadow-xs'
                : 'bg-red-50 text-red-700 border border-red-200'
            }`}
          >
            🔴 Red: Immediate Resuscitation
          </button>
          <button
            onClick={() => setFilterCategory('yellow')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              filterCategory === 'yellow'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'bg-amber-50 text-amber-700 border border-amber-200'
            }`}
          >
            🟡 Yellow: Urgent
          </button>
        </div>

        <div className="text-xs text-slate-500 font-semibold flex items-center gap-1.5">
          <PhoneCall className="w-3.5 h-3.5 text-red-600" />
          <span>Hotlines: +232 90-774548 / +232 75-240127</span>
        </div>
      </div>

      {/* Grid: ER Live Cases & Detail Board */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left Column: ER Cases Queue */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
          <h3 className="font-bold text-xs uppercase text-slate-700 tracking-wider pb-2 border-b">
            Active Emergency Bays ({filteredEmergencies.length})
          </h3>

          <div className="space-y-2">
            {filteredEmergencies.map((er) => {
              const isSelected = er.id === selectedErId;
              const isRed = er.triageCategory.includes('RED');
              return (
                <div
                  key={er.id}
                  onClick={() => setSelectedErId(er.id)}
                  className={`p-3 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? isRed
                        ? 'bg-red-50 border-red-400 shadow-xs'
                        : 'bg-amber-50 border-amber-400 shadow-xs'
                      : isRed
                      ? 'bg-red-50/40 border-red-200 hover:bg-red-100/50'
                      : 'bg-slate-50 hover:bg-slate-100 border-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 text-xs">{er.patientName}</span>
                    <span
                      className={`text-[9px] font-black px-2 py-0.5 rounded text-white ${
                        isRed ? 'bg-red-600' : 'bg-amber-600'
                      }`}
                    >
                      {er.triageCategory.split(' ')[0]}
                    </span>
                  </div>

                  <div className="text-[11px] text-slate-800 font-medium mt-1 truncate">
                    {er.chiefComplaint}
                  </div>

                  <div className="text-[10px] text-slate-500 mt-1 flex items-center justify-between">
                    <span className="font-mono font-bold text-red-800">{er.assignedBed}</span>
                    <span>Arr: {er.arrivalTime}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Case Management Sheet */}
        <div className="xl:col-span-2 space-y-4">
          {selectedEr ? (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-5 space-y-5">
              {/* Header */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-red-100 text-red-700 font-black flex items-center justify-center text-sm">
                    <AlertTriangle className="w-5 h-5 animate-pulse" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-base text-slate-900">{selectedEr.patientName}</h3>
                      <span className="text-xs text-slate-400 font-mono">({selectedEr.patientId})</span>
                      <span className="text-xs font-black px-2 py-0.5 rounded-full bg-red-600 text-white">
                        {selectedEr.triageCategory}
                      </span>
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5">
                      {selectedEr.age}yo {selectedEr.gender} • Intake at {selectedEr.arrivalTime} by {selectedEr.triageNurse}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openPrintReport('emergency', selectedEr)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition-colors"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Print Trauma Log</span>
                  </button>

                  <button
                    onClick={() =>
                      openAiAssistant(
                        'differential-diagnosis',
                        `Emergency Trauma Case: ${selectedEr.patientName} (${selectedEr.age}yo ${selectedEr.gender}).\nChief Complaint: ${selectedEr.chiefComplaint}\nVitals: BP ${selectedEr.vitalSigns.bp}, HR ${selectedEr.vitalSigns.hr}, Temp ${selectedEr.vitalSigns.temp}°C, SpO2 ${selectedEr.vitalSigns.spo2}%\nImmediate Stabilization Done: ${selectedEr.immediateIntervention}\nRecommend next critical steps, workup, and surgical urgency:`
                      )
                    }
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-900 border border-indigo-200 rounded-lg text-xs font-bold transition-colors"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    <span>AI Emergency Protocol</span>
                  </button>
                </div>
              </div>

              {/* Chief Complaint */}
              <div className="p-3.5 bg-red-50/60 border border-red-200 rounded-xl text-xs">
                <span className="font-bold text-red-900 uppercase text-[10px] tracking-wider block">
                  Chief Complaint / Mechanism of Injury:
                </span>
                <p className="text-slate-900 font-bold mt-0.5 text-sm leading-snug">
                  {selectedEr.chiefComplaint}
                </p>
              </div>

              {/* Triage Baseline Vitals */}
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
                <span className="font-bold text-slate-800 uppercase text-[10px] tracking-wider block mb-2">
                  Initial Triage Vitals
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 font-mono text-xs">
                  <div className="bg-white p-2 rounded-lg border">
                    <span className="text-[10px] text-slate-400 block font-sans">Blood Pressure</span>
                    <span className="font-bold text-red-700 text-sm">{selectedEr.vitalSigns.bp}</span>
                  </div>
                  <div className="bg-white p-2 rounded-lg border">
                    <span className="text-[10px] text-slate-400 block font-sans">Heart Rate</span>
                    <span className="font-bold text-slate-900 text-sm">{selectedEr.vitalSigns.hr} bpm</span>
                  </div>
                  <div className="bg-white p-2 rounded-lg border">
                    <span className="text-[10px] text-slate-400 block font-sans">Body Temp</span>
                    <span className="font-bold text-slate-900 text-sm">{selectedEr.vitalSigns.temp}°C</span>
                  </div>
                  <div className="bg-white p-2 rounded-lg border">
                    <span className="text-[10px] text-slate-400 block font-sans">Oxygen (SpO2)</span>
                    <span className="font-bold text-slate-900 text-sm">{selectedEr.vitalSigns.spo2}%</span>
                  </div>
                  <div className="bg-white p-2 rounded-lg border">
                    <span className="text-[10px] text-slate-400 block font-sans">Resp. Rate</span>
                    <span className="font-bold text-slate-900 text-sm">{selectedEr.vitalSigns.rr} /min</span>
                  </div>
                </div>
              </div>

              {/* Immediate Interventions */}
              <div>
                <h4 className="font-bold text-xs text-slate-800 uppercase tracking-wider mb-1.5">
                  Immediate Resuscitative Interventions Given
                </h4>
                <p className="text-xs text-slate-800 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-200 whitespace-pre-wrap font-mono">
                  {selectedEr.immediateIntervention}
                </p>
              </div>

              {/* Escalation / Outcome Actions */}
              <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-slate-500 font-semibold">Status:</span>
                  <span className="px-2.5 py-0.5 bg-amber-100 text-amber-900 font-bold rounded-md uppercase text-[10px]">
                    {selectedEr.outcome.replace('-', ' ')}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      updateEmergencyStatus(selectedEr.id, 'transferred-theatre', 'Transferred to OT for emergency surgery.');
                      setActiveTab('surgery');
                    }}
                    className="flex items-center gap-1 px-3 py-1.5 bg-purple-700 hover:bg-purple-800 text-white rounded-lg text-xs font-bold transition-colors"
                  >
                    <Scissors className="w-3.5 h-3.5" />
                    <span>Transfer to Theatre (OT)</span>
                  </button>

                  <button
                    onClick={() => {
                      updateEmergencyStatus(selectedEr.id, 'admitted-ward', 'Admitted to inpatient ward post-stabilization.');
                      setActiveTab('admission');
                    }}
                    className="flex items-center gap-1 px-3 py-1.5 bg-teal-700 hover:bg-teal-800 text-white rounded-lg text-xs font-bold transition-colors"
                  >
                    <BedDouble className="w-3.5 h-3.5" />
                    <span>Admit to Inpatient Ward</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white p-12 rounded-2xl border text-center text-slate-400">
              No emergency case selected.
            </div>
          )}
        </div>
      </div>

      {/* Modal: New Emergency Intake */}
      {isNewErModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setIsNewErModalOpen(false)}
        >
          <div
            className="w-full max-w-xl bg-white rounded-2xl shadow-2xl p-6 border space-y-4 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="font-bold text-base text-red-700 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              Emergency Triage & Intake Form
            </h3>
            <form onSubmit={handleRegisterEmergency} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Patient Name</label>
                  <input
                    type="text"
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    className="w-full p-2.5 border rounded-xl bg-slate-50 font-bold"
                    required
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Triage Priority Category</label>
                  <select
                    value={triageCategory}
                    onChange={(e) => setTriageCategory(e.target.value as any)}
                    className="w-full p-2.5 border rounded-xl bg-red-50 text-red-900 font-bold outline-none"
                  >
                    <option value="RED (Immediate)">🔴 RED (Immediate Resuscitation)</option>
                    <option value="YELLOW (Urgent)">🟡 YELLOW (Urgent &lt;15 mins)</option>
                    <option value="GREEN (Standard)">🟢 GREEN (Standard Triage)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Age</label>
                  <input
                    type="number"
                    value={age}
                    onChange={(e) => setAge(Number(e.target.value))}
                    className="w-full p-2.5 border rounded-xl bg-slate-50"
                    required
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Gender</label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value as any)}
                    className="w-full p-2.5 border rounded-xl bg-slate-50"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Assigned ER Bay</label>
                  <input
                    type="text"
                    value={assignedBed}
                    onChange={(e) => setAssignedBed(e.target.value)}
                    className="w-full p-2.5 border rounded-xl bg-slate-50"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Chief Complaint & Trauma Details</label>
                <input
                  type="text"
                  value={complaint}
                  onChange={(e) => setComplaint(e.target.value)}
                  className="w-full p-2.5 border rounded-xl bg-slate-50"
                  required
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Immediate Stabilization Measures</label>
                <textarea
                  value={intervention}
                  onChange={(e) => setIntervention(e.target.value)}
                  className="w-full p-2.5 border rounded-xl bg-slate-50 h-16"
                  required
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsNewErModalOpen(false)}
                  className="px-4 py-2 border rounded-xl font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl font-black"
                >
                  Confirm Emergency Intake
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
