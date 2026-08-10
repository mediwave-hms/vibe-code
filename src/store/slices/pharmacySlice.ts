import { StateCreator } from 'zustand';
import { Medication, Prescription, PrescriptionItem } from '../../types/models';
import { PrescriptionStatus, MedicationForm, DrugCategory } from '../../types/enums';

export type PharmacySlice = {
  medications: Medication[];
  prescriptions: Prescription[];
  prescriptionItems: PrescriptionItem[];
  selectedMedicationId: string | null;
  selectedPrescriptionId: string | null;
  addMedication: (
    med: Omit<Medication, 'id' | 'createdAt' | 'updatedAt' | 'stockQuantity'> & { stockQuantity?: number }
  ) => Medication;
  updateMedication: (id: string, patch: Partial<Medication>) => Medication | null;
  deleteMedication: (id: string) => boolean;
  getMedicationById: (id: string) => Medication | undefined;
  getMedicationsByCategory: (category: DrugCategory) => Medication[];
  getMedicationsByForm: (form: MedicationForm) => Medication[];
  getLowStockMedications: () => Medication[];
  getOutOfStockMedications: () => Medication[];
  searchMedications: (query: string) => Medication[];
  restockMedication: (id: string, quantity: number, batchNumber?: string, expiryDate?: Date) => Medication | null;
  dispenseMedication: (id: string, quantity: number) => Medication | null;
  addPrescription: (
    rx: Omit<Prescription, 'id' | 'createdAt' | 'updatedAt' | 'status'> & {
      status?: PrescriptionStatus;
      items: Omit<PrescriptionItem, 'id' | 'prescriptionId' | 'createdAt' | 'updatedAt' | 'dispensedQuantity'>[];
    }
  ) => Prescription;
  updatePrescription: (id: string, patch: Partial<Prescription>) => Prescription | null;
  deletePrescription: (id: string) => boolean;
  getPrescriptionById: (id: string) => Prescription | undefined;
  getPrescriptionsByPatientId: (patientId: string) => Prescription[];
  getPrescriptionsByDoctorId: (doctorId: string) => Prescription[];
  getPrescriptionsByStatus: (status: PrescriptionStatus) => Prescription[];
  getActivePrescriptions: (patientId: string) => Prescription[];
  getPrescriptionItems: (prescriptionId: string) => PrescriptionItem[];
  addPrescriptionItem: (
    prescriptionId: string,
    item: Omit<PrescriptionItem, 'id' | 'prescriptionId' | 'createdAt' | 'updatedAt' | 'dispensedQuantity'>
  ) => Prescription | null;
  removePrescriptionItem: (prescriptionId: string, itemId: string) => Prescription | null;
  dispensePrescription: (
    prescriptionId: string,
    pharmacistId: string,
    itemsToDispense?: { itemId: string; quantity: number }[]
  ) => Prescription | null;
  cancelPrescription: (id: string) => Prescription | null;
  setSelectedMedicationId: (id: string | null) => void;
  setSelectedPrescriptionId: (id: string | null) => void;
};

