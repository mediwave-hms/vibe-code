import { StateCreator } from 'zustand';
import { Admission } from '../../types/models';
import { AdmissionStatus, DischargeStatus, Department, BedStatus } from '../../types/enums';

export type AdmissionSlice = {
  admissions: Admission[];
  selectedAdmissionId: string | null;
  addAdmission: (admission: Omit<Admission, 'id' | 'createdAt' | 'updatedAt' | 'status'> & { status?: AdmissionStatus }) => Admission;
  updateAdmission: (id: string, patch: Partial<Admission>) => Admission | null;
  deleteAdmission: (id: string) => boolean;
  getAdmissionById: (id: string) => Admission | undefined;
  getActiveAdmissions: () => Admission[];
  getAdmissionsByPatientId: (patientId: string) => Admission[];
  getAdmissionsByDoctorId: (doctorId: string) => Admission[];
  getAdmissionsByDepartment: (department: Department) => Admission[];
  getAdmissionsByDateRange: (startDate: Date, endDate: Date) => Admission[];
  getAdmissionsByStatus: (status: AdmissionStatus) => Admission[];
  admitPatient: (
    data: Omit<Admission, 'id' | 'createdAt' | 'updatedAt' | 'status' | 'admissionDate'> & { admissionDate?: Date }
  ) => Admission | null;
  dischargePatient: (
    id: string,
    dischargeData: {
      dischargeDate?: Date;
      dischargeStatus: DischargeStatus;
      dischargeSummary?: string;
      dischargeInstructions?: string;
      finalDiagnosis?: string;
      followUpDate?: Date;
      totalBilledAmount?: number;
    }
  ) => Admission | null;
  transferAdmission: (
    id: string,
    transferData: { roomId?: string; bedId?: string; department?: Department; notes?: string }
  ) => Admission | null;
  setSelectedAdmissionId: (id: string | null) => void;
};

