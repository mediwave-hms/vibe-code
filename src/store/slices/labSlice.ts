import { StateCreator } from 'zustand';
import { LabTest, LabOrder, LabOrderTest } from '../../types/models';
import { LabTestStatus, LabTestPriority, LabSampleType } from '../../types/enums';

export type LabSlice = {
  labTests: LabTest[];
  labOrders: LabOrder[];
  selectedLabTestId: string | null;
  selectedLabOrderId: string | null;
  addLabTest: (test: Omit<LabTest, 'id' | 'createdAt' | 'updatedAt' | 'isActive'> & { isActive?: boolean }) => LabTest;
  updateLabTest: (id: string, patch: Partial<LabTest>) => LabTest | null;
  deleteLabTest: (id: string) => boolean;
  getLabTestById: (id: string) => LabTest | undefined;
  getLabTestsByCategory: (category: string) => LabTest[];
  getLabTestsBySampleType: (sampleType: LabSampleType) => LabTest[];
  getActiveLabTests: () => LabTest[];
  searchLabTests: (query: string) => LabTest[];
  addLabOrder: (
    order: Omit<LabOrder, 'id' | 'createdAt' | 'updatedAt' | 'status'> & {
      status?: LabTestStatus;
      tests: Omit<LabOrderTest, 'id' | 'labOrderId' | 'status' | 'createdAt' | 'updatedAt'>[];
    }
  ) => LabOrder;
  updateLabOrder: (id: string, patch: Partial<LabOrder>) => LabOrder | null;
  deleteLabOrder: (id: string) => boolean;
  getLabOrderById: (id: string) => LabOrder | undefined;
  getLabOrdersByPatientId: (patientId: string) => LabOrder[];
  getLabOrdersByDoctorId: (doctorId: string) => LabOrder[];
  getLabOrdersByStatus: (status: LabTestStatus) => LabOrder[];
  getLabOrdersByDateRange: (startDate: Date, endDate: Date) => LabOrder[];
  getPendingLabOrders: () => LabOrder[];
  orderTest: (data: {
    patientId: string;
    doctorId: string;
    appointmentId?: string;
    admissionId?: string;
    priority?: LabTestPriority;
    clinicalNotes?: string;
    tests: {
      testId: string;
      testName: string;
      testCode: string;
    }[];
  }) => LabOrder;
  collectSample: (orderId: string, collectedBy: string) => LabOrder | null;
  receiveSample: (orderId: string) => LabOrder | null;
  startTest: (orderId: string, testId: string) => LabOrder | null;
  updateTestResult: (
    orderId: string,
    testId: string,
    result: {
      result?: string;
      numericResult?: number;
      unit?: string;
      abnormalFlag?: 'HIGH' | 'LOW' | 'NORMAL';
      notes?: string;
    }
  ) => LabOrder | null;
  completeOrder: (orderId: string, reportedBy: string) => LabOrder | null;
  reviewOrder: (orderId: string, reviewedBy: string) => LabOrder | null;
  cancelOrder: (orderId: string) => LabOrder | null;
  setSelectedLabTestId: (id: string | null) => void;
  setSelectedLabOrderId: (id: string | null) => void;
};

const determineAbnormalFlag = (
  numericResult: number | undefined,
  min: number | undefined,
  max: number | undefined
): 'HIGH' | 'LOW' | 'NORMAL' | undefined => {
  if (numericResult === undefined) return undefined;
  if (min !== undefined && numericResult < min) return 'LOW';
  if (max !== undefined && numericResult > max) return 'HIGH';
  return 'NORMAL';
};

