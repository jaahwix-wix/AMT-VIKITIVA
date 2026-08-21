/**
 * AMT & Vikitiva Health Care Centre
 * 92 Main Sewa Road, Bo City, Sierra Leone
 * System Data Models & Types
 */

export interface HospitalInfo {
  name: string;
  shortName: string;
  tagline: string;
  address: string;
  city: string;
  country: string;
  phones: string[];
  email: string;
}

export type DepartmentType =
  | 'admission'
  | 'observation'
  | 'laboratory'
  | 'pharmacy'
  | 'surgery'
  | 'ultrasound'
  | 'emergency'
  | 'patients'
  | 'consultation'
  | 'billing'
  | 'reports'
  | 'dashboard';

export interface VitalSign {
  id?: string;
  timestamp: string;
  bp: string; // e.g. "120/80"
  hr: number; // bpm
  temp: number; // °C
  spo2: number; // %
  rr: number; // breaths/min
  bloodSugar?: number; // mg/dL
  painScale?: number; // 0-10
  notes?: string;
}

export interface Patient {
  id: string;
  nationalId?: string;
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  dob: string;
  phone: string;
  address: string;
  bloodGroup: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';
  genotype: 'AA' | 'AS' | 'SS' | 'AC' | 'SC';
  allergies: string[];
  chronicConditions: string[];
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
  };
  registeredAt: string;
  status: 'Outpatient' | 'Inpatient' | 'Observation' | 'Emergency' | 'Discharged';
  currentWardBed?: string;
}

// 1. ADMISSION
export interface Bed {
  id: string;
  bedNumber: string;
  ward: 'Male Medical Ward' | 'Female Medical Ward' | 'Maternity Ward' | 'Pediatric Ward' | 'Surgical Ward' | 'ICU & Isolation';
  status: 'available' | 'occupied' | 'maintenance' | 'reserved';
  patientId?: string;
  patientName?: string;
  admissionDate?: string;
}

export interface AdmissionRecord {
  id: string;
  patientId: string;
  patientName: string;
  age: number;
  gender: string;
  ward: 'Male Medical Ward' | 'Female Medical Ward' | 'Maternity Ward' | 'Pediatric Ward' | 'Surgical Ward' | 'ICU & Isolation';
  bedNumber: string;
  admissionDate: string;
  dischargeDate?: string;
  admittingDoctor: string;
  diagnosis: string;
  status: 'active' | 'discharged' | 'transferred';
  vitals: VitalSign[];
  doctorRounds: {
    id: string;
    date: string;
    doctor: string;
    note: string;
    orders: string;
  }[];
  dischargeSummary?: string;
}

// 2. OBSERVATION
export interface ObservationCase {
  id: string;
  patientId: string;
  patientName: string;
  age: number;
  gender: string;
  admittedAt: string;
  targetDurationHours: number;
  triageLevel: 'Urgent (High Risk)' | 'Moderate' | 'Mild Observation';
  chiefComplaint: string;
  provisionalDiagnosis: string;
  vitals: VitalSign[];
  ivFluids: string;
  nursingCareNotes: string[];
  status: 'observing' | 'discharged' | 'admitted-inpatient' | 'transferred';
  assignedNurse: string;
}

// 3. LABORATORY
export interface LabTestCatalogItem {
  id: string;
  name: string;
  code: string;
  category: 'Parasitology' | 'Hematology' | 'Biochemistry' | 'Serology' | 'Urinalysis' | 'Microbiology';
  priceNLE: number;
  priceUSD: number;
  turnaroundMinutes: number;
  normalRange: string;
  unit: string;
}

export interface LabOrderItem {
  testId: string;
  testName: string;
  category: string;
  result?: string;
  unit?: string;
  referenceRange?: string;
  isAbnormal?: boolean;
  notes?: string;
}

export interface LabOrder {
  id: string;
  orderNumber: string;
  patientId: string;
  patientName: string;
  age: number;
  gender: string;
  doctorName: string;
  orderedAt: string;
  completedAt?: string;
  priority: 'Routine' | 'Urgent' | 'STAT (Emergency)';
  status: 'pending' | 'sample-collected' | 'analyzing' | 'completed' | 'cancelled';
  items: LabOrderItem[];
  clinicalNotes?: string;
  labTechnician?: string;
}

// 4. PHARMACY
export interface PharmacyItem {
  id: string;
  code: string;
  name: string;
  genericName: string;
  category: 'Antimalarial' | 'Antibiotic' | 'Analgesic & Antipyretic' | 'Antihypertensive' | 'IV Fluid & Electrolyte' | 'Maternal Health' | 'Surgical Supply' | 'Gastrointestinal';
  dosageForm: 'Tablets' | 'Syrup' | 'Injection' | 'Suspension' | 'Capsules' | 'IV Infusion' | 'Ointment';
  strength: string;
  stockQuantity: number;
  reorderLevel: number;
  unitPriceNLE: number; // Sierra Leone Leone
  unitPriceUSD: number;
  batchNumber: string;
  expiryDate: string;
  manufacturer: string;
}

