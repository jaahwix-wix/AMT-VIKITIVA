import React, { useState, useEffect } from 'react';
import {
  Search,
  AlertOctagon,
  Sparkles,
  UserPlus,
  Plus,
  DollarSign,
  Clock,
  Printer,
  ChevronDown,
  Building2,
  FileCheck2,
  Bed,
  Bell
} from 'lucide-react';
import { useHospital } from '../../context/HospitalContext';

export const Header: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    currency,
    setCurrency,
    setIsCommandPaletteOpen,
    openAiAssistant,
    stats,
    emergencies,
  } = useHospital();

  const [timeString, setTimeString] = useState<string>('');
  const [quickMenuOpen, setQuickMenuOpen] = useState<boolean>(false);

  // Real-time clock for Bo City, Sierra Leone (UTC / GMT)
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
      };
      setTimeString(now.toLocaleDateString('en-GB', options));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const redEmergencyCases = emergencies.filter(
    (e) => e.triageCategory.includes('RED') && e.outcome === 'under-stabilization'
  );

  const getTabTitle = () => {
    switch (activeTab) {
      case 'dashboard':
        return 'Executive Clinical Dashboard & Hospital Operations';
      case 'admission':
        return '1. Inpatient Admissions & Ward Bed Management';
      case 'observation':
        return '2. Day Care & Observation Triage Flow';
      case 'laboratory':
        return '3. Diagnostic Laboratory Investigations';
      case 'pharmacy':
        return '4. Dispensary, Prescriptions & Drug Inventory';
      case 'surgery':
        return '5. Surgical Theatre & Operation Schedules';
      case 'ultrasound':
        return '6. Diagnostic Ultrasound & Sonography Suite';
      case 'emergency':
        return '7. Emergency, Trauma & Accident Intake';
      case 'patients':
        return 'Electronic Health Records (EHR) Patient Directory';
      case 'consultation':
        return 'Outpatient Consultation & SOAP Clinical Notes';
      case 'billing':
        return 'Cashier, Invoicing & Patient Accounting';
      default:
        return 'AMT & Vikitiva Health Care Centre';
    }
  };

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-10 select-none">
      {/* Red Emergency Ticker if immediate trauma cases are in ER */}
      {redEmergencyCases.length > 0 && (
        <div className="bg-red-600 text-white text-xs px-4 py-1.5 flex items-center justify-between font-semibold tracking-wide animate-pulse">
          <div className="flex items-center gap-2">
            <AlertOctagon className="w-4 h-4 text-amber-200 shrink-0" />
            <span>
              CRITICAL TRAUMA ALERT ({redEmergencyCases.length}): {redEmergencyCases[0].patientName} — {redEmergencyCases[0].chiefComplaint}
            </span>
          </div>
          <button
            onClick={() => setActiveTab('emergency')}
            className="underline text-amber-200 hover:text-white text-xs font-bold uppercase shrink-0 ml-4 cursor-pointer"
          >
            Open ER Board →
          </button>
        </div>
      )}

      <div className="h-16 px-4 md:px-6 flex items-center justify-between gap-4">
        {/* Left Section: Active View Title */}
        <div className="flex items-center gap-3 min-w-0">
          <div>
            <div className="text-[11px] font-semibold text-teal-700 uppercase tracking-wider flex items-center gap-1.5">
              <span>Bo City, Sierra Leone</span>
              <span className="text-slate-300">•</span>
              <span className="text-slate-500 font-normal">Bed Occupancy: {stats.bedOccupancyRate}%</span>
            </div>
            <h1 className="text-lg font-bold text-slate-900 truncate">
              {getTabTitle()}
            </h1>
          </div>
        </div>

        {/* Middle Section: Quick Search Trigger Button */}
        <div className="hidden lg:flex items-center max-w-md w-full">
          <button
            id="global-search-trigger"
            onClick={() => setIsCommandPaletteOpen(true)}
            className="w-full flex items-center justify-between px-3.5 py-2 text-sm text-slate-400 bg-slate-100 hover:bg-slate-200/80 border border-slate-200/80 rounded-xl transition-all shadow-2xs"
          >
            <div className="flex items-center gap-2">
              <Search className="w-4 h-4 text-slate-500" />
              <span className="text-slate-600">Search patient, test, drug or order...</span>
            </div>
            <kbd className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-mono font-semibold text-slate-500 bg-white border border-slate-300 rounded-md shadow-2xs">
              ⌘K
            </kbd>
          </button>
        </div>

        {/* Right Section: Utilities, Currency, Actions */}
        <div className="flex items-center gap-2.5 shrink-0">
          {/* Bo City Realtime Clock */}
          <div className="hidden xl:flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono text-slate-600">
            <Clock className="w-3.5 h-3.5 text-teal-600" />
            <span>{timeString}</span>
          </div>

          {/* Currency Switcher (NLe / USD) */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-semibold">
            <button
              onClick={() => setCurrency('NLE')}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                currency === 'NLE'
                  ? 'bg-teal-700 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              NLe (Le)
            </button>
            <button
              onClick={() => setCurrency('USD')}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                currency === 'USD'
                  ? 'bg-teal-700 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              USD ($)
            </button>
          </div>

          {/* AI Clinical Assistant Trigger */}
          <button
            id="header-ai-btn"
            onClick={() => openAiAssistant('differential-diagnosis')}
            className="flex items-center gap-2 px-3 py-2 bg-indigo-50 border border-indigo-200 text-indigo-900 hover:bg-indigo-100 rounded-xl text-xs font-bold transition-all shadow-xs"
          >
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span className="hidden sm:inline">AI Decision Support</span>
          </button>

          {/* Emergency Fast-Track Red Intake Button */}
          <button
            id="emergency-intake-btn"
            onClick={() => setActiveTab('emergency')}
            className="flex items-center gap-1.5 px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold shadow-sm transition-all"
          >
            <AlertOctagon className="w-4 h-4" />
            <span>ER Triage</span>
          </button>

          {/* Quick Action Hub */}
          <div className="relative">
            <button
              id="header-quick-action-btn"
              onClick={() => setQuickMenuOpen((prev) => !prev)}
              className="flex items-center gap-1 px-3 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-bold shadow-sm transition-all"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden md:inline">Quick Action</span>
              <ChevronDown className="w-3.5 h-3.5" />
            </button>

            {quickMenuOpen && (
              <div
                className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-50 text-sm"
                onClick={() => setQuickMenuOpen(false)}
              >
                <button
                  onClick={() => setActiveTab('patients')}
                  className="w-full px-4 py-2 text-left text-slate-700 hover:bg-teal-50 hover:text-teal-900 flex items-center gap-2.5"
                >
                  <UserPlus className="w-4 h-4 text-teal-600" />
                  <span>Register New Patient</span>
                </button>
                <button
                  onClick={() => setActiveTab('laboratory')}
                  className="w-full px-4 py-2 text-left text-slate-700 hover:bg-teal-50 hover:text-teal-900 flex items-center gap-2.5"
                >
                  <FileCheck2 className="w-4 h-4 text-indigo-600" />
                  <span>Order Lab Test</span>
                </button>
                <button
                  onClick={() => setActiveTab('pharmacy')}
                  className="w-full px-4 py-2 text-left text-slate-700 hover:bg-teal-50 hover:text-teal-900 flex items-center gap-2.5"
                >
                  <Plus className="w-4 h-4 text-emerald-600" />
                  <span>New Prescription</span>
                </button>
                <button
                  onClick={() => setActiveTab('admission')}
                  className="w-full px-4 py-2 text-left text-slate-700 hover:bg-teal-50 hover:text-teal-900 flex items-center gap-2.5"
                >
                  <Bed className="w-4 h-4 text-amber-600" />
                  <span>Admit to Ward</span>
                </button>
                <div className="border-t border-slate-100 my-1"></div>
                <button
                  onClick={() => setActiveTab('billing')}
                  className="w-full px-4 py-2 text-left text-slate-700 hover:bg-teal-50 hover:text-teal-900 flex items-center gap-2.5"
                >
                  <DollarSign className="w-4 h-4 text-emerald-700" />
                  <span>Generate Hospital Bill</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
