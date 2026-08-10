import { Permission, Role } from '../types/enums';

export const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  [Role.ADMIN]: Object.values(Permission),
  [Role.DEPT_HEAD]: [
    Permission.MANAGE_STAFF,
    Permission.VIEW_PATIENT_PROFILE,
    Permission.MANAGE_OWN_PATIENTS,
    Permission.MANAGE_OWN_SCHEDULE,
    Permission.MANAGE_PROGRAMS,
    Permission.MANAGE_WAVES,
    Permission.MANAGE_CASES,
    Permission.VIEW_REPORTS,
    Permission.ASSIGN_CASES,
    Permission.REVIEW_APPEALS,
    Permission.REVIEW_ONBOARDING,
    Permission.APPLY_TO_CASES,
    Permission.SUBMIT_REVIEWS,
    Permission.VIEW_NOTIFICATIONS,
  ],
  [Role.DOCTOR]: [
    Permission.VIEW_PATIENT_PROFILE,
    Permission.MANAGE_OWN_PATIENTS,
    Permission.MANAGE_OWN_SCHEDULE,
    Permission.ORDER_LAB_TESTS,
    Permission.ADMIT_PATIENTS,
    Permission.DISCHARGE_PATIENTS,
    Permission.MANAGE_MEDICAL_RECORDS,
    Permission.VIEW_REPORTS,
    Permission.VIEW_NOTIFICATIONS,
  ],
  [Role.NURSE]: [
    Permission.VIEW_PATIENT_PROFILE,
    Permission.MANAGE_OWN_PATIENTS,
    Permission.MANAGE_OWN_SCHEDULE,
    Permission.ADMIT_PATIENTS,
    Permission.VIEW_NOTIFICATIONS,
  ],
  [Role.RECEPTIONIST]: [
    Permission.MANAGE_PATIENTS,
    Permission.MANAGE_APPOINTMENTS,
    Permission.VIEW_PATIENT_PROFILE,
    Permission.VIEW_NOTIFICATIONS,
  ],
  [Role.PHARMACIST]: [
    Permission.MANAGE_PHARMACY,
    Permission.DISPENSE_MEDICATION,
    Permission.VIEW_PATIENT_PROFILE,
    Permission.VIEW_NOTIFICATIONS,
  ],
  [Role.LAB_TECHNICIAN]: [
    Permission.MANAGE_LAB,
    Permission.VIEW_PATIENT_PROFILE,
    Permission.VIEW_NOTIFICATIONS,
  ],
  [Role.PATIENT]: [
    Permission.VIEW_PATIENT_PROFILE,
    Permission.MANAGE_OWN_PATIENT_PROFILE,
    Permission.MANAGE_OWN_APPOINTMENTS,
    Permission.VIEW_NOTIFICATIONS,
  ],
  [Role.ACCOUNTANT]: [
    Permission.MANAGE_BILLING,
    Permission.CREATE_INVOICE,
    Permission.PROCESS_PAYMENTS,
    Permission.VIEW_REPORTS,
    Permission.VIEW_NOTIFICATIONS,
  ],
  [Role.PROGRAM_MANAGER]: [
    Permission.MANAGE_PROGRAMS,
    Permission.MANAGE_WAVES,
    Permission.MANAGE_CASES,
    Permission.VIEW_REPORTS,
    Permission.ASSIGN_CASES,
    Permission.REVIEW_APPEALS,
    Permission.REVIEW_ONBOARDING,
    Permission.VIEW_NOTIFICATIONS,
  ],
  [Role.CLINICIAN]: [
    Permission.VIEW_PATIENT_PROFILE,
    Permission.MANAGE_OWN_PATIENTS,
    Permission.MANAGE_OWN_SCHEDULE,
    Permission.ORDER_LAB_TESTS,
    Permission.MANAGE_MEDICAL_RECORDS,
    Permission.VIEW_REPORTS,
    Permission.VIEW_NOTIFICATIONS,
    Permission.APPLY_TO_CASES,
    Permission.SUBMIT_REVIEWS,
  ],
};

export const COMPLEXITY_POINTS: Record<string, number> = {
  TRIVIAL: 50,
  LOW: 100,
  MEDIUM: 150,
  HIGH: 200,
  CRITICAL: 300,
};

export const REVIEW_DEADLINE_DAYS_DEFAULT = 14;
export const SESSION_DURATION_HOURS = 8;