export interface PrescriptionItem {
  itemId: string;
  itemName: string;
  dosage: string;
  frequency: string;
  duration: string;
  quantity: number;
  unitPriceNLE: number;
  dispensed: boolean;
}

export interface Prescription {
  id: string;
  patientId: string;
  patientName: string;
  doctorName: string;
  prescribedAt: string;
  diagnosis: string;
  items: PrescriptionItem[];
  status: 'pending' | 'partially-dispensed' | 'dispensed' | 'cancelled';
  pharmacistNotes?: string;
}

// 5. SURGERY
export interface SurgerySchedule {
  id: string;
  patientId: string;
  patientName: string;
  age: number;
  gender: string;
  procedureName: string;
  procedureType: 'Emergency' | 'Major Elective' | 'Minor Procedure' | 'Obstetric / C-Section';
  theatreRoom: 'OT-1 (Main Surgical)' | 'OT-2 (Maternity & C-Section)' | 'OT-3 (Trauma & Minor)';
  leadSurgeon: string;
  assistantSurgeon?: string;
  anaesthetist: string;
  scrubNurse: string;
  scheduledDate: string;
  scheduledTime: string;
  estimatedDurationHours: number;
  status: 'scheduled' | 'pre-op-prep' | 'in-surgery' | 'recovery-room' | 'completed' | 'postponed';
  preOpChecklist: {
    fastingVerified: boolean;
    bloodCrossMatched: boolean;
    surgicalConsentSigned: boolean;
    prophylacticAntibiotics: boolean;
    anesthesiaAssessed: boolean;
  };
  postOpNotes?: string;
}

// 6. ULTRA-SOUND (SCANNING)
export interface UltrasoundScan {
  id: string;
  patientId: string;
  patientName: string;
  age: number;
  gender: string;
  scanType: 'Obstetric (Pregnancy)' | 'Pelvic / GYN' | 'Abdominal' | 'Renal & Urinary' | 'Doppler Vascular' | 'Thyroid & Soft Tissue';
  referringDoctor: string;
  sonographer: string;
  scanDate: string;
  gestationalAgeWeeks?: number;
  estimatedDueDate?: string;
  fetalHeartRate?: number;
  biometry?: {
    bpd_mm?: number; // Biparietal Diameter
    fl_mm?: number;  // Femur Length
    ac_mm?: number;  // Abdominal Circumference
    hc_mm?: number;  // Head Circumference
    efw_grams?: number; // Est. Fetal Weight
    afi_cm?: number; // Amniotic Fluid Index
  };
  findings: string;
  impression: string;
  recommendations: string;
  imageUrl?: string;
  status: 'completed' | 'draft' | 'pending';
}

// 7. EMERGENCY / ACCIDENT
export interface EmergencyCase {
  id: string;
  patientId: string;
  patientName: string;
  age: number;
  gender: string;
  arrivalTime: string;
  triageCategory: 'RED (Immediate)' | 'YELLOW (Urgent)' | 'GREEN (Standard)' | 'BLACK (Expectant)';
  chiefComplaint: string;
  traumaMechanism?: string;
  consciousnessLevel: 'Alert' | 'Voice Responsive' | 'Pain Responsive' | 'Unresponsive';
  vitals: VitalSign;
  immediateIntervention: string;
  attendingOfficer: string;
  outcome: 'under-stabilization' | 'admitted-inpatient' | 'sent-to-surgery' | 'transferred' | 'discharged';
  assignedBed: string;
}

// BILLING & INVOICING
export interface InvoiceItem {
  id: string;
  serviceName: string;
  department: 'Admission' | 'Observation' | 'Laboratory' | 'Pharmacy' | 'Surgery' | 'Ultrasound' | 'Emergency' | 'Consultation';
  amountNLE: number;
  amountUSD: number;
  quantity: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  patientId: string;
  patientName: string;
  date: string;
  items: InvoiceItem[];
  subtotalNLE: number;
  discountNLE: number;
  totalNLE: number;
  totalUSD: number;
  status: 'paid' | 'partial' | 'unpaid';
  paidAmountNLE: number;
  paymentMethod: 'Cash (NLE)' | 'Cash (USD)' | 'Orange Money' | 'Afrimoney' | 'Bank Transfer' | 'NHIS / Insurance';
  cashierName: string;
}

// CONSULTATION / CLINICAL SOAP NOTE
export interface ClinicalConsultation {
  id: string;
  patientId: string;
  patientName: string;
  doctorName: string;
  date: string;
  vitals: VitalSign;
  subjective: {
    chiefComplaint: string;
    historyOfPresentIllness: string;
    pastHistory: string;
  };
  objective: {
    physicalExamination: string;
    systemicReview: string;
    diagnosticSummary: string;
  };
  assessment: {
    primaryDiagnosis: string;
    icd10Code?: string;
    differentialDiagnoses: string[];
  };
  plan: {
    prescriptions: string[];
    labOrdersRequested: string[];
    ultrasoundRequested?: string;
    admissionAdvised: boolean;
    admissionWard?: string;
    followUpDate?: string;
    patientInstructions: string;
  };
}
