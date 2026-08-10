import { useState, useMemo } from 'react';
import { useStore } from '../../store';
import { Card, CardContent } from '../../components/ui/Card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../components/ui/Table';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Modal } from '../../components/ui/Modal';
import { Textarea } from '../../components/ui/Textarea';
import { EmptyState } from '../../components/ui/EmptyState';
import { BedDouble, UserPlus, LogOut, Search, Filter } from 'lucide-react';
import { toast } from 'sonner';
import { AdmissionStatus, Department, DischargeStatus } from '../../types/enums';
import { User, Patient, Room } from '../../types/models';

export default function AdmissionListPage() {
  const admissions = useStore((s) => s.admissions || []);
  const patients = useStore((s) => s.patients || []);
  const rooms = useStore((s) => s.rooms || []);
  const users = useStore((s) => s.users || []);
  const admitPatient = useStore((s) => s.admitPatient);
  const dischargePatient = useStore((s) => s.dischargePatient);

  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  // Admit Modal State
  const [isAdmitModalOpen, setIsAdmitModalOpen] = useState(false);
  const [selectedPatientId, setSelectedPatientId] = useState('');
  const [selectedRoomId, setSelectedRoomId] = useState('');
  const [selectedDept, setSelectedDept] = useState<Department>(Department.GENERAL_MEDICINE);
  const [admittingDoctorId, setAdmittingDoctorId] = useState('');
  const [admittingDiagnosis, setAdmittingDiagnosis] = useState('');

  // Discharge Modal State
  const [dischargeTargetId, setDischargeTargetId] = useState<string | null>(null);
  const [dischargeStatus, setDischargeStatus] = useState<DischargeStatus>(DischargeStatus.RECOVERED);
  const [dischargeSummary, setDischargeSummary] = useState('');

  const doctors = useMemo(() => {
    return users.filter((u: User) => u.role === 'DOCTOR' || u.role === 'CLINICIAN');
  }, [users]);

  const availableRooms = useMemo(() => {
    return rooms.filter((r: Room) => r.currentOccupancy < r.capacity);
  }, [rooms]);

  const filteredAdmissions = useMemo(() => {
    return admissions
      .map((admission) => {
        const patient = patients.find((p: Patient) => p.id === admission.patientId);
        const room = rooms.find((r: Room) => r.id === admission.roomId);
        const doctor = users.find((s: User) => s.id === admission.attendingDoctorId || s.id === admission.doctorId);
        return {
          ...admission,
          patientName: patient ? `${patient.firstName} ${patient.lastName}` : 'Unknown Patient',
          patientMrn: patient?.medicalRecordNumber || 'N/A',
          roomNumber: room ? `Room ${room.roomNumber} (${room.type})` : 'Unassigned',
          doctorName: doctor ? `Dr. ${doctor.firstName} ${doctor.lastName}` : 'Unassigned',
        };
      })
      .filter((adm) => {
        const matchesSearch =
          adm.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          adm.patientMrn.toLowerCase().includes(searchTerm.toLowerCase()) ||
          adm.roomNumber.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'ALL' || adm.status === statusFilter;
        return matchesSearch && matchesStatus;
      });
  }, [admissions, patients, rooms, users, searchTerm, statusFilter]);

  const handleAdmitSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPatientId) {
      toast.error('Please select a patient to admit');
      return;
    }
    const patient = patients.find((p: Patient) => p.id === selectedPatientId);
    const room = rooms.find((r: Room) => r.id === selectedRoomId);

    admitPatient({
      patientId: selectedPatientId,
      doctorId: admittingDoctorId || doctors[0]?.id || 'doc-1',
      attendingDoctorId: admittingDoctorId || doctors[0]?.id || 'doc-1',
      roomId: selectedRoomId || undefined,
      department: selectedDept,
      admissionType: 'ELECTIVE',
      isSurgical: false,
      reasonForAdmission: admittingDiagnosis || 'Medical observation & treatment',
      preliminaryDiagnosis: admittingDiagnosis || 'Routine Inpatient Admission',
    });

    toast.success(
      `Patient ${patient ? `${patient.firstName} ${patient.lastName}` : ''} admitted successfully ${
        room ? `to Room ${room.roomNumber}` : ''
      }!`
    );

    setIsAdmitModalOpen(false);
    setSelectedPatientId('');
    setSelectedRoomId('');
    setAdmittingDiagnosis('');
  };

  const handleDischargeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!dischargeTargetId) return;

    dischargePatient(dischargeTargetId, {
      dischargeStatus,
      dischargeSummary: dischargeSummary || 'Patient discharged in stable condition.',
    });

    toast.success('Patient discharged successfully!');
    setDischargeTargetId(null);
    setDischargeSummary('');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <BedDouble className="w-7 h-7 text-brand-600" />
            Admissions Management
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Monitor and manage inpatient admissions, ward beds, and patient discharges.
          </p>
        </div>
        <Button
          onClick={() => setIsAdmitModalOpen(true)}
          className="flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white shadow-sm"
        >
          <UserPlus className="w-4 h-4" />
          Admit New Patient
        </Button>
      </div>

      {/* Filter & Search Bar */}
      <Card className="p-4">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <Input
              type="text"
              placeholder="Search by patient name, MRN, room..."
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
              <option value={AdmissionStatus.ADMITTED}>Admitted</option>
              <option value={AdmissionStatus.PENDING}>Pending</option>
              <option value={AdmissionStatus.DISCHARGED}>Discharged</option>
              <option value={AdmissionStatus.TRANSFERRED}>Transferred</option>
            </Select>
          </div>
        </div>
      </Card>

      {/* Admissions Table */}
      <Card>
        <CardContent className="p-0">
          {filteredAdmissions.length === 0 ? (
            <EmptyState
              title="No admissions found"
              description="No admissions match your current search or filter parameters."
            />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Patient</TableHead>
                  <TableHead>MRN</TableHead>
                  <TableHead>Room / Ward</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Attending Doctor</TableHead>
                  <TableHead>Admission Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAdmissions.map((adm) => (
                  <TableRow key={adm.id} className="hover:bg-slate-50/80 transition-colors">
                    <TableCell className="font-medium text-slate-900">{adm.patientName}</TableCell>
                    <TableCell className="font-mono text-xs text-slate-500">{adm.patientMrn}</TableCell>
                    <TableCell>{adm.roomNumber}</TableCell>
                    <TableCell>
                      <Badge variant="brand">{adm.department.replace(/_/g, ' ')}</Badge>
                    </TableCell>
                    <TableCell className="text-slate-700">{adm.doctorName}</TableCell>
                    <TableCell className="text-slate-600 text-sm">
                      {new Date(adm.admissionDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          adm.status === AdmissionStatus.ADMITTED
                            ? 'success'
                            : adm.status === AdmissionStatus.PENDING
                            ? 'warning'
                            : 'secondary'
                        }
                      >
                        {adm.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      {adm.status === AdmissionStatus.ADMITTED && (
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => setDischargeTargetId(adm.id)}
                          className="text-rose-600 hover:bg-rose-50 flex items-center gap-1.5 ml-auto text-xs"
                        >
                          <LogOut className="w-3.5 h-3.5" />
                          Discharge
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

      {/* Admit Patient Modal */}
      <Modal
        isOpen={isAdmitModalOpen}
        onClose={() => setIsAdmitModalOpen(false)}
        title="Admit New Patient"
        description="Select a registered patient and assign them to an available hospital ward/room."
        size="lg"
      >
        <form onSubmit={handleAdmitSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Select Patient *</label>
            <Select
              value={selectedPatientId}
              onChange={(e) => setSelectedPatientId(e.target.value)}
              required
            >
              <option value="">-- Select Patient --</option>
              {patients.map((p: Patient) => (
                <option key={p.id} value={p.id}>
                  {p.firstName} {p.lastName} (MRN: {p.medicalRecordNumber})
                </option>
              ))}
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Assign Room/Bed</label>
              <Select value={selectedRoomId} onChange={(e) => setSelectedRoomId(e.target.value)}>
                <option value="">-- Select Room (Optional) --</option>
                {availableRooms.map((r: Room) => (
                  <option key={r.id} value={r.id}>
                    Room {r.roomNumber} ({r.type}) - {r.capacity - r.currentOccupancy} free
                  </option>
                ))}
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Department</label>
              <Select
                value={selectedDept}
                onChange={(e) => setSelectedDept(e.target.value as Department)}
              >
                {Object.values(Department).map((d) => (
                  <option key={d} value={d}>
                    {d.replace(/_/g, ' ')}
                  </option>
                ))}
              </Select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Attending Physician</label>
            <Select
              value={admittingDoctorId}
              onChange={(e) => setAdmittingDoctorId(e.target.value)}
            >
              <option value="">-- Select Physician --</option>
              {doctors.map((d: User) => (
                <option key={d.id} value={d.id}>
                  Dr. {d.firstName} {d.lastName} ({d.department})
                </option>
              ))}
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Admitting Diagnosis / Notes</label>
            <Textarea
              rows={3}
              placeholder="Primary diagnosis or reason for hospitalization..."
              value={admittingDiagnosis}
              onChange={(e) => setAdmittingDiagnosis(e.target.value)}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <Button type="button" variant="secondary" onClick={() => setIsAdmitModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" className="bg-brand-600 text-white hover:bg-brand-700">
              Confirm Admission
            </Button>
          </div>
        </form>
      </Modal>

      {/* Discharge Patient Modal */}
      <Modal
        isOpen={!!dischargeTargetId}
        onClose={() => setDischargeTargetId(null)}
        title="Discharge Patient"
        description="Process patient discharge and release assigned ward bed back into available inventory."
      >
        <form onSubmit={handleDischargeSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Discharge Condition / Status</label>
            <Select
              value={dischargeStatus}
              onChange={(e) => setDischargeStatus(e.target.value as DischargeStatus)}
            >
              {Object.values(DischargeStatus).map((st) => (
                <option key={st} value={st}>
                  {st.replace(/_/g, ' ')}
                </option>
              ))}
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Discharge Summary & Instructions</label>
            <Textarea
              rows={3}
              placeholder="Enter patient recovery summary, medication instructions, and follow-up plan..."
              value={dischargeSummary}
              onChange={(e) => setDischargeSummary(e.target.value)}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <Button type="button" variant="secondary" onClick={() => setDischargeTargetId(null)}>
              Cancel
            </Button>
            <Button type="submit" className="bg-rose-600 text-white hover:bg-rose-700">
              Complete Discharge
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
