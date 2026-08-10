import { Link, useParams } from 'react-router-dom';
import { useStore } from '../../store';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { EmptyState } from '../../components/ui/EmptyState';
import { Button } from '../../components/ui/Button';

export default function PatientDetailPage() {
  const { id } = useParams();
  const patient = useStore((s) => s.patients.find((item) => item.id === id));
  const appointments = useStore((s) => s.appointments.filter((appointment) => appointment.patientId === id));
  const cases = useStore((s) => s.cases.filter((theCase) => theCase.patientId === id));

  if (!patient) {
    return (
      <div className="max-w-4xl mx-auto py-12">
        <EmptyState
          icon={<span className="text-4xl">👤</span>}
          title="Patient not found"
          description="Select a patient from the list to view the medical record."
        />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{patient.firstName} {patient.lastName}</h1>
          <p className="text-sm text-slate-500 mt-1">{patient.condition ?? 'Patient care profile'}</p>
        </div>
        <div className="flex gap-2">
          <Badge variant={patient.isActive ? 'success' : 'default'}>{patient.isActive ? 'Active' : 'Inactive'}</Badge>
          <Link to="/patients">
            <Button variant="secondary">Back to patients</Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Contact</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm text-slate-700">
              <div>Email: {patient.email ?? 'N/A'}</div>
              <div>Phone: {patient.phone ?? 'N/A'}</div>
              <div>Address: {patient.address ?? 'N/A'}</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Patient summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm text-slate-700">
              <div>Age: {patient.age ?? 'N/A'}</div>
              <div>Gender: {patient.gender ?? 'N/A'}</div>
              <div>Insurance: {patient.insuranceProvider ?? 'N/A'}</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm text-slate-700">
              <div>Upcoming appointments: {appointments.filter((apt) => new Date(apt.appointmentDate) >= new Date()).length}</div>
              <div>Open cases: {cases.filter((theCase) => theCase.status !== 'CLOSED').length}</div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent appointments</CardTitle>
        </CardHeader>
        <CardContent>
          {appointments.length === 0 ? (
            <p className="text-sm text-slate-500">No appointments have been scheduled for this patient yet.</p>
          ) : (
            <div className="space-y-3">
              {appointments.slice(0, 5).map((appointment) => (
                <div key={appointment.id} className="rounded-xl border border-slate-200 p-4 bg-white">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="font-medium text-slate-900">{appointment.title}</p>
                      <p className="text-xs text-slate-500">{new Date(appointment.appointmentDate).toLocaleDateString()} • {appointment.visitType}</p>
                    </div>
                    <Badge variant="info">{appointment.department}</Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Active cases</CardTitle>
        </CardHeader>
        <CardContent>
          {cases.length === 0 ? (
            <p className="text-sm text-slate-500">No active cases for this patient yet.</p>
          ) : (
            <div className="space-y-3">
              {cases.slice(0, 5).map((theCase) => (
                <div key={theCase.id} className="rounded-xl border border-slate-200 p-4 bg-white">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <Link to={`/cases/${theCase.id}`} className="font-medium text-slate-900 hover:text-brand-600">
                        {theCase.title}
                      </Link>
                      <p className="text-xs text-slate-500">{theCase.department}</p>
                    </div>
                    <Badge variant={theCase.status === 'CLOSED' ? 'default' : 'warning'}>{theCase.status}</Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
