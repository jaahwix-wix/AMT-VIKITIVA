import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  DepartmentType,
  Patient,
  Bed,
  AdmissionRecord,
  ObservationCase,
  LabOrder,
  PharmacyItem,
  Prescription,
  SurgerySchedule,
  UltrasoundScan,
  EmergencyCase,
  Invoice,
  ClinicalConsultation,
  VitalSign,
  LabOrderItem
} from '../types';
import {
  HOSPITAL_INFO,
  INITIAL_PATIENTS,
  INITIAL_BEDS,
  INITIAL_ADMISSIONS,
  INITIAL_OBSERVATIONS,
  INITIAL_LAB_ORDERS,
  PHARMACY_CATALOG,
  INITIAL_PRESCRIPTIONS,
  INITIAL_SURGERIES,
  INITIAL_ULTRASOUNDS,
  INITIAL_EMERGENCIES,
  INITIAL_INVOICES,
  INITIAL_CONSULTATIONS,
} from '../data/mockData';

interface HospitalContextType {
  // Navigation & System state
  activeTab: DepartmentType;
  setActiveTab: (tab: DepartmentType) => void;
  isSidebarCollapsed: boolean;
  setIsSidebarCollapsed: (collapsed: boolean | ((prev: boolean) => boolean)) => void;
  toggleSidebar: () => void;
  currency: 'NLE' | 'USD';
  setCurrency: (c: 'NLE' | 'USD') => void;
  formatMoney: (amountNLE: number) => string;
  searchQuery: string;
  setSearchQuery: (q: string) => void;

  // Selected Patient Quick Context
  selectedPatientId: string | null;
  setSelectedPatientId: (id: string | null) => void;
  selectedPatient: Patient | undefined;

  // Modals & Assistant
  isAiModalOpen: boolean;
  setIsAiModalOpen: (open: boolean) => void;
  aiModalInitialType: string;
  openAiAssistant: (type?: string, customQuery?: any) => void;
  aiQueryContext: any;
  isCommandPaletteOpen: boolean;
  setIsCommandPaletteOpen: (open: boolean) => void;

  // Print Report Modal State
  printData: {
    title: string;
    type: 'lab' | 'ultrasound' | 'admission' | 'prescription' | 'invoice' | 'emergency';
    data: any;
    patient?: Patient;
  } | null;
  setPrintData: (data: any) => void;
  openPrintReport: (type: 'lab' | 'ultrasound' | 'admission' | 'prescription' | 'invoice' | 'emergency', data: any) => void;

  // Data Collections
  patients: Patient[];
  beds: Bed[];
  admissions: AdmissionRecord[];
  observations: ObservationCase[];
  labOrders: LabOrder[];
  pharmacyItems: PharmacyItem[];
  prescriptions: Prescription[];
  surgeries: SurgerySchedule[];
  ultrasounds: UltrasoundScan[];
  emergencies: EmergencyCase[];
  invoices: Invoice[];
  consultations: ClinicalConsultation[];

  // Mutations
  addPatient: (patient: Omit<Patient, 'id' | 'registeredAt'>) => Patient;
  updatePatient: (id: string, updates: Partial<Patient>) => void;
  
  // Admission actions
  addAdmission: (admission: Omit<AdmissionRecord, 'id'>) => void;
  dischargeAdmission: (id: string, summary: string) => void;
  addAdmissionVitals: (admissionId: string, vitals: VitalSign) => void;
  addDoctorRound: (admissionId: string, note: { doctor: string; note: string; orders: string }) => void;
  allocateBed: (bedId: string, patientId: string, patientName: string) => void;
  freeBed: (bedId: string) => void;

  // Observation actions
  addObservation: (obs: Omit<ObservationCase, 'id' | 'admittedAt' | 'status'>) => void;
  addObservationVitals: (obsId: string, vitals: VitalSign) => void;
  updateObservationStatus: (obsId: string, status: ObservationCase['status'], note?: string) => void;