export const createLabSlice: StateCreator<LabSlice> = (set, get) => ({
  labTests: [],
  labOrders: [],
  selectedLabTestId: null,
  selectedLabOrderId: null,

  addLabTest: (test) => {
    const now = new Date();
    const newTest: LabTest = {
      ...test,
      id: `lt_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      isActive: test.isActive ?? true,
      createdAt: now,
      updatedAt: now,
    };
    set((state) => ({ labTests: [...state.labTests, newTest] }));
    return newTest;
  },

  updateLabTest: (id, patch) => {
    const state = get();
    const test = state.labTests.find((t: LabTest) => t.id === id);
    if (!test) return null;
    const updated: LabTest = { ...test, ...patch, updatedAt: new Date() };
    set((s) => ({
      labTests: s.labTests.map((t: LabTest) => (t.id === id ? updated : t)),
    }));
    return updated;
  },

  deleteLabTest: (id) => {
    const state = get();
    const exists = state.labTests.some((t: LabTest) => t.id === id);
    if (!exists) return false;
    set((s) => ({
      labTests: s.labTests.filter((t: LabTest) => t.id !== id),
      selectedLabTestId: s.selectedLabTestId === id ? null : s.selectedLabTestId,
    }));
    return true;
  },

  getLabTestById: (id) => {
    return get().labTests.find((t: LabTest) => t.id === id);
  },

  getLabTestsByCategory: (category) => {
    return get()
      .labTests.filter((t: LabTest) => t.category === category && t.isActive)
      .sort((a: LabTest, b: LabTest) => a.name.localeCompare(b.name));
  },

  getLabTestsBySampleType: (sampleType) => {
    return get()
      .labTests.filter((t: LabTest) => t.sampleType === sampleType && t.isActive)
      .sort((a: LabTest, b: LabTest) => a.name.localeCompare(b.name));
  },

  getActiveLabTests: () => {
    return get()
      .labTests.filter((t: LabTest) => t.isActive)
      .sort((a: LabTest, b: LabTest) => a.name.localeCompare(b.name));
  },

  searchLabTests: (query) => {
    const q = query.toLowerCase();
    return get().labTests.filter((t: LabTest) => {
      return (
        t.name.toLowerCase().includes(q) ||
        t.testCode.toLowerCase().includes(q) ||
        (t.category && t.category.toLowerCase().includes(q)) ||
        (t.description && t.description.toLowerCase().includes(q))
      );
    });
  },

  addLabOrder: (order) => {
    const now = new Date();
    const orderId = `lo_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    const tests: LabOrderTest[] = order.tests.map((t: { testId: string; testName: string; testCode: string }, idx: number) => {
      const labTest = get().getLabTestById(t.testId);
      return {
        ...t,
        id: `lot_${Date.now()}_${idx}_${Math.random().toString(36).slice(2, 6)}`,
        labOrderId: orderId,
        status: LabTestStatus.PENDING,
        unit: labTest?.unit,
        normalRangeMin: labTest?.normalRangeMin,
        normalRangeMax: labTest?.normalRangeMax,
        createdAt: now,
        updatedAt: now,
      };
    });
    const newOrder: LabOrder = {
      ...order,
      id: orderId,
      status: order.status ?? LabTestStatus.PENDING,
      tests,
      createdAt: now,
      updatedAt: now,
    };
    set((state) => ({ labOrders: [...state.labOrders, newOrder] }));
    return newOrder;
  },

  updateLabOrder: (id, patch) => {
    const state = get();
    const order = state.labOrders.find((o: LabOrder) => o.id === id);
    if (!order) return null;
    const updated: LabOrder = { ...order, ...patch, updatedAt: new Date() };
    set((s) => ({
      labOrders: s.labOrders.map((o: LabOrder) => (o.id === id ? updated : o)),
    }));
    return updated;
  },

  deleteLabOrder: (id) => {
    const state = get();
    const exists = state.labOrders.some((o: LabOrder) => o.id === id);
    if (!exists) return false;
    set((s) => ({
      labOrders: s.labOrders.filter((o: LabOrder) => o.id !== id),
      selectedLabOrderId: s.selectedLabOrderId === id ? null : s.selectedLabOrderId,
    }));
    return true;
  },

  getLabOrderById: (id) => {
    return get().labOrders.find((o: LabOrder) => o.id === id);
  },

  getLabOrdersByPatientId: (patientId) => {
    return get()
      .labOrders.filter((o: LabOrder) => o.patientId === patientId)
      .sort(
        (a: LabOrder, b: LabOrder) =>
          new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime()
      );
  },

  getLabOrdersByDoctorId: (doctorId) => {
    return get()
      .labOrders.filter((o: LabOrder) => o.doctorId === doctorId)
      .sort(
        (a: LabOrder, b: LabOrder) =>
          new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime()
      );
  },

  getLabOrdersByStatus: (status) => {
    return get()
      .labOrders.filter((o: LabOrder) => o.status === status)
      .sort(
        (a: LabOrder, b: LabOrder) =>
          new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime()
      );
  },

  getLabOrdersByDateRange: (startDate, endDate) => {
    const start = new Date(startDate).getTime();
    const end = new Date(endDate).getTime();
    return get()
      .labOrders.filter((o: LabOrder) => {
        const t = new Date(o.orderDate).getTime();
        return t >= start && t <= end;
      })
      .sort(
        (a: LabOrder, b: LabOrder) =>
          new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime()
      );
  },

  getPendingLabOrders: () => {
    return get()
      .labOrders.filter(
        (o: LabOrder) =>
          o.status === LabTestStatus.PENDING ||
          o.status === LabTestStatus.SAMPLE_COLLECTED ||
          o.status === LabTestStatus.IN_PROGRESS
      )
      .sort((a: LabOrder, b: LabOrder) => {
        const priorityOrder: Record<string, number> = { STAT: 0, URGENT: 1, ROUTINE: 2 };
        const pa = priorityOrder[a.priority] ?? 99;
        const pb = priorityOrder[b.priority] ?? 99;
        if (pa !== pb) return pa - pb;
        return new Date(a.orderDate).getTime() - new Date(b.orderDate).getTime();
      });
  },

  orderTest: (data) => {
    return get().addLabOrder({
      patientId: data.patientId,
      doctorId: data.doctorId,
      appointmentId: data.appointmentId,
      admissionId: data.admissionId,
      orderDate: new Date(),
      priority: data.priority ?? LabTestPriority.ROUTINE,
      clinicalNotes: data.clinicalNotes,
      tests: data.tests as any,
    });
  },

  collectSample: (orderId, collectedBy) => {
    const state = get();
    const order = state.labOrders.find((o: LabOrder) => o.id === orderId);
    if (!order) return null;
    const now = new Date();
    const updatedTests = order.tests.map((t: LabOrderTest) => ({
      ...t,
      status: LabTestStatus.SAMPLE_COLLECTED,
      updatedAt: now,
    }));
    return get().updateLabOrder(orderId, {
      status: LabTestStatus.SAMPLE_COLLECTED,
      sampleCollectedAt: now,
      sampleCollectedBy: collectedBy,
      tests: updatedTests,
      updatedAt: now,
    });
  },

  receiveSample: (orderId) => {
    const state = get();
    const order = state.labOrders.find((o: LabOrder) => o.id === orderId);
    if (!order) return null;
    const now = new Date();
    return get().updateLabOrder(orderId, {
      sampleReceivedAt: now,
      updatedAt: now,
    });
  },

  startTest: (orderId, testId) => {
    const state = get();
    const order = state.labOrders.find((o: LabOrder) => o.id === orderId);
    if (!order) return null;
    const now = new Date();
    const updatedTests = order.tests.map((t: LabOrderTest) =>
      t.id === testId || t.testId === testId
        ? { ...t, status: LabTestStatus.IN_PROGRESS, performedAt: now, updatedAt: now }
        : t
    );
    const allInProgress = updatedTests.every(
      (t: LabOrderTest) => t.status === LabTestStatus.IN_PROGRESS || t.status === LabTestStatus.COMPLETED
    );
    return get().updateLabOrder(orderId, {
      status: allInProgress ? LabTestStatus.IN_PROGRESS : order.status,
      tests: updatedTests,
      updatedAt: now,
    });
  },

  updateTestResult: (orderId, testId, result) => {
    const state = get();
    const order = state.labOrders.find((o: LabOrder) => o.id === orderId);
    if (!order) return null;
    const now = new Date();
    const updatedTests = order.tests.map((t: LabOrderTest) => {
      if (t.id !== testId && t.testId !== testId) return t;
      const flag =
        result.abnormalFlag ??
        determineAbnormalFlag(result.numericResult, t.normalRangeMin, t.normalRangeMax);
      return {
        ...t,
        result: result.result,
        numericResult: result.numericResult,
        unit: result.unit ?? t.unit,
        abnormalFlag: flag,
        notes: result.notes,
        status: LabTestStatus.COMPLETED,
        updatedAt: now,
      };
    });
    const allCompleted = updatedTests.every((t: LabOrderTest) => t.status === LabTestStatus.COMPLETED);
    return get().updateLabOrder(orderId, {
      status: allCompleted ? LabTestStatus.COMPLETED : LabTestStatus.IN_PROGRESS,
      tests: updatedTests,
      updatedAt: now,
    });
  },

  completeOrder: (orderId, reportedBy) => {
    const state = get();
    const order = state.labOrders.find((o: LabOrder) => o.id === orderId);
    if (!order) return null;
    const now = new Date();
    const updatedTests = order.tests.map((t: LabOrderTest) => ({
      ...t,
      status: t.status === LabTestStatus.PENDING ? LabTestStatus.COMPLETED : t.status,
      updatedAt: now,
    }));
    return get().updateLabOrder(orderId, {
      status: LabTestStatus.COMPLETED,
      completedAt: now,
      reportedBy,
      reportedAt: now,
      tests: updatedTests,
      updatedAt: now,
    });
  },

  reviewOrder: (orderId, reviewedBy) => {
    const now = new Date();
    return get().updateLabOrder(orderId, {
      status: LabTestStatus.REVIEWED,
      reviewedBy,
      reviewedAt: now,
      updatedAt: now,
    });
  },

  cancelOrder: (orderId) => {
    const state = get();
    const order = state.labOrders.find((o: LabOrder) => o.id === orderId);
    if (!order) return null;
    const now = new Date();
    const updatedTests = order.tests.map((t: LabOrderTest) => ({
      ...t,
      status: LabTestStatus.CANCELLED,
      updatedAt: now,
    }));
    return get().updateLabOrder(orderId, {
      status: LabTestStatus.CANCELLED,
      tests: updatedTests,
      updatedAt: now,
    });
  },

  setSelectedLabTestId: (id) => set({ selectedLabTestId: id }),
  setSelectedLabOrderId: (id) => set({ selectedLabOrderId: id }),
});
