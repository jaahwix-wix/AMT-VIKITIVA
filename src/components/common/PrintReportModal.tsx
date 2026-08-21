import React from 'react';
import {
  Printer,
  X,
  FileCheck,
  Download,
  Building2,
  Phone,
  Mail,
  MapPin,
  Calendar,
  User,
  ShieldCheck
} from 'lucide-react';
import { useHospital } from '../../context/HospitalContext';

export const PrintReportModal: React.FC = () => {
  const { printData, setPrintData, formatMoney, currency } = useHospital();

  if (!printData) return null;

  const { title, type, data, patient } = printData;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div
      id="print-modal-backdrop"
      className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
      onClick={() => setPrintData(null)}
    >
      <div
        id="print-modal-container"
        className="w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-6 animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Control Bar (Hidden during actual print) */}
        <div className="p-3 bg-slate-900 text-white flex items-center justify-between no-print">
          <div className="flex items-center gap-2">
            <FileCheck className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-bold uppercase tracking-wider">
              Document Preview — Official Hospital Paperwork
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              id="execute-print-btn"
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-xs font-bold transition-all shadow-xs"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save as PDF</span>
            </button>
            <button
              onClick={() => setPrintData(null)}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Official Document Sheet */}
        <div className="p-8 md:p-10 bg-white text-slate-900 font-sans print-card">
          {/* Header with Authentic Signboard Information */}
          <div className="border-b-2 border-teal-800 pb-4 mb-6">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-2xl bg-teal-800 text-white font-black text-2xl flex items-center justify-center border-2 border-teal-900 shadow-xs">
                  AMT
                </div>
                <div>
                  <h1 className="text-xl font-extrabold text-teal-900 tracking-tight leading-tight uppercase">
                    AMT & VIKITIVA HEALTH CARE CENTRE
                  </h1>
                  <p className="text-xs font-bold text-teal-700 uppercase tracking-wider">
                    Comprehensive Primary & Secondary Healthcare Services
                  </p>
                  <p className="text-xs text-slate-600 flex items-center gap-1 mt-0.5 font-medium">
                    <MapPin className="w-3.5 h-3.5 text-teal-700 inline" />
                    92 Main Sewa Road, Bo City, Sierra Leone
                  </p>
                </div>
              </div>

              <div className="text-right text-xs text-slate-600 space-y-0.5">
                <div className="font-bold text-slate-800 flex items-center justify-end gap-1">
                  <Phone className="w-3 h-3 text-teal-700" />
                  +232 90-774548 / +232 75-240127
                </div>
                <div className="text-slate-500 font-mono text-[11px]">
                  amthealthcareservices@gmail.com
                </div>
                <div className="text-[10px] text-slate-400 font-mono">
                  Issued: {new Date().toLocaleDateString('en-GB')}
                </div>
              </div>
            </div>

            {/* List of 7 Services Banner */}
            <div className="mt-3 pt-2 border-t border-slate-200/80 flex flex-wrap items-center justify-between text-[9.5px] font-bold text-slate-500 uppercase tracking-wider">
              <span>1. Admission</span>
              <span>•</span>
              <span>2. Observation</span>
              <span>•</span>
              <span>3. Laboratory</span>
              <span>•</span>
              <span>4. Pharmacy</span>
              <span>•</span>
              <span>5. Surgery</span>
              <span>•</span>
              <span>6. Ultra-Sound</span>
              <span>•</span>
              <span>7. Emergency</span>
            </div>
          </div>

          {/* Document Title Badge */}
          <div className="mb-6 flex items-center justify-between bg-slate-100/80 p-3 rounded-xl border border-slate-200">
            <div>
              <span className="text-[10px] font-bold text-teal-800 uppercase tracking-wider">
                Official Clinical Record
              </span>
              <h2 className="text-base font-bold text-slate-900">{title}</h2>
            </div>
            <div className="text-right">
              <span className="text-xs font-mono font-bold text-slate-700 bg-white px-2.5 py-1 rounded-md border border-slate-200">
                REF: {data.id || data.orderNumber || data.invoiceNumber || 'REC-2026'}
              </span>
            </div>
          </div>

          {/* Patient Details Band */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs mb-6">
            <div>
              <div className="text-[10px] text-slate-400 uppercase font-semibold">Patient Name</div>
              <div className="font-bold text-slate-900">{patient?.name || data.patientName || 'N/A'}</div>
            </div>
            <div>
              <div className="text-[10px] text-slate-400 uppercase font-semibold">Patient ID / Age / Sex</div>
              <div className="font-semibold text-slate-800">
                {patient?.id || data.patientId} • {patient?.age || data.age}yo {patient?.gender || data.gender}
              </div>
            </div>
            <div>
              <div className="text-[10px] text-slate-400 uppercase font-semibold">Blood Group / Genotype</div>
              <div className="font-semibold text-slate-800">
                {patient?.bloodGroup || 'N/A'} ({patient?.genotype || 'N/A'})
              </div>
            </div>
            <div>
              <div className="text-[10px] text-slate-400 uppercase font-semibold">Contact / Address</div>
              <div className="font-semibold text-slate-800 truncate">
                {patient?.phone || 'Bo City'}
              </div>
            </div>
          </div>

          {/* Type-Specific Document Body */}

          {/* 1. LABORATORY RESULT SLIP */}
          {type === 'lab' && (
            <div className="space-y-4">
              <div className="text-xs font-bold text-slate-800 uppercase tracking-wide border-b pb-1">
                Investigation Results & Reference Ranges
              </div>
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-100 text-slate-700 font-semibold border-b">
                    <th className="p-2">Test Name</th>
                    <th className="p-2">Result</th>
                    <th className="p-2">Reference Range</th>
                    <th className="p-2">Flag / Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {data.items?.map((item: any, idx: number) => (
                    <tr key={idx} className={item.isAbnormal ? 'bg-amber-50/50' : ''}>
                      <td className="p-2 font-medium text-slate-900">{item.testName}</td>
                      <td className="p-2 font-bold font-mono text-slate-800">
                        {item.result || 'Pending'}
                      </td>
                      <td className="p-2 text-slate-500 font-mono text-[11px]">
                        {item.referenceRange || 'N/A'}
                      </td>
                      <td className="p-2">
                        {item.isAbnormal ? (
                          <span className="text-[10px] font-bold px-2 py-0.5 bg-rose-100 text-rose-800 rounded">
                            ABNORMAL
                          </span>
                        ) : (
                          <span className="text-[10px] font-medium px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded">
                            NORMAL
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {data.clinicalNotes && (
                <div className="p-3 bg-slate-50 rounded-lg text-xs text-slate-700">
                  <span className="font-bold">Clinical Interpretation:</span> {data.clinicalNotes}
                </div>
              )}
            </div>
          )}

          {/* 2. ULTRASOUND REPORT */}
          {type === 'ultrasound' && (
            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-3 bg-teal-50/50 border border-teal-100 rounded-lg">
                <div>
                  <span className="text-[10px] text-teal-800 font-bold uppercase">Scan Exam Type</span>
                  <div className="font-bold text-slate-900">{data.scanType}</div>
                </div>
                <div>
                  <span className="text-[10px] text-teal-800 font-bold uppercase">Gestational Age</span>
                  <div className="font-bold text-slate-900">{data.gestationalAgeWeeks ? `${data.gestationalAgeWeeks} Weeks` : 'N/A'}</div>
                </div>
                <div>
                  <span className="text-[10px] text-teal-800 font-bold uppercase">Estimated Due Date (EDD)</span>
                  <div className="font-bold text-slate-900">{data.estimatedDueDate || 'N/A'}</div>
                </div>
              </div>

              {data.biometry && (
                <div className="p-3 bg-slate-50 rounded-lg">
                  <span className="font-bold text-slate-800 uppercase text-[10px] tracking-wider block mb-2">
                    Sonographic Biometry Calculations
                  </span>
                  <div className="grid grid-cols-3 gap-2 font-mono text-xs">
                    <div>BPD: <span className="font-bold">{data.biometry.bpd_mm || '-'} mm</span></div>
                    <div>FL: <span className="font-bold">{data.biometry.fl_mm || '-'} mm</span></div>
                    <div>AC: <span className="font-bold">{data.biometry.ac_mm || '-'} mm</span></div>
                    <div>HC: <span className="font-bold">{data.biometry.hc_mm || '-'} mm</span></div>
                    <div>Est. Weight: <span className="font-bold">{data.biometry.efw_grams || '-'} g</span></div>
                    <div>AFI: <span className="font-bold">{data.biometry.afi_cm || '-'} cm</span></div>
                  </div>
                </div>
              )}

              <div>
                <span className="font-bold text-slate-800 uppercase text-[10px] tracking-wider block mb-1">
                  Sonographic Findings
                </span>
                <p className="text-slate-700 leading-relaxed whitespace-pre-wrap bg-slate-50/50 p-3 rounded-lg border border-slate-200">
                  {data.findings}
                </p>
              </div>

              <div>
                <span className="font-bold text-slate-800 uppercase text-[10px] tracking-wider block mb-1">
                  Impression & Recommendations
                </span>
                <p className="text-slate-900 font-semibold leading-relaxed bg-teal-50/70 p-3 rounded-lg border border-teal-200">
                  {data.impression}
                </p>
              </div>
            </div>
          )}

          {/* 3. INVOICE / CASHIER RECEIPT */}
          {type === 'invoice' && (
            <div className="space-y-4">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-100 text-slate-700 font-semibold border-b">
                    <th className="p-2">Item / Service Description</th>
                    <th className="p-2">Department</th>
                    <th className="p-2 text-center">Qty</th>
                    <th className="p-2 text-right">Amount ({currency})</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {data.items?.map((item: any, idx: number) => (
                    <tr key={idx}>
                      <td className="p-2 font-medium text-slate-900">{item.serviceName}</td>
                      <td className="p-2 text-slate-500">{item.department}</td>
                      <td className="p-2 text-center font-mono">{item.quantity}</td>
                      <td className="p-2 text-right font-mono font-bold">
                        {formatMoney(item.amountNLE)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="border-t-2 border-slate-300 pt-3 flex justify-end">
                <div className="w-64 space-y-1.5 text-xs">
                  <div className="flex justify-between text-slate-600">
                    <span>Subtotal:</span>
                    <span className="font-mono">{formatMoney(data.subtotalNLE)}</span>
                  </div>
                  {data.discountNLE > 0 && (
                    <div className="flex justify-between text-emerald-700">
                      <span>Discount:</span>
                      <span className="font-mono">-{formatMoney(data.discountNLE)}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-bold text-sm text-slate-900 border-t pt-1">
                    <span>Total Due:</span>
                    <span className="font-mono text-teal-800">{formatMoney(data.totalNLE)}</span>
                  </div>
                  <div className="flex justify-between text-xs font-semibold text-emerald-800">
                    <span>Amount Paid:</span>
                    <span className="font-mono">{formatMoney(data.paidAmountNLE)}</span>
                  </div>
                  <div className="flex justify-between text-xs text-slate-500">
                    <span>Payment Method:</span>
                    <span>{data.paymentMethod}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 4. PRESCRIPTION SLIP */}
          {type === 'prescription' && (
            <div className="space-y-4 text-xs">
              <div className="p-3 bg-slate-50 rounded-lg">
                <span className="text-[10px] text-slate-400 uppercase font-bold">Diagnosis:</span>
                <div className="font-bold text-slate-900">{data.diagnosis}</div>
              </div>

              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-teal-50 text-teal-900 font-bold border-b border-teal-200">
                    <th className="p-2">Rx #</th>
                    <th className="p-2">Medication & Strength</th>
                    <th className="p-2">Dosage & Frequency</th>
                    <th className="p-2">Duration</th>
                    <th className="p-2 text-right">Dispensed</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {data.items?.map((it: any, idx: number) => (
                    <tr key={idx}>
                      <td className="p-2 font-mono font-bold text-slate-400">0{idx + 1}</td>
                      <td className="p-2 font-bold text-slate-900">{it.itemName}</td>
                      <td className="p-2 text-slate-700">{it.dosage} — {it.frequency}</td>
                      <td className="p-2 font-medium">{it.duration}</td>
                      <td className="p-2 text-right">
                        <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-bold text-[10px]">
                          {it.dispensed ? 'DISPENSED' : 'PENDING'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* 5. INPATIENT ADMISSION & OBSERVATION FLOW */}
          {type === 'admission' && (
            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded-lg">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold">Ward & Bed Number:</span>
                  <div className="font-bold text-slate-900">{data.ward} — Bed {data.bedNumber}</div>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold">Admission Date:</span>
                  <div className="font-bold text-slate-900">{data.admissionDate}</div>
                </div>
              </div>

              <div className="p-3 bg-teal-50/50 border border-teal-100 rounded-lg">
                <span className="text-[10px] text-teal-800 font-bold uppercase">Admitting Diagnosis:</span>
                <div className="font-bold text-slate-900">{data.diagnosis}</div>
              </div>

              <div>
                <span className="font-bold text-slate-800 uppercase text-[10px] tracking-wider block mb-1">
                  Vital Signs Log Flowsheet
                </span>
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-100 font-semibold border-b">
                      <th className="p-1.5">Timestamp</th>
                      <th className="p-1.5">BP</th>
                      <th className="p-1.5">HR (bpm)</th>
                      <th className="p-1.5">Temp (°C)</th>
                      <th className="p-1.5">SpO2</th>
                      <th className="p-1.5">Notes</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-mono">
                    {data.vitals?.map((v: any, idx: number) => (
                      <tr key={idx}>
                        <td className="p-1.5 text-slate-500">{v.timestamp}</td>
                        <td className="p-1.5 font-bold">{v.bp}</td>
                        <td className="p-1.5">{v.hr}</td>
                        <td className="p-1.5">{v.temp}°C</td>
                        <td className="p-1.5">{v.spo2}%</td>
                        <td className="p-1.5 font-sans text-slate-600">{v.notes || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Signatures & Official Stamp Footer */}
          <div className="mt-12 pt-6 border-t border-slate-300 grid grid-cols-2 gap-8 text-xs">
            <div>
              <div className="h-10 border-b border-dashed border-slate-400 flex items-end">
                <span className="text-teal-900 font-serif italic text-sm">Dr. A. Turay / Dr. V. Conteh</span>
              </div>
              <div className="mt-1 text-[10px] text-slate-500 font-semibold uppercase tracking-wider">
                Attending Medical Officer Signature & Stamp
              </div>
            </div>

            <div className="text-right">
              <div className="h-10 border-b border-dashed border-slate-400 flex items-end justify-end">
                <span className="text-slate-800 font-mono text-xs">AMT-HC-VERIFIED</span>
              </div>
              <div className="mt-1 text-[10px] text-slate-500 font-semibold uppercase tracking-wider">
                Authorized Hospital Dispensary / Lab Desk
              </div>
            </div>
          </div>

          <div className="mt-6 text-center text-[10px] text-slate-400">
            AMT & Vikitiva Health Care Centre • 92 Main Sewa Road, Bo City • Tel: +232 90-774548 / +232 75-240127
          </div>
        </div>
      </div>
    </div>
  );
};