  // Lab actions
  createLabOrder: (order: Omit<LabOrder, 'id' | 'orderNumber' | 'orderedAt' | 'status'>) => void;
  updateLabResults: (orderId: string, items: LabOrderItem[], labTech: string) => void;
  updateLabOrderStatus: (orderId: string, status: LabOrder['status']) => void;

  // Pharmacy actions
  addPharmacyItem: (item: Omit<PharmacyItem, 'id'>) => void;
  updatePharmacyStock: (id: string, quantityChange: number) => void;
  createPrescription: (rx: Omit<Prescription, 'id' | 'prescribedAt' | 'status'>) => void;
  dispensePrescription: (rxId: string, itemIds?: string[], notes?: string) => void;

  // Surgery actions
  scheduleSurgery: (surgery: Omit<SurgerySchedule, 'id'>) => void;
  updateSurgeryStatus: (id: string, status: SurgerySchedule['status'], notes?: string) => void;
  updateSurgeryChecklist: (id: string, checklist: Partial<SurgerySchedule['preOpChecklist']>) => void;

  // Ultrasound actions
  addUltrasoundScan: (scan: Omit<UltrasoundScan, 'id' | 'scanDate' | 'status'>) => void;
  updateUltrasoundScan: (id: string, updates: Partial<UltrasoundScan>) => void;

  // Emergency actions
  registerEmergencyCase: (erCase: Omit<EmergencyCase, 'id' | 'arrivalTime'>) => void;
  updateEmergencyStatus: (id: string, outcome: EmergencyCase['outcome'], intervention?: string) => void;

  // Billing actions
  createInvoice: (inv: Omit<Invoice, 'id' | 'invoiceNumber' | 'date'>) => void;
  payInvoice: (id: string, paidAmountNLE: number, method: Invoice['paymentMethod']) => void;

  // Consultation actions
  addConsultation: (cons: Omit<ClinicalConsultation, 'id' | 'date'>) => void;

  // Hospital Stats summary
  stats: {
    totalPatients: number;
    activeInpatients: number;
    occupiedBedsCount: number;
    totalBedsCount: number;
    bedOccupancyRate: number;
    activeObservations: number;
    pendingLabCount: number;
    lowStockPharmacyCount: number;
    todaySurgeriesCount: number;
    activeEmergencyCount: number;
    todayRevenueNLE: number;
  };
}

const HospitalContext = createContext<HospitalContextType | undefined>(undefined);

