import { StateCreator } from 'zustand';
import { Appointment } from '../../types/models';
import { AppointmentStatus } from '../../types/enums';

export type AppointmentSlice = {
  appointments: Appointment[];
  selectedAppointmentId: string | null;
  addAppointment: (
    appointment: Omit<Appointment, 'id' | 'createdAt' | 'updatedAt' | 'status' | 'isEmergency'> & {
      status?: AppointmentStatus;
      isEmergency?: boolean;
    }
  ) => Appointment;
  updateAppointment: (id: string, patch: Partial<Appointment>) => Appointment | null;
  deleteAppointment: (id: string) => boolean;
  getAppointmentById: (id: string) => Appointment | undefined;
  getAppointmentsByDoctorId: (doctorId: string) => Appointment[];
  getAppointmentsByPatientId: (patientId: string) => Appointment[];
  getAppointmentsByDateRange: (startDate: Date, endDate: Date) => Appointment[];
  getAppointmentsByDoctorAndDateRange: (
    doctorId: string,
    startDate: Date,
    endDate: Date
  ) => Appointment[];
  updateStatus: (id: string, status: AppointmentStatus, meta?: Partial<Appointment>) => Appointment | null;
  checkIn: (id: string) => Appointment | null;
  startConsultation: (id: string) => Appointment | null;
  completeAppointment: (id: string, followUpDate?: Date) => Appointment | null;
  cancelAppointment: (id: string, reason?: string, cancelledBy?: string) => Appointment | null;
  setSelectedAppointmentId: (id: string | null) => void;
};

export const createAppointmentSlice: StateCreator<AppointmentSlice> = (set, get) => ({
  appointments: [],
  selectedAppointmentId: null,

  addAppointment: (appointment) => {
    const now = new Date();
    const newApt: Appointment = {
      ...appointment,
      id: `apt_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      status: appointment.status ?? AppointmentStatus.SCHEDULED,
      isEmergency: appointment.isEmergency ?? false,
      createdAt: now,
      updatedAt: now,
    };
    set((state) => ({ appointments: [...state.appointments, newApt] }));
    return newApt;
  },

  updateAppointment: (id, patch) => {
    const state = get();
    const apt = state.appointments.find((a: Appointment) => a.id === id);
    if (!apt) return null;
    const updated: Appointment = { ...apt, ...patch, updatedAt: new Date() };
    set((s) => ({
      appointments: s.appointments.map((a: Appointment) => (a.id === id ? updated : a)),
    }));
    return updated;
  },

  deleteAppointment: (id) => {
    const state = get();
    const exists = state.appointments.some((a: Appointment) => a.id === id);
    if (!exists) return false;
    set((s) => ({
      appointments: s.appointments.filter((a: Appointment) => a.id !== id),
      selectedAppointmentId: s.selectedAppointmentId === id ? null : s.selectedAppointmentId,
    }));
    return true;
  },

  getAppointmentById: (id) => {
    return get().appointments.find((a: Appointment) => a.id === id);
  },

  getAppointmentsByDoctorId: (doctorId) => {
    return get()
      .appointments.filter((a: Appointment) => a.doctorId === doctorId)
      .sort(
        (a: Appointment, b: Appointment) =>
          new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
      );
  },

  getAppointmentsByPatientId: (patientId) => {
    return get()
      .appointments.filter((a: Appointment) => a.patientId === patientId)
      .sort(
        (a: Appointment, b: Appointment) =>
          new Date(b.startTime).getTime() - new Date(a.startTime).getTime()
      );
  },

  getAppointmentsByDateRange: (startDate, endDate) => {
    const start = new Date(startDate).getTime();
    const end = new Date(endDate).getTime();
    return get().appointments.filter((a: Appointment) => {
      const t = new Date(a.appointmentDate).getTime();
      return t >= start && t <= end;
    });
  },

  getAppointmentsByDoctorAndDateRange: (doctorId, startDate, endDate) => {
    const start = new Date(startDate).getTime();
    const end = new Date(endDate).getTime();
    return get()
      .appointments.filter((a: Appointment) => {
        if (a.doctorId !== doctorId) return false;
        const t = new Date(a.appointmentDate).getTime();
        return t >= start && t <= end;
      })
      .sort(
        (a: Appointment, b: Appointment) =>
          new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
      );
  },

  updateStatus: (id, status, meta) => {
    return get().updateAppointment(id, { status, ...meta, updatedAt: new Date() });
  },

  checkIn: (id) => {
    const now = new Date();
    return get().updateAppointment(id, {
      status: AppointmentStatus.CHECKED_IN,
      checkInTime: now,
      updatedAt: now,
    });
  },

  startConsultation: (id) => {
    const now = new Date();
    return get().updateAppointment(id, {
      status: AppointmentStatus.IN_PROGRESS,
      consultationStartTime: now,
      updatedAt: now,
    });
  },

  completeAppointment: (id, followUpDate) => {
    const now = new Date();
    const patch: Partial<Appointment> = {
      status: AppointmentStatus.COMPLETED,
      completedTime: now,
      updatedAt: now,
    };
    if (followUpDate) patch.followUpDate = followUpDate;
    return get().updateAppointment(id, patch);
  },

  cancelAppointment: (id, reason, cancelledBy) => {
    const now = new Date();
    return get().updateAppointment(id, {
      status: AppointmentStatus.CANCELLED,
      cancelledTime: now,
      cancellationReason: reason,
      cancelledBy,
      updatedAt: now,
    });
  },

  setSelectedAppointmentId: (id) => set({ selectedAppointmentId: id }),
});
