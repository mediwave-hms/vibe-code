import {
  subDays,
  addDays,
  addHours,
  addMonths,
  setHours,
  setMinutes,
  setSeconds,
} from 'date-fns';
import type {
  User,
  Patient,
  DoctorSchedule,
  Appointment,
  VitalSigns,
  Prescription,
  PrescriptionItem,
  Medication,
  Room,
  Bed,
  Admission,
  LabTest,
  LabOrder,
  LabOrderTest,
  Invoice,
  InvoiceItem,
  Payment,
  Notification,
  ClinicalNote,
  Case,
  CaseApplication,
  Wave,
  Program,
  Review,
} from '../types/models';
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
  NotificationType,
  CaseComplexity,
  CaseStatus,
  WaveStatus,
  ProgramStatus,
  ApplicationStatus,
} from '../types/enums';

function genId(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

const TODAY = new Date();

export function generateSeedData(): {
  users: User[];
  patients: Patient[];
  doctorSchedules: DoctorSchedule[];
  appointments: Appointment[];
  vitalSigns: VitalSigns[];
  clinicalNotes: ClinicalNote[];
  rooms: Room[];
  beds: Bed[];
  admissions: Admission[];
  medications: Medication[];
  prescriptions: Prescription[];
  prescriptionItems: PrescriptionItem[];
  labTests: LabTest[];
  labOrders: LabOrder[];
  labOrderTests: LabOrderTest[];
  invoices: Invoice[];
  invoiceItems: InvoiceItem[];
  payments: Payment[];
  notifications: Notification[];
  programs: Program[];
  waves: Wave[];
  cases: Case[];
  caseApplications: CaseApplication[];
  reviews: Review[];
} {
  // ============== USERS ==============
  const adminId = genId();
  const doctor1Id = genId();
  const doctor2Id = genId();
  const doctor3Id = genId();
  const doctor4Id = genId();
  const nurse1Id = genId();
  const nurse2Id = genId();
  const nurse3Id = genId();
  const receptionist1Id = genId();
  const receptionist2Id = genId();
  const pharmacist1Id = genId();
  const labTech1Id = genId();
  const labTech2Id = genId();
  const accountant1Id = genId();
  const pendingApplicantId = genId();
  const patientUser1Id = genId();
  const patientUser2Id = genId();
  const patientUser3Id = genId();

  const users: User[] = [
    {
      id: adminId,
      email: 'admin@hospital.com',
      password: 'admin123',
      firstName: 'Amanda',
      lastName: 'Carter',
      role: Role.ADMIN,
      phone: '(555) 100-2000',
      profileImageUrl: undefined,
      department: undefined,
      specialization: 'Healthcare Administration',
      licenseNumber: undefined,
      shift: Shift.MORNING,
      dateOfJoining: subDays(TODAY, 730),
      salary: 95000,
      address: '450 Oakridge Dr, Springfield, IL 62701',
      isActive: true,
      createdAt: subDays(TODAY, 730),
      updatedAt: subDays(TODAY, 10),
    },
    {
      id: doctor1Id,
      email: 'dr.simmons@hospital.com',
      password: 'hashed_doc_1',
      firstName: 'Margaret',
      lastName: 'Simmons',
      role: Role.DOCTOR,
      phone: '(555) 100-2001',
      department: Department.CARDIOLOGY,
      specialization: 'Interventional Cardiology',
      licenseNumber: 'LIC-CARD-00123',
      shift: Shift.MORNING,
      dateOfJoining: subDays(TODAY, 1460),
      salary: 220000,
      address: '122 Beacon St, Springfield, IL 62702',
      isActive: true,
      createdAt: subDays(TODAY, 1460),
      updatedAt: subDays(TODAY, 5),
    },
    {
      id: doctor2Id,
      email: 'dr.ramirez@hospital.com',
      password: 'hashed_doc_2',
      firstName: 'Carlos',
      lastName: 'Ramirez',
      role: Role.DOCTOR,
      phone: '(555) 100-2002',
      department: Department.NEUROLOGY,
      specialization: 'Vascular Neurology',
      licenseNumber: 'LIC-NEURO-00456',
      shift: Shift.AFTERNOON,
      dateOfJoining: subDays(TODAY, 1095),
      salary: 210000,
      address: '788 Pine Ave, Springfield, IL 62703',
      isActive: true,
      createdAt: subDays(TODAY, 1095),
      updatedAt: subDays(TODAY, 3),
    },
    {
      id: doctor3Id,
      email: 'dr.nguyen@hospital.com',
      password: 'hashed_doc_3',
      firstName: 'Linh',
      lastName: 'Nguyen',
      role: Role.DOCTOR,
      phone: '(555) 100-2005',
      department: Department.PEDIATRICS,
      specialization: 'General Pediatrics',
      licenseNumber: 'LIC-PED-00789',
      shift: Shift.MORNING,
      dateOfJoining: subDays(TODAY, 730),
      salary: 180000,
      address: '339 Maple Ct, Springfield, IL 62704',
      isActive: true,
      createdAt: subDays(TODAY, 730),
      updatedAt: subDays(TODAY, 8),
    },
    {
      id: doctor4Id,
      email: 'dr.patel@hospital.com',
      password: 'hashed_doc_4',
      firstName: 'Raj',
      lastName: 'Patel',
      role: Role.DOCTOR,
      phone: '(555) 100-2004',
      department: Department.GENERAL_MEDICINE,
      specialization: 'Internal Medicine',
      licenseNumber: 'LIC-GEN-00321',
      shift: Shift.ROTATING,
      dateOfJoining: subDays(TODAY, 1825),
      salary: 195000,
      address: '567 Cedar Ln, Springfield, IL 62705',
      isActive: true,
      createdAt: subDays(TODAY, 1825),
      updatedAt: subDays(TODAY, 2),
    },
    {
      id: nurse1Id,
      email: 's.oconnor@hospital.com',
      password: 'hashed_nurse_1',
      firstName: 'Sarah',
      lastName: "O'Connor",
      role: Role.NURSE,
      phone: '(555) 100-2006',
      department: Department.CARDIOLOGY,
      specialization: 'Cardiac Nursing',
      licenseNumber: 'RN-CARD-11223',
      shift: Shift.MORNING,
      dateOfJoining: subDays(TODAY, 545),
      salary: 78000,
      address: '901 Elm St, Springfield, IL 62706',
      isActive: true,
      createdAt: subDays(TODAY, 545),
      updatedAt: subDays(TODAY, 12),
    },
    {
      id: nurse2Id,
      email: 'm.brown@hospital.com',
      password: 'hashed_nurse_2',
      firstName: 'Michael',
      lastName: 'Brown',
      role: Role.NURSE,
      phone: '(555) 100-2007',
      department: Department.PEDIATRICS,
      specialization: 'Pediatric Nursing',
      licenseNumber: 'RN-PED-44556',
      shift: Shift.NIGHT,
      dateOfJoining: subDays(TODAY, 365),
      salary: 72000,
      address: '234 Walnut Way, Springfield, IL 62707',
      isActive: true,
      createdAt: subDays(TODAY, 365),
      updatedAt: subDays(TODAY, 6),
    },
    {
      id: nurse3Id,
      email: 'a.johnson@hospital.com',
      password: 'hashed_nurse_3',
      firstName: 'Angela',
      lastName: 'Johnson',
      role: Role.NURSE,
      phone: '(555) 100-2010',
      department: Department.EMERGENCY,
      specialization: 'Critical Care / ER',
      licenseNumber: 'RN-ER-77889',
      shift: Shift.AFTERNOON,
      dateOfJoining: subDays(TODAY, 912),
      salary: 82000,
      address: '777 Birch Rd, Springfield, IL 62708',
      isActive: true,
      createdAt: subDays(TODAY, 912),
      updatedAt: subDays(TODAY, 4),
    },
    {
      id: receptionist1Id,
      email: 'l.garcia@hospital.com',
      password: 'hashed_rec_1',
      firstName: 'Lucia',
      lastName: 'Garcia',
      role: Role.RECEPTIONIST,
      phone: '(555) 100-2008',
      department: Department.GENERAL_MEDICINE,
      specialization: 'Front Desk Operations',
      licenseNumber: undefined,
      shift: Shift.MORNING,
      dateOfJoining: subDays(TODAY, 450),
      salary: 42000,
      address: '101 Ash Blvd, Springfield, IL 62709',
      isActive: true,
      createdAt: subDays(TODAY, 450),
      updatedAt: subDays(TODAY, 15),
    },
    {
      id: receptionist2Id,
      email: 't.moore@hospital.com',
      password: 'hashed_rec_2',
      firstName: 'Thomas',
      lastName: 'Moore',
      role: Role.RECEPTIONIST,
      phone: '(555) 100-2009',
      department: Department.PEDIATRICS,
      specialization: 'Appointment Scheduling',
      licenseNumber: undefined,
      shift: Shift.AFTERNOON,
      dateOfJoining: subDays(TODAY, 280),
      salary: 40000,
      address: '245 Poplar St, Springfield, IL 62710',
      isActive: true,
      createdAt: subDays(TODAY, 280),
      updatedAt: subDays(TODAY, 9),
    },
    {
      id: pharmacist1Id,
      email: 'k.chen@hospital.com',
      password: 'hashed_pharm_1',
      firstName: 'Kevin',
      lastName: 'Chen',
      role: Role.PHARMACIST,
      phone: '(555) 100-2011',
      department: Department.PHARMACY,
      specialization: 'Clinical Pharmacy',
      licenseNumber: 'PHARM-99887',
      shift: Shift.MORNING,
      dateOfJoining: subDays(TODAY, 680),
      salary: 115000,
      address: '612 Cherry Ln, Springfield, IL 62711',
      isActive: true,
      createdAt: subDays(TODAY, 680),
      updatedAt: subDays(TODAY, 7),
    },
    {
      id: labTech1Id,
      email: 'j.wilson@hospital.com',
      password: 'hashed_lab_1',
      firstName: 'James',
      lastName: 'Wilson',
      role: Role.LAB_TECHNICIAN,
      phone: '(555) 100-2012',
      department: Department.LABORATORY,
      specialization: 'Clinical Laboratory Science',
      licenseNumber: 'LABT-55443',
      shift: Shift.MORNING,
      dateOfJoining: subDays(TODAY, 600),
      salary: 62000,
      address: '880 Spruce Dr, Springfield, IL 62712',
      isActive: true,
      createdAt: subDays(TODAY, 600),
      updatedAt: subDays(TODAY, 11),
    },
    {
      id: labTech2Id,
      email: 'r.davis@hospital.com',
      password: 'hashed_lab_2',
      firstName: 'Rachel',
      lastName: 'Davis',
      role: Role.LAB_TECHNICIAN,
      phone: '(555) 100-2013',
      department: Department.LABORATORY,
      specialization: 'Histopathology',
      licenseNumber: 'LABT-66778',
      shift: Shift.AFTERNOON,
      dateOfJoining: subDays(TODAY, 410),
      salary: 60000,
      address: '321 Fir Ave, Springfield, IL 62713',
      isActive: true,
      createdAt: subDays(TODAY, 410),
      updatedAt: subDays(TODAY, 1),
    },
    {
      id: pendingApplicantId,
      email: 's.jackson@hospital.com',
      password: 'pending123',
      firstName: 'Samuel',
      lastName: 'Jackson',
      role: Role.DOCTOR,
      phone: '(555) 100-2020',
      department: Department.ORTHOPEDICS,
      specialization: 'Orthopedic Surgery',
      licenseNumber: 'LIC-ORTH-00999',
      shift: Shift.MORNING,
      address: '801 Elm St, Springfield, IL 62714',
      isActive: false,
      createdAt: subDays(TODAY, 6),
      updatedAt: subDays(TODAY, 1),
    },
    {
      id: accountant1Id,
      email: 'd.martinez@hospital.com',
      password: 'hashed_acc_1',
      firstName: 'Diana',
      lastName: 'Martinez',
      role: Role.ACCOUNTANT,
      phone: '(555) 100-2014',
      department: undefined,
      specialization: 'Medical Billing & Accounting',
      licenseNumber: 'CPA-224466',
      shift: Shift.MORNING,
      dateOfJoining: subDays(TODAY, 1000),
      salary: 75000,
      address: '555 Sycamore Ct, Springfield, IL 62714',
      isActive: true,
      createdAt: subDays(TODAY, 1000),
      updatedAt: subDays(TODAY, 14),
    },
    {
      id: patientUser1Id,
      email: 'johndoe@example.com',
      password: 'hashed_pat_1',
      firstName: 'John',
      lastName: 'Doe',
      role: Role.PATIENT,
      phone: '(555) 300-1001',
      isActive: true,
      createdAt: subDays(TODAY, 200),
      updatedAt: subDays(TODAY, 20),
    },
    {
      id: patientUser2Id,
      email: 'janesmith@example.com',
      password: 'hashed_pat_2',
      firstName: 'Jane',
      lastName: 'Smith',
      role: Role.PATIENT,
      phone: '(555) 300-1002',
      isActive: true,
      createdAt: subDays(TODAY, 150),
      updatedAt: subDays(TODAY, 18),
    },
    {
      id: patientUser3Id,
      email: 'robert.johnson@example.com',
      password: 'hashed_pat_3',
      firstName: 'Robert',
      lastName: 'Johnson',
      role: Role.PATIENT,
      phone: '(555) 300-1003',
      isActive: true,
      createdAt: subDays(TODAY, 100),
      updatedAt: subDays(TODAY, 22),
    },
  ];

  // ============== PATIENTS ==============
  const patientFirstNames = [
    'Emily', 'James', 'Olivia', 'Liam', 'Ava', 'Noah', 'Sophia', 'Ethan',
    'Isabella', 'Lucas', 'Mia', 'Mason', 'Charlotte', 'Logan', 'Amelia',
    'Benjamin', 'Harper', 'Alexander',
  ];
  const patientLastNames = [
    'Anderson', 'Thompson', 'Harris', 'Clark', 'Lewis', 'Walker', 'Hall',
    'Young', 'King', 'Wright', 'Scott', 'Green', 'Adams', 'Baker', 'Nelson',
    'Carter', 'Mitchell', 'Roberts',
  ];
  const cities = [
    'Springfield', 'Madison', 'Franklin', 'Clinton', 'Washington',
    'Greenville', 'Bristol', 'Salem', 'Arlington', 'Riverside',
  ];
  const genders = [Gender.MALE, Gender.FEMALE, Gender.OTHER];
  const bloodGroups = [
    BloodGroup.A_POSITIVE, BloodGroup.A_NEGATIVE, BloodGroup.B_POSITIVE,
    BloodGroup.B_NEGATIVE, BloodGroup.AB_POSITIVE, BloodGroup.AB_NEGATIVE,
    BloodGroup.O_POSITIVE, BloodGroup.O_NEGATIVE,
  ];
  const maritalStatuses = [
    MaritalStatus.SINGLE, MaritalStatus.MARRIED, MaritalStatus.DIVORCED, MaritalStatus.WIDOWED,
  ];

  const patients: Patient[] = [];
  for (let i = 0; i < 18; i++) {
    const birthYear = 1950 + Math.floor((i * 3.2) % 65);
    const birthMonth = (i * 7) % 12;
    const birthDay = 1 + ((i * 13) % 28);
    const regDate = subDays(TODAY, 30 + ((i * 11) % 200));
    patients.push({
      id: genId(),
      userId: i === 0 ? patientUser1Id : i === 1 ? patientUser2Id : i === 2 ? patientUser3Id : undefined,
      firstName: patientFirstNames[i],
      lastName: patientLastNames[i],
      dateOfBirth: new Date(birthYear, birthMonth, birthDay),
      gender: genders[i % 3],
      phone: `(555) 300-${String(2000 + i).padStart(4, '0')}`,
      alternatePhone: i % 3 === 0 ? `(555) 400-${String(3000 + i).padStart(4, '0')}` : undefined,
      email: `${patientFirstNames[i].toLowerCase()}.${patientLastNames[i].toLowerCase()}${i}@example.com`,
      address: `${100 + i * 7} Main St`,
      city: cities[i % cities.length],
      state: 'IL',
      pincode: `6270${i % 10}`,
      country: 'USA',
      bloodGroup: bloodGroups[i % bloodGroups.length],
      maritalStatus: maritalStatuses[i % maritalStatuses.length],
      occupation: i % 4 === 0 ? 'Software Engineer' : i % 4 === 1 ? 'Teacher' : i % 4 === 2 ? 'Retired' : 'Business Owner',
      ethnicity: i % 3 === 0 ? 'Caucasian' : i % 3 === 1 ? 'African American' : 'Hispanic',
      nationality: 'American',
      emergencyContactName: `${patientFirstNames[(i + 3) % 18]} ${patientLastNames[(i + 5) % 18]}`,
      emergencyContactPhone: `(555) 400-${String(3100 + i).padStart(4, '0')}`,
      emergencyContactRelation: i % 4 === 0 ? 'Spouse' : i % 4 === 1 ? 'Parent' : i % 4 === 2 ? 'Child' : 'Sibling',
      insuranceProvider: i % 4 === 0 ? 'Blue Cross Blue Shield' : i % 4 === 1 ? 'UnitedHealthcare' : i % 4 === 2 ? 'Aetna' : 'Cigna',
      insuranceNumber: `POL-${100000 + i}`,
      insuranceExpiryDate: addMonths(TODAY, 6 + (i % 18)),
      primaryDoctorId: [doctor1Id, doctor2Id, doctor3Id, doctor4Id][i % 4],
      medicalRecordNumber: `MRN-${String(2024000 + i).padStart(7, '0')}`,
      allergies:
        i % 5 === 0 ? ['Penicillin', 'Peanuts'] :
        i % 5 === 1 ? ['Sulfa drugs'] :
        i % 5 === 2 ? ['Latex'] : ['None known'],
      chronicConditions:
        i % 3 === 0 ? ['Hypertension', 'Type 2 Diabetes'] :
        i % 3 === 1 ? ['Asthma'] :
        i % 3 === 2 ? ['High Cholesterol'] : [],
      pastSurgeries:
        i % 6 === 0 ? ['Appendectomy (2015)'] :
        i % 6 === 1 ? ['Cholecystectomy (2019)'] : [],
      familyHistory:
        i % 3 === 0 ? ['Father: Heart Disease', 'Mother: Diabetes'] :
        i % 3 === 1 ? ['Brother: Hypertension'] : [],
      currentMedications:
        i % 3 === 0 ? ['Lisinopril 10mg daily', 'Metformin 500mg BID'] :
        i % 3 === 1 ? ['Albuterol inhaler PRN'] :
        ['Multivitamin daily'],
      height: 150 + ((i * 4) % 50),
      weight: 50 + ((i * 3) % 60),
      bmi: Number((20 + ((i * 0.7) % 15)).toFixed(1)),
      isSmoker: i % 5 === 0,
      drinksAlcohol: i % 3 === 0,
      organDonor: i % 2 === 0,
      isActive: true,
      lastVisitDate: subDays(TODAY, (i * 5) % 90),
      registrationDate: regDate,
      createdAt: regDate,
      updatedAt: subDays(TODAY, (i % 30) + 1),
    });
  }

  const patientIds = patients.map(p => p.id);

  // ============== ROOMS & BEDS ==============
  const rooms: Room[] = [];
  const beds: Bed[] = [];

  const roomConfigs: Array<{
    roomNumber: string; floor: string; wing?: string; type: RoomType;
    status: RoomStatus; capacity: number; dailyRate: number; features: string[];
    bedCount: number;
  }> = [
    { roomNumber: '101-A', floor: '1', wing: 'East', type: RoomType.GENERAL, status: RoomStatus.OCCUPIED, capacity: 4, dailyRate: 250, features: ['Shared Bathroom', 'TV', 'Wi-Fi'], bedCount: 4 },
    { roomNumber: '205-B', floor: '2', wing: 'West', type: RoomType.SEMI_PRIVATE, status: RoomStatus.OCCUPIED, capacity: 2, dailyRate: 500, features: ['Private Bathroom', 'TV', 'Wi-Fi', 'Window View'], bedCount: 2 },
    { roomNumber: '310', floor: '3', wing: 'North', type: RoomType.PRIVATE, status: RoomStatus.AVAILABLE, capacity: 1, dailyRate: 900, features: ['Private Bathroom', 'TV', 'Wi-Fi', 'Premium View', 'Sofa Bed'], bedCount: 1 },
    { roomNumber: 'ICU-03', floor: '4', wing: 'ICU', type: RoomType.ICU, status: RoomStatus.OCCUPIED, capacity: 1, dailyRate: 2500, features: ['Cardiac Monitor', 'Ventilator Access', '24/7 Monitoring', 'Private Bathroom'], bedCount: 1 },
    { roomNumber: 'PED-12', floor: '2', wing: 'Pediatrics', type: RoomType.PEDIATRIC, status: RoomStatus.AVAILABLE, capacity: 2, dailyRate: 600, features: ['Child-Friendly Decor', 'Parental Sleeping', 'TV', 'Wi-Fi'], bedCount: 2 },
    { roomNumber: 'CCU-01', floor: '4', wing: 'CCU', type: RoomType.CCU, status: RoomStatus.CLEANING, capacity: 1, dailyRate: 2800, features: ['Cardiac Monitor', 'Hemodynamic Monitoring', '24/7 Care'], bedCount: 1 },
  ];

  for (const config of roomConfigs) {
    const roomId = genId();
    rooms.push({
      id: roomId,
      roomNumber: config.roomNumber,
      floor: config.floor,
      wing: config.wing,
      type: config.type,
      status: config.status,
      capacity: config.capacity,
      currentOccupancy: config.status === RoomStatus.OCCUPIED ? Math.max(1, config.bedCount - 1) : 0,
      dailyRate: config.dailyRate,
      features: config.features,
      lastCleanedAt: subDays(TODAY, config.status === RoomStatus.CLEANING ? 0 : 1),
      notes: undefined,
      createdAt: subDays(TODAY, 500),
      updatedAt: subDays(TODAY, 2),
    });
    for (let b = 0; b < config.bedCount; b++) {
      beds.push({
        id: genId(),
        roomId,
        bedNumber: `${config.roomNumber}-B${b + 1}`,
        type: config.type,
        status:
          config.status === RoomStatus.OCCUPIED && b === 0 ? BedStatus.OCCUPIED :
          config.status === RoomStatus.AVAILABLE ? BedStatus.AVAILABLE :
          config.status === RoomStatus.CLEANING ? BedStatus.OUT_OF_SERVICE : BedStatus.AVAILABLE,
        ratePerDay: config.dailyRate / config.bedCount,
        features: ['Electric Bed', 'Side Rails', 'IV Pole'],
        currentAdmissionId: undefined,
        notes: undefined,
        createdAt: subDays(TODAY, 500),
        updatedAt: subDays(TODAY, 2),
      });
    }
  }

  const occupiedBed = beds.find(b => b.status === BedStatus.OCCUPIED);
  const occupiedRoom = rooms.find(r => r.status === RoomStatus.OCCUPIED && r.type === RoomType.GENERAL);
  const icuRoom = rooms.find(r => r.type === RoomType.ICU);
  const icuBed = beds.find(b => b.roomId === icuRoom?.id);
  const semiPrivateRoom = rooms.find(r => r.type === RoomType.SEMI_PRIVATE);
  const semiPrivateBed = beds.find(b => b.roomId === semiPrivateRoom?.id);
  const privateRoom = rooms.find(r => r.type === RoomType.PRIVATE);
  const privateBed = beds.find(b => b.roomId === privateRoom?.id);

  // ============== DOCTOR SCHEDULES ==============
  const doctorSchedules: DoctorSchedule[] = [
    {
      id: genId(),
      doctorId: doctor1Id,
      dayOfWeek: 1,
      startTime: '09:00',
      endTime: '17:00',
      department: Department.CARDIOLOGY,
      isAvailable: true,
      maxPatientsPerSlot: 2,
      slotDurationMinutes: 30,
      roomId: privateRoom?.id,
      createdAt: subDays(TODAY, 300),
      updatedAt: subDays(TODAY, 10),
    },
    {
      id: genId(),
      doctorId: doctor1Id,
      dayOfWeek: 2,
      startTime: '09:00',
      endTime: '17:00',
      department: Department.CARDIOLOGY,
      isAvailable: true,
      maxPatientsPerSlot: 2,
      slotDurationMinutes: 30,
      roomId: privateRoom?.id,
      createdAt: subDays(TODAY, 300),
      updatedAt: subDays(TODAY, 10),
    },
    {
      id: genId(),
      doctorId: doctor1Id,
      dayOfWeek: 3,
      startTime: '09:00',
      endTime: '13:00',
      department: Department.CARDIOLOGY,
      isAvailable: true,
      maxPatientsPerSlot: 2,
      slotDurationMinutes: 30,
      roomId: privateRoom?.id,
      createdAt: subDays(TODAY, 300),
      updatedAt: subDays(TODAY, 10),
    },
    {
      id: genId(),
      doctorId: doctor2Id,
      dayOfWeek: 1,
      startTime: '13:00',
      endTime: '21:00',
      department: Department.NEUROLOGY,
      isAvailable: true,
      maxPatientsPerSlot: 1,
      slotDurationMinutes: 45,
      roomId: privateRoom?.id,
      createdAt: subDays(TODAY, 250),
      updatedAt: subDays(TODAY, 5),
    },
    {
      id: genId(),
      doctorId: doctor2Id,
      dayOfWeek: 4,
      startTime: '13:00',
      endTime: '21:00',
      department: Department.NEUROLOGY,
      isAvailable: true,
      maxPatientsPerSlot: 1,
      slotDurationMinutes: 45,
      roomId: privateRoom?.id,
      createdAt: subDays(TODAY, 250),
      updatedAt: subDays(TODAY, 5),
    },
    {
      id: genId(),
      doctorId: doctor3Id,
      dayOfWeek: 1,
      startTime: '08:00',
      endTime: '16:00',
      department: Department.PEDIATRICS,
      isAvailable: true,
      maxPatientsPerSlot: 3,
      slotDurationMinutes: 20,
      roomId: rooms.find(r => r.type === RoomType.PEDIATRIC)?.id,
      createdAt: subDays(TODAY, 200),
      updatedAt: subDays(TODAY, 8),
    },
    {
      id: genId(),
      doctorId: doctor3Id,
      dayOfWeek: 3,
      startTime: '08:00',
      endTime: '16:00',
      department: Department.PEDIATRICS,
      isAvailable: true,
      maxPatientsPerSlot: 3,
      slotDurationMinutes: 20,
      roomId: rooms.find(r => r.type === RoomType.PEDIATRIC)?.id,
      createdAt: subDays(TODAY, 200),
      updatedAt: subDays(TODAY, 8),
    },
    {
      id: genId(),
      doctorId: doctor4Id,
      dayOfWeek: 1,
      startTime: '09:00',
      endTime: '17:00',
      department: Department.GENERAL_MEDICINE,
      isAvailable: true,
      maxPatientsPerSlot: 3,
      slotDurationMinutes: 20,
      roomId: semiPrivateRoom?.id,
      createdAt: subDays(TODAY, 400),
      updatedAt: subDays(TODAY, 3),
    },
    {
      id: genId(),
      doctorId: doctor4Id,
      dayOfWeek: 2,
      startTime: '09:00',
      endTime: '17:00',
      department: Department.GENERAL_MEDICINE,
      isAvailable: true,
      maxPatientsPerSlot: 3,
      slotDurationMinutes: 20,
      roomId: semiPrivateRoom?.id,
      createdAt: subDays(TODAY, 400),
      updatedAt: subDays(TODAY, 3),
    },
    {
      id: genId(),
      doctorId: doctor4Id,
      dayOfWeek: 4,
      startTime: '09:00',
      endTime: '17:00',
      department: Department.GENERAL_MEDICINE,
      isAvailable: true,
      maxPatientsPerSlot: 3,
      slotDurationMinutes: 20,
      roomId: semiPrivateRoom?.id,
      createdAt: subDays(TODAY, 400),
      updatedAt: subDays(TODAY, 3),
    },
  ];

  // ============== APPOINTMENTS ==============
  const appointments: Appointment[] = [];
  const visitTypes = [VisitType.CONSULTATION, VisitType.FOLLOW_UP, VisitType.EMERGENCY, VisitType.CHECKUP, VisitType.PROCEDURE];
  const apptStatuses = [
    AppointmentStatus.SCHEDULED, AppointmentStatus.SCHEDULED, AppointmentStatus.CHECKED_IN,
    AppointmentStatus.IN_PROGRESS, AppointmentStatus.COMPLETED, AppointmentStatus.COMPLETED,
    AppointmentStatus.CANCELLED, AppointmentStatus.NO_SHOW, AppointmentStatus.RESCHEDULED,
    AppointmentStatus.COMPLETED,
  ];
  const depts = [Department.CARDIOLOGY, Department.NEUROLOGY, Department.PEDIATRICS, Department.GENERAL_MEDICINE];
  const docIds = [doctor1Id, doctor2Id, doctor3Id, doctor4Id];
  const apptRooms = [privateRoom?.id, semiPrivateRoom?.id, rooms.find(r => r.type === RoomType.PEDIATRIC)?.id, occupiedRoom?.id];

  for (let i = 0; i < 22; i++) {
    const apptDayOffset = i < 12 ? -(12 - i) : i - 11;
    const apptDate = addDays(TODAY, apptDayOffset);
    const startH = 8 + ((i * 2) % 9);
    const startM = (i * 15) % 60;
    const startTime = setSeconds(setMinutes(setHours(apptDate, startH), startM), 0);
    const endTime = addHours(startTime, i % 3 === 0 ? 1 : 0.5);
    const status = apptStatuses[i % apptStatuses.length];
    const docIdx = i % docIds.length;
    const patientIdx = i % patientIds.length;

    appointments.push({
      id: genId(),
      patientId: patientIds[patientIdx],
      doctorId: docIds[docIdx],
      title: i % 5 === 0 ? 'Routine Checkup' : i % 5 === 1 ? 'Follow-up Visit' : i % 5 === 2 ? 'Initial Consultation' : i % 5 === 3 ? 'Procedure Review' : 'Emergency Visit',
      notes: i % 4 === 0 ? 'Patient reports occasional discomfort' : i % 4 === 1 ? 'Bring previous lab results' : undefined,
      appointmentDate: apptDate,
      startTime,
      endTime,
      visitType: visitTypes[i % visitTypes.length],
      status,
      department: depts[docIdx],
      roomId: apptRooms[docIdx % apptRooms.length],
      queueNumber: status === AppointmentStatus.SCHEDULED || status === AppointmentStatus.CHECKED_IN ? (i % 10) + 1 : undefined,
      checkInTime: (status === AppointmentStatus.CHECKED_IN || status === AppointmentStatus.IN_PROGRESS || status === AppointmentStatus.COMPLETED)
        ? new Date(startTime.getTime() - 10 * 60 * 1000)
        : undefined,
      consultationStartTime: (status === AppointmentStatus.IN_PROGRESS || status === AppointmentStatus.COMPLETED)
        ? startTime
        : undefined,
      completedTime: status === AppointmentStatus.COMPLETED ? endTime : undefined,
      cancelledTime: status === AppointmentStatus.CANCELLED ? subDays(startTime, 1) : undefined,
      cancellationReason: status === AppointmentStatus.CANCELLED ? (i % 2 === 0 ? 'Patient request' : 'Doctor unavailable') : undefined,
      cancelledBy: status === AppointmentStatus.CANCELLED ? (i % 2 === 0 ? patientIds[patientIdx] : receptionist1Id) : undefined,
      followUpDate: status === AppointmentStatus.COMPLETED && i % 3 === 0 ? addDays(apptDate, 30) : undefined,
      isEmergency: visitTypes[i % visitTypes.length] === VisitType.EMERGENCY,
      createdById: receptionist1Id,
      createdAt: subDays(startTime, i < 12 ? 7 : 3),
      updatedAt: subDays(TODAY, i % 10),
    });
  }

  const completedAppts = appointments.filter(a => a.status === AppointmentStatus.COMPLETED);

  // ============== VITAL SIGNS ==============
  const vitalSigns: VitalSigns[] = [];
  for (let i = 0; i < 8; i++) {
    const pIdx = i % patientIds.length;
    const appt = completedAppts[i % completedAppts.length];
    const recordedAt = appt ? appt.completedTime! : subDays(TODAY, i);
    vitalSigns.push({
      id: genId(),
      patientId: patientIds[pIdx],
      appointmentId: appt?.id,
      admissionId: undefined,
      recordedByNurseId: [nurse1Id, nurse2Id, nurse3Id][i % 3],
      recordedAt,
      temperature: Number((36.5 + ((i * 0.2) % 2)).toFixed(1)),
      systolicBP: 110 + ((i * 7) % 50),
      diastolicBP: 70 + ((i * 4) % 30),
      pulse: 65 + ((i * 5) % 40),
      respiratoryRate: 14 + (i % 8),
      weight: patients[pIdx].weight ?? 70,
      height: patients[pIdx].height ?? 170,
      bmi: patients[pIdx].bmi ?? 24,
      bloodSugar: i % 3 === 0 ? 140 + (i % 60) : 90 + ((i * 3) % 40),
      spO2: 95 + (i % 6),
      notes: i % 5 === 0 ? 'Patient slightly anxious during measurement' : undefined,
      createdAt: recordedAt,
      updatedAt: recordedAt,
    });
  }

  // ============== CLINICAL NOTES ==============
  const clinicalNotes: ClinicalNote[] = [
    {
      id: genId(),
      patientId: patientIds[0],
      appointmentId: completedAppts[0]?.id,
      admissionId: undefined,
      authorId: doctor1Id,
      authorRole: Role.DOCTOR,
      noteType: 'SOAP',
      title: 'Cardiology Follow-up SOAP Note',
      content: 'Patient presents for routine cardiology follow-up. Reports occasional exertional chest discomfort. No syncope or edema noted.',
      isFinalized: true,
      finalizedAt: completedAppts[0]?.completedTime,
      signedBy: doctor1Id,
      subjective: 'Patient states "I feel a tightness in my chest when walking up stairs, lasts about 2 minutes."',
      objective: 'BP 138/88, HR 78 regular, no murmurs. Lungs clear bilaterally. Trace edema absent.',
      assessment: 'Stable angina. Hypertension well-controlled on current regimen.',
      plan: 'Continue current medications. Schedule stress test for next week. F/U in 4 weeks.',
      createdAt: completedAppts[0]?.completedTime ?? subDays(TODAY, 10),
      updatedAt: completedAppts[0]?.completedTime ?? subDays(TODAY, 10),
    },
    {
      id: genId(),
      patientId: patientIds[2],
      appointmentId: completedAppts[2]?.id,
      admissionId: undefined,
      authorId: doctor3Id,
      authorRole: Role.DOCTOR,
      noteType: 'CONSULTATION',
      title: 'Pediatric Consultation Note',
      content: '7-year-old patient seen for routine wellness exam with vaccinations administered. Developmental milestones appropriate for age.',
      isFinalized: true,
      finalizedAt: completedAppts[2]?.completedTime,
      signedBy: doctor3Id,
      createdAt: completedAppts[2]?.completedTime ?? subDays(TODAY, 8),
      updatedAt: completedAppts[2]?.completedTime ?? subDays(TODAY, 8),
    },
    {
      id: genId(),
      patientId: patientIds[4],
      appointmentId: completedAppts[1]?.id,
      admissionId: undefined,
      authorId: nurse1Id,
      authorRole: Role.NURSE,
      noteType: 'NURSING',
      title: 'Pre-Op Nursing Assessment',
      content: 'Patient prepared for scheduled procedure. IV access obtained, labs reviewed. Consent verified. Patient resting comfortably, anxious but cooperative.',
      isFinalized: true,
      finalizedAt: completedAppts[1]?.completedTime,
      signedBy: nurse1Id,
      createdAt: completedAppts[1]?.completedTime ?? subDays(TODAY, 6),
      updatedAt: completedAppts[1]?.completedTime ?? subDays(TODAY, 6),
    },
    {
      id: genId(),
      patientId: patientIds[1],
      appointmentId: undefined,
      admissionId: undefined,
      authorId: doctor2Id,
      authorRole: Role.DOCTOR,
      noteType: 'PROGRESS',
      title: 'Neurology Progress Note',
      content: 'Patient with history of migraines reports reduction in frequency from 8/month to 2/month on current prophylactic regimen. Continuing management.',
      isFinalized: true,
      finalizedAt: subDays(TODAY, 3),
      signedBy: doctor2Id,
      createdAt: subDays(TODAY, 3),
      updatedAt: subDays(TODAY, 3),
    },
    {
      id: genId(),
      patientId: patientIds[3],
      appointmentId: completedAppts[3]?.id,
      admissionId: undefined,
      authorId: doctor4Id,
      authorRole: Role.DOCTOR,
      noteType: 'SOAP',
      title: 'General Medicine SOAP Note',
      content: 'Follow-up for Type 2 Diabetes. HbA1c improved from 7.8 to 7.1. Continue current metformin dose. Encourage dietary modifications.',
      isFinalized: true,
      finalizedAt: completedAppts[3]?.completedTime,
      signedBy: doctor4Id,
      subjective: 'Reports checking sugars regularly, averaging around 130-150 post-prandial.',
      objective: 'Weight stable. BMI 28.3. HbA1c 7.1 (down from 7.8).',
      assessment: 'Type 2 DM - improving. Obesity.',
      plan: 'Continue Metformin 500mg BID. Nutritionist referral. F/U in 3 months with repeat labs.',
      createdAt: completedAppts[3]?.completedTime ?? subDays(TODAY, 4),
      updatedAt: completedAppts[3]?.completedTime ?? subDays(TODAY, 4),
    },
  ];

  // ============== ADMISSIONS ==============
  const admissions: Admission[] = [];
  const admissionTypes: Array<'ELECTIVE' | 'EMERGENCY' | 'TRANSFER' | 'NEWBORN'> = ['ELECTIVE', 'EMERGENCY', 'TRANSFER', 'ELECTIVE', 'EMERGENCY'];
  const roomForAdmission = [occupiedRoom, icuRoom, semiPrivateRoom, privateRoom, occupiedRoom];
  const bedForAdmission = [occupiedBed, icuBed, semiPrivateBed, privateBed, occupiedBed];

  for (let i = 0; i < 6; i++) {
    const admitDate = subDays(TODAY, i === 5 ? 1 : (i === 0 ? 3 : i * 7 + 5));
    const isDischarged = i < 4;
    const dischargeDate = isDischarged ? addDays(admitDate, 2 + (i % 5)) : undefined;
    const status: AdmissionStatus = isDischarged ? AdmissionStatus.DISCHARGED : (i === 5 ? AdmissionStatus.ADMITTED : AdmissionStatus.PENDING);

    admissions.push({
      id: genId(),
      patientId: patientIds[i % patientIds.length],
      admissionDate: admitDate,
      dischargeDate,
      status,
      doctorId: docIds[i % docIds.length],
      department: depts[i % depts.length],
      roomId: roomForAdmission[i % roomForAdmission.length]?.id,
      bedId: bedForAdmission[i % bedForAdmission.length]?.id,
      admittingDoctorId: doctor4Id,
      attendingDoctorId: docIds[i % docIds.length],
      referralSource: i % 3 === 0 ? 'Primary Care Physician' : i % 3 === 1 ? 'Emergency Room' : 'Self-referral',
      admissionType: admissionTypes[i % admissionTypes.length],
      reasonForAdmission: i % 3 === 0 ? 'Chest pain evaluation' : i % 3 === 1 ? 'Acute asthma exacerbation' : 'Elective procedure - cholecystectomy',
      chiefComplaint: i % 3 === 0 ? 'Crushing chest pain radiating to left arm x 2 hours' : i % 3 === 1 ? 'Shortness of breath and wheezing' : 'Right upper quadrant pain',
      preliminaryDiagnosis: i % 3 === 0 ? 'Acute Coronary Syndrome - rule out MI' : i % 3 === 1 ? 'Asthma exacerbation' : 'Acute cholecystitis',
      finalDiagnosis: isDischarged ? (i % 3 === 0 ? 'Unstable Angina - treated medically' : i % 3 === 1 ? 'Asthma exacerbation resolved' : 'Cholelithiasis with cholecystitis - laparoscopic cholecystectomy performed') : undefined,
      dischargeStatus: isDischarged ? [DischargeStatus.RECOVERED, DischargeStatus.IMPROVED, DischargeStatus.REFERRED, DischargeStatus.IMPROVED][i % 4] : undefined,
      dischargeSummary: isDischarged ? 'Patient admitted for [reason]. Treated with [treatment]. Clinical course was uncomplicated/complicated as noted. Hemodynamically stable at discharge.' : undefined,
      dischargeInstructions: isDischarged ? '1. Follow up with PCP in 1 week\n2. Take medications as prescribed\n3. Return to ED for worsening symptoms\n4. Activity as tolerated' : undefined,
      followUpDate: isDischarged ? addDays(dischargeDate!, 7 + (i % 14)) : undefined,
      nextOfKinName: patients[i % patientIds.length].emergencyContactName,
      nextOfKinPhone: patients[i % patientIds.length].emergencyContactPhone,
      nextOfKinRelation: patients[i % patientIds.length].emergencyContactRelation,
      insuranceAuthorized: true,
      insuranceAuthorizationNumber: `AUTH-${50000 + i}`,
      isSurgical: i % 2 === 0,
      expectedLengthOfStay: 3 + (i % 5),
      totalBilledAmount: 2500 + ((i * 1200) % 15000),
      createdAt: admitDate,
      updatedAt: dischargeDate ?? subDays(TODAY, 1),
    });
  }

  const dischargedAdmissions = admissions.filter(a => a.status === AdmissionStatus.DISCHARGED);

  // ============== MEDICATIONS ==============
  const medications: Medication[] = [
    { id: genId(), name: 'Lipitor', genericName: 'Atorvastatin', category: DrugCategory.CARDIOVASCULAR, form: MedicationForm.TABLET, strength: '20mg', manufacturer: 'Pfizer', batchNumber: 'B-ATV-2401', stockQuantity: 500, reorderLevel: 100, unitPrice: 3.5, expiryDate: addMonths(TODAY, 18), isControlled: false, isGeneric: false, requiresPrescription: true, sideEffects: ['Muscle pain', 'Liver enzyme elevation'], contraindications: ['Active liver disease', 'Pregnancy'], storageInstructions: 'Store at room temperature, protect from moisture', description: 'Statin medication used to lower cholesterol', createdAt: subDays(TODAY, 400), updatedAt: subDays(TODAY, 5) },
    { id: genId(), name: 'Lisinopril', genericName: 'Lisinopril', category: DrugCategory.ANTIHYPERTENSIVE, form: MedicationForm.TABLET, strength: '10mg', manufacturer: 'Sandoz', batchNumber: 'B-LIS-2402', stockQuantity: 800, reorderLevel: 200, unitPrice: 0.8, expiryDate: addMonths(TODAY, 24), isControlled: false, isGeneric: true, requiresPrescription: true, sideEffects: ['Dry cough', 'Dizziness'], contraindications: ['Angioedema history', 'Pregnancy'], storageInstructions: 'Room temperature', description: 'ACE inhibitor for hypertension and heart failure', createdAt: subDays(TODAY, 500), updatedAt: subDays(TODAY, 2) },
    { id: genId(), name: 'Metformin', genericName: 'Metformin HCl', category: DrugCategory.ANTIDIABETIC, form: MedicationForm.TABLET, strength: '500mg', manufacturer: 'Glucophage', batchNumber: 'B-MET-2403', stockQuantity: 1000, reorderLevel: 250, unitPrice: 0.25, expiryDate: addMonths(TODAY, 15), isControlled: false, isGeneric: true, requiresPrescription: true, sideEffects: ['Nausea', 'Diarrhea', 'Metallic taste'], contraindications: ['Severe renal impairment', 'Metabolic acidosis'], storageInstructions: 'Room temperature, tight container', description: 'Biguanide anti-diabetic medication', createdAt: subDays(TODAY, 450), updatedAt: subDays(TODAY, 8) },
    { id: genId(), name: 'Amoxicillin', genericName: 'Amoxicillin', category: DrugCategory.ANTIBIOTIC, form: MedicationForm.CAPSULE, strength: '500mg', manufacturer: 'GSK', batchNumber: 'B-AMX-2404', stockQuantity: 400, reorderLevel: 100, unitPrice: 1.2, expiryDate: addMonths(TODAY, 12), isControlled: false, isGeneric: false, requiresPrescription: true, sideEffects: ['Nausea', 'Rash', 'Diarrhea'], contraindications: ['Penicillin hypersensitivity'], storageInstructions: 'Room temperature', description: 'Broad-spectrum penicillin antibiotic', createdAt: subDays(TODAY, 300), updatedAt: subDays(TODAY, 1) },
    { id: genId(), name: 'Tylenol', genericName: 'Acetaminophen', category: DrugCategory.ANALGESIC, form: MedicationForm.TABLET, strength: '500mg', manufacturer: 'J&J', batchNumber: 'B-TYL-2405', stockQuantity: 2000, reorderLevel: 500, unitPrice: 0.1, expiryDate: addMonths(TODAY, 30), isControlled: false, isGeneric: false, requiresPrescription: false, sideEffects: ['Rare: liver toxicity at high doses'], contraindications: ['Severe hepatic impairment'], storageInstructions: 'Room temperature', description: 'Analgesic and antipyretic (OTC)', createdAt: subDays(TODAY, 600), updatedAt: subDays(TODAY, 10) },
    { id: genId(), name: 'Albuterol Sulfate', genericName: 'Albuterol', category: DrugCategory.RESPIRATORY, form: MedicationForm.INHALER, strength: '90mcg/puff', manufacturer: 'Proventil', batchNumber: 'B-ALB-2406', stockQuantity: 150, reorderLevel: 50, unitPrice: 35.0, expiryDate: addMonths(TODAY, 9), isControlled: false, isGeneric: false, requiresPrescription: true, sideEffects: ['Tremor', 'Tachycardia', 'Nervousness'], contraindications: ['Sympathomimetic hypersensitivity'], storageInstructions: 'Room temperature, avoid heat', description: 'SABA bronchodilator for asthma/COPD', createdAt: subDays(TODAY, 250), updatedAt: subDays(TODAY, 3) },
    { id: genId(), name: 'Ibuprofen', genericName: 'Ibuprofen', category: DrugCategory.ANALGESIC, form: MedicationForm.TABLET, strength: '200mg', manufacturer: 'Motrin', batchNumber: 'B-IBU-2407', stockQuantity: 1500, reorderLevel: 400, unitPrice: 0.15, expiryDate: addMonths(TODAY, 20), isControlled: false, isGeneric: true, requiresPrescription: false, sideEffects: ['GI upset', 'Renal effects'], contraindications: ['Active PUD', 'Severe HF'], storageInstructions: 'Store in cool place', description: 'NSAID analgesic and anti-inflammatory (OTC)', createdAt: subDays(TODAY, 550), updatedAt: subDays(TODAY, 12) },
    { id: genId(), name: 'Protonix', genericName: 'Pantoprazole', category: DrugCategory.GASTROINTESTINAL, form: MedicationForm.TABLET, strength: '40mg', manufacturer: 'Wyeth', batchNumber: 'B-PAN-2408', stockQuantity: 300, reorderLevel: 80, unitPrice: 4.5, expiryDate: addMonths(TODAY, 14), isControlled: false, isGeneric: false, requiresPrescription: true, sideEffects: ['Headache', 'Diarrhea'], contraindications: ['Hypersensitivity to PPIs'], storageInstructions: 'Room temperature', description: 'Proton pump inhibitor for GERD', createdAt: subDays(TODAY, 350), updatedAt: subDays(TODAY, 6) },
    { id: genId(), name: 'Centrum Silver', genericName: 'Multivitamin + Minerals', category: DrugCategory.VITAMIN, form: MedicationForm.TABLET, strength: 'Standard', manufacturer: 'Centrum', batchNumber: 'B-MVT-2409', stockQuantity: 600, reorderLevel: 150, unitPrice: 0.5, expiryDate: addMonths(TODAY, 10), isControlled: false, isGeneric: false, requiresPrescription: false, sideEffects: ['Constipation (rare)'], contraindications: ['None significant'], storageInstructions: 'Room temperature, dry place', description: 'Multivitamin supplement for adults 50+ (OTC)', createdAt: subDays(TODAY, 200), updatedAt: subDays(TODAY, 9) },
    { id: genId(), name: 'Morphine Sulfate', genericName: 'Morphine', category: DrugCategory.ANALGESIC, form: MedicationForm.INJECTION, strength: '10mg/mL', manufacturer: 'West-Ward', batchNumber: 'B-MOR-2410', stockQuantity: 100, reorderLevel: 30, unitPrice: 12.0, expiryDate: addMonths(TODAY, 8), isControlled: true, isGeneric: true, requiresPrescription: true, sideEffects: ['Respiratory depression', 'Constipation', 'Sedation'], contraindications: ['Respiratory depression', 'Severe asthma'], storageInstructions: 'Controlled storage - lock cabinet', description: 'Schedule II opioid analgesic - controlled substance', createdAt: subDays(TODAY, 150), updatedAt: subDays(TODAY, 1) },
    { id: genId(), name: 'Ventolin Syrup', genericName: 'Albuterol Sulfate', category: DrugCategory.RESPIRATORY, form: MedicationForm.SYRUP, strength: '2mg/5mL', manufacturer: 'GSK', batchNumber: 'B-VEN-2411', stockQuantity: 200, reorderLevel: 60, unitPrice: 8.5, expiryDate: addMonths(TODAY, 11), isControlled: false, isGeneric: false, requiresPrescription: true, sideEffects: ['Nervousness', 'Tachycardia'], contraindications: ['Sympathomimetic hypersensitivity'], storageInstructions: 'Room temperature', description: 'Oral bronchodilator syrup for pediatric use', createdAt: subDays(TODAY, 180), updatedAt: subDays(TODAY, 7) },
    { id: genId(), name: 'Neosporin', genericName: 'Bacitracin/Polymyxin/Neomycin', category: DrugCategory.ANTIBIOTIC, form: MedicationForm.OINTMENT, strength: 'Triple Antibiotic', manufacturer: 'J&J', batchNumber: 'B-NEO-2412', stockQuantity: 250, reorderLevel: 70, unitPrice: 5.0, expiryDate: addMonths(TODAY, 16), isControlled: false, isGeneric: false, requiresPrescription: false, sideEffects: ['Local irritation (rare)'], contraindications: ['Topical antibiotic hypersensitivity'], storageInstructions: 'Room temperature', description: 'Topical antibiotic ointment (OTC)', createdAt: subDays(TODAY, 320), updatedAt: subDays(TODAY, 11) },
  ];

  const medicationMap: Record<string, Medication> = {};
  medications.forEach(m => { medicationMap[m.name] = m; });

  // ============== PRESCRIPTIONS & ITEMS ==============
  const prescriptions: Prescription[] = [];
  const prescriptionItems: PrescriptionItem[] = [];

  const presc1Id = genId();
  prescriptions.push({
    id: presc1Id,
    patientId: patientIds[0],
    doctorId: doctor1Id,
    appointmentId: completedAppts[0]?.id,
    admissionId: undefined,
    status: PrescriptionStatus.DISPENSED,
    issuedDate: completedAppts[0]?.completedTime ?? subDays(TODAY, 15),
    expiryDate: addMonths(completedAppts[0]?.completedTime ?? TODAY, 3),
    notes: 'Take with food. Avoid grapefruit juice.',
    dispensingPharmacistId: pharmacist1Id,
    dispensedDate: addHours(completedAppts[0]?.completedTime ?? subDays(TODAY, 15), 2),
    createdAt: completedAppts[0]?.completedTime ?? subDays(TODAY, 15),
    updatedAt: addHours(completedAppts[0]?.completedTime ?? subDays(TODAY, 15), 2),
  });
  prescriptionItems.push(
    { id: genId(), prescriptionId: presc1Id, medicationId: medicationMap['Lipitor']?.id, medicationName: 'Lipitor', genericName: 'Atorvastatin', form: MedicationForm.TABLET, dosage: '1 tablet', strength: '20mg', frequency: 'Once daily', duration: '90 days', quantity: 90, dispensedQuantity: 90, instructions: 'Take orally once daily in the evening', refillCount: 3, remainingRefills: 2, isPRN: false, createdAt: prescriptions[0].createdAt, updatedAt: prescriptions[0].updatedAt },
    { id: genId(), prescriptionId: presc1Id, medicationId: medicationMap['Lisinopril']?.id, medicationName: 'Lisinopril', genericName: 'Lisinopril', form: MedicationForm.TABLET, dosage: '1 tablet', strength: '10mg', frequency: 'Once daily', duration: '90 days', quantity: 90, dispensedQuantity: 90, instructions: 'Take orally once daily in the morning with or without food', refillCount: 3, remainingRefills: 2, isPRN: false, createdAt: prescriptions[0].createdAt, updatedAt: prescriptions[0].updatedAt }
  );

  const presc2Id = genId();
  prescriptions.push({
    id: presc2Id,
    patientId: patientIds[2],
    doctorId: doctor3Id,
    appointmentId: completedAppts[2]?.id,
    admissionId: admissions[2]?.id,
    status: PrescriptionStatus.ACTIVE,
    issuedDate: admissions[2]?.dischargeDate ?? subDays(TODAY, 7),
    expiryDate: addMonths(admissions[2]?.dischargeDate ?? TODAY, 1),
    notes: 'Complete full course of antibiotics even if feeling better.',
    dispensingPharmacistId: pharmacist1Id,
    dispensedDate: undefined,
    createdAt: admissions[2]?.dischargeDate ?? subDays(TODAY, 7),
    updatedAt: admissions[2]?.dischargeDate ?? subDays(TODAY, 7),
  });
  prescriptionItems.push(
    { id: genId(), prescriptionId: presc2Id, medicationId: medicationMap['Amoxicillin']?.id, medicationName: 'Amoxicillin', genericName: 'Amoxicillin', form: MedicationForm.CAPSULE, dosage: '1 capsule', strength: '500mg', frequency: 'Every 8 hours', duration: '10 days', quantity: 30, dispensedQuantity: 0, instructions: 'Take every 8 hours with full glass of water. Finish all medication.', refillCount: 0, remainingRefills: 0, isPRN: false, createdAt: prescriptions[1].createdAt, updatedAt: prescriptions[1].updatedAt },
    { id: genId(), prescriptionId: presc2Id, medicationId: medicationMap['Tylenol']?.id, medicationName: 'Tylenol', genericName: 'Acetaminophen', form: MedicationForm.TABLET, dosage: '1-2 tablets', strength: '500mg', frequency: 'Every 4-6 hours as needed', duration: '10 days', quantity: 40, dispensedQuantity: 0, instructions: 'For fever or pain. Do not exceed 4g in 24 hours.', refillCount: 0, remainingRefills: 0, isPRN: true, prnReason: 'Fever > 101F or moderate pain', createdAt: prescriptions[1].createdAt, updatedAt: prescriptions[1].updatedAt },
    { id: genId(), prescriptionId: presc2Id, medicationId: medicationMap['Albuterol Sulfate']?.id, medicationName: 'Albuterol Inhaler', genericName: 'Albuterol', form: MedicationForm.INHALER, dosage: '2 puffs', strength: '90mcg/puff', frequency: 'Every 4-6 hours as needed', duration: '30 days', quantity: 1, dispensedQuantity: 0, instructions: 'Shake well. Inhale 2 puffs when wheezing or short of breath.', refillCount: 1, remainingRefills: 1, isPRN: true, prnReason: 'Shortness of breath, wheezing', createdAt: prescriptions[1].createdAt, updatedAt: prescriptions[1].updatedAt }
  );

  const presc3Id = genId();
  prescriptions.push({
    id: presc3Id,
    patientId: patientIds[3],
    doctorId: doctor4Id,
    appointmentId: completedAppts[3]?.id,
    admissionId: undefined,
    status: PrescriptionStatus.PARTIALLY_DISPENSED,
    issuedDate: completedAppts[3]?.completedTime ?? subDays(TODAY, 20),
    expiryDate: addMonths(completedAppts[3]?.completedTime ?? TODAY, 6),
    notes: undefined,
    dispensingPharmacistId: pharmacist1Id,
    dispensedDate: addDays(completedAppts[3]?.completedTime ?? subDays(TODAY, 20), 1),
    createdAt: completedAppts[3]?.completedTime ?? subDays(TODAY, 20),
    updatedAt: addDays(completedAppts[3]?.completedTime ?? subDays(TODAY, 20), 1),
  });
  prescriptionItems.push(
    { id: genId(), prescriptionId: presc3Id, medicationId: medicationMap['Metformin']?.id, medicationName: 'Metformin', genericName: 'Metformin HCl', form: MedicationForm.TABLET, dosage: '1 tablet', strength: '500mg', frequency: 'Twice daily', duration: '90 days', quantity: 180, dispensedQuantity: 90, instructions: 'Take with meals. Start 500mg BID and titrate as tolerated.', refillCount: 2, remainingRefills: 2, isPRN: false, createdAt: prescriptions[2].createdAt, updatedAt: prescriptions[2].updatedAt },
    { id: genId(), prescriptionId: presc3Id, medicationId: medicationMap['Protonix']?.id, medicationName: 'Protonix', genericName: 'Pantoprazole', form: MedicationForm.TABLET, dosage: '1 tablet', strength: '40mg', frequency: 'Once daily', duration: '30 days', quantity: 30, dispensedQuantity: 30, instructions: 'Take 30 minutes before breakfast, swallow whole.', refillCount: 2, remainingRefills: 1, isPRN: false, createdAt: prescriptions[2].createdAt, updatedAt: prescriptions[2].updatedAt },
    { id: genId(), prescriptionId: presc3Id, medicationId: medicationMap['Centrum Silver']?.id, medicationName: 'Centrum Silver', genericName: 'Multivitamin + Minerals', form: MedicationForm.TABLET, dosage: '1 tablet', strength: 'Standard', frequency: 'Once daily', duration: '100 days', quantity: 100, dispensedQuantity: 100, instructions: 'Take once daily with food.', refillCount: 1, remainingRefills: 0, isPRN: false, createdAt: prescriptions[2].createdAt, updatedAt: prescriptions[2].updatedAt }
  );

  // ============== LAB TESTS CATALOG ==============
  const labTests: LabTest[] = [
    { id: genId(), testCode: 'CBC', name: 'Complete Blood Count', category: 'Hematology', sampleType: LabSampleType.BLOOD, description: 'Comprehensive blood count including RBC, WBC, platelets and differential', department: Department.LABORATORY, durationMinutes: 45, normalRangeMin: undefined, normalRangeMax: undefined, unit: undefined, cost: 45.0, isActive: true, requiresFasting: false, createdAt: subDays(TODAY, 500), updatedAt: subDays(TODAY, 20) },
    { id: genId(), testCode: 'CMP', name: 'Comprehensive Metabolic Panel', category: 'Chemistry', sampleType: LabSampleType.BLOOD, description: 'Comprehensive metabolic panel including electrolytes, renal, and hepatic function', department: Department.LABORATORY, durationMinutes: 60, normalRangeMin: undefined, normalRangeMax: undefined, unit: undefined, cost: 75.0, isActive: true, requiresFasting: true, fastingHours: 8, createdAt: subDays(TODAY, 500), updatedAt: subDays(TODAY, 20) },
    { id: genId(), testCode: 'BMP', name: 'Basic Metabolic Panel', category: 'Chemistry', sampleType: LabSampleType.BLOOD, description: 'Basic metabolic panel - electrolytes, glucose, BUN, creatinine', department: Department.LABORATORY, durationMinutes: 30, normalRangeMin: undefined, normalRangeMax: undefined, unit: undefined, cost: 40.0, isActive: true, requiresFasting: false, createdAt: subDays(TODAY, 500), updatedAt: subDays(TODAY, 20) },
    { id: genId(), testCode: 'LIPID', name: 'Lipid Panel', category: 'Chemistry', sampleType: LabSampleType.BLOOD, description: 'Cholesterol panel - total, LDL, HDL, triglycerides, VLDL', department: Department.LABORATORY, durationMinutes: 60, normalRangeMin: undefined, normalRangeMax: undefined, unit: undefined, cost: 65.0, isActive: true, requiresFasting: true, fastingHours: 12, createdAt: subDays(TODAY, 500), updatedAt: subDays(TODAY, 20) },
    { id: genId(), testCode: 'HBA1C', name: 'Glycated Hemoglobin (HbA1c)', category: 'Chemistry', sampleType: LabSampleType.BLOOD, description: '3-month average blood glucose marker for diabetes management', department: Department.LABORATORY, durationMinutes: 45, normalRangeMin: 4.0, normalRangeMax: 5.6, unit: '%', cost: 55.0, isActive: true, requiresFasting: false, createdAt: subDays(TODAY, 500), updatedAt: subDays(TODAY, 20) },
    { id: genId(), testCode: 'UA', name: 'Urinalysis', category: 'Urinalysis', sampleType: LabSampleType.URINE, description: 'Routine and microscopic examination of urine', department: Department.LABORATORY, durationMinutes: 30, normalRangeMin: undefined, normalRangeMax: undefined, unit: undefined, cost: 25.0, isActive: true, requiresFasting: false, createdAt: subDays(TODAY, 500), updatedAt: subDays(TODAY, 20) },
    { id: genId(), testCode: 'PT-INR', name: 'Prothrombin Time / INR', category: 'Coagulation', sampleType: LabSampleType.BLOOD, description: 'Clotting time assay for anticoagulation monitoring (Warfarin)', department: Department.LABORATORY, durationMinutes: 30, normalRangeMin: 0.9, normalRangeMax: 1.1, unit: 'INR ratio', cost: 35.0, isActive: true, requiresFasting: false, createdAt: subDays(TODAY, 500), updatedAt: subDays(TODAY, 20) },
    { id: genId(), testCode: 'TROP', name: 'Troponin I', category: 'Cardiac Markers', sampleType: LabSampleType.BLOOD, description: 'Cardiac troponin for diagnosis of myocardial injury', department: Department.LABORATORY, durationMinutes: 20, normalRangeMin: 0, normalRangeMax: 0.04, unit: 'ng/mL', cost: 85.0, isActive: true, requiresFasting: false, createdAt: subDays(TODAY, 500), updatedAt: subDays(TODAY, 20) },
    { id: genId(), testCode: 'THYROID', name: 'Thyroid Function Panel (TSH, T4, T3)', category: 'Endocrinology', sampleType: LabSampleType.BLOOD, description: 'Thyroid stimulating hormone, free T4, free T3 panel', department: Department.LABORATORY, durationMinutes: 90, normalRangeMin: 0.4, normalRangeMax: 4.0, unit: 'mIU/L (TSH)', cost: 120.0, isActive: true, requiresFasting: false, createdAt: subDays(TODAY, 500), updatedAt: subDays(TODAY, 20) },
    { id: genId(), testCode: 'OCC-BLD', name: 'Stool Occult Blood (gFOBT)', category: 'Gastrointestinal', sampleType: LabSampleType.STOOL, description: 'Guaiac-based fecal occult blood test for GI bleeding screening', department: Department.LABORATORY, durationMinutes: 15, normalRangeMin: undefined, normalRangeMax: undefined, unit: undefined, cost: 20.0, isActive: true, requiresFasting: false, createdAt: subDays(TODAY, 500), updatedAt: subDays(TODAY, 20) },
    { id: genId(), testCode: 'BIOPSY-H', name: 'Histopathology - Surgical Biopsy', category: 'Histopathology', sampleType: LabSampleType.BIOPSY, description: 'Histopathological examination of surgical/tissue biopsy specimen', department: Department.PATHOLOGY, durationMinutes: 2880, normalRangeMin: undefined, normalRangeMax: undefined, unit: undefined, cost: 300.0, isActive: true, requiresFasting: false, createdAt: subDays(TODAY, 500), updatedAt: subDays(TODAY, 20) },
  ];

  // ============== LAB ORDERS ==============
  const labOrders: LabOrder[] = [];
  const labOrderTests: LabOrderTest[] = [];

  const priorites = [LabTestPriority.ROUTINE, LabTestPriority.URGENT, LabTestPriority.STAT];

  for (let i = 0; i < 6; i++) {
    const loId = genId();
    const orderDate = i < 4
      ? subDays(TODAY, (i + 1) * 2)
      : addDays(TODAY, (i - 3));
    const statusRoll = i % 5;
    const status: LabTestStatus = statusRoll <= 3 ? LabTestStatus.REVIEWED : i === 4 ? LabTestStatus.IN_PROGRESS : LabTestStatus.PENDING;
    const selectedTests = labTests.slice(i, i + 3);

    const sampleCollected = status !== LabTestStatus.PENDING ? addHours(orderDate, 2) : undefined;
    const sampleReceived = sampleCollected ? addHours(sampleCollected, 1) : undefined;
    const completedAt = status === LabTestStatus.REVIEWED ? addHours(sampleReceived!, 4 + i) : undefined;
    const reviewedAt = completedAt ? addHours(completedAt, 1) : undefined;

    labOrders.push({
      id: loId,
      patientId: patientIds[i % patientIds.length],
      doctorId: docIds[i % docIds.length],
      appointmentId: completedAppts[i % completedAppts.length]?.id,
      admissionId: dischargedAdmissions[i % dischargedAdmissions.length]?.id,
      orderDate,
      priority: priorites[i % priorites.length],
      status,
      clinicalNotes: i % 3 === 0 ? 'Routine screening for chronic disease management' : i % 3 === 1 ? 'Rule out acute coronary syndrome' : 'Pre-operative baseline labs',
      sampleCollectedAt: sampleCollected,
      sampleCollectedBy: nurse2Id,
      sampleReceivedAt: sampleReceived,
      tests: [],
      completedAt,
      reportedBy: labTech1Id,
      reportedAt: completedAt,
      reviewedBy: doctor4Id,
      reviewedAt,
      createdAt: orderDate,
      updatedAt: reviewedAt ?? sampleReceived ?? orderDate,
    });

    selectedTests.forEach((test, ti) => {
      const isAbnormal = (i + ti) % 3 === 0;
      const numericResult = test.normalRangeMin !== undefined && test.normalRangeMax !== undefined
        ? (isAbnormal ? test.normalRangeMax + (test.normalRangeMax - test.normalRangeMin) * 0.3 : test.normalRangeMin + ((test.normalRangeMax - test.normalRangeMin) * 0.4))
        : undefined;

      const lotId = genId();
      const lotStatus: LabTestStatus =
        status === LabTestStatus.PENDING ? LabTestStatus.PENDING :
        status === LabTestStatus.IN_PROGRESS ? LabTestStatus.IN_PROGRESS :
        LabTestStatus.REVIEWED;

      labOrderTests.push({
        id: lotId,
        labOrderId: loId,
        testId: test.id,
        testName: test.name,
        testCode: test.testCode,
        status: lotStatus,
        result: numericResult !== undefined ? numericResult.toFixed(2) : (isAbnormal ? 'Abnormal - see notes' : 'Within Normal Range'),
        numericResult,
        unit: test.unit,
        normalRangeMin: test.normalRangeMin,
        normalRangeMax: test.normalRangeMax,
        abnormalFlag: numericResult !== undefined && test.normalRangeMax !== undefined
          ? (numericResult > test.normalRangeMax ? 'HIGH' : numericResult < (test.normalRangeMin ?? 0) ? 'LOW' : 'NORMAL')
          : (isAbnormal ? 'HIGH' : 'NORMAL'),
        notes: isAbnormal ? 'Result elevated. Correlate clinically. Consider repeat testing.' : undefined,
        performedAt: completedAt ? addHours(completedAt, -2 + ti) : undefined,
        createdAt: orderDate,
        updatedAt: reviewedAt ?? orderDate,
      });

      labOrders[labOrders.length - 1].tests.push(labOrderTests[labOrderTests.length - 1]);
    });
  }

  // ============== INVOICES, ITEMS & PAYMENTS ==============
  const invoices: Invoice[] = [];
  const invoiceItems: InvoiceItem[] = [];
  const payments: Payment[] = [];

  const invTypes = [InvoiceType.CONSULTATION, InvoiceType.LAB_TEST, InvoiceType.HOSPITALIZATION, InvoiceType.PHARMACY, InvoiceType.PROCEDURE];
  const billStatuses = [BillStatus.PAID, BillStatus.PAID, BillStatus.PARTIAL, BillStatus.PENDING, BillStatus.PAID, BillStatus.OVERDUE];

  for (let i = 0; i < 6; i++) {
    const invId = genId();
    const issueDate = i < 5 ? subDays(TODAY, (i + 1) * 4) : subDays(TODAY, 40);
    const dueDate = addDays(issueDate, 15);
    const type = invTypes[i % invTypes.length];
    const status: BillStatus = billStatuses[i % billStatuses.length];

    const items: Array<{ desc: string; qty: number; unitPrice: number; itype: InvoiceType; ref?: string }> = [];
    if (type === InvoiceType.HOSPITALIZATION) {
      items.push({ desc: 'Room & Board - General Ward (3 days)', qty: 3, unitPrice: occupiedRoom?.dailyRate ?? 250, itype: InvoiceType.ROOM, ref: admissions[i]?.id });
      items.push({ desc: 'Nursing Care', qty: 3, unitPrice: 200, itype: InvoiceType.HOSPITALIZATION, ref: admissions[i]?.id });
      items.push({ desc: 'Physician Daily Visits', qty: 3, unitPrice: 180, itype: InvoiceType.CONSULTATION, ref: admissions[i]?.id });
      items.push({ desc: 'Labs - CBC & CMP', qty: 2, unitPrice: 60, itype: InvoiceType.LAB_TEST, ref: labOrders[i % labOrders.length]?.id });
    } else if (type === InvoiceType.CONSULTATION) {
      items.push({ desc: 'Outpatient Consultation - Specialist', qty: 1, unitPrice: 280, itype: InvoiceType.CONSULTATION, ref: completedAppts[i % completedAppts.length]?.id });
      items.push({ desc: 'Office Procedure - ECG', qty: 1, unitPrice: 85, itype: InvoiceType.PROCEDURE });
    } else if (type === InvoiceType.LAB_TEST) {
      items.push({ desc: 'Comprehensive Metabolic Panel (CMP)', qty: 1, unitPrice: 75, itype: InvoiceType.LAB_TEST, ref: labOrders[i % labOrders.length]?.id });
      items.push({ desc: 'Lipid Panel', qty: 1, unitPrice: 65, itype: InvoiceType.LAB_TEST, ref: labOrders[i % labOrders.length]?.id });
      items.push({ desc: 'Complete Blood Count (CBC)', qty: 1, unitPrice: 45, itype: InvoiceType.LAB_TEST, ref: labOrders[i % labOrders.length]?.id });
      items.push({ desc: 'Phlebotomy / Venipuncture Fee', qty: 1, unitPrice: 15, itype: InvoiceType.LAB_TEST });
    } else if (type === InvoiceType.PHARMACY) {
      prescriptionItems.slice(i * 2, i * 2 + 3).forEach((pi, idx) => {
        items.push({ desc: `Rx: ${pi.medicationName} ${pi.strength} ${pi.form}`, qty: Math.min(pi.quantity, 60), unitPrice: 2.5 + (idx * 0.8), itype: InvoiceType.PHARMACY, ref: pi.prescriptionId });
      });
    } else {
      items.push({ desc: 'Outpatient Procedure - Minor Surgery', qty: 1, unitPrice: 850, itype: InvoiceType.PROCEDURE });
      items.push({ desc: 'Anesthesia Fee', qty: 1, unitPrice: 200, itype: InvoiceType.PROCEDURE });
      items.push({ desc: 'Post-procedure Dressing Kit', qty: 1, unitPrice: 35, itype: InvoiceType.PHARMACY });
    }

    const subtotal = items.reduce((s, it) => s + (it.qty * it.unitPrice), 0);
    const discountPct = i % 4 === 0 ? 5 : 0;
    const discountAmount = subtotal * discountPct / 100;
    const taxable = subtotal - discountAmount;
    const taxPct = 5;
    const taxAmount = taxable * taxPct / 100;
    const totalAmount = taxable + taxAmount;
    const insuranceAmt = i % 3 === 0 ? totalAmount * 0.7 : 0;
    const patientPayable = totalAmount - insuranceAmt;

    const paidAmount =
      status === BillStatus.PAID ? totalAmount :
      status === BillStatus.PARTIAL ? totalAmount * 0.5 :
      0;
    const balance = totalAmount - paidAmount;

    invoices.push({
      id: invId,
      invoiceNumber: `INV-${2024}-${String(1000 + i).padStart(5, '0')}`,
      patientId: patientIds[i % patientIds.length],
      appointmentId: completedAppts[i % completedAppts.length]?.id,
      admissionId: admissions[i]?.id,
      issueDate,
      dueDate,
      type,
      status,
      subtotal: Number(subtotal.toFixed(2)),
      discountAmount: Number(discountAmount.toFixed(2)),
      discountPercent: discountPct || undefined,
      taxAmount: Number(taxAmount.toFixed(2)),
      taxPercent: taxPct,
      totalAmount: Number(totalAmount.toFixed(2)),
      paidAmount: Number(paidAmount.toFixed(2)),
      balanceAmount: Number(balance.toFixed(2)),
      insuranceClaimAmount: insuranceAmt > 0 ? Number(insuranceAmt.toFixed(2)) : undefined,
      patientPayableAmount: Number(patientPayable.toFixed(2)),
      billingNotes: i % 2 === 0 ? 'Insurance claim submitted. Patient responsible for coinsurance/deductible.' : undefined,
      cancellationReason: undefined,
      cancelledAt: undefined,
      createdById: accountant1Id,
      items: [],
      payments: [],
      createdAt: issueDate,
      updatedAt: status === BillStatus.PAID ? addDays(issueDate, 2) : issueDate,
    });

    items.forEach((it) => {
      const iiId = genId();
      invoiceItems.push({
        id: iiId,
        invoiceId: invId,
        description: it.desc,
        quantity: it.qty,
        unitPrice: Number(it.unitPrice.toFixed(2)),
        totalPrice: Number((it.qty * it.unitPrice).toFixed(2)),
        itemType: it.itype,
        referenceId: it.ref,
        notes: undefined,
        createdAt: issueDate,
      });
      invoices[invoices.length - 1].items.push(invoiceItems[invoiceItems.length - 1]);
    });

    if (paidAmount > 0) {
      const payCount = status === BillStatus.PAID && i % 2 === 0 ? 2 : 1;
      for (let p = 0; p < payCount; p++) {
        const payAmt = payCount === 2 ? paidAmount / 2 : paidAmount;
        const payId = genId();
        payments.push({
          id: payId,
          invoiceId: invId,
          patientId: patientIds[i % patientIds.length],
          amount: Number(payAmt.toFixed(2)),
          method: [PaymentMethod.CREDIT_CARD, PaymentMethod.DEBIT_CARD, PaymentMethod.CASH, PaymentMethod.INSURANCE, PaymentMethod.DIGITAL_WALLET][(i + p) % 5],
          date: addDays(issueDate, 1 + p),
          referenceNumber: `TXN-${800000 + (i * 10) + p}`,
          transactionId: `PROC-${999000 + (i * 10) + p}`,
          notes: p === 0 ? 'Patient payment via portal' : 'Second installment - split payment',
          receivedById: accountant1Id,
          createdAt: addDays(issueDate, 1 + p),
        });
        invoices[invoices.length - 1].payments.push(payments[payments.length - 1]);
      }
    }
  }

  // ============== NOTIFICATIONS ==============
  const notifications: Notification[] = [
    {
      id: genId(),
      userId: adminId,
      title: 'New Appeal Submitted',
      message: 'A staff member has submitted an onboarding appeal requiring your review.',
      type: 'info' as NotificationType,
      read: false,
      link: '/admin/appeals',
      relatedEntityId: doctor1Id,
      relatedEntityType: 'Appeal',
      createdAt: subDays(TODAY, 0),
    },
    {
      id: genId(),
      userId: doctor1Id,
      title: 'New Appointment Scheduled',
      message: 'A new cardiology consultation has been scheduled for tomorrow at 10:00 AM.',
      type: 'info' as NotificationType,
      read: false,
      link: '/appointments',
      relatedEntityId: appointments.find(a => a.status === AppointmentStatus.SCHEDULED)?.id,
      relatedEntityType: 'Appointment',
      createdAt: subDays(TODAY, 0),
    },
    {
      id: genId(),
      userId: doctor1Id,
      title: 'Lab Results Ready',
      message: 'Lab results for patient Emily Anderson are now available and require your review.',
      type: 'success' as NotificationType,
      read: true,
      link: `/patients/${patientIds[0]}`,
      relatedEntityId: labOrders[0]?.id,
      relatedEntityType: 'LabOrder',
      createdAt: subDays(TODAY, 1),
      readAt: subDays(TODAY, 0),
    },
    {
      id: genId(),
      userId: doctor2Id,
      title: 'Admission - Emergency',
      message: 'Patient James Thompson admitted to ER with suspected stroke - neurology consult requested.',
      type: 'urgent' as NotificationType,
      read: false,
      link: `/admissions/${admissions[1]?.id}`,
      relatedEntityId: admissions[1]?.id,
      relatedEntityType: 'Admission',
      createdAt: subDays(TODAY, 0),
    },
    {
      id: genId(),
      userId: pharmacist1Id,
      title: 'New Prescription to Dispense',
      message: 'Prescription #3 (3 items) for patient Olivia Harris is ready for dispensing.',
      type: 'info' as NotificationType,
      read: false,
      link: '/pharmacy/prescriptions',
      relatedEntityId: prescriptions[2]?.id,
      relatedEntityType: 'Prescription',
      createdAt: subDays(TODAY, 1),
    },
    {
      id: genId(),
      userId: labTech1Id,
      title: 'STAT Lab Order Received',
      message: 'STAT cardiac markers (Troponin) ordered for patient in ER. Please process immediately.',
      type: 'urgent' as NotificationType,
      read: false,
      link: '/lab/orders',
      relatedEntityId: labOrders.find(l => l.priority === LabTestPriority.STAT)?.id,
      relatedEntityType: 'LabOrder',
      createdAt: subDays(TODAY, 0),
    },
    {
      id: genId(),
      userId: accountant1Id,
      title: 'Invoice Overdue',
      message: 'Invoice INV-2024-001005 is 25 days overdue with balance of $1,248.50.',
      type: 'warning' as NotificationType,
      read: false,
      link: '/billing/invoices',
      relatedEntityId: invoices.find(i => i.status === BillStatus.OVERDUE)?.id,
      relatedEntityType: 'Invoice',
      createdAt: subDays(TODAY, 2),
    },
    {
      id: genId(),
      userId: receptionist1Id,
      title: 'Check-in Reminder',
      message: 'Patient #7 arriving for 2:00 PM appointment. Room 205-B should be prepared.',
      type: 'info' as NotificationType,
      read: true,
      link: '/appointments',
      relatedEntityId: appointments.find(a => a.status === AppointmentStatus.CHECKED_IN)?.id,
      relatedEntityType: 'Appointment',
      createdAt: subDays(TODAY, 0),
      readAt: subDays(TODAY, 0),
    },
    {
      id: genId(),
      userId: patientUser1Id,
      title: 'Appointment Confirmed',
      message: 'Your cardiology follow-up appointment has been confirmed for Friday at 10:00 AM.',
      type: 'success' as NotificationType,
      read: false,
      link: '/my-appointments',
      relatedEntityId: appointments.find(a => a.patientId === patientIds[0])?.id,
      relatedEntityType: 'Appointment',
      createdAt: subDays(TODAY, 2),
    },
    {
      id: genId(),
      userId: patientUser2Id,
      title: 'Prescription Ready',
      message: 'Your prescription is now ready for pickup at the hospital pharmacy.',
      type: 'info' as NotificationType,
      read: true,
      link: '/my-prescriptions',
      relatedEntityId: prescriptions[0]?.id,
      relatedEntityType: 'Prescription',
      createdAt: subDays(TODAY, 3),
      readAt: subDays(TODAY, 2),
    },
    {
      id: genId(),
      userId: nurse3Id,
      title: 'Bed Request Approved',
      message: 'ICU bed request for patient Benjamin Carter has been approved. ICU-03 is ready.',
      type: 'success' as NotificationType,
      read: false,
      link: '/rooms',
      relatedEntityId: icuRoom?.id,
      relatedEntityType: 'Room',
      createdAt: subDays(TODAY, 1),
    },
    {
      id: genId(),
      userId: doctor3Id,
      title: 'Discharge Summary Required',
      message: 'Admission #4 was discharged 48 hours ago. Please finalize and sign the discharge summary.',
      type: 'warning' as NotificationType,
      read: false,
      link: `/admissions/${admissions[3]?.id}`,
      relatedEntityId: admissions[3]?.id,
      relatedEntityType: 'Admission',
      createdAt: subDays(TODAY, 0),
    },
    {
      id: genId(),
      userId: accountant1Id,
      title: 'Payment Received',
      message: 'Payment of $1,875.00 received for Invoice INV-2024-001002 via insurance.',
      type: 'success' as NotificationType,
      read: true,
      link: '/billing/invoices',
      relatedEntityId: invoices[1]?.id,
      relatedEntityType: 'Invoice',
      createdAt: subDays(TODAY, 2),
      readAt: subDays(TODAY, 1),
    },
    {
      id: genId(),
      userId: patientUser3Id,
      title: 'Lab Results Available',
      message: 'Your recent lab test results are now available to view in your patient portal.',
      type: 'success' as NotificationType,
      read: false,
      link: '/my-labs',
      relatedEntityId: labOrders[2]?.id,
      relatedEntityType: 'LabOrder',
      createdAt: subDays(TODAY, 1),
    },
    {
      id: genId(),
      userId: labTech2Id,
      title: 'Sample Processing - Delayed',
      message: 'Biopsy specimen processing delayed due to equipment maintenance. TAT extended by 24h.',
      type: 'error' as NotificationType,
      read: false,
      link: '/lab/tests',
      relatedEntityId: labTests.find(t => t.testCode === 'BIOPSY-H')?.id,
      relatedEntityType: 'LabTest',
      createdAt: subDays(TODAY, 0),
    },
  ];

  // ============== PROGRAMS ==============
  const programs: Program[] = [
    {
      id: 'prog_1',
      name: 'MediWave Clinical Excellence',
      description: 'Cross-departmental clinical improvement program',
      organizerId: adminId,
      status: ProgramStatus.ACTIVE,
      isPublic: true,
      createdAt: subDays(TODAY, 90),
      updatedAt: subDays(TODAY, 5),
    },
    {
      id: 'prog_2',
      name: 'Emergency Response Sprint',
      description: 'Rapid response to ER case load spikes',
      organizerId: adminId,
      status: ProgramStatus.ACTIVE,
      isPublic: true,
      createdAt: subDays(TODAY, 60),
      updatedAt: subDays(TODAY, 2),
    },
    {
      id: 'prog_3',
      name: 'Pediatric Care Initiative',
      description: 'Improving pediatric care quality and wait times',
      organizerId: doctor3Id,
      status: ProgramStatus.ACTIVE,
      isPublic: false,
      createdAt: subDays(TODAY, 45),
      updatedAt: subDays(TODAY, 1),
    },
  ];

  // ============== WAVES ==============
  const waves: Wave[] = [
    {
      id: 'wave_1',
      programId: 'prog_1',
      name: 'Wave 1 - Cardiology Focus',
      description: 'First sprint focused on cardiology cases',
      startDate: subDays(TODAY, 60),
      endDate: subDays(TODAY, 30),
      status: WaveStatus.CLOSED,
      createdAt: subDays(TODAY, 60),
      updatedAt: subDays(TODAY, 30),
    },
    {
      id: 'wave_2',
      programId: 'prog_1',
      name: 'Wave 2 - General Medicine',
      description: 'Second sprint covering general medicine',
      startDate: subDays(TODAY, 25),
      endDate: addDays(TODAY, 5),
      status: WaveStatus.ACTIVE,
      createdAt: subDays(TODAY, 25),
      updatedAt: TODAY,
    },
    {
      id: 'wave_3',
      programId: 'prog_1',
      name: 'Wave 3 - Neurology & Beyond',
      description: 'Upcoming wave for neurology and allied cases',
      startDate: addDays(TODAY, 6),
      endDate: addDays(TODAY, 36),
      status: WaveStatus.UPCOMING,
      createdAt: TODAY,
      updatedAt: TODAY,
    },
    {
      id: 'wave_4',
      programId: 'prog_2',
      name: 'Emergency Wave A',
      description: 'First emergency response wave',
      startDate: subDays(TODAY, 45),
      endDate: subDays(TODAY, 15),
      status: WaveStatus.CLOSED,
      createdAt: subDays(TODAY, 45),
      updatedAt: subDays(TODAY, 15),
    },
    {
      id: 'wave_5',
      programId: 'prog_2',
      name: 'Emergency Wave B',
      description: 'Second emergency response wave',
      startDate: subDays(TODAY, 10),
      endDate: addDays(TODAY, 10),
      status: WaveStatus.ACTIVE,
      createdAt: subDays(TODAY, 10),
      updatedAt: TODAY,
    },
    {
      id: 'wave_6',
      programId: 'prog_3',
      name: 'Pediatric Wave 1',
      description: 'First pediatric care wave',
      startDate: subDays(TODAY, 20),
      endDate: addDays(TODAY, 10),
      status: WaveStatus.ACTIVE,
      createdAt: subDays(TODAY, 20),
      updatedAt: TODAY,
    },
  ];

  // ============== CASES ==============
  const cases: Case[] = [
    {
      id: 'case_1',
      title: 'Chest pain evaluation - urgent cardiology consult',
      description: 'Patient presents with crushing chest pain radiating to left arm. Requires immediate cardiology assessment.',
      programId: 'prog_1',
      waveId: 'wave_2',
      complexity: CaseComplexity.HIGH,
      points: 200,
      status: CaseStatus.ASSIGNED,
      assignedClinicianId: doctor1Id,
      assignedDate: subDays(TODAY, 3),
      applicantCount: 2,
      department: Department.CARDIOLOGY,
      priority: 'HIGH',
      tags: ['chest-pain', 'cardiology'],
      createdAt: subDays(TODAY, 7),
      updatedAt: subDays(TODAY, 3),
      resolvedAt: undefined,
      closedAt: undefined,
    },
    {
      id: 'case_2',
      title: 'Persistent migraine management',
      description: 'Patient with chronic migraines unresponsive to current prophylactic regimen.',
      programId: 'prog_1',
      waveId: 'wave_2',
      complexity: CaseComplexity.MEDIUM,
      points: 150,
      status: CaseStatus.IN_PROGRESS,
      assignedClinicianId: doctor2Id,
      assignedDate: subDays(TODAY, 5),
      applicantCount: 1,
      department: Department.NEUROLOGY,
      priority: 'MEDIUM',
      tags: ['migraine', 'neurology'],
      createdAt: subDays(TODAY, 10),
      updatedAt: subDays(TODAY, 2),
    },
    {
      id: 'case_3',
      title: 'Pediatric vaccination follow-up',
      description: 'Routine wellness exam with catch-up vaccination schedule review.',
      programId: 'prog_3',
      waveId: 'wave_6',
      complexity: CaseComplexity.TRIVIAL,
      points: 100,
      status: CaseStatus.RESOLVED,
      assignedClinicianId: doctor3Id,
      assignedDate: subDays(TODAY, 8),
      applicantCount: 3,
      department: Department.PEDIATRICS,
      priority: 'LOW',
      tags: ['vaccination', 'pediatrics'],
      createdAt: subDays(TODAY, 14),
      updatedAt: subDays(TODAY, 1),
      resolvedAt: subDays(TODAY, 1),
    },
    {
      id: 'case_4',
      title: 'Post-operative wound infection',
      description: 'Patient developed wound infection 5 days post laparoscopic cholecystectomy.',
      programId: 'prog_1',
      waveId: 'wave_2',
      complexity: CaseComplexity.HIGH,
      points: 200,
      status: CaseStatus.OPEN,
      applicantCount: 4,
      department: Department.SURGERY,
      priority: 'CRITICAL',
      tags: ['surgery', 'infection'],
      createdAt: subDays(TODAY, 4),
      updatedAt: subDays(TODAY, 4),
    },
    {
      id: 'case_5',
      title: 'Diabetes management optimization',
      description: 'Type 2 DM patient HbA1c remains above target despite current therapy.',
      programId: 'prog_1',
      waveId: 'wave_2',
      complexity: CaseComplexity.MEDIUM,
      points: 150,
      status: CaseStatus.RESOLVED,
      assignedClinicianId: doctor4Id,
      assignedDate: subDays(TODAY, 12),
      applicantCount: 2,
      department: Department.GENERAL_MEDICINE,
      priority: 'MEDIUM',
      tags: ['diabetes', 'general-medicine'],
      createdAt: subDays(TODAY, 18),
      updatedAt: subDays(TODAY, 4),
      resolvedAt: subDays(TODAY, 4),
    },
    {
      id: 'case_6',
      title: 'ER trauma stabilization',
      description: 'Multiple injuries from motor vehicle accident requiring stabilization.',
      programId: 'prog_2',
      waveId: 'wave_5',
      complexity: CaseComplexity.CRITICAL,
      points: 200,
      status: CaseStatus.ASSIGNED,
      assignedClinicianId: doctor4Id,
      assignedDate: subDays(TODAY, 1),
      applicantCount: 5,
      department: Department.EMERGENCY,
      priority: 'CRITICAL',
      tags: ['trauma', 'emergency'],
      createdAt: subDays(TODAY, 3),
      updatedAt: subDays(TODAY, 1),
    },
    {
      id: 'case_7',
      title: 'Asthma exacerbation in child',
      description: 'Pediatric patient with acute asthma exacerbation requiring nebulizer treatment.',
      programId: 'prog_3',
      waveId: 'wave_6',
      complexity: CaseComplexity.MEDIUM,
      points: 150,
      status: CaseStatus.CLOSED,
      assignedClinicianId: doctor3Id,
      assignedDate: subDays(TODAY, 15),
      applicantCount: 2,
      department: Department.PEDIATRICS,
      priority: 'HIGH',
      tags: ['asthma', 'pediatrics'],
      createdAt: subDays(TODAY, 20),
      updatedAt: subDays(TODAY, 5),
      resolvedAt: subDays(TODAY, 8),
      closedAt: subDays(TODAY, 5),
    },
    {
      id: 'case_8',
      title: 'Acute coronary syndrome workup',
      description: 'ECG changes and elevated troponin - rule out MI.',
      programId: 'prog_2',
      waveId: 'wave_4',
      complexity: CaseComplexity.CRITICAL,
      points: 200,
      status: CaseStatus.CLOSED,
      assignedClinicianId: doctor1Id,
      assignedDate: subDays(TODAY, 40),
      applicantCount: 3,
      department: Department.CARDIOLOGY,
      priority: 'CRITICAL',
      tags: ['acs', 'cardiology'],
      createdAt: subDays(TODAY, 50),
      updatedAt: subDays(TODAY, 20),
      resolvedAt: subDays(TODAY, 25),
      closedAt: subDays(TODAY, 20),
    },
    {
      id: 'case_9',
      title: 'Skin rash differential diagnosis',
      description: 'Unexplained rash spreading across torso and limbs.',
      programId: 'prog_1',
      waveId: 'wave_3',
      complexity: CaseComplexity.LOW,
      points: 100,
      status: CaseStatus.OPEN,
      applicantCount: 1,
      department: Department.DERMATOLOGY,
      priority: 'LOW',
      tags: ['dermatology', 'rash'],
      createdAt: subDays(TODAY, 2),
      updatedAt: subDays(TODAY, 2),
    },
    {
      id: 'case_10',
      title: 'Atrial fibrillation rate control',
      description: 'New onset AF with rapid ventricular response.',
      programId: 'prog_1',
      waveId: 'wave_3',
      complexity: CaseComplexity.HIGH,
      points: 200,
      status: CaseStatus.OPEN,
      applicantCount: 3,
      department: Department.CARDIOLOGY,
      priority: 'HIGH',
      tags: ['afib', 'cardiology'],
      createdAt: subDays(TODAY, 1),
      updatedAt: subDays(TODAY, 1),
    },
    {
      id: 'case_11',
      title: 'Hypothyroidism medication titration',
      description: 'TSH elevated on repeat testing - adjust levothyroxine dose.',
      programId: 'prog_1',
      waveId: 'wave_1',
      complexity: CaseComplexity.LOW,
      points: 100,
      status: CaseStatus.CLOSED,
      assignedClinicianId: doctor4Id,
      assignedDate: subDays(TODAY, 50),
      applicantCount: 1,
      department: Department.GENERAL_MEDICINE,
      priority: 'LOW',
      tags: ['hypothyroidism'],
      createdAt: subDays(TODAY, 55),
      updatedAt: subDays(TODAY, 35),
      resolvedAt: subDays(TODAY, 40),
      closedAt: subDays(TODAY, 35),
    },
    {
      id: 'case_12',
      title: 'Migraine prophylaxis review',
      description: 'Review effectiveness of current prophylactic regimen and consider alternatives.',
      programId: 'prog_1',
      waveId: 'wave_1',
      complexity: CaseComplexity.MEDIUM,
      points: 150,
      status: CaseStatus.CLOSED,
      assignedClinicianId: doctor2Id,
      assignedDate: subDays(TODAY, 55),
      applicantCount: 2,
      department: Department.NEUROLOGY,
      priority: 'MEDIUM',
      tags: ['migraine', 'neurology'],
      createdAt: subDays(TODAY, 60),
      updatedAt: subDays(TODAY, 30),
      resolvedAt: subDays(TODAY, 35),
      closedAt: subDays(TODAY, 30),
    },
  ];

  // ============== CASE APPLICATIONS ==============
  const caseApplications: CaseApplication[] = [];
  const appsData: Array<{
    caseId: string;
    clinicianId: string;
    coverNote?: string;
    status: ApplicationStatus;
    appliedAt: Date;
    rejectionReason?: string;
    reviewedAt?: Date;
  }> = [
    { caseId: 'case_1', clinicianId: doctor2Id, coverNote: 'Interventional cardiology experience', status: ApplicationStatus.ACCEPTED, appliedAt: subDays(TODAY, 5) },
    { caseId: 'case_1', clinicianId: doctor4Id, coverNote: 'General medicine background', status: ApplicationStatus.INACTIVE, appliedAt: subDays(TODAY, 6) },
    { caseId: 'case_2', clinicianId: doctor2Id, coverNote: 'Specialist in migraines', status: ApplicationStatus.ACCEPTED, appliedAt: subDays(TODAY, 8) },
    { caseId: 'case_4', clinicianId: doctor1Id, coverNote: 'Surgery team lead', status: ApplicationStatus.ACTIVE, appliedAt: subDays(TODAY, 3) },
    { caseId: 'case_4', clinicianId: doctor2Id, coverNote: 'Available for surgical assist', status: ApplicationStatus.ACTIVE, appliedAt: subDays(TODAY, 3) },
    { caseId: 'case_5', clinicianId: doctor4Id, coverNote: 'Primary care physician', status: ApplicationStatus.ACCEPTED, appliedAt: subDays(TODAY, 12) },
    { caseId: 'case_6', clinicianId: doctor4Id, coverNote: 'ER attending available', status: ApplicationStatus.ACCEPTED, appliedAt: subDays(TODAY, 2) },
    { caseId: 'case_6', clinicianId: doctor1Id, coverNote: 'Trauma certified', status: ApplicationStatus.REJECTED, appliedAt: subDays(TODAY, 2), rejectionReason: 'Already at capacity', reviewedAt: subDays(TODAY, 1) },
    { caseId: 'case_3', clinicianId: doctor3Id, coverNote: 'Pediatric specialist', status: ApplicationStatus.ACCEPTED, appliedAt: subDays(TODAY, 12) },
    { caseId: 'case_10', clinicianId: doctor1Id, coverNote: 'Cardiac rhythm specialist', status: ApplicationStatus.ACTIVE, appliedAt: subDays(TODAY, 1) },
    { caseId: 'case_10', clinicianId: doctor2Id, coverNote: 'Neurology perspective', status: ApplicationStatus.WITHDRAWN, appliedAt: subDays(TODAY, 1) },
  ];
  appsData.forEach((app, idx) => {
    caseApplications.push({
      id: `app_${idx + 1}`,
      caseId: app.caseId,
      clinicianId: app.clinicianId,
      coverNote: app.coverNote,
      status: app.status,
      appliedAt: app.appliedAt,
      rejectionReason: app.rejectionReason,
      reviewedAt: app.reviewedAt,
    });
  });

  // ============== REVIEWS ==============
  const reviews: Review[] = [
    {
      id: 'rev_1',
      caseId: 'case_5',
      reviewerId: doctor4Id,
      revieweeId: doctor4Id,
      overallRating: 4.5,
      categories: { timeliness: 5, quality: 4, communication: 4, documentation: 5 },
      comment: 'Excellent management of diabetes case. Clear treatment plan and good follow-up.',
      createdAt: subDays(TODAY, 3),
      updatedAt: subDays(TODAY, 3),
    },
    {
      id: 'rev_2',
      caseId: 'case_3',
      reviewerId: doctor3Id,
      revieweeId: doctor3Id,
      overallRating: 5,
      categories: { timeliness: 5, quality: 5, communication: 5, documentation: 5 },
      comment: 'Perfect handling of pediatric vaccination follow-up. Parent very satisfied.',
      createdAt: subDays(TODAY, 2),
      updatedAt: subDays(TODAY, 2),
    },
    {
      id: 'rev_3',
      caseId: 'case_7',
      reviewerId: doctor3Id,
      revieweeId: doctor3Id,
      overallRating: 4,
      categories: { timeliness: 4, quality: 4, communication: 4, documentation: 4 },
      comment: 'Good care provided. Could improve discharge instructions.',
      createdAt: subDays(TODAY, 6),
      updatedAt: subDays(TODAY, 6),
    },
    {
      id: 'rev_4',
      caseId: 'case_8',
      reviewerId: doctor1Id,
      revieweeId: doctor1Id,
      overallRating: 4.8,
      categories: { timeliness: 5, quality: 5, communication: 4, documentation: 5 },
      comment: 'Outcome ACS workup. Patient stabilized and transferred appropriately.',
      createdAt: subDays(TODAY, 22),
      updatedAt: subDays(TODAY, 22),
    },
    {
      id: 'rev_5',
      caseId: 'case_12',
      reviewerId: doctor2Id,
      revieweeId: doctor2Id,
      overallRating: 4.2,
      categories: { timeliness: 4, quality: 4, communication: 5, documentation: 4 },
      comment: 'Thorough review of migraine prophylaxis. Alternative considered.',
      createdAt: subDays(TODAY, 32),
      updatedAt: subDays(TODAY, 32),
    },
  ];

  return {
    users,
    patients,
    doctorSchedules,
    appointments,
    vitalSigns,
    clinicalNotes,
    rooms,
    beds,
    admissions,
    medications,
    prescriptions,
    prescriptionItems,
    labTests,
    labOrders,
    labOrderTests,
    invoices,
    invoiceItems,
    payments,
    notifications,
    programs,
    waves,
    cases,
    caseApplications,
    reviews,
  };
}
