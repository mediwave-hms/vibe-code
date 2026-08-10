import { StateCreator } from 'zustand';
import { Program } from '../../types/models';
import { ProgramStatus } from '../../types/enums';

export interface ProgramSlice {
  programs: Program[];
  createProgram: (data: Omit<Program, 'id' | 'status' | 'createdAt' | 'updatedAt'> & { status?: ProgramStatus }) => void;
  updateProgram: (id: string, patch: Partial<Program>) => void;
  archiveProgram: (id: string) => void;
  addBulkPrograms: (programs: Program[]) => void;
}

export const createProgramSlice: StateCreator<ProgramSlice> = (set) => ({
  programs: [],

  createProgram: (data) => {
    const now = new Date();
    const program: Program = {
      ...data,
      id: `prog_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      status: data.status ?? ProgramStatus.DRAFT,
      createdAt: now,
      updatedAt: now,
    };
    set((state) => ({ programs: [...state.programs, program] }));
  },

  updateProgram: (id, patch) => {
    set((state) => ({
      programs: state.programs.map((p: Program) =>
        p.id === id ? { ...p, ...patch, updatedAt: new Date() } : p
      ),
    }));
  },

  archiveProgram: (id) => {
    set((state) => ({
      programs: state.programs.map((p: Program) =>
        p.id === id ? { ...p, status: ProgramStatus.ARCHIVED, updatedAt: new Date() } : p
      ),
    }));
  },

  addBulkPrograms: (programs) => {
    set((state) => ({ programs: [...state.programs, ...programs] }));
  },
});
