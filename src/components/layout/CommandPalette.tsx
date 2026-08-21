import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  X,
  Users,
  BedDouble,
  Clock,
  FlaskConical,
  Pill,
  Scissors,
  Scan,
  AlertTriangle,
  Receipt,
  Stethoscope,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { useHospital } from '../../context/HospitalContext';
import { DepartmentType } from '../../types';

export const CommandPalette: React.FC = () => {
  const {
    isCommandPaletteOpen,
    setIsCommandPaletteOpen,
    patients,
    setActiveTab,
    setSelectedPatientId,
    openAiAssistant,
  } = useHospital();

  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isCommandPaletteOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isCommandPaletteOpen]);

  if (!isCommandPaletteOpen) return null;

  const quickNavs: { label: string; tab: DepartmentType; icon: React.ElementType; desc: string }[] = [
    { label: '1. Admission & Bed Management', tab: 'admission', icon: BedDouble, desc: 'Wards, bed occupancy, inpatient flow' },
    { label: '2. Observation Unit', tab: 'observation', icon: Clock, desc: 'Day-care monitoring and hourly vitals' },
    { label: '3. Diagnostic Laboratory', tab: 'laboratory', icon: FlaskConical, desc: 'Malaria, FBC, Widal, Biochemistry' },
    { label: '4. Pharmacy & Dispensary', tab: 'pharmacy', icon: Pill, desc: 'Prescription fulfillment and drug stocks' },
    { label: '5. Surgery Theatre', tab: 'surgery', icon: Scissors, desc: 'OT schedules and pre-op checklist' },
    { label: '6. Ultra-Sound {Scanning}', tab: 'ultrasound', icon: Scan, desc: 'Obstetric biometry and abdominal scans' },
    { label: '7. Emergency / Accident', tab: 'emergency', icon: AlertTriangle, desc: 'Immediate trauma triage and stabilization' },
    { label: 'Patient EHR Directory', tab: 'patients', icon: Users, desc: 'Master patient files and medical history' },
    { label: 'Doctor Consultation (SOAP)', tab: 'consultation', icon: Stethoscope, desc: 'Clinical notes and diagnoses' },
    { label: 'Cashier & Invoicing', tab: 'billing', icon: Receipt, desc: 'Hospital billing, NLe and USD payments' },
  ];

  const filteredNavs = quickNavs.filter(
    (n) =>
      n.label.toLowerCase().includes(query.toLowerCase()) ||
      n.desc.toLowerCase().includes(query.toLowerCase())
  );

  const filteredPatients = patients.filter(
    (p) =>
      p.name.toLowerCase().includes(query.toLowerCase()) ||
      p.id.toLowerCase().includes(query.toLowerCase()) ||
      p.phone.includes(query) ||
      p.address.toLowerCase().includes(query.toLowerCase())
  );

  const handleSelectNav = (tab: DepartmentType) => {
    setActiveTab(tab);
    setIsCommandPaletteOpen(false);
  };

  const handleSelectPatient = (patientId: string) => {
    setSelectedPatientId(patientId);
    setActiveTab('patients');
    setIsCommandPaletteOpen(false);
  };

  return (
    <div
      id="command-palette-backdrop"
      className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-start justify-center pt-20 px-4"
      onClick={() => setIsCommandPaletteOpen(false)}
    >
      <div
        id="command-palette-dialog"
        className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[80vh] animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search input header */}
        <div className="p-4 border-b border-slate-100 flex items-center gap-3 bg-slate-50/50">
          <Search className="w-5 h-5 text-teal-600 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search departments, patients, orders, or type a clinical command..."
            className="flex-1 bg-transparent border-none outline-none text-slate-800 placeholder-slate-400 text-base"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-slate-400 hover:text-slate-600 p-1 rounded-md"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="text-[11px] font-mono text-slate-400 border border-slate-200 px-1.5 py-0.5 rounded bg-white">
            ESC
          </kbd>
        </div>

        {/* Search Results */}
        <div className="overflow-y-auto p-3 space-y-4 text-sm">
          {/* AI Shortcut */}
          {query && (
            <div>
              <div className="text-[11px] font-bold uppercase text-indigo-700 tracking-wider px-2 mb-1.5 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-500" />
                AI Clinical Decision Support
              </div>
              <button
                onClick={() => {
                  setIsCommandPaletteOpen(false);
                  openAiAssistant('differential-diagnosis', query);
                }}
                className="w-full flex items-center justify-between p-2.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-indigo-950 font-medium text-left transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center">
                    <Sparkles className="w-3.5 h-3.5" />
                  </div>
                  <span>Ask Gemini Clinical Assistant about &quot;{query}&quot;</span>
                </div>
                <ArrowRight className="w-4 h-4 text-indigo-600" />
              </button>
            </div>
          )}

          {/* Patients Matching */}
          {filteredPatients.length > 0 && (
            <div>
              <div className="text-[11px] font-bold uppercase text-slate-400 tracking-wider px-2 mb-1.5">
                Patients ({filteredPatients.length})
              </div>
              <div className="space-y-1">
                {filteredPatients.slice(0, 5).map((p) => (
                  <button
                    key={p.id}
                    onClick={() => handleSelectPatient(p.id)}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-100 text-left transition-colors border border-transparent hover:border-slate-200"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-teal-100 text-teal-800 font-bold text-xs flex items-center justify-center">
                        {p.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-semibold text-slate-900 flex items-center gap-2">
                          {p.name}
                          <span className="text-xs text-slate-400 font-mono font-normal">
                            ({p.id})
                          </span>
                        </div>
                        <div className="text-xs text-slate-500">
                          {p.age}yo {p.gender} • {p.phone} • {p.address}
                        </div>
                      </div>
                    </div>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-md font-medium ${
                        p.status === 'Inpatient'
                          ? 'bg-amber-100 text-amber-800'
                          : p.status === 'Emergency'
                          ? 'bg-red-100 text-red-800 font-bold'
                          : 'bg-teal-100 text-teal-800'
                      }`}
                    >
                      {p.status}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Departments & Services */}
          {filteredNavs.length > 0 && (
            <div>
              <div className="text-[11px] font-bold uppercase text-slate-400 tracking-wider px-2 mb-1.5">
                Hospital Departments & Services
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-1.5">
                {filteredNavs.map((nav) => {
                  const Icon = nav.icon;
                  return (
                    <button
                      key={nav.tab}
                      onClick={() => handleSelectNav(nav.tab)}
                      className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-slate-100 border border-transparent hover:border-slate-200 text-left transition-colors"
                    >
                      <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center shrink-0 mt-0.5">
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-slate-800 truncate">
                          {nav.label}
                        </div>
                        <div className="text-xs text-slate-500 truncate">
                          {nav.desc}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-100 text-xs text-slate-500 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span>
              <kbd className="font-mono bg-white border border-slate-200 px-1 rounded">↑</kbd>{' '}
              <kbd className="font-mono bg-white border border-slate-200 px-1 rounded">↓</kbd> to navigate
            </span>
            <span>
              <kbd className="font-mono bg-white border border-slate-200 px-1 rounded">↵</kbd> to select
            </span>
          </div>
          <span className="font-semibold text-teal-800">AMT & Vikitiva Health Care Centre</span>
        </div>
      </div>
    </div>
  );
};
