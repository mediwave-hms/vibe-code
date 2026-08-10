import { StateCreator } from 'zustand';
import { Wave } from '../../types/models';
import { WaveStatus } from '../../types/enums';

export interface WaveSlice {
  waves: Wave[];
  createWave: (data: Omit<Wave, 'id' | 'status' | 'createdAt' | 'updatedAt'> & { status?: WaveStatus }) => void;
  updateWave: (id: string, patch: Partial<Wave>) => void;
  setWaveStatus: (id: string, status: WaveStatus) => void;
  autoRolloverCheck: () => void;
  addBulkWaves: (waves: Wave[]) => void;
}

export const createWaveSlice: StateCreator<WaveSlice> = (set, get) => ({
  waves: [],

  createWave: (data) => {
    const now = new Date();
    const wave: Wave = {
      ...data,
      id: `wave_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      status: data.status ?? WaveStatus.UPCOMING,
      createdAt: now,
      updatedAt: now,
    };
    set((state) => ({ waves: [...state.waves, wave] }));
  },

  updateWave: (id, patch) => {
    set((state) => ({
      waves: state.waves.map((w: Wave) =>
        w.id === id ? { ...w, ...patch, updatedAt: new Date() } : w
      ),
    }));
  },

  setWaveStatus: (id, status) => {
    set((state) => ({
      waves: state.waves.map((w: Wave) =>
        w.id === id ? { ...w, status, updatedAt: new Date() } : w
      ),
    }));
  },

  autoRolloverCheck: () => {
    const now = new Date();
    const state = get();
    const activeWaves = state.waves.filter(
      (w) => w.status === WaveStatus.ACTIVE && new Date(w.endDate) < now
    );
    activeWaves.forEach((activeWave) => {
      const nextWave = state.waves.find(
        (w) =>
          w.programId === activeWave.programId &&
          w.status === WaveStatus.UPCOMING
      );
      set((s) => ({
        waves: s.waves.map((w: Wave) =>
          w.id === activeWave.id
            ? { ...w, status: WaveStatus.CLOSED, updatedAt: now }
            : w
        ),
      }));
      if (nextWave) {
        (get() as any).rolloverUnresolvedToNextWave(activeWave.id, nextWave.id);
      }
    });
  },

  addBulkWaves: (waves) => {
    set((state) => ({ waves: [...state.waves, ...waves] }));
  },
});
