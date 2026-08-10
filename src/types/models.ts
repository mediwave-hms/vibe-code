import {
  Role,
  Gender,
  BloodGroup,
  MaritalStatus,
  AppointmentStatus,
  VisitType,
  AdmissionStatus,
  RoomType,
  RoomStatus,
  BedStatus,
  BillStatus,
  PaymentMethod,
  PrescriptionStatus,
  MedicationForm,
  DrugCategory,
  LabTestStatus,
  LabSampleType,
  LabTestPriority,
  Department,
  Shift,
  InvoiceType,
  DischargeStatus,
  VitalType,
  CaseComplexity,
  CaseStatus,
  ApplicationStatus,
  WaveStatus,
  ProgramStatus,
} from './enums';

export interface User {
  id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: Role;
  phone?: string;
  profileImageUrl?: string;
  department?: Department;
  specialization?: string;
  licenseNumber?: string;
  shift?: Shift;
  dateOfJoining?: Date;
  salary?: number;
  address?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Patient {
  id: string;
  userId?: string;
  firstName: string;
  lastName: string;
  dateOfBirth: Date;
  gender: Gender;
  phone: string;
  alternatePhone?: string;
  email?: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  country?: string;
  bloodGroup?: BloodGroup;
  maritalStatus?: MaritalStatus;
  occupation?: string;
  ethnicity?: string;
  nationality?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  emergencyContactRelation?: string;
  insuranceProvider?: string;
  insuranceNumber?: string;
  insuranceExpiryDate?: Date;
  primaryDoctorId?: string;
  medicalRecordNumber: string;
  allergies?: string[];
  chronicConditions?: string[];
  pastSurgeries?: string[];
  familyHistory?: string[];
  currentMedications?: string[];
  height?: number;
  weight?: number;
  bmi?: number;
  age?: number;
  condition?: string;
  isSmoker?: boolean;
  drinksAlcohol?: boolean;
  organDonor?: boolean;
  isActive: boolean;
  lastVisitDate?: Date;
  registrationDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface DoctorSchedule {
  id: string;
  doctorId: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  department: Department;
  isAvailable: boolean;
  maxPatientsPerSlot?: number;
  slotDurationMinutes?: number;
  roomId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Appointment {
  id: string;
  patientId: string;
  doctorId: string;
  title: string;
  notes?: string;
  appointmentDate: Date;
  startTime: Date;
  endTime: Date;
  visitType: VisitType;
  status: AppointmentStatus;
  department: Department;
  roomId?: string;
  queueNumber?: number;
  checkInTime?: Date;
  consultationStartTime?: Date;
  completedTime?: Date;
  cancelledTime?: Date;
  cancellationReason?: string;
  cancelledBy?: string;
  followUpDate?: Date;
  isEmergency: boolean;
  createdById?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface VitalSigns {
  id: string;
  patientId: string;
  appointmentId?: string;
  admissionId?: string;
  recordedByNurseId?: string;
  recordedAt: Date;
  temperature?: number;
  systolicBP?: number;
  diastolicBP?: number;
  pulse?: number;
  respiratoryRate?: number;
  weight?: number;
  height?: number;
  bmi?: number;
  bloodSugar?: number;
  spO2?: number;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Diagnosis {
  id: string;
  patientId: string;
  appointmentId?: string;
  admissionId?: string;
  doctorId: string;
  icdCode?: string;
  diagnosis: string;
  description?: string;
  severity?: 'MILD' | 'MODERATE' | 'SEVERE' | 'CRITICAL';
  type?: 'PRIMARY' | 'SECONDARY' | 'DIFFERENTIAL';
  date: Date;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface TreatmentPlan {
  id: string;
  patientId: string;
  appointmentId?: string;
  admissionId?: string;
  doctorId: string;
  title: string;
  description?: string;
  instructions?: string[];
  startDate: Date;
  endDate?: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Prescription {
  id: string;
  patientId: string;
  doctorId: string;
  appointmentId?: string;
  admissionId?: string;
  status: PrescriptionStatus;
  issuedDate: Date;
  expiryDate?: Date;
  notes?: string;
  dispensingPharmacistId?: string;
  dispensedDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface PrescriptionItem {
  id: string;
  prescriptionId: string;
  medicationId?: string;
  medicationName: string;
  genericName?: string;
  form: MedicationForm;
  dosage: string;
  strength: string;
  frequency: string;
  duration: string;
  quantity: number;
  dispensedQuantity?: number;
  instructions?: string;
  refillCount?: number;
  remainingRefills?: number;
  isPRN: boolean;
  prnReason?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Medication {
  id: string;
  name: string;
  genericName?: string;
  category: DrugCategory;
  form: MedicationForm;
  strength: string;
  manufacturer?: string;
  batchNumber?: string;
  stockQuantity: number;
  reorderLevel: number;
  unitPrice: number;
  expiryDate?: Date;
  isControlled: boolean;
  isGeneric: boolean;
  requiresPrescription: boolean;
  sideEffects?: string[];
  contraindications?: string[];
  storageInstructions?: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Room {
  id: string;
  roomNumber: string;
  name?: string;
  floor: string;
  wing?: string;
  type: RoomType;
  status: RoomStatus;
  capacity: number;
  currentOccupancy: number;
  dailyRate: number;
  features?: string[];
  lastCleanedAt?: Date;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Bed {
  id: string;
  roomId: string;
  bedNumber: string;
  type?: RoomType;
  status: BedStatus;
  ratePerDay?: number;
  features?: string[];
  currentAdmissionId?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Admission {
  id: string;
  patientId: string;
  admissionDate: Date;
  dischargeDate?: Date;
  status: AdmissionStatus;
  doctorId: string;
  department: Department;
  roomId?: string;
  bedId?: string;
  admittingDoctorId?: string;
  attendingDoctorId?: string;
  referralSource?: string;
  admissionType: 'ELECTIVE' | 'EMERGENCY' | 'TRANSFER' | 'NEWBORN';
  reasonForAdmission?: string;
  chiefComplaint?: string;
  preliminaryDiagnosis?: string;
  finalDiagnosis?: string;
  dischargeStatus?: DischargeStatus;
  dischargeSummary?: string;
  dischargeInstructions?: string;
  followUpDate?: Date;
  nextOfKinName?: string;
  nextOfKinPhone?: string;
  nextOfKinRelation?: string;
  insuranceAuthorized?: boolean;
  insuranceAuthorizationNumber?: string;
  isSurgical: boolean;
  expectedLengthOfStay?: number;
  totalBilledAmount?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface LabTest {
  id: string;
  testCode: string;
  name: string;
  category?: string;
  sampleType: LabSampleType;
  description?: string;
  department?: Department;
  durationMinutes?: number;
  normalRangeMin?: number;
  normalRangeMax?: number;
  unit?: string;
  cost: number;
  isActive: boolean;
  requiresFasting: boolean;
  fastingHours?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface LabOrder {
  id: string;
  patientId: string;
  doctorId: string;
  appointmentId?: string;
  admissionId?: string;
  orderDate: Date;
  priority: LabTestPriority;
  status: LabTestStatus;
  clinicalNotes?: string;
  sampleCollectedAt?: Date;
  sampleCollectedBy?: string;
  sampleReceivedAt?: Date;
  tests: LabOrderTest[];
  completedAt?: Date;
  reportedBy?: string;
  reportedAt?: Date;
  reviewedBy?: string;
  reviewedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface LabOrderTest {
  id: string;
  labOrderId: string;
  testId: string;
  testName: string;
  testCode: string;
  status: LabTestStatus;
  result?: string;
  numericResult?: number;
  unit?: string;
  normalRangeMin?: number;
  normalRangeMax?: number;
  abnormalFlag?: 'HIGH' | 'LOW' | 'NORMAL';
  notes?: string;
  performedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  patientId: string;
  appointmentId?: string;
  admissionId?: string;
  issueDate: Date;
  dueDate: Date;
  type: InvoiceType;
  status: BillStatus;
  subtotal: number;
  discountAmount: number;
  discountPercent?: number;
  taxAmount: number;
  taxPercent?: number;
  totalAmount: number;
  paidAmount: number;
  balanceAmount: number;
  insuranceClaimAmount?: number;
  patientPayableAmount?: number;
  billingNotes?: string;
  cancellationReason?: string;
  cancelledAt?: Date;
  createdById?: string;
  items: InvoiceItem[];
  payments: Payment[];
  createdAt: Date;
  updatedAt: Date;
}

export interface InvoiceItem {
  id: string;
  invoiceId: string;
  description: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  itemType: InvoiceType;
  referenceId?: string;
  notes?: string;
  createdAt: Date;
}

export interface Payment {
  id: string;
  invoiceId: string;
  patientId: string;
  amount: number;
  method: PaymentMethod;
  date: Date;
  referenceNumber?: string;
  transactionId?: string;
  notes?: string;
  receivedById?: string;
  createdAt: Date;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'urgent';
  read: boolean;
  link?: string;
  relatedEntityId?: string;
  relatedEntityType?: string;
  createdAt: Date;
  updatedAt: Date;
  readAt?: Date;
}

export interface AuditLog {
  id: string;
  userId: string;
  action: string;
  entityType: string;
  entityId?: string;
  fieldChanged?: string;
  oldValue?: string;
  newValue?: string;
  ipAddress?: string;
  userAgent?: string;
  timestamp: Date;
}

export interface ClinicalNote {
  id: string;
  patientId: string;
  appointmentId?: string;
  admissionId?: string;
  authorId: string;
  authorRole: Role;
  noteType: 'PROGRESS' | 'SOAP' | 'DISCHARGE' | 'OPERATIVE' | 'CONSULTATION' | 'NURSING';
  title?: string;
  content: string;
  isFinalized: boolean;
  finalizedAt?: Date;
  signedBy?: string;
  subjective?: string;
  objective?: string;
  assessment?: string;
  plan?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface OperationProcedure {
  id: string;
  patientId: string;
  admissionId?: string;
  procedureName: string;
  procedureCode?: string;
  description?: string;
  surgeonId: string;
  anesthesiologistId?: string;
  assistantSurgeonIds?: string[];
  roomId?: string;
  scheduledDate: Date;
  startDateTime?: Date;
  endDateTime?: Date;
  status: 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  anesthesiaType?: string;
  preOpDiagnosis?: string;
  postOpDiagnosis?: string;
  complications?: string;
  outcome?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface VitalEntry {
  id: string;
  vitalType: VitalType;
  value: string;
  numericValue?: number;
  unit?: string;
  notes?: string;
}

export interface CaseTimelineEntry {
  timestamp: Date;
  actorUserId?: string;
  action: string;
  details?: string;
}

export interface Case {
  id: string;
  title: string;
  description: string;
  programId: string;
  waveId?: string;
  complexity: CaseComplexity;
  points: number;
  status: CaseStatus;
  assignedClinicianId?: string;
  assignedDate?: Date;
  assignedAt?: Date;
  patientId?: string;
  applicantCount: number;
  department: Department;
  priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  tags?: string[];
  diagnosis?: string;
  treatmentPlan?: string;
  timeline?: CaseTimelineEntry[];
  createdAt: Date;
  updatedAt: Date;
  resolvedAt?: Date;
  closedAt?: Date;
}

export interface CaseApplication {
  id: string;
  caseId: string;
  clinicianId: string;
  coverNote?: string;
  status: ApplicationStatus;
  appliedAt: Date;
  reviewedAt?: Date;
  rejectionReason?: string;
}

export interface Wave {
  id: string;
  programId: string;
  name: string;
  description?: string;
  startDate: Date;
  endDate: Date;
  status: WaveStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface Program {
  id: string;
  name: string;
  description?: string;
  organizerId: string;
  status: ProgramStatus;
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Review {
  id: string;
  caseId: string;
  reviewerId: string;
  revieweeId: string;
  overallRating: number;
  categories: Record<string, number>;
  comment?: string;
  createdAt: Date;
  updatedAt: Date;
}
