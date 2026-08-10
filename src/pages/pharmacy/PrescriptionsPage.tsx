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
import { Pill, PlusCircle, CheckCircle, Search, Filter } from 'lucide-react';
import { toast } from 'sonner';
import { PrescriptionStatus, MedicationForm } from '../../types/enums';
import { Patient, User, Medication } from '../../types/models';

export default function PrescriptionsPage() {
  const prescriptions = useStore((s) => s.prescriptions || []);
  const patients = useStore((s) => s.patients || []);
  const users = useStore((s) => s.users || []);
  const medications = useStore((s) => s.medications || []);
  const addPrescription = useStore((s) => s.addPrescription);
  const dispensePrescription = useStore((s) => s.dispensePrescription);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPatientId, setSelectedPatientId] = useState('');
  const [selectedDoctorId, setSelectedDoctorId] = useState('');
  const [selectedDrugId, setSelectedDrugId] = useState('');
  const [dosage, setDosage] = useState('500mg');
  const [frequency, setFrequency] = useState('Twice daily after meals');
  const [durationDays, setDurationDays] = useState(7);
  const [quantity, setQuantity] = useState(14);
  const [instructions, setInstructions] = useState('');

  const doctors = useMemo(() => {
    return users.filter((u: User) => u.role === 'DOCTOR' || u.role === 'CLINICIAN');
  }, [users]);

  const filteredPrescriptions = useMemo(() => {
    return prescriptions
      .map((p) => {
        const patient = patients.find((pt: Patient) => pt.id === p.patientId);
        const doctor = users.find((st: User) => st.id === p.doctorId);
        return {
          ...p,
          patientName: patient ? `${patient.firstName} ${patient.lastName}` : p.patientId || 'Unknown Patient',
          patientMrn: patient?.medicalRecordNumber || 'N/A',
          doctorName: doctor ? `Dr. ${doctor.firstName} ${doctor.lastName}` : 'Attending Physician',
        };
      })
      .filter((p) => {
        const matchesSearch =
          p.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.patientMrn.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.id.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'ALL' || p.status === statusFilter;
        return matchesSearch && matchesStatus;
      });
  }, [prescriptions, patients, users, searchTerm, statusFilter]);

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPatientId) {
      toast.error('Please select a patient');
      return;
    }
    const drug = medications.find((i: Medication) => i.id === selectedDrugId);
    const medicationName = drug ? drug.name : 'Amoxicillin 500mg';

    addPrescription({
      patientId: selectedPatientId,
      doctorId: selectedDoctorId || doctors[0]?.id || 'doc-1',
      issuedDate: new Date(),
      status: PrescriptionStatus.ACTIVE,
      items: [
        {
          medicationId: selectedDrugId || undefined,
          medicationName,
          form: drug?.form || MedicationForm.TABLET,
          dosage,
          strength: dosage,
          frequency,
          duration: `${durationDays} days`,
          quantity,
          instructions,
          isPRN: false,
        },
      ],
      notes: instructions,
    });

    toast.success(`Prescription issued successfully for ${medicationName}!`);
    setIsModalOpen(false);
    setSelectedPatientId('');
    setInstructions('');
  };

  const handleDispense = (prescriptionId: string) => {
    if (typeof dispensePrescription === 'function') {
      dispensePrescription(prescriptionId, 'ph-1');
    }
    toast.success('Medication dispensed and inventory stock updated!');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Pill className="w-7 h-7 text-emerald-600" />
            Prescription Management
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Issue electronic prescriptions, dispense medications, and verify inventory stock.
          </p>
        </div>
        <Button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm"
        >
          <PlusCircle className="w-4 h-4" />
          Issue New Prescription
        </Button>
      </div>

      {/* Filter & Search Bar */}
      <Card className="p-4">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <Input
              type="text"
              placeholder="Search patient name, Rx ID..."
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
              <option value={PrescriptionStatus.ACTIVE}>Active</option>
              <option value={PrescriptionStatus.DISPENSED}>Dispensed</option>
              <option value={PrescriptionStatus.DRAFT}>Draft</option>
              <option value={PrescriptionStatus.CANCELLED}>Cancelled</option>
            </Select>
          </div>
        </div>
      </Card>

      {/* Prescriptions Table */}
      <Card>
        <CardContent className="p-0">
          {filteredPrescriptions.length === 0 ? (
            <EmptyState
              title="No prescriptions found"
              description="No prescriptions match your current search or status filter."
            />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Rx Code</TableHead>
                  <TableHead>Patient</TableHead>
                  <TableHead>Prescribing Physician</TableHead>
                  <TableHead>Issue Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPrescriptions.map((p) => (
                  <TableRow key={p.id} className="hover:bg-slate-50/80 transition-colors">
                    <TableCell className="font-mono text-xs font-semibold text-slate-700">
                      {p.id.slice(0, 10)}
                    </TableCell>
                    <TableCell className="font-medium text-slate-900">{p.patientName}</TableCell>
                    <TableCell className="text-slate-700">{p.doctorName}</TableCell>
                    <TableCell className="text-slate-500 text-sm">
                      {p.issuedDate ? new Date(p.issuedDate).toLocaleDateString() : 'Today'}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          p.status === PrescriptionStatus.DISPENSED
                            ? 'success'
                            : p.status === PrescriptionStatus.ACTIVE
                            ? 'brand'
                            : 'secondary'
                        }
                      >
                        {p.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      {p.status !== PrescriptionStatus.DISPENSED && (
                        <Button
                          size="sm"
                          onClick={() => handleDispense(p.id)}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-1.5 ml-auto text-xs"
                        >
                          <CheckCircle className="w-3.5 h-3.5" />
                          Dispense Medication
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

      {/* Modal to Issue Prescription */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Issue Electronic Prescription"
        description="Create an authorized medical prescription for an active patient."
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
              <label className="block text-sm font-medium text-slate-700 mb-1">Prescribing Physician</label>
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

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Select Drug (Pharmacy Inventory)</label>
            <Select
              value={selectedDrugId}
              onChange={(e) => setSelectedDrugId(e.target.value)}
            >
              <option value="">-- Select Drug --</option>
              {medications.map((item: Medication) => (
                <option key={item.id} value={item.id}>
                  {item.name} ({item.strength}) - Stock: {item.stockQuantity}
                </option>
              ))}
            </Select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Dosage</label>
              <Input
                type="text"
                placeholder="e.g. 500mg, 1 tablet"
                value={dosage}
                onChange={(e) => setDosage(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Duration (Days)</label>
              <Input
                type="number"
                value={durationDays}
                onChange={(e) => setDurationDays(parseInt(e.target.value) || 1)}
                min={1}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Quantity</label>
              <Input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                min={1}
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Frequency & Dosage Instructions</label>
            <Input
              type="text"
              placeholder="e.g. 1 capsule twice daily after meals"
              value={frequency}
              onChange={(e) => setFrequency(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Special Physician Notes / Precautions</label>
            <Input
              type="text"
              placeholder="Take with food, avoid alcohol, finish full course..."
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" className="bg-emerald-600 text-white hover:bg-emerald-700">
              Issue Prescription
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
