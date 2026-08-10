import { StateCreator } from 'zustand';
import { Invoice, Payment, InvoiceItem } from '../../types/models';
import { BillStatus, InvoiceType, PaymentMethod } from '../../types/enums';

export type BillingSlice = {
  invoices: Invoice[];
  payments: Payment[];
  selectedInvoiceId: string | null;
  selectedPaymentId: string | null;
  addInvoice: (
    invoice: Omit<
      Invoice,
      'id' | 'createdAt' | 'updatedAt' | 'invoiceNumber' | 'status' | 'paidAmount' | 'balanceAmount' | 'items' | 'payments' | 'subtotal' | 'discountAmount' | 'taxAmount' | 'totalAmount'
    > & {
      status?: BillStatus;
      items: Omit<InvoiceItem, 'id' | 'invoiceId' | 'createdAt'>[];
    }
  ) => Invoice;
  updateInvoice: (id: string, patch: Partial<Invoice>) => Invoice | null;
  deleteInvoice: (id: string) => boolean;
  getInvoiceById: (id: string) => Invoice | undefined;
  getPatientInvoices: (patientId: string) => Invoice[];
  getInvoicesByStatus: (status: BillStatus) => Invoice[];
  getInvoicesByDateRange: (startDate: Date, endDate: Date) => Invoice[];
  getOverdueInvoices: () => Invoice[];
  createInvoice: (
    data: {
      patientId: string;
      appointmentId?: string;
      admissionId?: string;
      type: InvoiceType;
      dueDate?: Date;
      discountPercent?: number;
      taxPercent?: number;
      billingNotes?: string;
      items: {
        description: string;
        quantity: number;
        unitPrice: number;
        itemType: InvoiceType;
        referenceId?: string;
        notes?: string;
      }[];
      createdById?: string;
    }
  ) => Invoice;
  addInvoiceItem: (invoiceId: string, item: Omit<InvoiceItem, 'id' | 'invoiceId' | 'createdAt'>) => Invoice | null;
  removeInvoiceItem: (invoiceId: string, itemId: string) => Invoice | null;
  cancelInvoice: (id: string, reason: string) => Invoice | null;
  addPayment: (
    payment: Omit<Payment, 'id' | 'createdAt'>
  ) => Payment | null;
  getPaymentsByInvoiceId: (invoiceId: string) => Payment[];
  getPaymentsByPatientId: (patientId: string) => Payment[];
  getPaymentsByDateRange: (startDate: Date, endDate: Date) => Payment[];
  getPaymentsByMethod: (method: PaymentMethod) => Payment[];
  recalculateInvoiceTotals: (id: string) => Invoice | null;
  searchInvoices: (query: string) => Invoice[];
  setSelectedInvoiceId: (id: string | null) => void;
  setSelectedPaymentId: (id: string | null) => void;
};

const generateInvoiceNumber = () => {
  const year = new Date().getFullYear();
  const rand = Math.floor(100000 + Math.random() * 900000);
  return `INV-${year}-${rand}`;
};

const calculateTotals = (
  items: { quantity: number; unitPrice: number }[],
  discountPercent: number = 0,
  taxPercent: number = 0
) => {
  const subtotal = items.reduce((sum, it: { quantity: number; unitPrice: number }) => sum + it.quantity * it.unitPrice, 0);
  const discountAmount = subtotal * (discountPercent / 100);
  const afterDiscount = subtotal - discountAmount;
  const taxAmount = afterDiscount * (taxPercent / 100);
  const totalAmount = afterDiscount + taxAmount;
  return { subtotal, discountAmount, taxAmount, totalAmount };
};

