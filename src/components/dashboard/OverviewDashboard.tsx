import React from 'react';
import {
  BedDouble,
  Clock,
  FlaskConical,
  Pill,
  Scissors,
  Scan,
  AlertTriangle,
  Users,
  DollarSign,
  TrendingUp,
  Activity,
  ArrowUpRight,
  Sparkles,
  Phone,
  CheckCircle2,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { useHospital } from '../../context/HospitalContext';
import { DepartmentType } from '../../types';

export const OverviewDashboard: React.FC = () => {
  const {
    stats,
    setActiveTab,
    openAiAssistant,
    formatMoney,
    beds,
    admissions,
    observations,
    labOrders,
    emergencies,
    surgeries,
    pharmacyItems,
    setSelectedPatientId,
  } = useHospital();

  const servicesGrid: {
    num: number;
    title: string;
    tab: DepartmentType;
    icon: React.ElementType;
    badge: string;
    badgeBg: string;
    metricLabel: string;
    metricValue: string | number;
    description: string;
    actionLabel: string;
  }[] = [
    {
      num: 1,
      title: 'Admission',
      tab: 'admission',
      icon: BedDouble,
      badge: `${stats.occupiedBedsCount}/${stats.totalBedsCount} Beds Occupied`,
      badgeBg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      metricLabel: 'Bed Occupancy Rate',
      metricValue: `${stats.bedOccupancyRate}%`,
      description: 'Male, Female & Pediatric Wards with dedicated nursing rosters',
      actionLabel: 'Manage Inpatients',
    },
    {
      num: 2,
      title: 'Observation',
      tab: 'observation',
      icon: Clock,
      badge: `${stats.activeObservations} Under Observation`,
      badgeBg: 'bg-amber-50 text-amber-800 border-amber-200',
      metricLabel: 'Active Day-Care Cases',
      metricValue: stats.activeObservations,
      description: 'Short-stay clinical re-evaluation and hourly vital tracking',
      actionLabel: 'View Flowsheet',
    },
    {
      num: 3,
      title: 'Laboratory',
      tab: 'laboratory',
      icon: FlaskConical,
      badge: `${stats.pendingLabCount} Pending Tests`,
      badgeBg: 'bg-indigo-50 text-indigo-800 border-indigo-200',
      metricLabel: 'Total Lab Orders Today',
      metricValue: labOrders.length,
      description: 'Malaria BF, FBC, Widal, Hep B, Blood Group, Stool & Urine panels',
      actionLabel: 'Enter Lab Results',
    },
    {
      num: 4,
      title: 'Pharmacy',
      tab: 'pharmacy',
      icon: Pill,
      badge: `${stats.lowStockPharmacyCount} Low Stock Alert`,
      badgeBg: stats.lowStockPharmacyCount > 0 ? 'bg-rose-50 text-rose-800 border-rose-200' : 'bg-slate-50 text-slate-700',
      metricLabel: 'Catalogued Medicines',
      metricValue: pharmacyItems.length,
      description: 'Essential medicines, injectables, antimalarials & antibiotics',
      actionLabel: 'Dispensary & Orders',
    },
    {
      num: 5,
      title: 'Surgery',
      tab: 'surgery',
      icon: Scissors,
      badge: `${stats.todaySurgeriesCount} Operative Cases`,
      badgeBg: 'bg-purple-50 text-purple-800 border-purple-200',
      metricLabel: 'Scheduled OT Cases',
      metricValue: surgeries.length,
      description: 'Major/minor theatre, C-sections, appendectomies & laparotomies',
      actionLabel: 'OT Schedule',
    },
    {
      num: 6,
      title: 'Ultra-Sound {Scanning}',
      tab: 'ultrasound',
      icon: Scan,
      badge: 'Sonography Suite Active',
      badgeBg: 'bg-cyan-50 text-cyan-800 border-cyan-200',
      metricLabel: 'Completed Scans',
      metricValue: 2,
      description: 'Obstetric 2D/3D biometry, pelvic, abdominal & thyroid sonograms',
      actionLabel: 'Ultrasound Reports',
    },
    {
      num: 7,
      title: 'Emergency / Accident',
      tab: 'emergency',
      icon: AlertTriangle,
      badge: `${stats.activeEmergencyCount} Active ER Triage`,
      badgeBg: 'bg-red-50 text-red-800 border-red-200 font-bold',
      metricLabel: 'ER Intake Today',
      metricValue: emergencies.length,
      description: '24/7 Red/Yellow/Green trauma stabilization & resuscitation bay',
      actionLabel: 'Open Emergency Bay',
    },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner / Welcome with Location and Contact */}
      <div className="bg-gradient-to-r from-teal-900 via-teal-800 to-slate-900 rounded-2xl p-6 text-white shadow-md relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-96 bg-radial from-teal-500/20 to-transparent pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-md bg-teal-500/30 border border-teal-400/40 text-teal-200 text-xs font-bold uppercase tracking-wider">
                Official Hospital Operations Hub
              </span>
              <span className="text-xs text-teal-300">Bo City, Sierra Leone</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              AMT & VIKITIVA HEALTH CARE CENTRE
            </h2>
            <p className="text-sm text-teal-100/80 mt-1 max-w-2xl">
              Dedicated full-spectrum healthcare delivering all 7 core signboard services: Admissions, Observation, Laboratory, Pharmacy, Surgery, Ultra-Sound Scanning, and 24/7 Emergency Triage.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 shrink-0">
            <button
              onClick={() => openAiAssistant('differential-diagnosis')}
              className="flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600/80 hover:bg-indigo-600 text-white rounded-xl text-xs font-bold transition-all border border-indigo-400/50 shadow-sm"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>AI Clinical Assistant</span>
            </button>
            <button
              onClick={() => setActiveTab('emergency')}
              className="flex items-center justify-center gap-2 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm"
            >
              <AlertTriangle className="w-4 h-4 text-white animate-bounce" />
              <span>Emergency Intake</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Statistic Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Total Patients */}
        <div
          onClick={() => setActiveTab('patients')}
          className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs hover:border-teal-300 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Total Registered</span>
            <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900">{stats.totalPatients}</div>
          <div className="text-[11px] text-teal-700 font-medium mt-1 flex items-center gap-1">
            <span>EHR Patient Directory</span>
            <ArrowUpRight className="w-3 h-3" />
          </div>
        </div>

        {/* Inpatient Occupancy */}
        <div
          onClick={() => setActiveTab('admission')}
          className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs hover:border-emerald-300 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Ward Occupancy</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center group-hover:scale-110 transition-transform">
              <BedDouble className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900">
            {stats.occupiedBedsCount} <span className="text-sm font-normal text-slate-400">/ {stats.totalBedsCount} beds</span>
          </div>
          <div className="text-[11px] text-emerald-700 font-medium mt-1">
            {stats.bedOccupancyRate}% current utilization
          </div>
        </div>

        {/* Diagnostic Lab Queue */}
        <div
          onClick={() => setActiveTab('laboratory')}
          className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs hover:border-indigo-300 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Lab Investigation</span>
            <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center group-hover:scale-110 transition-transform">
              <FlaskConical className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900">{stats.pendingLabCount}</div>
          <div className="text-[11px] text-indigo-700 font-medium mt-1">
            Pending specimen analyses
          </div>
        </div>

        {/* Daily Revenue */}
        <div
          onClick={() => setActiveTab('billing')}
          className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs hover:border-amber-300 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Cashier Collections</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center group-hover:scale-110 transition-transform">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 font-mono">
            {formatMoney(stats.todayRevenueNLE)}
          </div>
          <div className="text-[11px] text-amber-700 font-medium mt-1">
            Hospital billing ledger
          </div>
        </div>
      </div>

      {/* The 7 Core Services Grid (Directly from Signboard) */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <span>The 7 Signboard Clinical Services</span>
              <span className="text-xs font-normal text-slate-500">
                (AMT & Vikitiva Health Care Centre - Bo City)
              </span>
            </h3>
          </div>
          <span className="text-xs text-teal-800 font-semibold">
            All Departments Operational 24/7
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {servicesGrid.map((svc) => {
            const Icon = svc.icon;
            return (
              <div
                key={svc.num}
                onClick={() => setActiveTab(svc.tab)}
                className="bg-white border border-slate-200/90 hover:border-teal-500 rounded-2xl p-4 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between cursor-pointer group"
              >
                <div>
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-teal-800 text-white font-black text-sm flex items-center justify-center shadow-xs">
                        {svc.num}
                      </div>
                      <div className="font-bold text-slate-900 text-sm group-hover:text-teal-800 transition-colors">
                        {svc.title}
                      </div>
                    </div>
                    <Icon className="w-5 h-5 text-slate-400 group-hover:text-teal-700 transition-colors" />
                  </div>

                  <span
                    className={`inline-block text-[11px] px-2.5 py-0.5 rounded-full font-semibold border mb-2 ${svc.badgeBg}`}
                  >
                    {svc.badge}
                  </span>

                  <p className="text-xs text-slate-500 leading-relaxed min-h-[36px]">
                    {svc.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 block">{svc.metricLabel}</span>
                    <span className="font-bold text-slate-800">{svc.metricValue}</span>
                  </div>
                  <span className="font-semibold text-teal-700 group-hover:text-teal-900 flex items-center gap-1">
                    {svc.actionLabel}
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Live Operational Boards: Active Admissions & ER Triage */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Inpatients Snapshot */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
            <div className="flex items-center gap-2">
              <BedDouble className="w-5 h-5 text-teal-700" />
              <h4 className="font-bold text-slate-900 text-sm">Active Inpatients & Ward Status</h4>
            </div>
            <button
              onClick={() => setActiveTab('admission')}
              className="text-xs font-semibold text-teal-700 hover:text-teal-900"
            >
              View Ward Map →
            </button>
          </div>

          <div className="space-y-2.5">
            {admissions.slice(0, 3).map((adm) => (
              <div
                key={adm.id}
                onClick={() => {
                  setSelectedPatientId(adm.patientId);
                  setActiveTab('admission');
                }}
                className="p-3 bg-slate-50 hover:bg-teal-50/50 rounded-xl border border-slate-200/80 transition-colors flex items-center justify-between cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-teal-100 text-teal-800 font-bold text-xs flex items-center justify-center">
                    {adm.bedNumber}
                  </div>
                  <div>
                    <div className="font-semibold text-slate-900 text-xs flex items-center gap-2">
                      {adm.patientName}
                      <span className="text-[10px] text-slate-400 font-mono">({adm.patientId})</span>
                    </div>
                    <div className="text-[11px] text-slate-500">
                      {adm.ward} • {adm.diagnosis}
                    </div>
                  </div>
                </div>
                <div className="text-right text-xs">
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">
                    {adm.status.toUpperCase()}
                  </span>
                  <div className="text-[10px] text-slate-400 mt-1">Adm: {adm.admissionDate}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Emergency Triage Intake Board */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              <h4 className="font-bold text-slate-900 text-sm">Emergency & Trauma Department Board</h4>
            </div>
            <button
              onClick={() => setActiveTab('emergency')}
              className="text-xs font-semibold text-red-700 hover:text-red-900"
            >
              All ER Cases →
            </button>
          </div>

          <div className="space-y-2.5">
            {emergencies.slice(0, 3).map((er) => {
              const isRed = er.triageCategory.includes('RED');
              return (
                <div
                  key={er.id}
                  onClick={() => {
                    setSelectedPatientId(er.patientId);
                    setActiveTab('emergency');
                  }}
                  className={`p-3 rounded-xl border transition-colors flex items-center justify-between cursor-pointer ${
                    isRed
                      ? 'bg-red-50/70 border-red-200 hover:bg-red-100/70'
                      : 'bg-slate-50 border-slate-200/80 hover:bg-amber-50/50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`text-[10px] font-black px-2 py-1 rounded-md text-white ${
                        isRed ? 'bg-red-600' : 'bg-amber-600'
                      }`}
                    >
                      {isRed ? 'RED' : 'YELLOW'}
                    </span>
                    <div>
                      <div className="font-semibold text-slate-900 text-xs">
                        {er.patientName} ({er.age}yo)
                      </div>
                      <div className="text-[11px] text-slate-600 truncate max-w-xs">
                        {er.chiefComplaint}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-mono text-slate-500">{er.assignedBed}</span>
                    <div className="text-[10px] font-semibold text-slate-700 capitalize">
                      {er.outcome.replace('-', ' ')}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
