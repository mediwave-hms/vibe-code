import { useParams, Link } from 'react-router-dom';
import { useStore } from '../../store';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { EmptyState } from '../../components/ui/EmptyState';
import { Button } from '../../components/ui/Button';

export default function StaffDetailPage() {
  const { id } = useParams();
  const staff = useStore((s) => s.getStaffById(id ?? ''));
  const appointments = useStore((s) => s.appointments.filter((apt) => apt.doctorId === id));
  const staffCases = useStore((s) => s.cases.filter((c) => c.assignedClinicianId === id));

  if (!staff) {
    return (
      <div className="max-w-4xl mx-auto py-12">
        <EmptyState
          icon={<span className="text-4xl">👤</span>}
          title="Staff member not found"
          description="Select a staff member from the directory to view details."
        />
      </div>
    );
  }

  const totalAppointments = appointments.length;
  const assignedCases = staffCases.length;

  return (
    <div className="space-y-6 animate-fade-in max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{staff.firstName} {staff.lastName}</h1>
          <p className="text-sm text-slate-500 mt-1">{staff.role} in {staff.department ?? 'General'}.</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={staff.isActive ? 'success' : 'default'}>{staff.isActive ? 'Active' : 'Inactive'}</Badge>
          <Link to="/staff">
            <Button variant="secondary">Back to staff</Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm text-slate-700">
              <div>Email: {staff.email}</div>
              <div>Phone: {staff.phone ?? 'N/A'}</div>
              <div>License: {staff.licenseNumber ?? 'N/A'}</div>
              <div>Shift: {staff.shift ?? 'N/A'}</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Workload</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div>Total appointments</div>
              <div className="text-2xl font-semibold text-slate-900">{totalAppointments}</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Assigned cases</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold text-slate-900">{assignedCases}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Assigned cases</CardTitle>
        </CardHeader>
        <CardContent>
          {staffCases.length === 0 ? (
            <p className="text-sm text-slate-500">No cases currently assigned to this staff member.</p>
          ) : (
            <div className="space-y-3">
              {staffCases.map((theCase) => (
                <div key={theCase.id} className="rounded-xl border border-slate-200 p-4 bg-white">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <Link to={`/cases/${theCase.id}`} className="font-medium text-slate-900 hover:text-brand-600">
                        {theCase.title}
                      </Link>
                      <div className="text-xs text-slate-500">{theCase.department}</div>
                    </div>
                    <Badge variant={theCase.status === 'RESOLVED' ? 'success' : theCase.status === 'CLOSED' ? 'default' : 'warning'}>{theCase.status}</Badge>
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
