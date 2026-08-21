import React, { useState } from 'react';
import {
  Scan,
  Plus,
  Search,
  CheckCircle,
  Clock,
  Printer,
  Sparkles,
  Baby,
  Activity,
  User,
  Calendar,
  FileText
} from 'lucide-react';
import { useHospital } from '../../context/HospitalContext';
import { UltrasoundScan } from '../../types';

export const UltrasoundView: React.FC = () => {
  const {
    ultrasounds,
    patients,
    addUltrasoundScan,
    updateUltrasoundScan,
    openAiAssistant,
    openPrintReport,
  } = useHospital();

  const [selectedScanId, setSelectedScanId] = useState<string>(ultrasounds[0]?.id || '');
  const [isNewScanModalOpen, setIsNewScanModalOpen] = useState<boolean>(false);

  // Form states
  const [patientId, setPatientId] = useState<string>(patients[0]?.id || '');
  const [scanType, setScanType] = useState<string>('Obstetric Ultrasound (2nd/3rd Trimester)');
  const [sonographer, setSonographer] = useState<string>('Dr. V. Conteh (Sonologist)');
  const [gaWeeks, setGaWeeks] = useState<number>(28);
  const [edd, setEdd] = useState<string>('2026-11-04');
  const [findings, setFindings] = useState<string>(
    'Single active intrauterine gestation in cephalic presentation. Regular fetal cardiac activity (148 bpm). Adequate liquor volume (AFI 14.2 cm). Anterior placenta Grade II clear of internal os.'
  );
  const [impression, setImpression] = useState<string>(
    'Normal 28-week live singleton intrauterine pregnancy with reassuring biophysical profile and appropriate interval growth.'
  );

  // Biometry
  const [bpd, setBpd] = useState<number>(72);
  const [fl, setFl] = useState<number>(54);
  const [ac, setAc] = useState<number>(242);
  const [hc, setHc] = useState<number>(265);
  const [efw, setEfw] = useState<number>(1250);
  const [afi, setAfi] = useState<number>(14.2);

  const selectedScan = ultrasounds.find((u) => u.id === selectedScanId) || ultrasounds[0];

  const handleCreateScan = (e: React.FormEvent) => {
    e.preventDefault();
    const patient = patients.find((p) => p.id === patientId);
    if (!patient) return;

    addUltrasoundScan({
      patientId: patient.id,
      patientName: patient.name,
      scanType,
      sonographer,
      findings,
      impression,
      gestationalAgeWeeks: gaWeeks,
      estimatedDueDate: edd,
      biometry: {
        bpd_mm: bpd,
        fl_mm: fl,
        ac_mm: ac,
        hc_mm: hc,
        efw_grams: efw,
        afi_cm: afi,
      },
    });

    setIsNewScanModalOpen(false);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Signboard Service 6 Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-cyan-700 text-white font-black text-xl flex items-center justify-center shadow-xs">
            6
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-slate-900">
                Ultra-Sound {'{Scanning}'} & Diagnostic Sonography
              </h2>
              <span className="text-xs px-2 py-0.5 rounded-full font-bold bg-cyan-100 text-cyan-800">
                Signboard Service #6
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              High-resolution 2D/3D Obstetric biometry, Fetal anomaly screening, Abdominopelvic scans & Doppler vascular studies.
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsNewScanModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-cyan-700 hover:bg-cyan-800 text-white rounded-xl text-xs font-bold shadow-sm transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>New Ultrasound Scan Study</span>
        </button>
      </div>

      {/* Grid: Scan Records & Detailed Sonogram Report */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left Column: Ultrasound Reports List */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
          <h3 className="font-bold text-xs uppercase text-slate-700 tracking-wider pb-2 border-b">
            Ultrasound Examinations ({ultrasounds.length})
          </h3>

          <div className="space-y-2">
            {ultrasounds.map((scan) => {
              const isSelected = scan.id === selectedScanId;
              return (
                <div
                  key={scan.id}
                  onClick={() => setSelectedScanId(scan.id)}
                  className={`p-3 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-cyan-50 border-cyan-300 shadow-xs'
                      : 'bg-slate-50 hover:bg-slate-100/80 border-slate-200/80'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 text-xs">{scan.patientName}</span>
                    <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-cyan-100 text-cyan-800 uppercase">
                      {scan.status}
                    </span>
                  </div>

                  <div className="text-[11px] font-bold text-cyan-950 mt-1 truncate">
                    {scan.scanType}
                  </div>

                  <div className="text-[10px] text-slate-500 mt-1 flex items-center justify-between">
                    <span>{scan.sonographer}</span>
                    <span className="font-mono">{scan.scanDate}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Full Sonogram Report */}
        <div className="xl:col-span-2 space-y-4">
          {selectedScan ? (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-5 space-y-5">
              {/* Header */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-cyan-100 text-cyan-800 font-bold flex items-center justify-center text-sm">
                    <Scan className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-base text-slate-900">{selectedScan.patientName}</h3>
                      <span className="text-xs text-slate-400 font-mono">({selectedScan.id})</span>
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5">
                      {selectedScan.scanType} • Performed by {selectedScan.sonographer} on {selectedScan.scanDate}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openPrintReport('ultrasound', selectedScan)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition-colors"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Print Report Slip</span>
                  </button>

                  <button
                    onClick={() =>
                      openAiAssistant(
                        'ultrasound-report',
                        `Analyze this ultrasound biometry and generate impressions:\nExam: ${selectedScan.scanType}\nFindings: ${selectedScan.findings}\nImpression: ${selectedScan.impression}`
                      )
                    }
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-900 border border-indigo-200 rounded-lg text-xs font-bold transition-colors"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    <span>AI Biometry Summary</span>
                  </button>
                </div>
              </div>

              {/* Fetal & Biometry Summary Card */}
              {selectedScan.biometry && (
                <div className="p-4 bg-cyan-50/60 border border-cyan-200 rounded-xl space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-bold text-cyan-900 uppercase tracking-wider">
                      <Baby className="w-4 h-4 text-cyan-700" />
                      <span>Obstetric Biometry & Fetal EGA Measurements</span>
                    </div>
                    {selectedScan.gestationalAgeWeeks && (
                      <span className="px-2.5 py-0.5 bg-cyan-700 text-white font-bold text-xs rounded-full">
                        {selectedScan.gestationalAgeWeeks} Weeks EGA
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 text-xs">
                    <div className="bg-white p-2.5 rounded-lg border border-cyan-100">
                      <span className="text-[10px] text-slate-400 block font-semibold">BPD (Head)</span>
                      <span className="font-bold text-slate-900 font-mono text-sm">
                        {selectedScan.biometry.bpd_mm} mm
                      </span>
                    </div>
                    <div className="bg-white p-2.5 rounded-lg border border-cyan-100">
                      <span className="text-[10px] text-slate-400 block font-semibold">FL (Femur)</span>
                      <span className="font-bold text-slate-900 font-mono text-sm">
                        {selectedScan.biometry.fl_mm} mm
                      </span>
                    </div>
                    <div className="bg-white p-2.5 rounded-lg border border-cyan-100">
                      <span className="text-[10px] text-slate-400 block font-semibold">AC (Abdomen)</span>
                      <span className="font-bold text-slate-900 font-mono text-sm">
                        {selectedScan.biometry.ac_mm} mm
                      </span>
                    </div>
                    <div className="bg-white p-2.5 rounded-lg border border-cyan-100">
                      <span className="text-[10px] text-slate-400 block font-semibold">HC (Circum.)</span>
                      <span className="font-bold text-slate-900 font-mono text-sm">
                        {selectedScan.biometry.hc_mm} mm
                      </span>
                    </div>
                    <div className="bg-white p-2.5 rounded-lg border border-cyan-100">
                      <span className="text-[10px] text-slate-400 block font-semibold">Est. Weight</span>
                      <span className="font-bold text-slate-900 font-mono text-sm">
                        {selectedScan.biometry.efw_grams} g
                      </span>
                    </div>
                    <div className="bg-white p-2.5 rounded-lg border border-cyan-100">
                      <span className="text-[10px] text-slate-400 block font-semibold">AFI (Fluid)</span>
                      <span className="font-bold text-slate-900 font-mono text-sm">
                        {selectedScan.biometry.afi_cm} cm
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Detailed Findings */}
              <div>
                <h4 className="font-bold text-xs text-slate-800 uppercase tracking-wider mb-1.5">
                  Detailed Sonographic Findings
                </h4>
                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 leading-relaxed whitespace-pre-wrap">
                  {selectedScan.findings}
                </div>
              </div>

              {/* Clinical Impression */}
              <div>
                <h4 className="font-bold text-xs text-slate-800 uppercase tracking-wider mb-1.5">
                  Sonographic Impression & Recommendations
                </h4>
                <div className="p-3.5 bg-teal-50/70 border border-teal-200 rounded-xl text-xs font-semibold text-slate-900 leading-relaxed">
                  {selectedScan.impression}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white p-12 rounded-2xl border text-center text-slate-400">
              Select an ultrasound study.
            </div>
          )}
        </div>
      </div>

      {/* Modal: New Ultrasound Scan */}
      {isNewScanModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setIsNewScanModalOpen(false)}
        >
          <div
            className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl p-6 border space-y-4 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="font-bold text-base text-slate-900">Record Ultrasound Examination</h3>
            <form onSubmit={handleCreateScan} className="space-y-4 text-xs">
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
                  <label className="font-semibold text-slate-700 block mb-1">Exam Type</label>
                  <select
                    value={scanType}
                    onChange={(e) => setScanType(e.target.value)}
                    className="w-full p-2.5 border rounded-xl bg-slate-50 outline-none"
                  >
                    <option value="Obstetric Ultrasound (2nd/3rd Trimester)">Obstetric Ultrasound (2nd/3rd Trimester)</option>
                    <option value="Pelvic & Transvaginal Sonogram">Pelvic & Transvaginal Sonogram</option>
                    <option value="Full Abdominal Ultrasound">Full Abdominal Ultrasound</option>
                    <option value="Renal & Urinary Tract Scan">Renal & Urinary Tract Scan</option>
                    <option value="Thyroid & Neck Sonogram">Thyroid & Neck Sonogram</option>
                  </select>
                </div>
              </div>

              {/* Biometry inputs if obstetric */}
              <div className="p-3 bg-cyan-50/50 rounded-xl border border-cyan-100 space-y-2">
                <span className="font-bold text-cyan-900 block text-[11px]">
                  Fetal Biometry Parameters (Optional for non-OB)
                </span>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 font-mono">
                  <div>
                    <label className="text-[10px] text-slate-500 block">BPD (mm)</label>
                    <input
                      type="number"
                      value={bpd}
                      onChange={(e) => setBpd(Number(e.target.value))}
                      className="w-full p-1.5 border rounded bg-white"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-500 block">FL (mm)</label>
                    <input
                      type="number"
                      value={fl}
                      onChange={(e) => setFl(Number(e.target.value))}
                      className="w-full p-1.5 border rounded bg-white"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-500 block">AC (mm)</label>
                    <input
                      type="number"
                      value={ac}
                      onChange={(e) => setAc(Number(e.target.value))}
                      className="w-full p-1.5 border rounded bg-white"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-500 block">HC (mm)</label>
                    <input
                      type="number"
                      value={hc}
                      onChange={(e) => setHc(Number(e.target.value))}
                      className="w-full p-1.5 border rounded bg-white"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-500 block">EFW (g)</label>
                    <input
                      type="number"
                      value={efw}
                      onChange={(e) => setEfw(Number(e.target.value))}
                      className="w-full p-1.5 border rounded bg-white"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-500 block">AFI (cm)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={afi}
                      onChange={(e) => setAfi(Number(e.target.value))}
                      className="w-full p-1.5 border rounded bg-white"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Sonographic Findings</label>
                <textarea
                  value={findings}
                  onChange={(e) => setFindings(e.target.value)}
                  className="w-full p-2.5 border rounded-xl bg-slate-50 h-24"
                  required
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Impression & Recommendations</label>
                <textarea
                  value={impression}
                  onChange={(e) => setImpression(e.target.value)}
                  className="w-full p-2.5 border rounded-xl bg-slate-50 h-16"
                  required
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsNewScanModalOpen(false)}
                  className="px-4 py-2 border rounded-xl font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-cyan-700 hover:bg-cyan-800 text-white rounded-xl font-bold"
                >
                  Save Scan Report
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