export const createBillingSlice: StateCreator<BillingSlice> = (set, get) => ({
  invoices: [],
  payments: [],
  selectedInvoiceId: null,
  selectedPaymentId: null,

  addInvoice: (invoice) => {
    const now = new Date();
    const totals = calculateTotals(invoice.items, invoice.discountPercent ?? 0, invoice.taxPercent ?? 0);
    const invoiceId = `inv_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    const itemsWithIds: InvoiceItem[] = invoice.items.map((it: Omit<InvoiceItem, 'id' | 'invoiceId' | 'createdAt'>, idx: number) => ({
      ...it,
      id: `inv_item_${Date.now()}_${idx}_${Math.random().toString(36).slice(2, 6)}`,
      invoiceId,
      totalPrice: it.quantity * it.unitPrice,
      createdAt: now,
    }));
    const newInv: Invoice = {
      ...invoice,
      id: invoiceId,
      invoiceNumber: generateInvoiceNumber(),
      status: invoice.status ?? BillStatus.PENDING,
      subtotal: totals.subtotal,
      discountAmount: totals.discountAmount,
      taxAmount: totals.taxAmount,
      totalAmount: totals.totalAmount,
      paidAmount: 0,
      balanceAmount: totals.totalAmount,
      items: itemsWithIds,
      payments: [],
      createdAt: now,
      updatedAt: now,
    };
    set((state) => ({ invoices: [...state.invoices, newInv] }));
    return newInv;
  },

  updateInvoice: (id, patch) => {
    const state = get();
    const inv = state.invoices.find((i: Invoice) => i.id === id);
    if (!inv) return null;
    const updated: Invoice = { ...inv, ...patch, updatedAt: new Date() };
    set((s) => ({
      invoices: s.invoices.map((i: Invoice) => (i.id === id ? updated : i)),
    }));
    return updated;
  },

  deleteInvoice: (id) => {
    const state = get();
    const exists = state.invoices.some((i: Invoice) => i.id === id);
    if (!exists) return false;
    set((s) => ({
      invoices: s.invoices.filter((i: Invoice) => i.id !== id),
      payments: s.payments.filter((p: Payment) => p.invoiceId !== id),
      selectedInvoiceId: s.selectedInvoiceId === id ? null : s.selectedInvoiceId,
    }));
    return true;
  },

  getInvoiceById: (id) => {
    return get().invoices.find((i: Invoice) => i.id === id);
  },

  getPatientInvoices: (patientId) => {
    return get()
      .invoices.filter((i: Invoice) => i.patientId === patientId)
      .sort(
        (a: Invoice, b: Invoice) =>
          new Date(b.issueDate).getTime() - new Date(a.issueDate).getTime()
      );
  },

  getInvoicesByStatus: (status) => {
    return get()
      .invoices.filter((i: Invoice) => i.status === status)
      .sort(
        (a: Invoice, b: Invoice) =>
          new Date(b.issueDate).getTime() - new Date(a.issueDate).getTime()
      );
  },

  getInvoicesByDateRange: (startDate, endDate) => {
    const start = new Date(startDate).getTime();
    const end = new Date(endDate).getTime();
    return get()
      .invoices.filter((i: Invoice) => {
        const t = new Date(i.issueDate).getTime();
        return t >= start && t <= end;
      })
      .sort(
        (a: Invoice, b: Invoice) =>
          new Date(b.issueDate).getTime() - new Date(a.issueDate).getTime()
      );
  },

  getOverdueInvoices: () => {
    const now = Date.now();
    return get()
      .invoices.filter(
        (i: Invoice) =>
          (i.status === BillStatus.PENDING || i.status === BillStatus.PARTIAL || i.status === BillStatus.OVERDUE) &&
          new Date(i.dueDate).getTime() < now &&
          i.balanceAmount > 0
      )
      .sort(
        (a: Invoice, b: Invoice) =>
          new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
      );
  },

  createInvoice: (data) => {
    const now = new Date();
    const dueDate = data.dueDate ?? new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
    return get().addInvoice({
      patientId: data.patientId,
      appointmentId: data.appointmentId,
      admissionId: data.admissionId,
      issueDate: now,
      dueDate,
      type: data.type,
      discountPercent: data.discountPercent,
      taxPercent: data.taxPercent,
      billingNotes: data.billingNotes,
      createdById: data.createdById,
      items: data.items as any,
    });
  },

  addInvoiceItem: (invoiceId, item) => {
    const state = get();
    const inv = state.invoices.find((i: Invoice) => i.id === invoiceId);
    if (!inv) return null;
    const now = new Date();
    const newItem: InvoiceItem = {
      ...item,
      id: `inv_item_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      invoiceId,
      totalPrice: item.quantity * item.unitPrice,
      createdAt: now,
    };
    const updatedItems = [...inv.items, newItem];
    const totals = calculateTotals(updatedItems, inv.discountPercent ?? 0, inv.taxPercent ?? 0);
    return get().updateInvoice(invoiceId, {
      items: updatedItems,
      subtotal: totals.subtotal,
      discountAmount: totals.discountAmount,
      taxAmount: totals.taxAmount,
      totalAmount: totals.totalAmount,
      balanceAmount: totals.totalAmount - inv.paidAmount,
      updatedAt: now,
    });
  },

  removeInvoiceItem: (invoiceId, itemId) => {
    const state = get();
    const inv = state.invoices.find((i: Invoice) => i.id === invoiceId);
    if (!inv) return null;
    const updatedItems = inv.items.filter((it: InvoiceItem) => it.id !== itemId);
    const totals = calculateTotals(updatedItems, inv.discountPercent ?? 0, inv.taxPercent ?? 0);
    return get().updateInvoice(invoiceId, {
      items: updatedItems,
      subtotal: totals.subtotal,
      discountAmount: totals.discountAmount,
      taxAmount: totals.taxAmount,
      totalAmount: totals.totalAmount,
      balanceAmount: Math.max(0, totals.totalAmount - inv.paidAmount),
      updatedAt: new Date(),
    });
  },

  cancelInvoice: (id, reason) => {
    return get().updateInvoice(id, {
      status: BillStatus.CANCELLED,
      cancellationReason: reason,
      cancelledAt: new Date(),
      updatedAt: new Date(),
    });
  },

  addPayment: (payment) => {
    const state = get();
    const inv = state.invoices.find((i: Invoice) => i.id === payment.invoiceId);
    if (!inv) return null;
    const now = new Date();
    const newPayment: Payment = {
      ...payment,
      id: `pay_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      createdAt: now,
    };
    const newPaidAmount = inv.paidAmount + payment.amount;
    const newBalance = Math.max(0, inv.totalAmount - newPaidAmount);
    const newStatus =
      newBalance <= 0
        ? BillStatus.PAID
        : newPaidAmount > 0
        ? BillStatus.PARTIAL
        : inv.status;
    set((s) => ({
      payments: [...s.payments, newPayment],
      invoices: s.invoices.map((i: Invoice) =>
        i.id === payment.invoiceId
          ? {
              ...i,
              paidAmount: newPaidAmount,
              balanceAmount: newBalance,
              status: newStatus,
              payments: [...i.payments, newPayment],
              updatedAt: now,
            }
          : i
      ),
    }));
    return newPayment;
  },

  getPaymentsByInvoiceId: (invoiceId) => {
    return get()
      .payments.filter((p: Payment) => p.invoiceId === invoiceId)
      .sort(
        (a: Payment, b: Payment) =>
          new Date(b.date).getTime() - new Date(a.date).getTime()
      );
  },

  getPaymentsByPatientId: (patientId) => {
    return get()
      .payments.filter((p: Payment) => p.patientId === patientId)
      .sort(
        (a: Payment, b: Payment) =>
          new Date(b.date).getTime() - new Date(a.date).getTime()
      );
  },

  getPaymentsByDateRange: (startDate, endDate) => {
    const start = new Date(startDate).getTime();
    const end = new Date(endDate).getTime();
    return get()
      .payments.filter((p: Payment) => {
        const t = new Date(p.date).getTime();
        return t >= start && t <= end;
      })
      .sort(
        (a: Payment, b: Payment) =>
          new Date(b.date).getTime() - new Date(a.date).getTime()
      );
  },

  getPaymentsByMethod: (method) => {
    return get()
      .payments.filter((p: Payment) => p.method === method)
      .sort(
        (a: Payment, b: Payment) =>
          new Date(b.date).getTime() - new Date(a.date).getTime()
      );
  },

  recalculateInvoiceTotals: (id) => {
    const inv = get().getInvoiceById(id);
    if (!inv) return null;
    const totals = calculateTotals(inv.items, inv.discountPercent ?? 0, inv.taxPercent ?? 0);
    return get().updateInvoice(id, {
      subtotal: totals.subtotal,
      discountAmount: totals.discountAmount,
      taxAmount: totals.taxAmount,
      totalAmount: totals.totalAmount,
      balanceAmount: Math.max(0, totals.totalAmount - inv.paidAmount),
      updatedAt: new Date(),
    });
  },

  searchInvoices: (query) => {
    const q = query.toLowerCase();
    return get().invoices.filter((i: Invoice) => {
      return (
        i.invoiceNumber.toLowerCase().includes(q) ||
        i.patientId.toLowerCase().includes(q) ||
        (i.billingNotes && i.billingNotes.toLowerCase().includes(q))
      );
    });
  },

  setSelectedInvoiceId: (id) => set({ selectedInvoiceId: id }),
  setSelectedPaymentId: (id) => set({ selectedPaymentId: id }),
});
