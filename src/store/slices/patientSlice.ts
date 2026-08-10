import { StateCreator } from 'zustand';
import { Patient, ClinicalNote } from '../../types/models';
import { Gender, BloodGroup, Role } from '../../types/enums';
import { matchesPatientQuery, filterPatients } from '../../utils/patientSearch';

export type PatientSlice = {
  patients: Patient[];
  clinicalNotes: ClinicalNote[];
  selectedPatientId: string | null;
  searchQuery: string;
  filterGender: Gender | null;
  filterBloodGroup: BloodGroup | null;
  filterIsActive: boolean | null;
  addPatient: (
    patient: Omit<Patient, 'id' | 'createdAt' | 'updatedAt' | 'medicalRecordNumber' | 'registrationDate' | 'isActive'>
  ) => Patient;
  updatePatient: (id: string, patch: Partial<Patient>) => Patient | null;
  deletePatient: (id: string) => boolean;
  getPatientById: (id: string) => Patient | undefined;
  addClinicalNote: (
    note: Omit<ClinicalNote, 'id' | 'createdAt' | 'updatedAt' | 'isFinalized'> & { isFinalized?: boolean }
  ) => ClinicalNote;
  getFilteredPatients: () => Patient[];
  searchPatients: (query: string) => Patient[];
  setSelectedPatientId: (id: string | null) => void;
  setSearchQuery: (query: string) => void;
  setFilterGender: (gender: Gender | null) => void;
  setFilterBloodGroup: (bg: BloodGroup | null) => void;
  setFilterIsActive: (active: boolean | null) => void;
  clearFilters: () => void;
};

const generateMRN = () => {
  const year = new Date().getFullYear();
  const rand = Math.floor(100000 + Math.random() * 900000);
  return `MRN-${year}-${rand}`;
};

export const createPatientSlice: StateCreator<PatientSlice> = (set, get) => ({
  patients: [],
  clinicalNotes: [],
  selectedPatientId: null,
  searchQuery: '',
  filterGender: null,
  filterBloodGroup: null,
  filterIsActive: null,

  addPatient: (patient) => {
    const now = new Date();
    const newPatient: Patient = {
      ...patient,
      id: `pat_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      medicalRecordNumber: generateMRN(),
      registrationDate: now,
      isActive: true,
      createdAt: now,
      updatedAt: now,
    };
    set((state) => ({ patients: [...state.patients, newPatient] }));
    return newPatient;
  },

  updatePatient: (id, patch) => {
    const state = get();
    const patient = state.patients.find((p: Patient) => p.id === id);
    if (!patient) return null;
    const updated: Patient = { ...patient, ...patch, updatedAt: new Date() };
    set((s) => ({
      patients: s.patients.map((p: Patient) => (p.id === id ? updated : p)),
    }));
    return updated;
  },

  deletePatient: (id) => {
    const state = get();
    const exists = state.patients.some((p: Patient) => p.id === id);
    if (!exists) return false;
    set((s) => ({
      patients: s.patients.filter((p: Patient) => p.id !== id),
      selectedPatientId: s.selectedPatientId === id ? null : s.selectedPatientId,
    }));
    return true;
  },

  getPatientById: (id) => {
    return get().patients.find((p: Patient) => p.id === id);
  },

  addClinicalNote: (note) => {
    const now = new Date();
    const newNote: ClinicalNote = {
      ...note,
      id: `note_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      authorRole: note.authorRole ?? Role.DOCTOR,
      isFinalized: note.isFinalized ?? true,
      createdAt: now,
      updatedAt: now,
    };
    set((state) => ({ clinicalNotes: [...(state.clinicalNotes || []), newNote] }));
    return newNote;
  },

  getFilteredPatients: () => {
    const state = get();
    return filterPatients(state.patients, {
      query: state.searchQuery,
      gender: state.filterGender,
      bloodGroup: state.filterBloodGroup,
      isActive: state.filterIsActive,
    });
  },

  searchPatients: (query) => {
    return get().patients.filter((p: Patient) => matchesPatientQuery(p, query));
  },

  setSelectedPatientId: (id) => set({ selectedPatientId: id }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setFilterGender: (gender) => set({ filterGender: gender }),
  setFilterBloodGroup: (bg) => set({ filterBloodGroup: bg }),
  setFilterIsActive: (active) => set({ filterIsActive: active }),

  clearFilters: () =>
    set({
      searchQuery: '',
      filterGender: null,
      filterBloodGroup: null,
      filterIsActive: null,
    }),
});
