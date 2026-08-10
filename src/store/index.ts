import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { RootState } from './types';
import { createAuthSlice } from './slices/authSlice';
import { createPatientSlice } from './slices/patientSlice';
import { createAppointmentSlice } from './slices/appointmentSlice';
import { createStaffSlice } from './slices/staffSlice';
import { createRoomSlice } from './slices/roomSlice';
import { createAdmissionSlice } from './slices/admissionSlice';
import { createBillingSlice } from './slices/billingSlice';
import { createPharmacySlice } from './slices/pharmacySlice';
import { createLabSlice } from './slices/labSlice';
import { createNotificationSlice } from './slices/notificationSlice';
import { createProgramSlice } from './slices/programSlice';
import { createWaveSlice } from './slices/waveSlice';
import { createCaseSlice } from './slices/caseSlice';
import { createReviewSlice } from './slices/reviewSlice';
import { generateSeedData } from '../data/seedData';

export type { RootState } from './types';

export const useStore = create<RootState>()(
  persist(
    (set, get, api) => {
      const authPart = createAuthSlice(set, get, api);
      const patientPart = createPatientSlice(set, get, api);
      const appointmentPart = createAppointmentSlice(set, get, api);
      const staffPart = createStaffSlice(set, get, api);
      const roomPart = createRoomSlice(set, get, api);
      const admissionPart = createAdmissionSlice(set, get, api);
      const billingPart = createBillingSlice(set, get, api);
      const pharmacyPart = createPharmacySlice(set, get, api);
      const labPart = createLabSlice(set, get, api);
      const notificationPart = createNotificationSlice(set, get, api);
      const programPart = createProgramSlice(set, get, api);
      const wavePart = createWaveSlice(set, get, api);
      const casePart = createCaseSlice(set, get, api);
      const reviewPart = createReviewSlice(set, get, api);

      const initializeFromSeed = () => {
        const seed = generateSeedData();
        const {
          users,
          patients,
          appointments,
          rooms,
          beds,
          admissions,
          medications,
          prescriptions,
          prescriptionItems,
          labTests,
          labOrders,
          invoices,
          notifications,
          clinicalNotes,
          programs,
          waves,
          cases,
          caseApplications,
          reviews,
        } = seed;
        set({
          users,
          patients,
          appointments,
          rooms,
          beds,
          admissions,
          medications,
          prescriptions,
          prescriptionItems,
          labTests,
          labOrders,
          invoices,
          notifications,
          clinicalNotes,
          programs,
          waves,
          cases,
          caseApplications,
          reviews,
        } as Partial<RootState>);
      };

      const combined: RootState = {
        ...authPart,
        ...patientPart,
        ...appointmentPart,
        ...staffPart,
        ...roomPart,
        ...admissionPart,
        ...billingPart,
        ...pharmacyPart,
        ...labPart,
        ...notificationPart,
        ...programPart,
        ...wavePart,
        ...casePart,
        ...reviewPart,
        reset: () => {
          set({
            currentUser: null,
            isAuthenticated: false,
            sessionExpiresAt: null,
            users: [],
            patients: [],
            appointments: [],
            rooms: [],
            beds: [],
            admissions: [],
            medications: [],
            prescriptions: [],
            prescriptionItems: [],
            labTests: [],
            labOrders: [],
            invoices: [],
            payments: [],
            notifications: [],
            programs: [],
            waves: [],
            cases: [],
            caseApplications: [],
            reviews: [],
            selectedPatientId: null,
            selectedAppointmentId: null,
            selectedStaffId: null,
            selectedRoomId: null,
            selectedBedId: null,
            selectedAdmissionId: null,
            selectedInvoiceId: null,
            selectedPaymentId: null,
            selectedMedicationId: null,
            selectedPrescriptionId: null,
            selectedLabTestId: null,
            selectedLabOrderId: null,
            selectedNotificationId: null,
          } as Partial<RootState>);
          initializeFromSeed();
        },
        initializeFromSeed,
      };

      return combined;
    },
    {
      name: 'hms_v1_root',
      skipHydration: true,
    }
  )
);

const initialState = useStore.getState();
if (!initialState.users || initialState.users.length === 0) {
  initialState.initializeFromSeed();
}

export default useStore;
