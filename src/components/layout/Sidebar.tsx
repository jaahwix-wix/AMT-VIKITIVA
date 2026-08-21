import React from 'react';
import {
  Activity,
  BedDouble,
  Clock,
  FlaskConical,
  Pill,
  Scissors,
  Scan,
  AlertTriangle,
  Users,
  Stethoscope,
  Receipt,
  LayoutDashboard,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  PhoneCall,
  MapPin,
  FileText
} from 'lucide-react';
import { useHospital } from '../../context/HospitalContext';
import { DepartmentType } from '../../types';

interface NavItem {
  id: DepartmentType;
  label: string;
  signNumber?: number; // 1 to 7 corresponding to the physical sign
  icon: React.ElementType;
  badge?: number | string;
  badgeColor?: string;
  highlight?: boolean;
}

export const Sidebar: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    isSidebarCollapsed,
    toggleSidebar,
    stats,
    openAiAssistant,
  } = useHospital();

  const coreSignboardServices: NavItem[] = [
    {
      id: 'admission',
      label: '1. Admission',
      signNumber: 1,
      icon: BedDouble,
      badge: `${stats.occupiedBedsCount}/${stats.totalBedsCount}`,
      badgeColor: 'bg-emerald-500/20 text-emerald-700 border-emerald-300',
    },
    {
      id: 'observation',
      label: '2. Observation',
      signNumber: 2,
      icon: Clock,
      badge: stats.activeObservations > 0 ? stats.activeObservations : undefined,
      badgeColor: 'bg-amber-500/20 text-amber-700 border-amber-300',
    },
    {
      id: 'laboratory',
      label: '3. Laboratory',
      signNumber: 3,
      icon: FlaskConical,
      badge: stats.pendingLabCount > 0 ? stats.pendingLabCount : undefined,
      badgeColor: 'bg-indigo-500/20 text-indigo-700 border-indigo-300',
    },
    {
      id: 'pharmacy',
      label: '4. Pharmacy',
      signNumber: 4,
      icon: Pill,
      badge: stats.lowStockPharmacyCount > 0 ? `${stats.lowStockPharmacyCount} low` : undefined,
      badgeColor: 'bg-rose-500/20 text-rose-700 border-rose-300',
    },
    {
      id: 'surgery',
      label: '5. Surgery',
      signNumber: 5,
      icon: Scissors,
      badge: stats.todaySurgeriesCount > 0 ? stats.todaySurgeriesCount : undefined,
      badgeColor: 'bg-purple-500/20 text-purple-700 border-purple-300',
    },
    {
      id: 'ultrasound',
      label: '6. Ultra-Sound {Scanning}',
      signNumber: 6,
      icon: Scan,
      badgeColor: 'bg-cyan-500/20 text-cyan-700 border-cyan-300',
    },
    {
      id: 'emergency',
      label: '7. Emergency / Accident',
      signNumber: 7,
      icon: AlertTriangle,
      badge: stats.activeEmergencyCount > 0 ? `${stats.activeEmergencyCount} CRIT` : undefined,
      badgeColor: 'bg-red-500 text-white font-bold animate-pulse',
      highlight: true,
    },
  ];

  const workspaceNavItems: NavItem[] = [
    {
      id: 'dashboard',
      label: 'Overview & Triage',
      icon: LayoutDashboard,
    },
    {
      id: 'patients',
      label: 'Patient EHR Registry',
      icon: Users,
      badge: stats.totalPatients,
      badgeColor: 'bg-slate-200 text-slate-700',
    },
    {
      id: 'consultation',
      label: 'Doctor Consultation & SOAP',
      icon: Stethoscope,
    },
    {
      id: 'billing',
      label: 'Cashier & Billing',
      icon: Receipt,
    },
  ];

  return (
    <aside
      id="hospital-sidebar"
      className={`relative flex flex-col border-r border-slate-200 bg-white transition-all duration-300 ease-in-out z-20 shrink-0 select-none ${
        isSidebarCollapsed ? 'w-[72px]' : 'w-[280px]'
      }`}
    >
      {/* Header with Hospital Brand from Signboard */}
      <div className="p-4 border-b border-slate-100 flex items-center justify-between min-h-[72px]">
        <div className="flex items-center space-x-3 overflow-hidden">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-700 to-teal-500 text-white flex items-center justify-center font-bold text-lg shadow-md shrink-0 border border-teal-600">
            <Activity className="w-6 h-6 animate-pulse" />
          </div>
          {!isSidebarCollapsed && (
            <div className="flex flex-col truncate">
              <span className="font-extrabold text-xs tracking-wider text-teal-800 uppercase leading-none">
                AMT & VIKITIVA
              </span>
              <span className="font-bold text-slate-900 text-sm truncate">
                Health Care Centre
              </span>
              <span className="text-[10px] text-slate-500 flex items-center gap-1 truncate mt-0.5">
                <MapPin className="w-3 h-3 text-teal-600 shrink-0" />
                92 Main Sewa Rd, Bo City
              </span>
            </div>
          )}
        </div>

        {/* Sidebar Collapse Toggle Button */}
        <button
          id="collapse-sidebar-btn"
          onClick={toggleSidebar}
          title={isSidebarCollapsed ? 'Expand Menu (Ctrl+B)' : 'Collapse Menu (Ctrl+B)'}
          className="w-7 h-7 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 flex items-center justify-center transition-colors shrink-0 ml-1"
        >
          {isSidebarCollapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <ChevronLeft className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto py-3 px-2 space-y-6">
        {/* Core Clinical Workspaces */}
        <div>
          {!isSidebarCollapsed && (
            <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Workspace
            </div>
          )}
          <div className="space-y-1">
            {workspaceNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-item-${item.id}`}
                  onClick={() => setActiveTab(item.id)}
                  title={isSidebarCollapsed ? item.label : undefined}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-sm transition-all text-left ${
                    isActive
                      ? 'bg-teal-50 text-teal-900 font-semibold shadow-xs border border-teal-200'
                      : 'text-slate-600 hover:bg-slate-100/80 hover:text-slate-900'
                  } ${isSidebarCollapsed ? 'justify-center px-0' : ''}`}
                >
                  <Icon
                    className={`w-5 h-5 shrink-0 ${
                      isActive ? 'text-teal-700' : 'text-slate-500'
                    }`}
                  />
                  {!isSidebarCollapsed && (
                    <span className="truncate flex-1">{item.label}</span>
                  )}
                  {!isSidebarCollapsed && item.badge !== undefined && (
                    <span
                      className={`text-[11px] px-2 py-0.5 rounded-full font-semibold border ${
                        item.badgeColor || 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* 7 Services From Signboard */}
        <div>
          {!isSidebarCollapsed && (
            <div className="px-3 pb-2 flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-teal-800">
                Core Signboard Services (1-7)
              </span>
              <span className="text-[9px] bg-teal-100 text-teal-800 px-1.5 py-0.5 rounded font-mono">
                Bo City
              </span>
            </div>
          )}
          <div className="space-y-1">
            {coreSignboardServices.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-service-${item.id}`}
                  onClick={() => setActiveTab(item.id)}
                  title={isSidebarCollapsed ? item.label : undefined}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-sm transition-all text-left group ${
                    isActive
                      ? item.highlight
                        ? 'bg-red-50 text-red-950 font-bold border border-red-200 shadow-xs'
                        : 'bg-teal-700 text-white font-semibold shadow-sm'
                      : item.highlight
                      ? 'text-red-700 hover:bg-red-50/80 bg-red-50/40 border border-red-100'
                      : 'text-slate-700 hover:bg-teal-50/60 hover:text-teal-900'
                  } ${isSidebarCollapsed ? 'justify-center px-0' : ''}`}
                >
                  <div className="relative">
                    <Icon
                      className={`w-5 h-5 shrink-0 ${
                        isActive
                          ? item.highlight
                            ? 'text-red-700'
                            : 'text-white'
                          : item.highlight
                          ? 'text-red-600'
                          : 'text-slate-600 group-hover:text-teal-700'
                      }`}
                    />
                    {isSidebarCollapsed && item.signNumber && (
                      <span className="absolute -top-1.5 -right-2 w-3.5 h-3.5 rounded-full bg-teal-800 text-[9px] text-white font-bold flex items-center justify-center">
                        {item.signNumber}
                      </span>
                    )}
                  </div>
                  {!isSidebarCollapsed && (
                    <span className="truncate flex-1 text-[13px]">
                      {item.label}
                    </span>
                  )}
                  {!isSidebarCollapsed && item.badge !== undefined && (
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-medium border ${
                        isActive
                          ? 'bg-white/20 text-white border-white/30'
                          : item.badgeColor || 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* AI Clinical Assistant Floating Trigger Card */}
      <div className="p-3 border-t border-slate-100">
        <button
          id="sidebar-ai-assistant-btn"
          onClick={() => openAiAssistant('differential-diagnosis')}
          title={isSidebarCollapsed ? 'Open Gemini Clinical Assistant' : undefined}
          className={`w-full rounded-xl bg-gradient-to-br from-indigo-900 via-slate-900 to-teal-900 text-white p-3 text-left transition-all hover:shadow-md hover:scale-[1.01] active:scale-[0.99] border border-indigo-700/40 flex items-center ${
            isSidebarCollapsed ? 'justify-center p-2.5' : 'gap-3'
          }`}
        >
          <div className="w-8 h-8 rounded-lg bg-indigo-500/30 border border-indigo-400/50 flex items-center justify-center shrink-0 text-amber-300">
            <Sparkles className="w-4 h-4 animate-spin" style={{ animationDuration: '6s' }} />
          </div>
          {!isSidebarCollapsed && (
            <div className="flex-1 overflow-hidden">
              <div className="text-xs font-bold text-white flex items-center gap-1.5">
                AI Clinical Decision
                <span className="text-[9px] px-1 py-0.2 rounded bg-amber-400 text-slate-950 font-black uppercase">
                  Gemini
                </span>
              </div>
              <p className="text-[10px] text-slate-300 truncate">
                Differential Dx & SOAP helper
              </p>
            </div>
          )}
        </button>

        {/* Emergency Contact on Signboard */}
        {!isSidebarCollapsed && (
          <div className="mt-2.5 p-2 bg-slate-50 border border-slate-200/80 rounded-lg text-[11px] text-slate-600">
            <div className="font-semibold text-slate-800 flex items-center gap-1 text-[10px] uppercase tracking-wider mb-1">
              <PhoneCall className="w-3 h-3 text-teal-600" />
              Signboard Helplines:
            </div>
            <div className="font-mono text-[10.5px] text-slate-700 space-y-0.5">
              <div>+232 90-774548</div>
              <div>+232 75-240127</div>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};
