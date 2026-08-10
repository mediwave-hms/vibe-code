import { useState, useMemo } from 'react';
import { useStore } from '../../store';
import { Card, CardContent } from '../../components/ui/Card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../components/ui/Table';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Modal } from '../../components/ui/Modal';
import { EmptyState } from '../../components/ui/EmptyState';
import { CreditCard, PlusCircle, DollarSign, Search, Filter } from 'lucide-react';
import { toast } from 'sonner';
import { BillStatus, InvoiceType, PaymentMethod } from '../../types/enums';
import { Invoice, Patient } from '../../types/models';

type EnrichedInvoice = Invoice & { patientName: string; patientMrn: string };

export default function BillingPage() {
  const invoices = useStore((s) => s.invoices || []);
  const patients = useStore((s) => s.patients || []);
  const createInvoice = useStore((s) => s.createInvoice);
  const addPayment = useStore((s) => s.addPayment);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  // Create Invoice Modal State
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const [selectedPatientId, setSelectedPatientId] = useState('');
  const [invoiceType, setInvoiceType] = useState<InvoiceType>(InvoiceType.CONSULTATION);
  const [itemDescription, setItemDescription] = useState('Medical Consultation & Assessment');
  const [itemPrice, setItemPrice] = useState(150);

  // Record Payment Modal State
  const [paymentTargetInvoice, setPaymentTargetInvoice] = useState<EnrichedInvoice | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(PaymentMethod.CREDIT_CARD);
  const [paymentAmount, setPaymentAmount] = useState(0);

  const filteredInvoices = useMemo(() => {
    return invoices
      .map<EnrichedInvoice>((inv) => {
        const patient = patients.find((p: Patient) => p.id === inv.patientId);
        return {
          ...inv,
          patientName: patient ? `${patient.firstName} ${patient.lastName}` : inv.patientId || 'Unknown Patient',
          patientMrn: patient?.medicalRecordNumber || 'N/A',
        };
      })
      .filter((inv) => {
        const matchesSearch =
          inv.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          inv.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'ALL' || inv.status === statusFilter;
        return matchesSearch && matchesStatus;
      });
  }, [invoices, patients, searchTerm, statusFilter]);

  const handleCreateInvoice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPatientId) {
      toast.error('Please select a patient');
      return;
    }

    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 30);

    createInvoice({
      patientId: selectedPatientId,
      type: invoiceType,
      dueDate,
      items: [
        {
          description: itemDescription,
          quantity: 1,
          unitPrice: Number(itemPrice),
          itemType: invoiceType,
        },
      ],
      taxPercent: 5,
    });

    toast.success('Invoice generated successfully!');
    setIsInvoiceModalOpen(false);
    setSelectedPatientId('');
  };

  const handleRecordPaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!paymentTargetInvoice) return;

    if (typeof addPayment === 'function') {
      addPayment({
        invoiceId: paymentTargetInvoice.id,
        patientId: paymentTargetInvoice.patientId,
        amount: Number(paymentAmount),
        method: paymentMethod,
        date: new Date(),
        referenceNumber: `PAY-${Date.now().toString().slice(-6)}`,
      });
    }

    toast.success(`Payment of $${Number(paymentAmount).toFixed(2)} recorded successfully!`);
    setPaymentTargetInvoice(null);
  };

  const openPaymentModal = (inv: EnrichedInvoice) => {
    setPaymentTargetInvoice(inv);
    setPaymentAmount(inv.balanceAmount || inv.totalAmount || 0);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <CreditCard className="w-7 h-7 text-emerald-600" />
            Billing & Invoicing
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Generate patient billing invoices, track payment status, and reconcile accounts.
          </p>
        </div>
        <Button
          onClick={() => setIsInvoiceModalOpen(true)}
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm"
        >
          <PlusCircle className="w-4 h-4" />
          Create New Invoice
        </Button>
      </div>

      {/* Search & Status Filter */}
      <Card className="p-4">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <Input
              type="text"
              placeholder="Search patient, invoice #..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
          <div className="flex items-center gap-3 w-full md:w-auto">
            <Filter className="w-4 h-4 text-slate-400 hidden sm:block" />
            <span className="text-sm text-slate-600 font-medium hidden sm:inline">Status:</span>
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full sm:w-44"
            >
              <option value="ALL">All Statuses</option>
              <option value={BillStatus.PENDING}>Pending</option>
              <option value={BillStatus.PAID}>Paid</option>
              <option value={BillStatus.PARTIAL}>Partial</option>
              <option value={BillStatus.OVERDUE}>Overdue</option>
            </Select>
          </div>
        </div>
      </Card>

      {/* Invoices Table */}
      <Card>
        <CardContent className="p-0">
          {filteredInvoices.length === 0 ? (
            <EmptyState
              title="No invoices found"
              description="No billing invoices match your current search or status filter."
            />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Invoice #</TableHead>
                  <TableHead>Patient</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Total Amount</TableHead>
                  <TableHead>Balance Due</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInvoices.map((inv) => (
                  <TableRow key={inv.id} className="hover:bg-slate-50/80 transition-colors">
                    <TableCell className="font-mono text-xs font-semibold text-slate-700">
                      {inv.invoiceNumber}
                    </TableCell>
                    <TableCell className="font-medium text-slate-900">{inv.patientName}</TableCell>
                    <TableCell>
                      <Badge variant="brand">{inv.type}</Badge>
                    </TableCell>
                    <TableCell className="font-medium text-slate-900">
                      ${inv.totalAmount.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-slate-600">
                      ${(inv.balanceAmount ?? inv.totalAmount).toFixed(2)}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          inv.status === BillStatus.PAID
                            ? 'success'
                            : inv.status === BillStatus.PENDING
                            ? 'warning'
                            : 'secondary'
                        }
                      >
                        {inv.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      {inv.status !== BillStatus.PAID && (
                        <Button
                          size="sm"
                          onClick={() => openPaymentModal(inv)}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-1.5 ml-auto text-xs"
                        >
                          <DollarSign className="w-3.5 h-3.5" />
                          Record Payment
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Modal to Create Invoice */}
      <Modal
        isOpen={isInvoiceModalOpen}
        onClose={() => setIsInvoiceModalOpen(false)}
        title="Generate Patient Invoice"
        description="Issue a new billing invoice for consultation, pharmacy, lab test, or inpatient room charges."
        size="lg"
      >
        <form onSubmit={handleCreateInvoice} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Select Patient *</label>
              <Select
                value={selectedPatientId}
                onChange={(e) => setSelectedPatientId(e.target.value)}
                required
              >
                <option value="">-- Select Patient --</option>
                {patients.map((pt: Patient) => (
                  <option key={pt.id} value={pt.id}>
                    {pt.firstName} {pt.lastName} (MRN: {pt.medicalRecordNumber})
                  </option>
                ))}
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Billing Type</label>
              <Select
                value={invoiceType}
                onChange={(e) => setInvoiceType(e.target.value as InvoiceType)}
              >
                {Object.values(InvoiceType).map((t) => (
                  <option key={t} value={t}>
                    {t.replace(/_/g, ' ')}
                  </option>
                ))}
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">Service / Item Description</label>
              <Input
                type="text"
                placeholder="e.g. Inpatient Room Charges, Emergency Consultation"
                value={itemDescription}
                onChange={(e) => setItemDescription(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Price ($ USD)</label>
              <Input
                type="number"
                value={itemPrice}
                onChange={(e) => setItemPrice(Number(e.target.value))}
                min={1}
                required
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <Button type="button" variant="secondary" onClick={() => setIsInvoiceModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" className="bg-emerald-600 text-white hover:bg-emerald-700">
              Generate Invoice
            </Button>
          </div>
        </form>
      </Modal>

      {/* Modal to Record Payment */}
      <Modal
        isOpen={!!paymentTargetInvoice}
        onClose={() => setPaymentTargetInvoice(null)}
        title="Record Payment"
        description={`Record payment for Invoice ${paymentTargetInvoice?.invoiceNumber} (${paymentTargetInvoice?.patientName})`}
      >
        <form onSubmit={handleRecordPaymentSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Payment Method</label>
            <Select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
            >
              {Object.values(PaymentMethod).map((m) => (
                <option key={m} value={m}>
                  {m.replace(/_/g, ' ')}
                </option>
              ))}
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Payment Amount ($)</label>
            <Input
              type="number"
              step="0.01"
              value={paymentAmount}
              onChange={(e) => setPaymentAmount(Number(e.target.value))}
              required
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <Button type="button" variant="secondary" onClick={() => setPaymentTargetInvoice(null)}>
              Cancel
            </Button>
            <Button type="submit" className="bg-emerald-600 text-white hover:bg-emerald-700">
              Confirm Payment
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
