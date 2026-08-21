import React, { useState } from 'react';
import {
  BedDouble,
  Plus,
  Search,
  CheckCircle2,
  Printer,
  Sparkles,
  FileText,
  Activity,
  Heart,
  User,
  Calendar,
  Clock,
  ArrowRight,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { useHospital } from '../../context/HospitalContext';
import { Bed, AdmissionRecord, VitalSign } from '../../types';

export const AdmissionView: React.FC = () => {
  const {
    beds,
    admissions,
    patients,
    addAdmission,
    dischargeAdmission,
    addAdmissionVitals,
    addDoctorRound,
    allocateBed,
    freeBed,
    openAiAssistant,
    openPrintReport,
    selectedPatientId,
    setSelectedPatientId,
  } = useHospital();

  const [selectedWard, setSelectedWard] = useState<string>('All');
  const [selectedAdmissionId, setSelectedAdmissionId] = useState<string>(admissions[0]?.id || '');
  const [isAdmitModalOpen, setIsAdmitModalOpen] = useState<boolean>(false);
  const [isVitalsModalOpen, setIsVitalsModalOpen] = useState<boolean>(false);
  const [isRoundModalOpen, setIsRoundModalOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Form states
  const [admitPatientId, setAdmitPatientId] = useState<string>(patients[0]?.id || '');
  const [admitWard, setAdmitWard] = useState<string>('Male Medical Ward');
  const [admitBedNumber, setAdmitBedNumber] = useState<string>('M-02');
  const [admitDiagnosis, setAdmitDiagnosis] = useState<string>('Severe Malaria & Electrolyte Imbalance');
  const [admitDoctor, setAdmitDoctor] = useState<string>('Dr. A. Turay');
  const [admitDiet, setAdmitDiet] = useState<string>('Soft diet, high fluid intake');

  // Vitals form
  const [bp, setBp] = useState<string>('120/80');
  const [hr, setHr] = useState<number>(78);
  const [temp, setTemp] = useState<number>(37.0);
  const [spo2, setSpo2] = useState<number>(98);
  const [rr, setRr] = useState<number>(18);
  const [vitalsNotes, setVitalsNotes] = useState<string>('Patient resting comfortably');

  // Round notes form
  const [roundDoctor, setRoundDoctor] = useState<string>('Dr. A. Turay');
  const [roundNote, setRoundNote] = useState<string>('Fever subsiding, tolerating oral fluids well.');
  const [roundOrders, setRoundOrders] = useState<string>('Continue IV fluids, repeat malaria smear in AM.');

  const wards = ['All', 'Male Medical Ward', 'Female Surgical Ward', 'Pediatric Ward', 'Maternity Ward', 'Private Amenity Ward'];

  const filteredBeds = beds.filter((b) => {
    if (selectedWard !== 'All' && b.ward !== selectedWard) return false;
    if (searchQuery) {
      return (
        b.bedNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (b.patientName && b.patientName.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }
    return true;
  });

  const selectedAdmission = admissions.find((a) => a.id === selectedAdmissionId) || admissions[0];
  const patientForAdmission = patients.find((p) => p.id === selectedAdmission?.patientId);

  const handleCreateAdmission = (e: React.FormEvent) => {
    e.preventDefault();
    const patient = patients.find((p) => p.id === admitPatientId);
    if (!patient) return;

    const today = new Date().toISOString().split('T')[0];
    addAdmission({
      patientId: patient.id,
      patientName: patient.name,
      ward: admitWard,
      bedNumber: admitBedNumber,
      admissionDate: today,
      admittingDoctor: admitDoctor,
      diagnosis: admitDiagnosis,
      status: 'active',
      dietPlan: admitDiet,
      vitals: [
        {
          id: `v-${Date.now()}`,
          timestamp: `${today} 08:00`,
          bp: '120/80',
          hr: 80,
          temp: 37.5,
          spo2: 98,
          rr: 18,
          notes: 'Baseline admission vitals',
        },
      ],
      doctorRounds: [
        {
          id: `dr-${Date.now()}`,
          date: `${today} 09:00`,
          doctor: admitDoctor,
          note: `Admitted for ${admitDiagnosis}. Initiated supportive care.`,
          orders: 'Bed rest, maintain hydration, monitor vitals 4-hourly.',
        },
      ],
    });

    setIsAdmitModalOpen(false);
  };

  const handleAddVitals = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAdmission) return;
    const now = new Date().toISOString().replace('T', ' ').slice(0, 16);
    addAdmissionVitals(selectedAdmission.id, {
      id: `v-${Date.now()}`,
      timestamp: now,
      bp,
      hr,
      temp,
      spo2,
      rr,
      notes: vitalsNotes,
    });
    setIsVitalsModalOpen(false);
  };

  const handleAddRound = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAdmission) return;
    addDoctorRound(selectedAdmission.id, {
      doctor: roundDoctor,
      note: roundNote,
      orders: roundOrders,
    });
    setIsRoundModalOpen(false);
  };

  const handleDischarge = (admId: string) => {
    const summary = prompt('Enter final discharge clinical summary and take-home medications:');
    if (summary) {
      dischargeAdmission(admId, summary);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Service 1 Header Banner */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-teal-800 text-white font-black text-xl flex items-center justify-center shadow-xs">
            1
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-slate-900">
                Inpatient Admission & Ward Bed Management
              </h2>
              <span className="text-xs px-2 py-0.5 rounded-full font-bold bg-emerald-100 text-emerald-800">
                Signboard Service #1
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Male, Female, Pediatric, Maternity & Private Amenity Wards with active telemetry and flowsheet records.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setIsAdmitModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-bold shadow-sm transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Admit Patient to Ward</span>
          </button>
        </div>
      </div>

      {/* Ward Filter and Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {wards.map((w) => (
            <button
              key={w}
              onClick={() => setSelectedWard(w)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedWard === w
                  ? 'bg-teal-700 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200/80'
              }`}
            >
              {w}
            </button>
          ))}
        </div>

        <div className="relative min-w-[200px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search bed or patient..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-teal-600 focus:bg-white"
          />
        </div>
      </div>

      {/* Bed Matrix & Inpatient Flowsheet */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left Column: Bed Layout */}
        <div className="xl:col-span-1 bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
              <BedDouble className="w-4 h-4 text-teal-700" />
              <span>Ward Bed Grid ({filteredBeds.length})</span>
            </h3>
            <div className="flex items-center gap-2 text-[11px]">
              <span className="flex items-center gap-1 text-emerald-700 font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Available
              </span>
              <span className="flex items-center gap-1 text-rose-700 font-semibold">
                <span className="w-2 h-2 rounded-full bg-rose-500"></span> Occupied
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {filteredBeds.map((bed) => {
              const isOccupied = bed.status === 'occupied';
              return (
                <div
                  key={bed.id}
                  className={`p-3 rounded-xl border transition-all text-left flex flex-col justify-between min-h-[95px] ${
                    isOccupied
                      ? 'bg-rose-50/40 border-rose-200 hover:border-rose-300'
                      : 'bg-emerald-50/40 border-emerald-200 hover:border-emerald-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-black text-xs text-slate-900">{bed.bedNumber}</span>
                    <span
                      className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase ${
                        isOccupied ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {bed.status}
                    </span>
                  </div>

                  <div className="my-1">
                    {isOccupied ? (
                      <div>
                        <div className="text-[11px] font-bold text-slate-800 truncate">
                          {bed.patientName}
                        </div>
                        <div className="text-[10px] text-slate-400">Adm: {bed.admissionDate}</div>
                      </div>
                    ) : (
                      <div className="text-[11px] text-emerald-700 font-medium">Ready for Intake</div>
                    )}
                  </div>

                  <div className="text-[9.5px] text-slate-500 truncate">{bed.ward}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Inpatient Clinical Flowsheet */}
        <div className="xl:col-span-2 space-y-4">
          {selectedAdmission ? (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-5 space-y-5">
              {/* Patient Banner */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-teal-100 text-teal-800 font-bold flex items-center justify-center text-sm">
                    {selectedAdmission.bedNumber}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-base text-slate-900">
                        {selectedAdmission.patientName}
                      </h3>
                      <span className="text-xs text-slate-400 font-mono">
                        ({selectedAdmission.patientId})
                      </span>
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                        ACTIVE INPATIENT
                      </span>
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5">
                      {selectedAdmission.ward} • Admitted by {selectedAdmission.admittingDoctor} on{' '}
                      {selectedAdmission.admissionDate}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openPrintReport('admission', selectedAdmission)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition-colors"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Print Chart</span>
                  </button>
                  <button
                    onClick={() => openAiAssistant('discharge-summary')}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-900 border border-indigo-200 rounded-lg text-xs font-bold transition-colors"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    <span>AI Discharge Plan</span>
                  </button>
                  <button
                    onClick={() => handleDischarge(selectedAdmission.id)}
                    className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold transition-colors"
                  >
                    Discharge
                  </button>
                </div>
              </div>

              {/* Diagnosis and Diet */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 bg-teal-50/50 border border-teal-100 rounded-xl text-xs">
                <div>
                  <span className="text-[10px] font-bold uppercase text-teal-800">
                    Admitting Diagnosis
                  </span>
                  <div className="font-bold text-slate-900 mt-0.5">{selectedAdmission.diagnosis}</div>
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase text-teal-800">Diet & Nutrition</span>
                  <div className="text-slate-700 mt-0.5">{selectedAdmission.dietPlan || 'Standard hospital diet'}</div>
                </div>
              </div>

              {/* Vitals Log Flowsheet */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-bold text-xs text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                    <Activity className="w-3.5 h-3.5 text-teal-700" />
                    <span>Nursing Vitals Flowsheet ({selectedAdmission.vitals.length})</span>
                  </h4>
                  <button
                    onClick={() => setIsVitalsModalOpen(true)}
                    className="text-xs font-bold text-teal-700 hover:text-teal-900 flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Log New Vitals</span>
                  </button>
                </div>

                <div className="overflow-x-auto border border-slate-200 rounded-xl">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
                      <tr>
                        <th className="p-2.5">Time</th>
                        <th className="p-2.5">BP (mmHg)</th>
                        <th className="p-2.5">Pulse (bpm)</th>
                        <th className="p-2.5">Temp (°C)</th>
                        <th className="p-2.5">SpO2 (%)</th>
                        <th className="p-2.5">Nurse Remarks</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-mono">
                      {selectedAdmission.vitals.map((v) => (
                        <tr key={v.id} className="hover:bg-slate-50">
                          <td className="p-2.5 text-slate-500 font-sans">{v.timestamp}</td>
                          <td className="p-2.5 font-bold text-slate-900">{v.bp}</td>
                          <td className="p-2.5 text-slate-800">{v.hr}</td>
                          <td className="p-2.5 text-slate-800">{v.temp}°C</td>
                          <td className="p-2.5 text-slate-800">{v.spo2}%</td>
                          <td className="p-2.5 font-sans text-slate-600">{v.notes || '-'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Doctor Daily Rounds */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-bold text-xs text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-indigo-700" />
                    <span>Physician Daily Rounds & Clinical Orders ({selectedAdmission.doctorRounds.length})</span>
                  </h4>
                  <button
                    onClick={() => setIsRoundModalOpen(true)}
                    className="text-xs font-bold text-indigo-700 hover:text-indigo-900 flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Round Note</span>
                  </button>
                </div>

                <div className="space-y-2.5">
                  {selectedAdmission.doctorRounds.map((dr) => (
                    <div
                      key={dr.id}
                      className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1.5"
                    >
                      <div className="flex items-center justify-between text-slate-500">
                        <span className="font-bold text-slate-800">{dr.doctor}</span>
                        <span className="font-mono text-[11px]">{dr.date}</span>
                      </div>
                      <p className="text-slate-700 leading-relaxed">{dr.note}</p>
                      <div className="p-2 bg-indigo-50/50 rounded-lg text-indigo-950 border border-indigo-100 text-[11px]">
                        <span className="font-bold">Active Orders:</span> {dr.orders}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center text-slate-400">
              Select an active admission or admit a new patient to view the flowsheet.
            </div>
          )}
        </div>
      </div>

      {/* Modal: Admit Patient to Ward */}
      {isAdmitModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setIsAdmitModalOpen(false)}
        >
          <div
            className="w-full max-w-lg bg-white rounded-2xl shadow-2xl p-6 border border-slate-200 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="font-bold text-base text-slate-900">Admit Patient to Ward</h3>
            <form onSubmit={handleCreateAdmission} className="space-y-3.5 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Select Patient</label>
                <select
                  value={admitPatientId}
                  onChange={(e) => setAdmitPatientId(e.target.value)}
                  className="w-full p-2.5 border border-slate-200 rounded-xl bg-slate-50 outline-none focus:border-teal-600"
                >
                  {patients.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.id}) — {p.age}yo {p.gender}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Ward Selection</label>
                  <select
                    value={admitWard}
                    onChange={(e) => setAdmitWard(e.target.value)}
                    className="w-full p-2.5 border border-slate-200 rounded-xl bg-slate-50 outline-none focus:border-teal-600"
                  >
                    <option value="Male Medical Ward">Male Medical Ward</option>
                    <option value="Female Surgical Ward">Female Surgical Ward</option>
                    <option value="Pediatric Ward">Pediatric Ward</option>
                    <option value="Maternity Ward">Maternity Ward</option>
                    <option value="Private Amenity Ward">Private Amenity Ward</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Bed Number</label>
                  <input
                    type="text"
                    value={admitBedNumber}
                    onChange={(e) => setAdmitBedNumber(e.target.value)}
                    placeholder="e.g. M-04"
                    className="w-full p-2.5 border border-slate-200 rounded-xl bg-slate-50 outline-none focus:border-teal-600"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Admitting Diagnosis</label>
                <input
                  type="text"
                  value={admitDiagnosis}
                  onChange={(e) => setAdmitDiagnosis(e.target.value)}
                  className="w-full p-2.5 border border-slate-200 rounded-xl bg-slate-50 outline-none focus:border-teal-600"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Attending Doctor</label>
                  <input
                    type="text"
                    value={admitDoctor}
                    onChange={(e) => setAdmitDoctor(e.target.value)}
                    className="w-full p-2.5 border border-slate-200 rounded-xl bg-slate-50 outline-none focus:border-teal-600"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Dietary Regimen</label>
                  <input
                    type="text"
                    value={admitDiet}
                    onChange={(e) => setAdmitDiet(e.target.value)}
                    className="w-full p-2.5 border border-slate-200 rounded-xl bg-slate-50 outline-none focus:border-teal-600"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAdmitModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-xl font-bold"
                >
                  Confirm Admission
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Log Vitals */}
      {isVitalsModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setIsVitalsModalOpen(false)}
        >
          <div
            className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 border border-slate-200 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="font-bold text-base text-slate-900">Record Nursing Vitals</h3>
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
                <label className="font-semibold text-slate-700 block mb-1">Nurse Notes</label>
                <input
                  type="text"
                  value={vitalsNotes}
                  onChange={(e) => setVitalsNotes(e.target.value)}
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
                  className="px-4 py-2 bg-teal-700 text-white rounded-xl font-bold"
                >
                  Save Vitals
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add Doctor Round */}
      {isRoundModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setIsRoundModalOpen(false)}
        >
          <div
            className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 border border-slate-200 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="font-bold text-base text-slate-900">Physician Daily Round Entry</h3>
            <form onSubmit={handleAddRound} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Doctor Name</label>
                <input
                  type="text"
                  value={roundDoctor}
                  onChange={(e) => setRoundDoctor(e.target.value)}
                  className="w-full p-2 border rounded-xl"
                />
              </div>
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Clinical Progress Note</label>
                <textarea
                  value={roundNote}
                  onChange={(e) => setRoundNote(e.target.value)}
                  className="w-full p-2 border rounded-xl h-20"
                />
              </div>
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Medical Orders & Treatment</label>
                <input
                  type="text"
                  value={roundOrders}
                  onChange={(e) => setRoundOrders(e.target.value)}
                  className="w-full p-2 border rounded-xl"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsRoundModalOpen(false)}
                  className="px-4 py-2 border rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-700 text-white rounded-xl font-bold"
                >
                  Submit Round Note
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