export const HospitalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Navigation & View state
  const [activeTab, setActiveTab] = useState<DepartmentType>('dashboard');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);
  const [currency, setCurrency] = useState<'NLE' | 'USD'>('NLE');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>('PT-2026-001');

  // Assistant & Modals state
  const [isAiModalOpen, setIsAiModalOpen] = useState<boolean>(false);
  const [aiModalInitialType, setAiModalInitialType] = useState<string>('differential-diagnosis');
  const [aiQueryContext, setAiQueryContext] = useState<any>(null);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState<boolean>(false);
  const [printData, setPrintData] = useState<any>(null);

  // Entities with localStorage caching
  const [patients, setPatients] = useState<Patient[]>(() => {
    const saved = localStorage.getItem('amt_patients');
    return saved ? JSON.parse(saved) : INITIAL_PATIENTS;
  });

  const [beds, setBeds] = useState<Bed[]>(() => {
    const saved = localStorage.getItem('amt_beds');
    return saved ? JSON.parse(saved) : INITIAL_BEDS;
  });

  const [admissions, setAdmissions] = useState<AdmissionRecord[]>(() => {
    const saved = localStorage.getItem('amt_admissions');
    return saved ? JSON.parse(saved) : INITIAL_ADMISSIONS;
  });

  const [observations, setObservations] = useState<ObservationCase[]>(() => {
    const saved = localStorage.getItem('amt_observations');
    return saved ? JSON.parse(saved) : INITIAL_OBSERVATIONS;
  });

  const [labOrders, setLabOrders] = useState<LabOrder[]>(() => {
    const saved = localStorage.getItem('amt_lab_orders');
    return saved ? JSON.parse(saved) : INITIAL_LAB_ORDERS;
  });

  const [pharmacyItems, setPharmacyItems] = useState<PharmacyItem[]>(() => {
    const saved = localStorage.getItem('amt_pharmacy_items');
    return saved ? JSON.parse(saved) : PHARMACY_CATALOG;
  });

  const [prescriptions, setPrescriptions] = useState<Prescription[]>(() => {
    const saved = localStorage.getItem('amt_prescriptions');
    return saved ? JSON.parse(saved) : INITIAL_PRESCRIPTIONS;
  });

  const [surgeries, setSurgeries] = useState<SurgerySchedule[]>(() => {
    const saved = localStorage.getItem('amt_surgeries');
    return saved ? JSON.parse(saved) : INITIAL_SURGERIES;
  });

  const [ultrasounds, setUltrasounds] = useState<UltrasoundScan[]>(() => {
    const saved = localStorage.getItem('amt_ultrasounds');
    return saved ? JSON.parse(saved) : INITIAL_ULTRASOUNDS;
  });

  const [emergencies, setEmergencies] = useState<EmergencyCase[]>(() => {
    const saved = localStorage.getItem('amt_emergencies');
    return saved ? JSON.parse(saved) : INITIAL_EMERGENCIES;
  });

  const [invoices, setInvoices] = useState<Invoice[]>(() => {
    const saved = localStorage.getItem('amt_invoices');
    return saved ? JSON.parse(saved) : INITIAL_INVOICES;
  });

  const [consultations, setConsultations] = useState<ClinicalConsultation[]>(() => {
    const saved = localStorage.getItem('amt_consultations');
    return saved ? JSON.parse(saved) : INITIAL_CONSULTATIONS;
  });

  // Sync to localStorage
  useEffect(() => { localStorage.setItem('amt_patients', JSON.stringify(patients)); }, [patients]);
  useEffect(() => { localStorage.setItem('amt_beds', JSON.stringify(beds)); }, [beds]);
  useEffect(() => { localStorage.setItem('amt_admissions', JSON.stringify(admissions)); }, [admissions]);
  useEffect(() => { localStorage.setItem('amt_observations', JSON.stringify(observations)); }, [observations]);
  useEffect(() => { localStorage.setItem('amt_lab_orders', JSON.stringify(labOrders)); }, [labOrders]);
  useEffect(() => { localStorage.setItem('amt_pharmacy_items', JSON.stringify(pharmacyItems)); }, [pharmacyItems]);
  useEffect(() => { localStorage.setItem('amt_prescriptions', JSON.stringify(prescriptions)); }, [prescriptions]);
  useEffect(() => { localStorage.setItem('amt_surgeries', JSON.stringify(surgeries)); }, [surgeries]);
  useEffect(() => { localStorage.setItem('amt_ultrasounds', JSON.stringify(ultrasounds)); }, [ultrasounds]);
  useEffect(() => { localStorage.setItem('amt_emergencies', JSON.stringify(emergencies)); }, [emergencies]);
  useEffect(() => { localStorage.setItem('amt_invoices', JSON.stringify(invoices)); }, [invoices]);
  useEffect(() => { localStorage.setItem('amt_consultations', JSON.stringify(consultations)); }, [consultations]);

  // Keyboard shortcut listener: Cmd+K / Ctrl+K for command palette, [ for sidebar toggle
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      }
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'b') {
        e.preventDefault();
        setIsSidebarCollapsed((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const toggleSidebar = () => setIsSidebarCollapsed((prev) => !prev);

  const formatMoney = (amountNLE: number) => {
    if (currency === 'USD') {
      const usd = (amountNLE / 20).toFixed(2);
      return `$${usd}`;
    }
    return `NLe ${amountNLE.toLocaleString()}`;
  };

  const selectedPatient = patients.find((p) => p.id === selectedPatientId);

  const openAiAssistant = (type: string = 'differential-diagnosis', customContext?: any) => {
    setAiModalInitialType(type);
    setAiQueryContext(customContext || null);
    setIsAiModalOpen(true);
  };

  const openPrintReport = (type: 'lab' | 'ultrasound' | 'admission' | 'prescription' | 'invoice' | 'emergency', data: any) => {
    const patient = patients.find((p) => p.id === data?.patientId);
    let title = 'Hospital Document';
    if (type === 'lab') title = `Laboratory Investigation Result Slip - ${data.orderNumber || data.id}`;
    if (type === 'ultrasound') title = `Diagnostic Ultrasound Scan Report - ${data.id}`;
    if (type === 'admission') title = `Inpatient Admission & Clinical Flowsheet - ${data.id}`;
    if (type === 'prescription') title = `Official Prescription & Dispensary Order - ${data.id}`;
    if (type === 'invoice') title = `Official Medical Invoice & Cash Receipt - ${data.invoiceNumber || data.id}`;
    if (type === 'emergency') title = `Emergency Triage & Trauma Log - ${data.id}`;

    setPrintData({ title, type, data, patient });
  };

  // Patients
  const addPatient = (newP: Omit<Patient, 'id' | 'registeredAt'>): Patient => {
    const id = `PT-2026-${String(patients.length + 1).padStart(3, '0')}`;
    const today = new Date().toISOString().split('T')[0];
    const created: Patient = { ...newP, id, registeredAt: today };
    setPatients((prev) => [created, ...prev]);
    setSelectedPatientId(id);
    return created;
  };

  const updatePatient = (id: string, updates: Partial<Patient>) => {
    setPatients((prev) => prev.map((p) => (p.id === id ? { ...p, ...updates } : p)));
  };

  // Admission
  const addAdmission = (newAdm: Omit<AdmissionRecord, 'id'>) => {
    const id = `ADM-2026-${String(admissions.length + 1).padStart(3, '0')}`;
    const created: AdmissionRecord = { ...newAdm, id };
    setAdmissions((prev) => [created, ...prev]);
    // update bed
    setBeds((prev) =>
      prev.map((b) =>
        b.bedNumber === newAdm.bedNumber && b.ward === newAdm.ward
          ? { ...b, status: 'occupied', patientId: newAdm.patientId, patientName: newAdm.patientName, admissionDate: newAdm.admissionDate }
          : b
      )
    );
    // update patient status
    updatePatient(newAdm.patientId, {
      status: 'Inpatient',
      currentWardBed: `${newAdm.ward} - Bed ${newAdm.bedNumber}`,
    });
  };

  const dischargeAdmission = (id: string, summary: string) => {
    const today = new Date().toISOString().split('T')[0];
    const target = admissions.find((a) => a.id === id);
    setAdmissions((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: 'discharged', dischargeDate: today, dischargeSummary: summary } : a))
    );
    if (target) {
      // free bed
      setBeds((prev) =>
        prev.map((b) =>
          b.bedNumber === target.bedNumber && b.ward === target.ward
            ? { ...b, status: 'available', patientId: undefined, patientName: undefined, admissionDate: undefined }
            : b
        )
      );
      // update patient
      updatePatient(target.patientId, { status: 'Discharged', currentWardBed: undefined });
    }
  };

  const addAdmissionVitals = (admissionId: string, vitals: VitalSign) => {
    setAdmissions((prev) =>
      prev.map((a) =>
        a.id === admissionId
          ? { ...a, vitals: [...a.vitals, { ...vitals, id: `v-${Date.now()}` }] }
          : a
      )
    );
  };

  const addDoctorRound = (admissionId: string, note: { doctor: string; note: string; orders: string }) => {
    const now = new Date().toISOString().replace('T', ' ').slice(0, 16);
    setAdmissions((prev) =>
      prev.map((a) =>
        a.id === admissionId
          ? {
              ...a,
              doctorRounds: [
                ...a.doctorRounds,
                { id: `dr-${Date.now()}`, date: now, ...note },
              ],
            }
          : a
      )
    );
  };

  const allocateBed = (bedId: string, patientId: string, patientName: string) => {
    const now = new Date().toISOString().split('T')[0];
    setBeds((prev) =>
      prev.map((b) =>
        b.id === bedId
          ? { ...b, status: 'occupied', patientId, patientName, admissionDate: now }
          : b
      )
    );
  };

  const freeBed = (bedId: string) => {
    setBeds((prev) =>
      prev.map((b) =>
        b.id === bedId
          ? { ...b, status: 'available', patientId: undefined, patientName: undefined, admissionDate: undefined }
          : b
      )
    );
  };

  // Observation
  const addObservation = (obs: Omit<ObservationCase, 'id' | 'admittedAt' | 'status'>) => {
    const id = `OBS-2026-${String(observations.length + 1).padStart(3, '0')}`;
    const now = new Date().toISOString().replace('T', ' ').slice(0, 16);
    const created: ObservationCase = {
      ...obs,
      id,
      admittedAt: now,
      status: 'observing',
    };
    setObservations((prev) => [created, ...prev]);
    updatePatient(obs.patientId, { status: 'Observation', currentWardBed: 'Observation Unit' });
  };

  const addObservationVitals = (obsId: string, vitals: VitalSign) => {
    setObservations((prev) =>
      prev.map((o) => (o.id === obsId ? { ...o, vitals: [...o.vitals, vitals] } : o))
    );
  };

  const updateObservationStatus = (obsId: string, status: ObservationCase['status'], note?: string) => {
    setObservations((prev) =>
      prev.map((o) => {
        if (o.id !== obsId) return o;
        const notes = note ? [...o.nursingCareNotes, `${new Date().toLocaleTimeString()} - ${note}`] : o.nursingCareNotes;
        return { ...o, status, nursingCareNotes: notes };
      })
    );
    const target = observations.find((o) => o.id === obsId);
    if (target) {
      if (status === 'discharged') {
        updatePatient(target.patientId, { status: 'Discharged', currentWardBed: undefined });
      } else if (status === 'admitted-inpatient') {
        updatePatient(target.patientId, { status: 'Inpatient' });
      }
    }
  };

  // Lab
  const createLabOrder = (order: Omit<LabOrder, 'id' | 'orderNumber' | 'orderedAt' | 'status'>) => {
    const count = labOrders.length + 1;
    const id = `LAB-2026-${String(count).padStart(3, '0')}`;
    const orderNumber = `ORD-${8800 + count}`;
    const now = new Date().toISOString().replace('T', ' ').slice(0, 16);
    const created: LabOrder = {
      ...order,
      id,
      orderNumber,
      orderedAt: now,
      status: 'pending',
    };
    setLabOrders((prev) => [created, ...prev]);
  };

  const updateLabResults = (orderId: string, items: LabOrderItem[], labTech: string) => {
    const now = new Date().toISOString().replace('T', ' ').slice(0, 16);
    setLabOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? {
              ...o,
              items,
              labTechnician: labTech,
              completedAt: now,
              status: 'completed',
            }
          : o
      )
    );
  };

  const updateLabOrderStatus = (orderId: string, status: LabOrder['status']) => {
    setLabOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status } : o)));
  };

  // Pharmacy
  const addPharmacyItem = (item: Omit<PharmacyItem, 'id'>) => {
    const id = `PH-${String(pharmacyItems.length + 1).padStart(2, '0')}`;
    setPharmacyItems((prev) => [...prev, { ...item, id }]);
  };

  const updatePharmacyStock = (id: string, quantityChange: number) => {
    setPharmacyItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, stockQuantity: Math.max(0, item.stockQuantity + quantityChange) }
          : item
      )
    );
  };

  const createPrescription = (rx: Omit<Prescription, 'id' | 'prescribedAt' | 'status'>) => {
    const id = `RX-2026-${String(prescriptions.length + 1).padStart(3, '0')}`;
    const now = new Date().toISOString().replace('T', ' ').slice(0, 16);
    const created: Prescription = {
      ...rx,
      id,
      prescribedAt: now,
      status: 'pending',
    };
    setPrescriptions((prev) => [created, ...prev]);
  };

  const dispensePrescription = (rxId: string, itemIds?: string[], notes?: string) => {
    setPrescriptions((prev) =>
      prev.map((rx) => {
        if (rx.id !== rxId) return rx;
        const updatedItems = rx.items.map((it) => {
          if (!itemIds || itemIds.includes(it.itemId)) {
            // deduct stock
            updatePharmacyStock(it.itemId, -it.quantity);
            return { ...it, dispensed: true };
          }
          return it;
        });
        const allDispensed = updatedItems.every((it) => it.dispensed);
        return {
          ...rx,
          items: updatedItems,
          status: allDispensed ? 'dispensed' : 'partially-dispensed',
          pharmacistNotes: notes || rx.pharmacistNotes,
        };
      })
    );
  };

  // Surgery
  const scheduleSurgery = (surg: Omit<SurgerySchedule, 'id'>) => {
    const id = `SUR-2026-${String(surgeries.length + 1).padStart(3, '0')}`;
    setSurgeries((prev) => [ { ...surg, id }, ...prev ]);
  };

  const updateSurgeryStatus = (id: string, status: SurgerySchedule['status'], notes?: string) => {
    setSurgeries((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status, postOpNotes: notes || s.postOpNotes } : s))
    );
  };

  const updateSurgeryChecklist = (id: string, checklist: Partial<SurgerySchedule['preOpChecklist']>) => {
    setSurgeries((prev) =>
      prev.map((s) =>
        s.id === id
          ? { ...s, preOpChecklist: { ...s.preOpChecklist, ...checklist } }
          : s
      )
    );
  };

  // Ultrasound
  const addUltrasoundScan = (scan: Omit<UltrasoundScan, 'id' | 'scanDate' | 'status'>) => {
    const id = `US-2026-${String(ultrasounds.length + 1).padStart(3, '0')}`;
    const today = new Date().toISOString().split('T')[0];
    const created: UltrasoundScan = {
      ...scan,
      id,
      scanDate: today,
      status: 'completed',
    };
    setUltrasounds((prev) => [created, ...prev]);
  };

  const updateUltrasoundScan = (id: string, updates: Partial<UltrasoundScan>) => {
    setUltrasounds((prev) => prev.map((u) => (u.id === id ? { ...u, ...updates } : u)));
  };

  // Emergency
  const registerEmergencyCase = (erCase: Omit<EmergencyCase, 'id' | 'arrivalTime'>) => {
    const id = `ER-2026-${String(emergencies.length + 1).padStart(3, '0')}`;
    const now = new Date().toISOString().replace('T', ' ').slice(0, 16);
    const created: EmergencyCase = {
      ...erCase,
      id,
      arrivalTime: now,
    };
    setEmergencies((prev) => [created, ...prev]);
    updatePatient(erCase.patientId, { status: 'Emergency', currentWardBed: erCase.assignedBed });
  };

  const updateEmergencyStatus = (id: string, outcome: EmergencyCase['outcome'], intervention?: string) => {
    setEmergencies((prev) =>
      prev.map((e) =>
        e.id === id
          ? {
              ...e,
              outcome,
              immediateIntervention: intervention ? `${e.immediateIntervention}\n[Update]: ${intervention}` : e.immediateIntervention,
            }
          : e
      )
    );
  };

  // Billing
  const createInvoice = (inv: Omit<Invoice, 'id' | 'invoiceNumber' | 'date'>) => {
    const count = invoices.length + 1;
    const id = `INV-2026-${String(count).padStart(3, '0')}`;
    const invoiceNumber = `AMT-INV-${String(910 + count).padStart(5, '0')}`;
    const date = new Date().toISOString().split('T')[0];
    const created: Invoice = { ...inv, id, invoiceNumber, date };
    setInvoices((prev) => [created, ...prev]);
  };

  const payInvoice = (id: string, paidAmountNLE: number, method: Invoice['paymentMethod']) => {
    setInvoices((prev) =>
      prev.map((inv) => {
        if (inv.id !== id) return inv;
        const newPaid = inv.paidAmountNLE + paidAmountNLE;
        const isFull = newPaid >= inv.totalNLE;
        return {
          ...inv,
          paidAmountNLE: newPaid,
          status: isFull ? 'paid' : 'partial',
          paymentMethod: method,
        };
      })
    );
  };

  // Consultation
  const addConsultation = (cons: Omit<ClinicalConsultation, 'id' | 'date'>) => {
    const id = `CON-2026-${String(consultations.length + 1).padStart(3, '0')}`;
    const date = new Date().toISOString().split('T')[0];
    const created: ClinicalConsultation = { ...cons, id, date };
    setConsultations((prev) => [created, ...prev]);
  };

  // Hospital Aggregated Stats
  const activeInpatients = admissions.filter((a) => a.status === 'active').length;
  const occupiedBedsCount = beds.filter((b) => b.status === 'occupied').length;
  const totalBedsCount = beds.length;
  const bedOccupancyRate = totalBedsCount > 0 ? Math.round((occupiedBedsCount / totalBedsCount) * 100) : 0;
  const activeObservations = observations.filter((o) => o.status === 'observing').length;
  const pendingLabCount = labOrders.filter((l) => l.status === 'pending' || l.status === 'analyzing').length;
  const lowStockPharmacyCount = pharmacyItems.filter((p) => p.stockQuantity <= p.reorderLevel).length;
  const todaySurgeriesCount = surgeries.filter((s) => s.status !== 'completed' && s.status !== 'postponed').length;
  const activeEmergencyCount = emergencies.filter((e) => e.outcome === 'under-stabilization').length;
  const todayRevenueNLE = invoices
    .filter((inv) => inv.status === 'paid' || inv.status === 'partial')
    .reduce((sum, inv) => sum + inv.paidAmountNLE, 0);

  const stats = {
    totalPatients: patients.length,
    activeInpatients,
    occupiedBedsCount,
    totalBedsCount,
    bedOccupancyRate,
    activeObservations,
    pendingLabCount,
    lowStockPharmacyCount,
    todaySurgeriesCount,
    activeEmergencyCount,
    todayRevenueNLE,
  };

  return (
    <HospitalContext.Provider
      value={{
        activeTab,
        setActiveTab,
        isSidebarCollapsed,
        setIsSidebarCollapsed,
        toggleSidebar,
        currency,
        setCurrency,
        formatMoney,
        searchQuery,
        setSearchQuery,
        selectedPatientId,
        setSelectedPatientId,
        selectedPatient,
        isAiModalOpen,
        setIsAiModalOpen,
        aiModalInitialType,
        openAiAssistant,
        aiQueryContext,
        isCommandPaletteOpen,
        setIsCommandPaletteOpen,
        printData,
        setPrintData,
        openPrintReport,
        patients,
        beds,
        admissions,
        observations,
        labOrders,
        pharmacyItems,
        prescriptions,
        surgeries,
        ultrasounds,
        emergencies,
        invoices,
        consultations,
        addPatient,
        updatePatient,
        addAdmission,
        dischargeAdmission,
        addAdmissionVitals,
        addDoctorRound,
        allocateBed,
        freeBed,
        addObservation,
        addObservationVitals,
        updateObservationStatus,
        createLabOrder,
        updateLabResults,
        updateLabOrderStatus,
        addPharmacyItem,
        updatePharmacyStock,
        createPrescription,
        dispensePrescription,
        scheduleSurgery,
        updateSurgeryStatus,
        updateSurgeryChecklist,
        addUltrasoundScan,
        updateUltrasoundScan,
        registerEmergencyCase,
        updateEmergencyStatus,
        createInvoice,
        payInvoice,
        addConsultation,
        stats,
      }}
    >
      {children}
    </HospitalContext.Provider>
  );
};

export const useHospital = () => {
  const context = useContext(HospitalContext);
  if (!context) {
    throw new Error('useHospital must be used within a HospitalProvider');
  }
  return context;
};
