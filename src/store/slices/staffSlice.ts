import { StateCreator } from 'zustand';
import { User } from '../../types/models';
import { Role, Department, Shift } from '../../types/enums';

const STAFF_ROLES: Role[] = [Role.DOCTOR, Role.NURSE, Role.RECEPTIONIST, Role.PHARMACIST, Role.LAB_TECHNICIAN, Role.ACCOUNTANT];

export type StaffSlice = {
  selectedStaffId: string | null;
  addStaff: (
    staff: Omit<User, 'id' | 'createdAt' | 'updatedAt' | 'isActive'> & { isActive?: boolean }
  ) => User;
  updateStaff: (id: string, patch: Partial<User>) => User | null;
  deleteStaff: (id: string) => boolean;
  getStaffById: (id: string) => User | undefined;
  getAllStaff: () => User[];
  getStaffByDepartment: (department: Department) => User[];
  getDoctors: () => User[];
  getDoctorsByDepartment: (department: Department) => User[];
  getNurses: () => User[];
  getStaffByRole: (role: Role) => User[];
  getStaffByShift: (shift: Shift) => User[];
  getActiveStaff: () => User[];
  searchStaff: (query: string) => User[];
  setSelectedStaffId: (id: string | null) => void;
};

export const createStaffSlice: StateCreator<StaffSlice> = (set, get) => ({
  selectedStaffId: null,

  addStaff: (staff) => {
    const now = new Date();
    const newStaff: User = {
      ...staff,
      id: `usr_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      isActive: staff.isActive ?? true,
      createdAt: now,
      updatedAt: now,
    };
    set(((state: StaffSlice) => ({ users: [...(state as any).users, newStaff] })) as any);
    return newStaff;
  },

  updateStaff: (id, patch) => {
    const state = get() as any;
    const staff = state.users.find((u: User) => u.id === id);
    if (!staff) return null;
    const updated: User = { ...staff, ...patch, updatedAt: new Date() };
    set(((s: StaffSlice) => ({
      users: (s as any).users.map((u: User) => (u.id === id ? updated : u)),
    })) as any);
    return updated;
  },

  deleteStaff: (id) => {
    const state = get() as any;
    const exists = state.users.some((u: User) => u.id === id);
    if (!exists) return false;
    set(((s: StaffSlice) => ({
      users: (s as any).users.filter((u: User) => u.id !== id),
      selectedStaffId: s.selectedStaffId === id ? null : s.selectedStaffId,
    })) as any);
    return true;
  },

  getStaffById: (id) => {
    return (get() as any).users.find((u: User) => u.id === id && STAFF_ROLES.includes(u.role));
  },

  getAllStaff: () => {
    return (get() as any).users.filter((u: User) => STAFF_ROLES.includes(u.role));
  },

  getStaffByDepartment: (department) => {
    return (get() as any)
      .users.filter((u: User) => STAFF_ROLES.includes(u.role) && u.department === department)
      .sort((a: User, b: User) => `${a.firstName} ${a.lastName}`.localeCompare(`${b.firstName} ${b.lastName}`));
  },

  getDoctors: () => {
    return (get() as any)
      .users.filter((u: User) => u.role === Role.DOCTOR && u.isActive)
      .sort((a: User, b: User) => `${a.firstName} ${a.lastName}`.localeCompare(`${b.firstName} ${b.lastName}`));
  },

  getDoctorsByDepartment: (department) => {
    return (get() as any)
      .users.filter(
        (u: User) => u.role === Role.DOCTOR && u.isActive && u.department === department
      )
      .sort((a: User, b: User) => `${a.firstName} ${a.lastName}`.localeCompare(`${b.firstName} ${b.lastName}`));
  },

  getNurses: () => {
    return (get() as any)
      .users.filter((u: User) => u.role === Role.NURSE && u.isActive)
      .sort((a: User, b: User) => `${a.firstName} ${a.lastName}`.localeCompare(`${b.firstName} ${b.lastName}`));
  },

  getStaffByRole: (role) => {
    return (get() as any)
      .users.filter((u: User) => u.role === role && u.isActive)
      .sort((a: User, b: User) => `${a.firstName} ${a.lastName}`.localeCompare(`${b.firstName} ${b.lastName}`));
  },

  getStaffByShift: (shift) => {
    return (get() as any)
      .users.filter((u: User) => STAFF_ROLES.includes(u.role) && u.shift === shift && u.isActive)
      .sort((a: User, b: User) => `${a.firstName} ${a.lastName}`.localeCompare(`${b.firstName} ${b.lastName}`));
  },

  getActiveStaff: () => {
    return (get() as any)
      .users.filter((u: User) => STAFF_ROLES.includes(u.role) && u.isActive)
      .sort((a: User, b: User) => `${a.firstName} ${a.lastName}`.localeCompare(`${b.firstName} ${b.lastName}`));
  },

  searchStaff: (query) => {
    const q = query.toLowerCase();
    return (get() as any).users.filter((u: User) => {
      if (!STAFF_ROLES.includes(u.role)) return false;
      const fullName = `${u.firstName} ${u.lastName}`.toLowerCase();
      return (
        fullName.includes(q) ||
        (u.email && u.email.toLowerCase().includes(q)) ||
        (u.phone && u.phone.includes(q)) ||
        (u.specialization && u.specialization.toLowerCase().includes(q)) ||
        (u.licenseNumber && u.licenseNumber.toLowerCase().includes(q))
      );
    });
  },

  setSelectedStaffId: (id) => set({ selectedStaffId: id }),
});
