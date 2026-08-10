import { CaseComplexity, CaseStatus } from '../types/enums';
import type { Case } from '../types/models';
import { COMPLEXITY_POINTS } from '../data/constants';

export function calculateCasePoints(complexity: CaseComplexity): number {
  return COMPLEXITY_POINTS[complexity] ?? 0;
}

export function calculateClinicianWavePoints(
  clinicianId: string,
  cases: Case[]
): number {
  return cases
    .filter((c) => c.assignedClinicianId === clinicianId && c.status === CaseStatus.RESOLVED)
    .reduce((sum, c) => sum + c.points, 0);
}