export const createAdmissionSlice: StateCreator<AdmissionSlice> = (set, get) => ({
  admissions: [],
  selectedAdmissionId: null,

  addAdmission: (admission) => {
    const now = new Date();
    const newAdm: Admission = {
      ...admission,
      id: `adm_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      status: admission.status ?? AdmissionStatus.PENDING,
      createdAt: now,
      updatedAt: now,
    };
    set((state) => ({ admissions: [...state.admissions, newAdm] }));
    return newAdm;
  },

  updateAdmission: (id, patch) => {
    const state = get();
    const adm = state.admissions.find((a: Admission) => a.id === id);
    if (!adm) return null;
    const updated: Admission = { ...adm, ...patch, updatedAt: new Date() };
    set((s) => ({
      admissions: s.admissions.map((a: Admission) => (a.id === id ? updated : a)),
    }));
    return updated;
  },

  deleteAdmission: (id) => {
    const state = get();
    const adm = state.admissions.find((a: Admission) => a.id === id);
    if (!adm) return false;
    set((s) => ({
      admissions: s.admissions.filter((a: Admission) => a.id !== id),
      selectedAdmissionId: s.selectedAdmissionId === id ? null : s.selectedAdmissionId,
    }));
    const _any = get() as any;
    if (adm.bedId && typeof _any.updateBedStatus === 'function') {
      _any.updateBedStatus(adm.bedId, BedStatus.AVAILABLE);
    }
    return true;
  },

  getAdmissionById: (id) => {
    return get().admissions.find((a: Admission) => a.id === id);
  },

  getActiveAdmissions: () => {
    return get()
      .admissions.filter(
        (a: Admission) => a.status === AdmissionStatus.ADMITTED || a.status === AdmissionStatus.PENDING
      )
      .sort(
        (a: Admission, b: Admission) =>
          new Date(b.admissionDate).getTime() - new Date(a.admissionDate).getTime()
      );
  },

  getAdmissionsByPatientId: (patientId) => {
    return get()
      .admissions.filter((a: Admission) => a.patientId === patientId)
      .sort(
        (a: Admission, b: Admission) =>
          new Date(b.admissionDate).getTime() - new Date(a.admissionDate).getTime()
      );
  },

  getAdmissionsByDoctorId: (doctorId) => {
    return get()
      .admissions.filter((a: Admission) => a.doctorId === doctorId || a.attendingDoctorId === doctorId)
      .sort(
        (a: Admission, b: Admission) =>
          new Date(b.admissionDate).getTime() - new Date(a.admissionDate).getTime()
      );
  },

  getAdmissionsByDepartment: (department) => {
    return get()
      .admissions.filter((a: Admission) => a.department === department)
      .sort(
        (a: Admission, b: Admission) =>
          new Date(b.admissionDate).getTime() - new Date(a.admissionDate).getTime()
      );
  },

  getAdmissionsByDateRange: (startDate, endDate) => {
    const start = new Date(startDate).getTime();
    const end = new Date(endDate).getTime();
    return get()
      .admissions.filter((a: Admission) => {
        const t = new Date(a.admissionDate).getTime();
        return t >= start && t <= end;
      })
      .sort(
        (a: Admission, b: Admission) =>
          new Date(b.admissionDate).getTime() - new Date(a.admissionDate).getTime()
      );
  },

  getAdmissionsByStatus: (status) => {
    return get()
      .admissions.filter((a: Admission) => a.status === status)
      .sort(
        (a: Admission, b: Admission) =>
          new Date(b.admissionDate).getTime() - new Date(a.admissionDate).getTime()
      );
  },

  admitPatient: (data) => {
    const now = new Date();
    const admission = get().addAdmission({
      ...data,
      admissionDate: data.admissionDate ?? now,
      status: AdmissionStatus.ADMITTED,
    });
    const _any = get() as any;
    if (admission.bedId && typeof _any.updateBedStatus === 'function') {
      _any.updateBedStatus(admission.bedId, BedStatus.OCCUPIED);
    }
    return admission;
  },

  dischargePatient: (id, dischargeData) => {
    const state = get();
    const adm = state.admissions.find((a: Admission) => a.id === id);
    if (!adm) return null;
    const now = new Date();
    const updated = get().updateAdmission(id, {
      status: AdmissionStatus.DISCHARGED,
      dischargeDate: dischargeData.dischargeDate ?? now,
      dischargeStatus: dischargeData.dischargeStatus,
      dischargeSummary: dischargeData.dischargeSummary,
      dischargeInstructions: dischargeData.dischargeInstructions,
      finalDiagnosis: dischargeData.finalDiagnosis,
      followUpDate: dischargeData.followUpDate,
      totalBilledAmount: dischargeData.totalBilledAmount,
      updatedAt: now,
    });
    const _any = get() as any;
    if (updated && updated.bedId && typeof _any.updateBedStatus === 'function') {
      _any.updateBedStatus(updated.bedId, BedStatus.AVAILABLE);
    }
    return updated;
  },

  transferAdmission: (id, transferData) => {
    const state = get();
    const adm = state.admissions.find((a: Admission) => a.id === id);
    if (!adm) return null;
    const oldBedId = adm.bedId;
    const updated = get().updateAdmission(id, {
      status: AdmissionStatus.TRANSFERRED,
      roomId: transferData.roomId ?? adm.roomId,
      bedId: transferData.bedId ?? adm.bedId,
      department: transferData.department ?? adm.department,
      updatedAt: new Date(),
    });
    if (updated) {
      const _any = get() as any;
      if (oldBedId && oldBedId !== updated.bedId && typeof _any.updateBedStatus === 'function') {
        _any.updateBedStatus(oldBedId, BedStatus.AVAILABLE);
      }
      if (updated.bedId && typeof _any.updateBedStatus === 'function') {
        _any.updateBedStatus(updated.bedId, BedStatus.OCCUPIED);
      }
    }
    return updated;
  },

  setSelectedAdmissionId: (id) => set({ selectedAdmissionId: id }),
});
