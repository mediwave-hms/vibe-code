import type { Patient } from '../types/models';
import type { Gender, BloodGroup } from '../types/enums';

/**
 * Returns true if the patient matches a free-text query.
 * Checked fields (case-insensitive): full name, MRN, email, phone.
 */
export function matchesPatientQuery(patient: Patient, query: string): boolean {
  if (!query) return true;
  const q = query.trim().toLowerCase();
  if (!q) return true;
  const fullName = `${patient.firstName} ${patient.lastName}`.toLowerCase();
  return (
    fullName.includes(q) ||
    patient.medicalRecordNumber.toLowerCase().includes(q) ||
    Boolean(patient.email?.toLowerCase().includes(q)) ||
    patient.phone.includes(q)
  );
}

/**
 * Full filter predicate — combines free-text search with optional
 * gender / blood-group / active-status filters.
 */
export interface PatientFilterOptions {
  query?: string;
  gender?: Gender | string | null;
  bloodGroup?: BloodGroup | string | null;
  isActive?: boolean | null;
}

export function filterPatients(
  patients: Patient[],
  options: PatientFilterOptions
): Patient[] {
  const { query = '', gender = null, bloodGroup = null, isActive = null } = options;
  return patients.filter((p) => {
    if (!matchesPatientQuery(p, query)) return false;
    if (gender && p.gender !== gender) return false;
    if (bloodGroup && p.bloodGroup !== bloodGroup) return false;
    if (isActive !== null && p.isActive !== isActive) return false;
    return true;
  });
}
