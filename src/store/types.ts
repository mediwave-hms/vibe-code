import type { AuthSlice } from './slices/authSlice';
import type { PatientSlice } from './slices/patientSlice';
import type { AppointmentSlice } from './slices/appointmentSlice';
import type { StaffSlice } from './slices/staffSlice';
import type { RoomSlice } from './slices/roomSlice';
import type { AdmissionSlice } from './slices/admissionSlice';
import type { BillingSlice } from './slices/billingSlice';
import type { PharmacySlice } from './slices/pharmacySlice';
import type { LabSlice } from './slices/labSlice';
import type { NotificationSlice } from './slices/notificationSlice';
import type { ProgramSlice } from './slices/programSlice';
import type { WaveSlice } from './slices/waveSlice';
import type { CaseSlice } from './slices/caseSlice';
import type { ReviewSlice } from './slices/reviewSlice';

export type StoreSlices = AuthSlice &
  PatientSlice &
  AppointmentSlice &
  StaffSlice &
  RoomSlice &
  AdmissionSlice &
  BillingSlice &
  PharmacySlice &
  LabSlice &
  NotificationSlice &
  ProgramSlice &
  WaveSlice &
  CaseSlice &
  ReviewSlice;

export type RootState = StoreSlices & {
  reset: () => void;
  initializeFromSeed: () => void;
};
