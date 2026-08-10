import { useState, useMemo } from 'react';
import { useStore } from '../../store';
import { Card, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Modal } from '../../components/ui/Modal';
import { Textarea } from '../../components/ui/Textarea';
import { Badge } from '../../components/ui/Badge';
import { EmptyState } from '../../components/ui/EmptyState';
import { FileText, PlusCircle, Search, User, Calendar, Stethoscope } from 'lucide-react';
import { toast } from 'sonner';
import { Patient, User as UserModel, ClinicalNote } from '../../types/models';
import { Role } from '../../types/enums';

export default function ClinicalNotesPage() {
  const notes = useStore((s) => s.clinicalNotes || []);
  const patients = useStore((s) => s.patients || []);
  const users = useStore((s) => s.users || []);
  const addClinicalNote = useStore((s) => s.addClinicalNote);

  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // SOAP Form State
  const [selectedPatientId, setSelectedPatientId] = useState('');
  const [selectedDoctorId, setSelectedDoctorId] = useState('');
  const [title, setTitle] = useState('Routine Clinical Consultation');
  const [subjective, setSubjective] = useState('');
  const [objective, setObjective] = useState('');
  const [assessment, setAssessment] = useState('');
  const [plan, setPlan] = useState('');

  const doctors = useMemo(() => {
    return users.filter((u: UserModel) => u.role === 'DOCTOR' || u.role === 'CLINICIAN');
  }, [users]);

  const filteredNotes = useMemo(() => {
    return notes
      .map((note: ClinicalNote) => {
        const patient = patients.find((p: Patient) => p.id === note.patientId);
        const doctor = users.find((s: UserModel) => s.id === note.authorId);
        return {
          ...note,
          patientName: patient ? `${patient.firstName} ${patient.lastName}` : 'Unknown Patient',
          patientMrn: patient?.medicalRecordNumber || 'N/A',
          authorName: doctor ? `Dr. ${doctor.firstName} ${doctor.lastName}` : 'Attending Physician',
        };
      })
      .filter((note) => {
        const noteTitle = note.title || '';
        return (
          note.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          noteTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
          note.content?.toLowerCase().includes(searchTerm.toLowerCase())
        );
      });
  }, [notes, patients, users, searchTerm]);

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPatientId) {
      toast.error('Please select a patient');
      return;
    }

    const fullContent = `[Subjective]: ${subjective || 'Patient reports standard symptoms.'}\n[Objective]: ${objective || 'Vitals stable.'}\n[Assessment]: ${assessment || 'Diagnosis confirmed.'}\n[Plan]: ${plan || 'Follow up in 2 weeks.'}`;

    if (typeof addClinicalNote === 'function') {
      addClinicalNote({
        patientId: selectedPatientId,
        authorId: selectedDoctorId || doctors[0]?.id || 'doc-1',
        authorRole: Role.DOCTOR,
        title,
        content: fullContent,
        subjective,
        objective,
        assessment,
        plan,
        noteType: 'SOAP',
      });
    }

    toast.success('Clinical SOAP note saved successfully!');
    setIsModalOpen(false);
    setSelectedPatientId('');
    setSubjective('');
    setObjective('');
    setAssessment('');
    setPlan('');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <FileText className="w-7 h-7 text-indigo-600" />
            Clinical Notes & SOAP Logs
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Record physician consultations, SOAP progress notes, and diagnostic assessments.
          </p>
        </div>
        <Button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm"
        >
          <PlusCircle className="w-4 h-4" />
          Add SOAP Note
        </Button>
      </div>

      {/* Search Bar */}
      <Card className="p-4">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <Input
            type="text"
            placeholder="Search patient, diagnosis, note content..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
      </Card>

      {/* Notes Grid / List */}
      {filteredNotes.length === 0 ? (
        <Card>
          <CardContent className="py-12">
            <EmptyState
              title="No clinical notes recorded"
              description="No clinical notes match your current search criteria."
            />
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredNotes.map((note) => (
            <Card key={note.id} className="hover:shadow-md transition-shadow border-slate-200">
              <CardContent className="p-5 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-slate-900 text-base">{note.title || 'Clinical Note'}</h3>
                    <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                      <span className="flex items-center gap-1 font-medium text-slate-700">
                        <User className="w-3.5 h-3.5 text-indigo-500" />
                        {note.patientName}
                      </span>
                      <span>·</span>
                      <span className="flex items-center gap-1">
                        <Stethoscope className="w-3.5 h-3.5 text-slate-400" />
                        {note.authorName}
                      </span>
                    </div>
                  </div>
                  <Badge variant="brand">SOAP</Badge>
                </div>

                <div className="rounded-lg bg-slate-50 p-3 text-sm text-slate-700 space-y-2 border border-slate-100">
                  {note.subjective && (
                    <div>
                      <strong className="text-xs uppercase text-indigo-600 tracking-wider">Subjective: </strong>
                      <span>{note.subjective}</span>
                    </div>
                  )}
                  {note.assessment && (
                    <div>
                      <strong className="text-xs uppercase text-emerald-600 tracking-wider">Assessment: </strong>
                      <span>{note.assessment}</span>
                    </div>
                  )}
                  {note.plan && (
                    <div>
                      <strong className="text-xs uppercase text-amber-600 tracking-wider">Plan: </strong>
                      <span>{note.plan}</span>
                    </div>
                  )}
                  {!note.subjective && (
                    <p className="whitespace-pre-line">{note.content}</p>
                  )}
                </div>

                <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {new Date(note.createdAt || Date.now()).toLocaleDateString()}
                  </span>
                  <span>MRN: {note.patientMrn}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Modal to Add SOAP Note */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add New Clinical SOAP Note"
        description="Record structured Subjective, Objective, Assessment, and Plan details."
        size="xl"
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
              <label className="block text-sm font-medium text-slate-700 mb-1">Attending Physician</label>
              <Select
                value={selectedDoctorId}
                onChange={(e) => setSelectedDoctorId(e.target.value)}
              >
                {doctors.map((d: UserModel) => (
                  <option key={d.id} value={d.id}>
                    Dr. {d.firstName} {d.lastName} ({d.department})
                  </option>
                ))}
              </Select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Note Title</label>
            <Input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-indigo-700 mb-1 font-semibold">
                S - Subjective (Patient Symptoms & History)
              </label>
              <Textarea
                rows={3}
                placeholder="Patient complains of persistent cough, mild fever for 3 days..."
                value={subjective}
                onChange={(e) => setSubjective(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-blue-700 mb-1 font-semibold">
                O - Objective (Vitals & Clinical Examination)
              </label>
              <Textarea
                rows={3}
                placeholder="Temp: 38.2 C, BP: 124/82, HR: 78 bpm, Clear breath sounds..."
                value={objective}
                onChange={(e) => setObjective(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-emerald-700 mb-1 font-semibold">
                A - Assessment (Provisional / Final Diagnosis)
              </label>
              <Textarea
                rows={3}
                placeholder="Acute Upper Respiratory Tract Infection (URTI)..."
                value={assessment}
                onChange={(e) => setAssessment(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-amber-700 mb-1 font-semibold">
                P - Plan (Treatment, Prescriptions, Follow-up)
              </label>
              <Textarea
                rows={3}
                placeholder="Prescribed Amoxicillin 500mg, rest, fluids. Follow-up in 7 days..."
                value={plan}
                onChange={(e) => setPlan(e.target.value)}
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" className="bg-indigo-600 text-white hover:bg-indigo-700">
              Save Clinical Note
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
