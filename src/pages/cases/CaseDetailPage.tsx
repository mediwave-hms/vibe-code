import { useMemo, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useStore } from '../../store';
import { CaseStatus, ApplicationStatus } from '../../types/enums';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../components/ui/Table';
import { EmptyState } from '../../components/ui/EmptyState';

export default function CaseDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const theCase = useStore((s) => s.cases.find((item) => item.id === id));
  const waves = useStore((s) => s.waves);
  const programs = useStore((s) => s.programs);
  const users = useStore((s) => s.users);
  const applications = useStore((s) => s.caseApplications.filter((app) => app.caseId === id));
  const resolveCase = useStore((s) => s.resolveCase);
  const closeCase = useStore((s) => s.closeCase);
  const acceptApplication = useStore((s) => s.acceptApplication);
  const rejectApplication = useStore((s) => s.rejectApplication);
  const [rejectionText] = useState<Record<string, string>>({});

  const assignedClinician = useMemo(
    () => users.find((user) => user.id === theCase?.assignedClinicianId),
    [users, theCase]
  );

  const program = useMemo(() => programs.find((item) => item.id === theCase?.programId), [programs, theCase]);
  const wave = useMemo(() => waves.find((item) => item.id === theCase?.waveId), [waves, theCase]);

  if (!theCase) {
    return (
      <div className="max-w-4xl mx-auto py-12">
        <EmptyState
          icon={<span className="text-4xl">📄</span>}
          title="Case not found"
          description="Select a valid case from the list to view its details."
        />
      </div>
    );
  }

  const handleResolve = () => {
    resolveCase(theCase.id);
    navigate('/cases');
  };

  const handleClose = () => {
    closeCase(theCase.id);
    navigate('/cases');
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{theCase.title}</h1>
          <p className="text-sm text-slate-500 mt-1">{theCase.description}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Badge variant={
            theCase.status === CaseStatus.OPEN ? 'info' :
            theCase.status === CaseStatus.ASSIGNED ? 'warning' :
            theCase.status === CaseStatus.IN_PROGRESS ? 'brand' :
            theCase.status === CaseStatus.RESOLVED ? 'success' :
            theCase.status === CaseStatus.CLOSED ? 'default' : 'danger'
          }>{theCase.status}</Badge>
          <Link to="/cases">
            <Button variant="secondary">Back to cases</Button>
          </Link>
          {(theCase.status === CaseStatus.OPEN || theCase.status === CaseStatus.IN_PROGRESS) && (
            <Button variant="primary" onClick={handleResolve}>Resolve</Button>
          )}
          {theCase.status === CaseStatus.RESOLVED && (
            <Button variant="danger" onClick={handleClose}>Close</Button>
          )}
          {theCase.status === CaseStatus.CLOSED && (
            <Button variant="secondary" onClick={() => navigate(`/reviews/submit/${theCase.id}`)}>
              Add review
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Program</CardTitle>
          </CardHeader>
          <CardContent>
            <div>{program?.name ?? 'Unknown'}</div>
            {program && <div className="text-xs text-slate-500">{program.description}</div>}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Wave</CardTitle>
          </CardHeader>
          <CardContent>
            <div>{wave?.name ?? 'Unassigned'}</div>
            {wave && <div className="text-xs text-slate-500">{new Date(wave.startDate).toLocaleDateString()} - {new Date(wave.endDate).toLocaleDateString()}</div>}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Assigned clinician</CardTitle>
          </CardHeader>
          <CardContent>
            <div>{assignedClinician ? `${assignedClinician.firstName} ${assignedClinician.lastName}` : 'Not assigned'}</div>
            {assignedClinician && <div className="text-xs text-slate-500">{assignedClinician.specialization ?? assignedClinician.role}</div>}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Case details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-slate-500">Complexity</p>
              <div className="font-medium text-slate-900">{theCase.complexity}</div>
            </div>
            <div>
              <p className="text-sm text-slate-500">Priority</p>
              <div className="font-medium text-slate-900">{theCase.priority ?? 'Standard'}</div>
            </div>
            <div>
              <p className="text-sm text-slate-500">Points</p>
              <div className="font-medium text-slate-900">{theCase.points}</div>
            </div>
            <div>
              <p className="text-sm text-slate-500">Tags</p>
              <div className="flex flex-wrap gap-2">
                {(theCase.tags || []).map((tag) => (
                  <Badge key={tag} variant="info">{tag}</Badge>
                ))}
                {!(theCase.tags?.length) && <span className="text-slate-500 text-sm">No tags</span>}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Applications</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {applications.length === 0 ? (
            <EmptyState
              icon={<span className="text-4xl">📝</span>}
              title="No applications yet"
              description="Clinicians can apply to support this case from the queue."
            />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Clinician</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Note</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {applications.map((application) => {
                  const clinician = users.find((user) => user.id === application.clinicianId);
                  return (
                    <TableRow key={application.id}>
                      <TableCell>
                        <div className="font-medium text-slate-900">{clinician ? `${clinician.firstName} ${clinician.lastName}` : 'Unknown'}</div>
                        <div className="text-xs text-slate-500">{clinician?.specialization ?? clinician?.role}</div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={application.status === ApplicationStatus.ACCEPTED ? 'success' : application.status === ApplicationStatus.REJECTED ? 'danger' : application.status === ApplicationStatus.ACTIVE ? 'info' : 'default'}>
                          {application.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{application.coverNote ?? '-'}</TableCell>
                      <TableCell className="text-right">
                        {application.status === ApplicationStatus.ACTIVE && (
                          <div className="flex items-center justify-end gap-2">
                            <Button size="sm" variant="primary" onClick={() => acceptApplication(theCase.id, application.id)}>
                              Accept
                            </Button>
                            <Button size="sm" variant="danger" onClick={() => rejectApplication(application.id, rejectionText[application.id] ?? 'Not suitable')}>
                              Reject
                            </Button>
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
