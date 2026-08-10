import { useMemo } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useStore } from '../../store';
import { ProgramStatus, WaveStatus } from '../../types/enums';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../components/ui/Table';
import { EmptyState } from '../../components/ui/EmptyState';

const statusVariant: Record<ProgramStatus, 'default' | 'success' | 'warning' | 'danger' | 'info'> = {
  [ProgramStatus.DRAFT]: 'default',
  [ProgramStatus.ACTIVE]: 'success',
  [ProgramStatus.PAUSED]: 'warning',
  [ProgramStatus.ARCHIVED]: 'danger',
};

export default function ProgramDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const program = useStore((s) => s.programs.find((item) => item.id === id));
  const users = useStore((s) => s.users);
  const waves = useStore((s) => s.waves);
  const cases = useStore((s) => s.cases);
  const archiveProgram = useStore((s) => s.archiveProgram);

  const organizer = users.find((u) => u.id === program?.organizerId);

  const programWaves = useMemo(() => {
    return waves
      .filter((wave) => wave.programId === id)
      .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
  }, [waves, id]);

  const programCases = useMemo(() => {
    return cases
      .filter((c) => c.programId === id)
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  }, [cases, id]);

  if (!program) {
    return (
      <div className="max-w-4xl mx-auto py-12">
        <EmptyState
          icon={<span className="text-4xl">📁</span>}
          title="Program not found"
          description="Check the program list and try again."
        />
      </div>
    );
  }

  const handleArchive = () => {
    archiveProgram(program.id);
    navigate('/programs');
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{program.name}</h1>
          <p className="text-sm text-slate-500 mt-1">{program.description}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Badge variant={statusVariant[program.status]}>{program.status}</Badge>
          <Link to="/programs">
            <Button variant="secondary">Back to programs</Button>
          </Link>
          {program.status !== ProgramStatus.ARCHIVED && (
            <Button variant="danger" onClick={handleArchive}>
              Archive Program
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Organizer</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-slate-900 font-medium">{organizer ? `${organizer.firstName} ${organizer.lastName}` : 'Unknown'}</div>
            <div className="text-sm text-slate-500">{organizer?.department ?? 'Program lead'}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Waves</CardTitle>
          </CardHeader>
          <CardContent>{programWaves.length}</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Cases</CardTitle>
          </CardHeader>
          <CardContent>{programCases.length}</CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Program waves</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {programWaves.length === 0 ? (
            <EmptyState
              icon={<span className="text-4xl">🌊</span>}
              title="No waves yet"
              description="This program has not been assigned any operational waves yet."
            />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Wave</TableHead>
                  <TableHead>Date range</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Cases</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {programWaves.map((wave) => {
                  const waveCaseCount = cases.filter((item) => item.waveId === wave.id).length;
                  return (
                    <TableRow key={wave.id}>
                      <TableCell>
                        <Link to={`/waves/${wave.id}`} className="font-medium text-slate-900 hover:text-brand-600">
                          {wave.name}
                        </Link>
                        <div className="text-xs text-slate-500">{wave.description}</div>
                      </TableCell>
                      <TableCell>
                        {new Date(wave.startDate).toLocaleDateString()} - {new Date(wave.endDate).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Badge variant={wave.status === WaveStatus.ACTIVE ? 'success' : wave.status === WaveStatus.UPCOMING ? 'info' : wave.status === WaveStatus.CLOSED ? 'default' : 'danger'}>
                          {wave.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">{waveCaseCount}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Program cases</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {programCases.length === 0 ? (
            <EmptyState
              icon={<span className="text-4xl">🩺</span>}
              title="No cases yet"
              description="Create cases and assign them to program waves to track delivery."
            />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Case</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Wave</TableHead>
                  <TableHead>Complexity</TableHead>
                  <TableHead className="text-right">Assigned</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {programCases.map((theCase) => {
                  const wave = waves.find((w) => w.id === theCase.waveId);
                  return (
                    <TableRow key={theCase.id}>
                      <TableCell>
                        <Link to={`/cases/${theCase.id}`} className="font-medium text-slate-900 hover:text-brand-600">
                          {theCase.title}
                        </Link>
                        <div className="text-xs text-slate-500">{theCase.department}</div>
                      </TableCell>
                      <TableCell>{theCase.status}</TableCell>
                      <TableCell>{wave?.name ?? '-'}</TableCell>
                      <TableCell>{theCase.complexity}</TableCell>
                      <TableCell className="text-right">{theCase.assignedClinicianId ? 'Yes' : 'No'}</TableCell>
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
