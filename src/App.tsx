import React from 'react';
import { HospitalProvider, useHospital } from './context/HospitalContext';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { CommandPalette } from './components/layout/CommandPalette';
import { AIAssistantModal } from './components/ai/AIAssistantModal';
import { PrintReportModal } from './components/common/PrintReportModal';

// Views
import { OverviewDashboard } from './components/dashboard/OverviewDashboard';
import { AdmissionView } from './components/departments/AdmissionView';
import { ObservationView } from './components/departments/ObservationView';
import { LaboratoryView } from './components/departments/LaboratoryView';
import { PharmacyView } from './components/departments/PharmacyView';
import { SurgeryView } from './components/departments/SurgeryView';
import { UltrasoundView } from './components/departments/UltrasoundView';
import { EmergencyView } from './components/departments/EmergencyView';
import { PatientRegistryView } from './components/patients/PatientRegistryView';
import { ConsultationView } from './components/consultation/ConsultationView';
import { BillingView } from './components/billing/BillingView';

const HospitalAppContent: React.FC = () => {
  const { activeTab } = useHospital();

  const renderActiveView = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewDashboard />;
      case 'admission':
        return <AdmissionView />;
      case 'observation':
        return <ObservationView />;
      case 'laboratory':
        return <LaboratoryView />;
      case 'pharmacy':
        return <PharmacyView />;
      case 'surgery':
        return <SurgeryView />;
      case 'ultrasound':
        return <UltrasoundView />;
      case 'emergency':
        return <EmergencyView />;
      case 'patients':
        return <PatientRegistryView />;
      case 'consultation':
        return <ConsultationView />;
      case 'billing':
        return <BillingView />;
      default:
        return <OverviewDashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-slate-100 text-slate-900 font-sans antialiased overflow-hidden select-none">
      {/* Collapsible Left System Menu Sidebar */}
      <Sidebar />

      {/* Main Workspace Layout */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* Top Header with KPIs & Global Quick Controls */}
        <Header />

        {/* Dynamic Scrollable Clinical Viewport */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {renderActiveView()}
          </div>
        </main>
      </div>

      {/* Global Modals & Assistive Tools */}
      <CommandPalette />
      <AIAssistantModal />
      <PrintReportModal />
    </div>
  );
};

export default function App() {
  return (
    <HospitalProvider>
      <HospitalAppContent />
    </HospitalProvider>
  );
}
