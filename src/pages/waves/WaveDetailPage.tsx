import { useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useStore } from '../../store';
import { WaveStatus, CaseStatus } from '../../types/enums';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../components/ui/Table';
import { EmptyState } from '../../components/ui/EmptyState';

const STATUS_VARIANT: Record<WaveStatus, 'default' | 'success' | 'warning' | 'danger' | 'info'> = {
  [WaveStatus.UPCOMING]: 'info',
  [WaveStatus.ACTIVE]: 'success',
  [WaveStatus.CLOSED]: 'default',
  [WaveStatus.ARCHIVED]: 'danger',
};

export default function WaveDetailPage() {
  const { id } = useParams();
  const wave = useStore((s) => s.waves.find((item) => item.id === id));
  const programs = useStore((s) => s.programs);
  const cases = useStore((s) => s.cases);
  const setWaveStatus = useStore((s) => s.setWaveStatus);
  const autoRolloverCheck = useStore((s) => s.autoRolloverCheck);

  const program = programs.find((p) => p.id === wave?.programId);
  const waveCases = useMemo(() => cases.filter((c) => c.waveId === id), [cases, id]);
  const unresolvedCount = waveCases.filter((c) => [CaseStatus.OPEN, CaseStatus.ASSIGNED, CaseStatus.IN_PROGRESS].includes(c.status)).length;

  if (!wave) {
    return (
      <div className="max-w-4xl mx-auto py-12">
        <EmptyState
          icon={<span className="text-4xl">🌊</span>}
          title="Wave not found"
          description="Select a valid wave from the waves list."
        />
      </div>
    );
  }

  const handleSetActive = () => {
    setWaveStatus(wave.id, WaveStatus.ACTIVE);
  };

  const handleSetClosed = () => {
    setWaveStatus(wave.id, WaveStatus.CLOSED);
  };

  const handleArchive = () => {
    setWaveStatus(wave.id, WaveStatus.ARCHIVED);
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{wave.name}</h1>
          <p className="text-sm text-slate-500 mt-1">{wave.description}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Badge variant={STATUS_VARIANT[wave.status]}>{wave.status}</Badge>
          <Link to={`/programs/${program?.id}`}>
            <Button variant="secondary">View program</Button>
          </Link>
          {wave.status === WaveStatus.UPCOMING && (
            <Button variant="primary" onClick={handleSetActive}>
              Activate wave
            </Button>
          )}
          {wave.status === WaveStatus.ACTIVE && (
            <Button variant="warning" onClick={handleSetClosed}>
              Close wave
            </Button>
          )}
          {wave.status === WaveStatus.CLOSED && (
            <Button variant="danger" onClick={handleArchive}>
              Archive wave
            </Button>
          )}
          <Button variant="secondary" onClick={autoRolloverCheck}>
            Run rollover check
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Program</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-slate-900 font-medium">{program?.name ?? 'Unknown'}</div>
            <div className="text-sm text-slate-500">{program?.description}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Dates</CardTitle>
          </CardHeader>
          <CardContent>
            <div>{new Date(wave.startDate).toLocaleDateString()}</div>
            <div className="text-slate-500 text-sm">to {new Date(wave.endDate).toLocaleDateString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Open work</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-slate-900 font-medium">{waveCases.length} cases</div>
            <div className="text-slate-500 text-sm">{unresolvedCount} unresolved</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Wave cases</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {waveCases.length === 0 ? (
            <EmptyState
              icon={<span className="text-4xl">📋</span>}
              title="No cases assigned"
              description="This wave has no cases assigned yet."
            />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Case</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Complexity</TableHead>
                  <TableHead>Assigned</TableHead>
                  <TableHead className="text-right">Details</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {waveCases.map((theCase) => (
                  <TableRow key={theCase.id}>
                    <TableCell>
                      <Link to={`/cases/${theCase.id}`} className="font-medium text-slate-900 hover:text-brand-600">
                        {theCase.title}
                      </Link>
                      <div className="text-xs text-slate-500">{theCase.department}</div>
                    </TableCell>
                    <TableCell>{theCase.status}</TableCell>
                    <TableCell>{theCase.complexity}</TableCell>
                    <TableCell>{theCase.assignedClinicianId ? 'Yes' : 'No'}</TableCell>
                    <TableCell className="text-right">
                      <Link to={`/cases/${theCase.id}`} className="text-sm font-medium text-blue-600 hover:text-blue-800">
                        View
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
