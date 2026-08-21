import React, { useState } from 'react';
import {
  Scissors,
  Plus,
  Search,
  CheckCircle,
  Clock,
  Printer,
  Sparkles,
  ShieldCheck,
  User,
  Calendar,
  AlertCircle,
  CheckSquare,
  Square
} from 'lucide-react';
import { useHospital } from '../../context/HospitalContext';
import { SurgerySchedule } from '../../types';

export const SurgeryView: React.FC = () => {
  const {
    surgeries,
    patients,
    scheduleSurgery,
    updateSurgeryStatus,
    updateSurgeryChecklist,
    openAiAssistant,
    openPrintReport,
  } = useHospital();

  const [selectedSurgeryId, setSelectedSurgeryId] = useState<string>(surgeries[0]?.id || '');
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState<boolean>(false);
  const [postOpNote, setPostOpNote] = useState<string>('');

  // Schedule form
  const [patientId, setPatientId] = useState<string>(patients[0]?.id || '');
  const [procedureName, setProcedureName] = useState<string>('Emergency Cesarean Section');
  const [indication, setIndication] = useState<string>('Obstructed labor, fetal bradycardia');
  const [theatre, setTheatre] = useState<string>('Main Operating Theatre (OT 1)');
  const [surgeon, setSurgeon] = useState<string>('Dr. V. Conteh');
  const [anesthetist, setAnesthetist] = useState<string>('Dr. K. Bangura');
  const [anesthesiaType, setAnesthesiaType] = useState<string>('Spinal Anesthesia');
  const [scheduledDate, setScheduledDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [scheduledTime, setScheduledTime] = useState<string>('14:00');

  const selectedSurgery = surgeries.find((s) => s.id === selectedSurgeryId) || surgeries[0];

  const handleCreateSurgery = (e: React.FormEvent) => {
    e.preventDefault();
    const patient = patients.find((p) => p.id === patientId);
    if (!patient) return;

    scheduleSurgery({
      patientId: patient.id,
      patientName: patient.name,
      procedureName,
      indication,
      theatre,
      surgeon,
      anesthetist,
      anesthesiaType,
      scheduledDate,
      scheduledTime,
      status: 'scheduled',
      preOpChecklist: {
        surgicalConsentSigned: true,
        fastingVerified: true,
        bloodCrossMatched: true,
        prophylacticAntibiotics: false,
        anesthesiaAssessed: true,
      },
    });

    setIsScheduleModalOpen(false);
  };

  const handleToggleChecklist = (field: keyof SurgerySchedule['preOpChecklist']) => {
    if (!selectedSurgery) return;
    const currentVal = selectedSurgery.preOpChecklist[field];
    updateSurgeryChecklist(selectedSurgery.id, { [field]: !currentVal });
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Signboard Service 5 Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-purple-700 text-white font-black text-xl flex items-center justify-center shadow-xs">
            5
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-slate-900">
                Surgical Theatre & Operative Suites
              </h2>
              <span className="text-xs px-2 py-0.5 rounded-full font-bold bg-purple-100 text-purple-800">
                Signboard Service #5
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Major & Minor Operating Theatres, Obstetric C-Sections, Herniorrhaphies, Emergency Laparotomies, and WHO Surgical Safety protocols.
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsScheduleModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-purple-700 hover:bg-purple-800 text-white rounded-xl text-xs font-bold shadow-sm transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Schedule Surgical Procedure</span>
        </button>
      </div>

      {/* Grid: Surgery Roster & Case Management */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left Column: OT Schedule Roster */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
          <h3 className="font-bold text-xs uppercase text-slate-700 tracking-wider pb-2 border-b">
            OT Case Schedules ({surgeries.length})
          </h3>

          <div className="space-y-2">
            {surgeries.map((surg) => {
              const isSelected = surg.id === selectedSurgeryId;
              const isDone = surg.status === 'completed';
              return (
                <div
                  key={surg.id}
                  onClick={() => setSelectedSurgeryId(surg.id)}
                  className={`p-3 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-purple-50 border-purple-300 shadow-xs'
                      : 'bg-slate-50 hover:bg-slate-100/80 border-slate-200/80'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 text-xs">{surg.patientName}</span>
                    <span
                      className={`text-[9px] font-bold px-2 py-0.5 rounded uppercase ${
                        isDone ? 'bg-emerald-100 text-emerald-800' : 'bg-purple-100 text-purple-800'
                      }`}
                    >
                      {surg.status}
                    </span>
                  </div>

                  <div className="text-[11px] font-bold text-purple-900 mt-1">
                    {surg.procedureName}
                  </div>

                  <div className="text-[10px] text-slate-500 mt-1 flex items-center justify-between">
                    <span>{surg.theatre}</span>
                    <span className="font-mono">{surg.scheduledDate} @ {surg.scheduledTime}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Active Surgical Case Sheet */}
        <div className="xl:col-span-2 space-y-4">
          {selectedSurgery ? (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-5 space-y-5">
              {/* Header */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-purple-100 text-purple-800 font-bold flex items-center justify-center text-sm">
                    <Scissors className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-base text-slate-900">{selectedSurgery.procedureName}</h3>
                      <span className="text-xs text-slate-400 font-mono">({selectedSurgery.id})</span>
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5">
                      Patient: <span className="font-bold text-slate-800">{selectedSurgery.patientName}</span> ({selectedSurgery.patientId})
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <select
                    value={selectedSurgery.status}
                    onChange={(e) => updateSurgeryStatus(selectedSurgery.id, e.target.value as any)}
                    className="p-1.5 bg-slate-100 text-xs font-bold rounded-lg border outline-none"
                  >
                    <option value="scheduled">Scheduled</option>
                    <option value="in-theatre">In Theatre (Active)</option>
                    <option value="post-op">Post-Op Recovery</option>
                    <option value="completed">Completed</option>
                    <option value="postponed">Postponed</option>
                  </select>
                </div>
              </div>

              {/* Surgical Team & Logistics */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 bg-purple-50/50 border border-purple-100 rounded-xl text-xs">
                <div>
                  <span className="text-[10px] text-purple-800 uppercase font-bold">Lead Surgeon</span>
                  <div className="font-bold text-slate-900 mt-0.5">{selectedSurgery.surgeon}</div>
                </div>
                <div>
                  <span className="text-[10px] text-purple-800 uppercase font-bold">Anesthetist</span>
                  <div className="font-bold text-slate-900 mt-0.5">{selectedSurgery.anesthetist}</div>
                </div>
                <div>
                  <span className="text-[10px] text-purple-800 uppercase font-bold">Anesthesia Mode</span>
                  <div className="font-bold text-slate-900 mt-0.5">{selectedSurgery.anesthesiaType}</div>
                </div>
                <div>
                  <span className="text-[10px] text-purple-800 uppercase font-bold">Theatre & Time</span>
                  <div className="font-bold text-slate-900 mt-0.5">
                    {selectedSurgery.theatre} ({selectedSurgery.scheduledTime})
                  </div>
                </div>
              </div>

              {/* WHO Surgical Safety Checklist */}
              <div>
                <h4 className="font-bold text-xs text-slate-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-purple-700" />
                  <span>WHO Surgical Safety Pre-Op Checklist</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <button
                    onClick={() => handleToggleChecklist('surgicalConsentSigned')}
                    className={`p-2.5 rounded-xl border flex items-center gap-2.5 text-left transition-all ${
                      selectedSurgery.preOpChecklist.surgicalConsentSigned
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-900 font-bold'
                        : 'bg-slate-50 border-slate-200 text-slate-600'
                    }`}
                  >
                    {selectedSurgery.preOpChecklist.surgicalConsentSigned ? (
                      <CheckSquare className="w-4 h-4 text-emerald-600 shrink-0" />
                    ) : (
                      <Square className="w-4 h-4 text-slate-400 shrink-0" />
                    )}
                    <span>1. Informed Consent Form Signed & Verified</span>
                  </button>

                  <button
                    onClick={() => handleToggleChecklist('fastingVerified')}
                    className={`p-2.5 rounded-xl border flex items-center gap-2.5 text-left transition-all ${
                      selectedSurgery.preOpChecklist.fastingVerified
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-900 font-bold'
                        : 'bg-slate-50 border-slate-200 text-slate-600'
                    }`}
                  >
                    {selectedSurgery.preOpChecklist.fastingVerified ? (
                      <CheckSquare className="w-4 h-4 text-emerald-600 shrink-0" />
                    ) : (
                      <Square className="w-4 h-4 text-slate-400 shrink-0" />
                    )}
                    <span>2. NPO / Fasting Protocol (6+ hours) Verified</span>
                  </button>

                  <button
                    onClick={() => handleToggleChecklist('bloodCrossMatched')}
                    className={`p-2.5 rounded-xl border flex items-center gap-2.5 text-left transition-all ${
                      selectedSurgery.preOpChecklist.bloodCrossMatched
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-900 font-bold'
                        : 'bg-slate-50 border-slate-200 text-slate-600'
                    }`}
                  >
                    {selectedSurgery.preOpChecklist.bloodCrossMatched ? (
                      <CheckSquare className="w-4 h-4 text-emerald-600 shrink-0" />
                    ) : (
                      <Square className="w-4 h-4 text-slate-400 shrink-0" />
                    )}
                    <span>3. Blood Grouped & Crossmatched (Units Ready)</span>
                  </button>

                  <button
                    onClick={() => handleToggleChecklist('prophylacticAntibiotics')}
                    className={`p-2.5 rounded-xl border flex items-center gap-2.5 text-left transition-all ${
                      selectedSurgery.preOpChecklist.prophylacticAntibiotics
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-900 font-bold'
                        : 'bg-slate-50 border-slate-200 text-slate-600'
                    }`}
                  >
                    {selectedSurgery.preOpChecklist.prophylacticAntibiotics ? (
                      <CheckSquare className="w-4 h-4 text-emerald-600 shrink-0" />
                    ) : (
                      <Square className="w-4 h-4 text-slate-400 shrink-0" />
                    )}
                    <span>4. Prophylactic IV Antibiotics Administered</span>
                  </button>
                </div>
              </div>

              {/* Post-Op Notes */}
              <div>
                <h4 className="font-bold text-xs text-slate-800 uppercase tracking-wider mb-2">
                  Operative & Post-Operative Notes
                </h4>
                <p className="text-xs text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-200 leading-relaxed whitespace-pre-wrap">
                  {selectedSurgery.postOpNotes || 'Procedure pending completion. Operative findings will be documented here.'}
                </p>
              </div>
            </div>
          ) : (
            <div className="bg-white p-12 rounded-2xl border text-center text-slate-400">
              Select a surgical case.
            </div>
          )}
        </div>
      </div>

      {/* Modal: Schedule Surgery */}
      {isScheduleModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setIsScheduleModalOpen(false)}
        >
          <div
            className="w-full max-w-lg bg-white rounded-2xl shadow-2xl p-6 border space-y-4 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="font-bold text-base text-slate-900">Schedule Operative Procedure</h3>
            <form onSubmit={handleCreateSurgery} className="space-y-3.5 text-xs">
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
                <label className="font-semibold text-slate-700 block mb-1">Procedure Name</label>
                <input
                  type="text"
                  value={procedureName}
                  onChange={(e) => setProcedureName(e.target.value)}
                  className="w-full p-2.5 border rounded-xl bg-slate-50"
                  required
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Surgical Indication</label>
                <input
                  type="text"
                  value={indication}
                  onChange={(e) => setIndication(e.target.value)}
                  className="w-full p-2.5 border rounded-xl bg-slate-50"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Lead Surgeon</label>
                  <input
                    type="text"
                    value={surgeon}
                    onChange={(e) => setSurgeon(e.target.value)}
                    className="w-full p-2.5 border rounded-xl bg-slate-50"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Anesthetist</label>
                  <input
                    type="text"
                    value={anesthetist}
                    onChange={(e) => setAnesthetist(e.target.value)}
                    className="w-full p-2.5 border rounded-xl bg-slate-50"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Scheduled Date</label>
                  <input
                    type="date"
                    value={scheduledDate}
                    onChange={(e) => setScheduledDate(e.target.value)}
                    className="w-full p-2.5 border rounded-xl bg-slate-50"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Time</label>
                  <input
                    type="time"
                    value={scheduledTime}
                    onChange={(e) => setScheduledTime(e.target.value)}
                    className="w-full p-2.5 border rounded-xl bg-slate-50"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsScheduleModalOpen(false)}
                  className="px-4 py-2 border rounded-xl font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-purple-700 hover:bg-purple-800 text-white rounded-xl font-bold"
                >
                  Confirm Surgery Booking
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
