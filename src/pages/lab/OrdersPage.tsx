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
import { TestTube, PlusCircle, CheckCircle2, Search, Filter } from 'lucide-react';
import { toast } from 'sonner';
import { LabTestStatus, LabTestPriority } from '../../types/enums';
import { LabOrder, Patient, User, LabTest } from '../../types/models';

type EnrichedOrder = LabOrder & { patientName: string; patientMrn: string; doctorName: string; testTitle: string };

export default function OrdersPage() {
  const orders = useStore((s) => s.labOrders || []);
  const labTests = useStore((s) => s.labTests || []);
  const patients = useStore((s) => s.patients || []);
  const users = useStore((s) => s.users || []);
  const orderTest = useStore((s) => s.orderTest);
  const updateLabOrder = useStore((s) => s.updateLabOrder);
  const updateTestResult = useStore((s) => s.updateTestResult);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  // Create Modal State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedPatientId, setSelectedPatientId] = useState('');
  const [selectedDoctorId, setSelectedDoctorId] = useState('');
  const [selectedTestId, setSelectedTestId] = useState('');
  const [priority, setPriority] = useState<LabTestPriority>(LabTestPriority.ROUTINE);
  const [clinicalNotes, setClinicalNotes] = useState('');

  // Result Modal State
  const [resultOrderTarget, setResultOrderTarget] = useState<EnrichedOrder | null>(null);
  const [resultValue, setResultValue] = useState('');
  const [resultInterpretation, setResultInterpretation] = useState('Normal');

  const doctors = useMemo(() => {
    return users.filter((u: User) => u.role === 'DOCTOR' || u.role === 'CLINICIAN');
  }, [users]);

  const filteredOrders = useMemo(() => {
    return orders
      .map<EnrichedOrder>((o) => {
        const patient = patients.find((pt: Patient) => pt.id === o.patientId);
        const doctor = users.find((st: User) => st.id === o.doctorId);
        const firstTest = o.tests?.[0];
        return {
          ...o,
          patientName: patient ? `${patient.firstName} ${patient.lastName}` : o.patientId || 'Unknown Patient',
          patientMrn: patient?.medicalRecordNumber || 'N/A',
          doctorName: doctor ? `Dr. ${doctor.firstName} ${doctor.lastName}` : 'Ordering Physician',
          testTitle: firstTest?.testName || 'Diagnostic Lab Test',
        };
      })
      .filter((o) => {
        const matchesSearch =
          o.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          o.testTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
          o.id.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'ALL' || o.status === statusFilter;
        return matchesSearch && matchesStatus;
      });
  }, [orders, patients, users, searchTerm, statusFilter]);

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPatientId) {
      toast.error('Please select a patient');
      return;
    }
    const testCatalogItem = labTests.find((t: LabTest) => t.id === selectedTestId);
    const testName = testCatalogItem ? testCatalogItem.name : 'Complete Blood Count (CBC)';
    const testCode = testCatalogItem ? testCatalogItem.testCode : 'LAB-CBC';

    if (typeof orderTest === 'function') {
      orderTest({
        patientId: selectedPatientId,
        doctorId: selectedDoctorId || doctors[0]?.id || 'doc-1',
        priority,
        clinicalNotes,
        tests: [
          {
            testId: selectedTestId || 'cat-1',
            testName,
            testCode,
          },
        ],
      });
    }

    toast.success(`Lab Order for ${testName} submitted successfully!`);
    setIsCreateModalOpen(false);
    setSelectedPatientId('');
    setClinicalNotes('');
  };

  const handleStatusAdvance = (orderId: string, currentStatus: LabTestStatus) => {
    let nextStatus = LabTestStatus.SAMPLE_COLLECTED;
    if (currentStatus === LabTestStatus.PENDING) nextStatus = LabTestStatus.SAMPLE_COLLECTED;
    else if (currentStatus === LabTestStatus.SAMPLE_COLLECTED) nextStatus = LabTestStatus.IN_PROGRESS;
    else if (currentStatus === LabTestStatus.IN_PROGRESS) nextStatus = LabTestStatus.COMPLETED;

    if (typeof updateLabOrder === 'function') {
      updateLabOrder(orderId, { status: nextStatus });
    }
    toast.success(`Lab Order status updated to ${nextStatus}!`);
  };

  const handleSaveResult = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resultOrderTarget) return;

    const firstTest = resultOrderTarget.tests?.[0];
    if (firstTest && typeof updateTestResult === 'function') {
      updateTestResult(resultOrderTarget.id, firstTest.id, {
        result: resultValue || '13.8 g/dL',
        numericResult: parseFloat(resultValue) || 13.8,
        unit: 'g/dL',
        abnormalFlag: resultInterpretation === 'Abnormal' ? 'HIGH' : 'NORMAL',
        notes: resultInterpretation,
      });
    }

    toast.success('Lab Test Result uploaded successfully!');
    setResultOrderTarget(null);
    setResultValue('');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <TestTube className="w-7 h-7 text-sky-600" />
            Diagnostic Lab Orders
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Order pathology and diagnostic laboratory tests, track sample status, and enter lab findings.
          </p>
        </div>
        <Button
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center gap-2 bg-sky-600 hover:bg-sky-700 text-white shadow-sm"
        >
          <PlusCircle className="w-4 h-4" />
          Create New Lab Order
        </Button>
      </div>

      {/* Filter & Search Bar */}
      <Card className="p-4">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <Input
              type="text"
              placeholder="Search patient, test name, order ID..."
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
              <option value={LabTestStatus.PENDING}>Pending</option>
              <option value={LabTestStatus.SAMPLE_COLLECTED}>Sample Collected</option>
              <option value={LabTestStatus.IN_PROGRESS}>In Progress</option>
              <option value={LabTestStatus.COMPLETED}>Completed</option>
              <option value={LabTestStatus.REVIEWED}>Reviewed</option>
            </Select>
          </div>
        </div>
      </Card>

      {/* Orders Table */}
      <Card>
        <CardContent className="p-0">
          {filteredOrders.length === 0 ? (
            <EmptyState
              title="No lab orders found"
              description="No lab orders match your current search or filter criteria."
            />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order Ref</TableHead>
                  <TableHead>Patient</TableHead>
                  <TableHead>Test Name</TableHead>
                  <TableHead>Ordering Doctor</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.map((o) => (
                  <TableRow key={o.id} className="hover:bg-slate-50/80 transition-colors">
                    <TableCell className="font-mono text-xs font-semibold text-slate-700">
                      {o.id.slice(0, 10)}
                    </TableCell>
                    <TableCell className="font-medium text-slate-900">{o.patientName}</TableCell>
                    <TableCell className="font-medium text-slate-700">{o.testTitle}</TableCell>
                    <TableCell className="text-slate-600">{o.doctorName}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          o.priority === LabTestPriority.STAT
                            ? 'danger'
                            : o.priority === LabTestPriority.URGENT
                            ? 'warning'
                            : 'secondary'
                        }
                      >
                        {o.priority}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          o.status === LabTestStatus.COMPLETED || o.status === LabTestStatus.REVIEWED
                            ? 'success'
                            : o.status === LabTestStatus.IN_PROGRESS
                            ? 'brand'
                            : 'warning'
                        }
                      >
                        {o.status.replace(/_/g, ' ')}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        {o.status !== LabTestStatus.COMPLETED && o.status !== LabTestStatus.REVIEWED && (
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => handleStatusAdvance(o.id, o.status)}
                            className="text-xs"
                          >
                            Advance Status
                          </Button>
                        )}
                        <Button
                          size="sm"
                          onClick={() => setResultOrderTarget(o)}
                          className="bg-sky-600 hover:bg-sky-700 text-white flex items-center gap-1.5 text-xs"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          {o.status === LabTestStatus.COMPLETED ? 'View Results' : 'Enter Results'}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Modal to Create Lab Order */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create New Laboratory Order"
        description="Select patient and test parameters from the lab catalog."
        size="lg"
      >
        <form onSubmit={handleCreateSubmit} className="space-y-4">
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
              <label className="block text-sm font-medium text-slate-700 mb-1">Ordering Physician</label>
              <Select
                value={selectedDoctorId}
                onChange={(e) => setSelectedDoctorId(e.target.value)}
              >
                {doctors.map((d: User) => (
                  <option key={d.id} value={d.id}>
                    Dr. {d.firstName} {d.lastName} ({d.department})
                  </option>
                ))}
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Select Test (Lab Catalog)</label>
              <Select
                value={selectedTestId}
                onChange={(e) => setSelectedTestId(e.target.value)}
              >
                <option value="">-- Select Lab Test --</option>
                {labTests.map((t: LabTest) => (
                  <option key={t.id} value={t.id}>
                    {t.name} ({t.category}) - ${t.cost}
                  </option>
                ))}
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Priority Level</label>
              <Select
                value={priority}
                onChange={(e) => setPriority(e.target.value as LabTestPriority)}
              >
                <option value={LabTestPriority.ROUTINE}>Routine</option>
                <option value={LabTestPriority.URGENT}>Urgent</option>
                <option value={LabTestPriority.STAT}>STAT (Immediate)</option>
              </Select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Clinical Indication / Symptoms</label>
            <Input
              type="text"
              placeholder="Reason for requesting test, provisional diagnosis..."
              value={clinicalNotes}
              onChange={(e) => setClinicalNotes(e.target.value)}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <Button type="button" variant="secondary" onClick={() => setIsCreateModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" className="bg-sky-600 text-white hover:bg-sky-700">
              Submit Lab Order
            </Button>
          </div>
        </form>
      </Modal>

      {/* Modal to Upload/View Lab Results */}
      <Modal
        isOpen={!!resultOrderTarget}
        onClose={() => setResultOrderTarget(null)}
        title="Lab Test Results"
        description={`Record findings for Order ${resultOrderTarget?.id?.slice(0, 10)} (${resultOrderTarget?.patientName})`}
      >
        <form onSubmit={handleSaveResult} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Measured Result Value</label>
            <Input
              type="text"
              placeholder="e.g. 13.8 g/dL, Negative, 98 mg/dL..."
              value={resultValue}
              onChange={(e) => setResultValue(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Result Interpretation</label>
            <Select
              value={resultInterpretation}
              onChange={(e) => setResultInterpretation(e.target.value)}
            >
              <option value="Normal">Normal (Within Reference Range)</option>
              <option value="Abnormal">Abnormal / Out of Range</option>
              <option value="Critical">Critical Value Alert</option>
            </Select>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <Button type="button" variant="secondary" onClick={() => setResultOrderTarget(null)}>
              Close
            </Button>
            <Button type="submit" className="bg-sky-600 text-white hover:bg-sky-700">
              Save Results
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