export const createPharmacySlice: StateCreator<PharmacySlice> = (set, get) => ({
  medications: [],
  prescriptions: [],
  prescriptionItems: [],
  selectedMedicationId: null,
  selectedPrescriptionId: null,

  addMedication: (med) => {
    const now = new Date();
    const newMed: Medication = {
      ...med,
      id: `med_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      stockQuantity: med.stockQuantity ?? 0,
      createdAt: now,
      updatedAt: now,
    };
    set((state) => ({ medications: [...state.medications, newMed] }));
    return newMed;
  },

  updateMedication: (id, patch) => {
    const state = get();
    const med = state.medications.find((m: Medication) => m.id === id);
    if (!med) return null;
    const updated: Medication = { ...med, ...patch, updatedAt: new Date() };
    set((s) => ({
      medications: s.medications.map((m: Medication) => (m.id === id ? updated : m)),
    }));
    return updated;
  },

  deleteMedication: (id) => {
    const state = get();
    const exists = state.medications.some((m: Medication) => m.id === id);
    if (!exists) return false;
    set((s) => ({
      medications: s.medications.filter((m: Medication) => m.id !== id),
      selectedMedicationId: s.selectedMedicationId === id ? null : s.selectedMedicationId,
    }));
    return true;
  },

  getMedicationById: (id) => {
    return get().medications.find((m: Medication) => m.id === id);
  },

  getMedicationsByCategory: (category) => {
    return get()
      .medications.filter((m: Medication) => m.category === category)
      .sort((a: Medication, b: Medication) => a.name.localeCompare(b.name));
  },

  getMedicationsByForm: (form) => {
    return get()
      .medications.filter((m: Medication) => m.form === form)
      .sort((a: Medication, b: Medication) => a.name.localeCompare(b.name));
  },

  getLowStockMedications: () => {
    return get()
      .medications.filter((m: Medication) => m.stockQuantity > 0 && m.stockQuantity <= m.reorderLevel)
      .sort((a: Medication, b: Medication) => a.stockQuantity - b.stockQuantity);
  },

  getOutOfStockMedications: () => {
    return get()
      .medications.filter((m: Medication) => m.stockQuantity === 0)
      .sort((a: Medication, b: Medication) => a.name.localeCompare(b.name));
  },

  searchMedications: (query) => {
    const q = query.toLowerCase();
    return get().medications.filter((m: Medication) => {
      return (
        m.name.toLowerCase().includes(q) ||
        (m.genericName && m.genericName.toLowerCase().includes(q)) ||
        (m.manufacturer && m.manufacturer.toLowerCase().includes(q)) ||
        (m.batchNumber && m.batchNumber.toLowerCase().includes(q))
      );
    });
  },

  restockMedication: (id, quantity, batchNumber, expiryDate) => {
    const med = get().getMedicationById(id);
    if (!med) return null;
    return get().updateMedication(id, {
      stockQuantity: med.stockQuantity + quantity,
      batchNumber: batchNumber ?? med.batchNumber,
      expiryDate: expiryDate ?? med.expiryDate,
      updatedAt: new Date(),
    });
  },

  dispenseMedication: (id, quantity) => {
    const med = get().getMedicationById(id);
    if (!med || med.stockQuantity < quantity) return null;
    return get().updateMedication(id, {
      stockQuantity: med.stockQuantity - quantity,
      updatedAt: new Date(),
    });
  },

  addPrescription: (rx) => {
    const now = new Date();
    const rxId = `rx_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    const items: PrescriptionItem[] = rx.items.map((it: Omit<PrescriptionItem, 'id' | 'prescriptionId' | 'createdAt' | 'updatedAt' | 'dispensedQuantity'>, idx: number) => ({
      ...it,
      id: `rx_item_${Date.now()}_${idx}_${Math.random().toString(36).slice(2, 6)}`,
      prescriptionId: rxId,
      dispensedQuantity: 0,
      remainingRefills: it.refillCount ?? 0,
      createdAt: now,
      updatedAt: now,
    }));
    const newRx: Prescription = {
      ...rx,
      id: rxId,
      status: rx.status ?? PrescriptionStatus.ACTIVE,
      createdAt: now,
      updatedAt: now,
    };
    set((state) => ({
      prescriptions: [...state.prescriptions, newRx],
      prescriptionItems: [...state.prescriptionItems, ...items],
    }));
    return newRx;
  },

  updatePrescription: (id, patch) => {
    const state = get();
    const rx = state.prescriptions.find((r: Prescription) => r.id === id);
    if (!rx) return null;
    const updated: Prescription = { ...rx, ...patch, updatedAt: new Date() };
    set((s) => ({
      prescriptions: s.prescriptions.map((r: Prescription) => (r.id === id ? updated : r)),
    }));
    return updated;
  },

  deletePrescription: (id) => {
    const state = get();
    const exists = state.prescriptions.some((r: Prescription) => r.id === id);
    if (!exists) return false;
    set((s) => ({
      prescriptions: s.prescriptions.filter((r: Prescription) => r.id !== id),
      prescriptionItems: s.prescriptionItems.filter((pi: PrescriptionItem) => pi.prescriptionId !== id),
      selectedPrescriptionId: s.selectedPrescriptionId === id ? null : s.selectedPrescriptionId,
    }));
    return true;
  },

  getPrescriptionById: (id) => {
    return get().prescriptions.find((r: Prescription) => r.id === id);
  },

  getPrescriptionsByPatientId: (patientId) => {
    return get()
      .prescriptions.filter((r: Prescription) => r.patientId === patientId)
      .sort(
        (a: Prescription, b: Prescription) =>
          new Date(b.issuedDate).getTime() - new Date(a.issuedDate).getTime()
      );
  },

  getPrescriptionsByDoctorId: (doctorId) => {
    return get()
      .prescriptions.filter((r: Prescription) => r.doctorId === doctorId)
      .sort(
        (a: Prescription, b: Prescription) =>
          new Date(b.issuedDate).getTime() - new Date(a.issuedDate).getTime()
      );
  },

  getPrescriptionsByStatus: (status) => {
    return get()
      .prescriptions.filter((r: Prescription) => r.status === status)
      .sort(
        (a: Prescription, b: Prescription) =>
          new Date(b.issuedDate).getTime() - new Date(a.issuedDate).getTime()
      );
  },

  getActivePrescriptions: (patientId) => {
    const now = new Date();
    return get()
      .prescriptions.filter((r: Prescription) => {
        if (r.patientId !== patientId) return false;
        if (r.status !== PrescriptionStatus.ACTIVE && r.status !== PrescriptionStatus.PARTIALLY_DISPENSED) return false;
        if (r.expiryDate && new Date(r.expiryDate) < now) return false;
        return true;
      })
      .sort(
        (a: Prescription, b: Prescription) =>
          new Date(b.issuedDate).getTime() - new Date(a.issuedDate).getTime()
      );
  },

  getPrescriptionItems: (prescriptionId) => {
    return get().prescriptionItems.filter((pi: PrescriptionItem) => pi.prescriptionId === prescriptionId);
  },

  addPrescriptionItem: (prescriptionId, item) => {
    const state = get();
    const rx = state.prescriptions.find((r: Prescription) => r.id === prescriptionId);
    if (!rx) return null;
    const now = new Date();
    const newItem: PrescriptionItem = {
      ...item,
      id: `rx_item_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      prescriptionId,
      dispensedQuantity: 0,
      remainingRefills: item.refillCount ?? 0,
      createdAt: now,
      updatedAt: now,
    };
    set((s) => ({
      prescriptionItems: [...s.prescriptionItems, newItem],
      prescriptions: s.prescriptions.map((r: Prescription) =>
        r.id === prescriptionId ? { ...r, updatedAt: now } : r
      ),
    }));
    return get().getPrescriptionById(prescriptionId) ?? null;
  },

  removePrescriptionItem: (prescriptionId, itemId) => {
    const now = new Date();
    set((s) => ({
      prescriptionItems: s.prescriptionItems.filter((pi: PrescriptionItem) => pi.id !== itemId),
      prescriptions: s.prescriptions.map((r: Prescription) =>
        r.id === prescriptionId ? { ...r, updatedAt: now } : r
      ),
    }));
    return get().getPrescriptionById(prescriptionId) ?? null;
  },

  dispensePrescription: (prescriptionId, pharmacistId, itemsToDispense) => {
    const state = get();
    const rx = state.prescriptions.find((r: Prescription) => r.id === prescriptionId);
    if (!rx) return null;

    const now = new Date();
    const rxItems = state.prescriptionItems.filter(
      (pi: PrescriptionItem) => pi.prescriptionId === prescriptionId
    );

    const plan = rxItems.map((item: PrescriptionItem) => {
      const dispense = itemsToDispense
        ? itemsToDispense.find((d) => d.itemId === item.id)
        : null;
      const qty = dispense
        ? dispense.quantity
        : item.quantity - (item.dispensedQuantity ?? 0);
      return { item, qty: qty > 0 ? qty : 0 };
    });

    for (const { item, qty } of plan) {
      if (qty <= 0) continue;
      if (!item.medicationId) continue;
      const med = state.medications.find((m: Medication) => m.id === item.medicationId);
      if (!med || med.stockQuantity < qty) {
        return null;
      }
    }

    const stockUpdates = new Map<string, number>();
    for (const { item, qty } of plan) {
      if (qty <= 0 || !item.medicationId) continue;
      const prev = stockUpdates.get(item.medicationId) ?? 0;
      stockUpdates.set(item.medicationId, prev + qty);
    }

    let allDispensed = true;
    const updatedItems = plan.map(({ item, qty }) => {
      if (qty <= 0) {
        if ((item.dispensedQuantity ?? 0) < item.quantity) allDispensed = false;
        return item;
      }
      const newDispensed = (item.dispensedQuantity ?? 0) + qty;
      if (newDispensed < item.quantity) allDispensed = false;
      return { ...item, dispensedQuantity: newDispensed, updatedAt: now };
    });

    const newStatus: PrescriptionStatus = allDispensed
      ? PrescriptionStatus.DISPENSED
      : PrescriptionStatus.PARTIALLY_DISPENSED;

    set((s) => ({
      medications: s.medications.map((m: Medication) => {
        const decrement = stockUpdates.get(m.id);
        if (!decrement) return m;
        return { ...m, stockQuantity: m.stockQuantity - decrement, updatedAt: now };
      }),
      prescriptionItems: s.prescriptionItems.map((pi: PrescriptionItem) => {
        const updated = updatedItems.find((ui) => ui.id === pi.id);
        return updated ?? pi;
      }),
      prescriptions: s.prescriptions.map((r: Prescription) =>
        r.id === prescriptionId
          ? {
              ...r,
              status: newStatus,
              dispensingPharmacistId: pharmacistId,
              dispensedDate: now,
              updatedAt: now,
            }
          : r
      ),
    }));

    return get().getPrescriptionById(prescriptionId) ?? null;
  },

  cancelPrescription: (id) => {
    return get().updatePrescription(id, {
      status: PrescriptionStatus.CANCELLED,
      updatedAt: new Date(),
    });
  },

  setSelectedMedicationId: (id) => set({ selectedMedicationId: id }),
  setSelectedPrescriptionId: (id) => set({ selectedPrescriptionId: id }),
});
