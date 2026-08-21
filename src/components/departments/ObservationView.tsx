import React, { useState } from 'react';
import {
  Clock,
  Plus,
  Search,
  Activity,
  User,
  CheckCircle,
  ArrowRight,
  AlertCircle,
  Printer,
  Sparkles,
  BedDouble
} from 'lucide-react';
import { useHospital } from '../../context/HospitalContext';
import { ObservationCase, VitalSign } from '../../types';

export const ObservationView: React.FC = () => {
  const {
    observations,
    patients,
    addObservation,
    addObservationVitals,
    updateObservationStatus,
    openAiAssistant,
    openPrintReport,
    setActiveTab,
  } = useHospital();

  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selectedObsId, setSelectedObsId] = useState<string>(observations[0]?.id || '');
  const [isNewObsModalOpen, setIsNewObsModalOpen] = useState<boolean>(false);
  const [isVitalsModalOpen, setIsVitalsModalOpen] = useState<boolean>(false);
  const [newNote, setNewNote] = useState<string>('');

  // Form states
  const [patientId, setPatientId] = useState<string>(patients[0]?.id || '');
  const [reason, setReason] = useState<string>('Acute Gastroenteritis with moderate dehydration');
  const [plan, setPlan] = useState<string>('IV Ringers Lactate 1000ml, Oral ORS trial, 2-hourly vital checks');

  // Vitals
  const [bp, setBp] = useState<string>('118/76');
  const [hr, setHr] = useState<number>(82);
  const [temp, setTemp] = useState<number>(37.1);
  const [spo2, setSpo2] = useState<number>(98);
  const [rr, setRr] = useState<number>(18);
  const [vitalNotes, setVitalNotes] = useState<string>('Good urine output, skin turgor improved');

  const filteredObs = observations.filter((o) => {
    if (filterStatus === 'all') return true;
    return o.status === filterStatus;
  });

  const selectedObs = observations.find((o) => o.id === selectedObsId) || observations[0];

  const handleCreateObservation = (e: React.FormEvent) => {
    e.preventDefault();
    const patient = patients.find((p) => p.id === patientId);
    if (!patient) return;

    addObservation({
      patientId: patient.id,
      patientName: patient.name,
      reasonForObservation: reason,
      monitoringPlan: plan,
      vitals: [
        {
          id: `v-${Date.now()}`,
          timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
          bp: '120/80',
          hr: 80,
          temp: 37.2,
          spo2: 98,
          rr: 18,
          notes: 'Observation intake baseline',
        },
      ],
      nursingCareNotes: [
        `${new Date().toLocaleTimeString()} - Patient positioned comfortably, IV line patent.`,
      ],
    });

    setIsNewObsModalOpen(false);
  };

  const handleAddVitals = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedObs) return;
    const now = new Date().toISOString().replace('T', ' ').slice(0, 16);
    addObservationVitals(selectedObs.id, {
      id: `v-${Date.now()}`,
      timestamp: now,
      bp,
      hr,
      temp,
      spo2,
      rr,
      notes: vitalNotes,
    });
    setIsVitalsModalOpen(false);
  };

  const handleAddNote = () => {
    if (!newNote.trim() || !selectedObs) return;
    updateObservationStatus(selectedObs.id, selectedObs.status, newNote.trim());
    setNewNote('');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Signboard Service 2 Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-amber-600 text-white font-black text-xl flex items-center justify-center shadow-xs">
            2
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-slate-900">
                Observation Unit & Day Care Monitoring
              </h2>
              <span className="text-xs px-2 py-0.5 rounded-full font-bold bg-amber-100 text-amber-800">
                Signboard Service #2
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Short-stay clinical assessment, dynamic hydration challenge, post-procedure recovery, and serial vitals.
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsNewObsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold shadow-sm transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>New Observation Intake</span>
        </button>
      </div>

      {/* Main Grid: Observation List and Selected Chart */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left Column: Active Cases */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h3 className="font-bold text-xs uppercase text-slate-700 tracking-wider">
              Observation Bay Cases ({filteredObs.length})
            </h3>
            <div className="flex items-center gap-1 text-[11px]">
              <button
                onClick={() => setFilterStatus('all')}
                className={`px-2 py-0.5 rounded ${
                  filterStatus === 'all' ? 'bg-amber-100 text-amber-900 font-bold' : 'text-slate-500'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilterStatus('observing')}
                className={`px-2 py-0.5 rounded ${
                  filterStatus === 'observing' ? 'bg-amber-100 text-amber-900 font-bold' : 'text-slate-500'
                }`}
              >
                Active
              </button>
            </div>
          </div>

          <div className="space-y-2">
            {filteredObs.map((obs) => {
              const isSelected = obs.id === selectedObsId;
              const isObserving = obs.status === 'observing';
              return (
                <div
                  key={obs.id}
                  onClick={() => setSelectedObsId(obs.id)}
                  className={`p-3 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-amber-50 border-amber-300 shadow-xs'
                      : 'bg-slate-50 hover:bg-slate-100/80 border-slate-200/80'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 text-xs">{obs.patientName}</span>
                    <span
                      className={`text-[9px] font-bold px-2 py-0.5 rounded uppercase ${
                        isObserving
                          ? 'bg-amber-200 text-amber-900 animate-pulse'
                          : 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      {obs.status}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-600 mt-1 truncate">
                    {obs.reasonForObservation}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-1 flex items-center justify-between">
                    <span>Admitted: {obs.admittedAt}</span>
                    <span className="font-mono text-amber-700 font-bold">
                      {obs.vitals.length} Vitals Logged
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Case Flowsheet */}
        <div className="xl:col-span-2 space-y-4">
          {selectedObs ? (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-5 space-y-5">
              {/* Header Info */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center font-black">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-slate-900">{selectedObs.patientName}</h3>
                    <div className="text-xs text-slate-500">
                      Case Ref: {selectedObs.id} • Initiated: {selectedObs.admittedAt}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {selectedObs.status === 'observing' && (
                    <>
                      <button
                        onClick={() => updateObservationStatus(selectedObs.id, 'discharged', 'Discharged stable.')}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all"
                      >
                        Discharge Home
                      </button>
                      <button
                        onClick={() => {
                          updateObservationStatus(selectedObs.id, 'admitted-inpatient', 'Escalated to Inpatient.');
                          setActiveTab('admission');
                        }}
                        className="px-3 py-1.5 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1"
                      >
                        <BedDouble className="w-3.5 h-3.5" />
                        <span>Admit to Ward</span>
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Reason and Care Plan */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 bg-amber-50/50 border border-amber-200 rounded-xl text-xs">
                <div>
                  <span className="text-[10px] font-bold uppercase text-amber-800">
                    Clinical Indication for Observation
                  </span>
                  <p className="font-bold text-slate-900 mt-0.5">{selectedObs.reasonForObservation}</p>
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase text-amber-800">
                    Monitoring & Care Directives
                  </span>
                  <p className="text-slate-700 mt-0.5">{selectedObs.monitoringPlan}</p>
                </div>
              </div>

              {/* Vitals Table */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-bold text-xs text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                    <Activity className="w-3.5 h-3.5 text-amber-700" />
                    <span>Hourly Vital Sign Monitoring ({selectedObs.vitals.length})</span>
                  </h4>
                  <button
                    onClick={() => setIsVitalsModalOpen(true)}
                    className="text-xs font-bold text-amber-700 hover:text-amber-900 flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Record Serial Vitals</span>
                  </button>
                </div>

                <div className="overflow-x-auto border border-slate-200 rounded-xl">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 font-semibold border-b">
                      <tr>
                        <th className="p-2">Timestamp</th>
                        <th className="p-2">BP (mmHg)</th>
                        <th className="p-2">HR (bpm)</th>
                        <th className="p-2">Temp (°C)</th>
                        <th className="p-2">SpO2</th>
                        <th className="p-2">Clinical Note</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-mono">
                      {selectedObs.vitals.map((v) => (
                        <tr key={v.id}>
                          <td className="p-2 text-slate-500 font-sans">{v.timestamp}</td>
                          <td className="p-2 font-bold">{v.bp}</td>
                          <td className="p-2">{v.hr}</td>
                          <td className="p-2">{v.temp}°C</td>
                          <td className="p-2">{v.spo2}%</td>
                          <td className="p-2 font-sans text-slate-600">{v.notes || '-'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Nursing Care Progress Log */}
              <div>
                <h4 className="font-bold text-xs text-slate-800 uppercase tracking-wider mb-2">
                  Nursing Care & Re-evaluation Log
                </h4>
                <div className="space-y-1.5">
                  {selectedObs.nursingCareNotes.map((note, idx) => (
                    <div key={idx} className="p-2.5 bg-slate-50 rounded-lg text-xs text-slate-700 border border-slate-200/70">
                      {note}
                    </div>
                  ))}
                </div>

                {selectedObs.status === 'observing' && (
                  <div className="mt-3 flex items-center gap-2">
                    <input
                      type="text"
                      value={newNote}
                      onChange={(e) => setNewNote(e.target.value)}
                      placeholder="Add nursing update / oral intake note..."
                      className="flex-1 p-2 text-xs border border-slate-200 rounded-xl bg-slate-50 outline-none focus:border-amber-600 focus:bg-white"
                      onKeyDown={(e) => e.key === 'Enter' && handleAddNote()}
                    />
                    <button
                      onClick={handleAddNote}
                      className="px-3 py-2 bg-amber-600 text-white rounded-xl text-xs font-bold hover:bg-amber-700"
                    >
                      Post Note
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-white p-12 rounded-2xl border text-center text-slate-400">
              No observation case selected.
            </div>
          )}
        </div>
      </div>

      {/* Modal: New Observation Case */}
      {isNewObsModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setIsNewObsModalOpen(false)}
        >
          <div
            className="w-full max-w-lg bg-white rounded-2xl shadow-2xl p-6 border space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="font-bold text-base text-slate-900">Admit to Observation Unit</h3>
            <form onSubmit={handleCreateObservation} className="space-y-3.5 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Select Patient</label>
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
                <label className="font-semibold text-slate-700 block mb-1">Reason for Observation</label>
                <input
                  type="text"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full p-2.5 border rounded-xl bg-slate-50 outline-none"
                  required
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Monitoring & Treatment Directives</label>
                <textarea
                  value={plan}
                  onChange={(e) => setPlan(e.target.value)}
                  className="w-full p-2.5 border rounded-xl bg-slate-50 outline-none h-20"
                  required
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsNewObsModalOpen(false)}
                  className="px-4 py-2 border rounded-xl font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-bold"
                >
                  Start Observation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add Vitals */}
      {isVitalsModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setIsVitalsModalOpen(false)}
        >
          <div
            className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 border space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="font-bold text-base text-slate-900">Record Observation Vitals</h3>
            <form onSubmit={handleAddVitals} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">BP (mmHg)</label>
                  <input
                    type="text"
                    value={bp}
                    onChange={(e) => setBp(e.target.value)}
                    className="w-full p-2 border rounded-xl"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Pulse (bpm)</label>
                  <input
                    type="number"
                    value={hr}
                    onChange={(e) => setHr(Number(e.target.value))}
                    className="w-full p-2 border rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Temp (°C)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={temp}
                    onChange={(e) => setTemp(Number(e.target.value))}
                    className="w-full p-2 border rounded-xl"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">SpO2 (%)</label>
                  <input
                    type="number"
                    value={spo2}
                    onChange={(e) => setSpo2(Number(e.target.value))}
                    className="w-full p-2 border rounded-xl"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Resp. Rate</label>
                  <input
                    type="number"
                    value={rr}
                    onChange={(e) => setRr(Number(e.target.value))}
                    className="w-full p-2 border rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Remarks</label>
                <input
                  type="text"
                  value={vitalNotes}
                  onChange={(e) => setVitalNotes(e.target.value)}
                  className="w-full p-2 border rounded-xl"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsVitalsModalOpen(false)}
                  className="px-4 py-2 border rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-600 text-white rounded-xl font-bold"
                >
                  Save Vitals
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
