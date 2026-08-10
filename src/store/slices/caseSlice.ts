import { StateCreator } from 'zustand';
import { Case, CaseApplication } from '../../types/models';
import { CaseComplexity, CaseStatus, ApplicationStatus } from '../../types/enums';
import { COMPLEXITY_POINTS } from '../../data/constants';

export interface CaseFilters {
  programId?: string;
  waveId?: string;
  status?: CaseStatus;
  complexity?: CaseComplexity;
  search: string;
  assignedTo?: string;
}

export interface CaseSlice {
  cases: Case[];
  caseApplications: CaseApplication[];
  filters: CaseFilters;
  createCase: (data: Omit<Case, 'id' | 'status' | 'createdAt' | 'updatedAt'> & { status?: CaseStatus }) => void;
  updateCase: (id: string, patch: Partial<Case>) => void;
  assignComplexity: (id: string, complexity: CaseComplexity) => void;
  addCaseToWave: (caseId: string, waveId: string) => void;
  applyToCase: (caseId: string, clinicianId: string, coverNote?: string) => void;
  acceptApplication: (caseId: string, applicationId: string) => void;
  rejectApplication: (appId: string, reason: string) => void;
  resolveCase: (id: string) => void;
  closeCase: (id: string) => void;
  rolloverUnresolvedToNextWave: (prevWaveId: string, nextWaveId: string) => void;
  getCasesForWave: (waveId: string) => Case[];
  addBulkCasesAndApplications: (cases: Case[], applications: CaseApplication[]) => void;
}

export const createCaseSlice: StateCreator<CaseSlice> = (set, get) => ({
  cases: [],
  caseApplications: [],
  filters: { search: '' },

  createCase: (data) => {
    const now = new Date();
    const newCase: Case = {
      ...data,
      id: `c_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      status: data.status ?? CaseStatus.OPEN,
      createdAt: now,
      updatedAt: now,
    };
    set((state) => ({ cases: [...state.cases, newCase] }));
  },

  updateCase: (id, patch) => {
    set((state) => ({
      cases: state.cases.map((c: Case) =>
        c.id === id ? { ...c, ...patch, updatedAt: new Date() } : c
      ),
    }));
  },

  assignComplexity: (id, complexity) => {
    set((state) => ({
      cases: state.cases.map((c: Case) =>
        c.id === id
          ? { ...c, complexity, points: COMPLEXITY_POINTS[complexity] ?? 0, updatedAt: new Date() }
          : c
      ),
    }));
  },

  addCaseToWave: (caseId, waveId) => {
    set((state) => ({
      cases: state.cases.map((c: Case) =>
        c.id === caseId ? { ...c, waveId, updatedAt: new Date() } : c
      ),
    }));
  },

  applyToCase: (caseId, clinicianId, coverNote) => {
    const now = new Date();
    const newApp: CaseApplication = {
      id: `ca_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      caseId,
      clinicianId,
      coverNote,
      status: ApplicationStatus.ACTIVE,
      appliedAt: now,
    };
    set((state) => ({ caseApplications: [...state.caseApplications, newApp] }));
  },

  acceptApplication: (caseId, applicationId) => {
    const now = new Date();
    const app = get().caseApplications.find((a) => a.id === applicationId);
    set((state) => ({
      caseApplications: state.caseApplications.map((a: CaseApplication) => {
        if (a.caseId !== caseId) return a;
        if (a.id === applicationId) {
          return { ...a, status: ApplicationStatus.ACCEPTED, reviewedAt: now };
        }
        return { ...a, status: ApplicationStatus.INACTIVE };
      }),
      cases: state.cases.map((c: Case) =>
        c.id === caseId
          ? {
              ...c,
              assignedClinicianId: app?.clinicianId,
              assignedDate: now,
              status: CaseStatus.ASSIGNED,
              updatedAt: now,
            }
          : c
      ),
    }));
  },

  rejectApplication: (appId, reason) => {
    const now = new Date();
    set((state) => ({
      caseApplications: state.caseApplications.map((a: CaseApplication) =>
        a.id === appId
          ? { ...a, status: ApplicationStatus.REJECTED, rejectionReason: reason, reviewedAt: now }
          : a
      ),
    }));
  },

  resolveCase: (id) => {
    const now = new Date();
    set((state) => ({
      cases: state.cases.map((c: Case) =>
        c.id === id ? { ...c, status: CaseStatus.RESOLVED, resolvedAt: now, updatedAt: now } : c
      ),
    }));
  },

  closeCase: (id) => {
    const now = new Date();
    set((state) => ({
      cases: state.cases.map((c: Case) =>
        c.id === id ? { ...c, status: CaseStatus.CLOSED, closedAt: now, updatedAt: now } : c
      ),
    }));
  },

  rolloverUnresolvedToNextWave: (prevWaveId, nextWaveId) => {
    const unresolved = [CaseStatus.OPEN, CaseStatus.ASSIGNED, CaseStatus.IN_PROGRESS];
    set((state) => ({
      cases: state.cases.map((c: Case) =>
        c.waveId === prevWaveId && unresolved.includes(c.status)
          ? { ...c, waveId: nextWaveId, status: CaseStatus.ROLLED_OVER, updatedAt: new Date() }
          : c
      ),
    }));
  },

  getCasesForWave: (waveId) => {
    return get().cases.filter((c) => c.waveId === waveId);
  },

  addBulkCasesAndApplications: (cases, applications) => {
    set((state) => ({
      cases: [...state.cases, ...cases],
      caseApplications: [...state.caseApplications, ...applications],
    }));
  },
});
