import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search } from 'lucide-react';
import { useStore } from '../../store';
import { WaveStatus } from '../../types/enums';
import { Card, CardContent } from '../../components/ui/Card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../components/ui/Table';
import { Badge } from '../../components/ui/Badge';
import { Input } from '../../components/ui/Input';
import { EmptyState } from '../../components/ui/EmptyState';

const STATUS_VARIANT: Record<WaveStatus, 'default' | 'success' | 'warning' | 'danger' | 'info'> = {
  [WaveStatus.UPCOMING]: 'info',
  [WaveStatus.ACTIVE]: 'success',
  [WaveStatus.CLOSED]: 'default',
  [WaveStatus.ARCHIVED]: 'danger',
};

export default function WaveListPage() {
  const waves = useStore((s) => s.waves);
  const programs = useStore((s) => s.programs);
  const cases = useStore((s) => s.cases);
  const [search, setSearch] = useState('');

  const filteredWaves = useMemo(() => {
    return waves.filter((wave) => {
      const q = search.trim().toLowerCase();
      if (!q) return true;
      return (
        wave.name.toLowerCase().includes(q) ||
        (wave.description?.toLowerCase().includes(q) ?? false)
      );
    });
  }, [waves, search]);

  return (
    <div className="space-y-6 animate-fade-in max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Waves</h1>
          <p className="text-sm text-slate-500 mt-1">View and manage operational wave cycles for active programs.</p>
        </div>
        <div className="w-full sm:w-96">
          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search waves..."
            leftIcon={<Search className="w-4 h-4" />}
          />
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          {filteredWaves.length === 0 ? (
            <EmptyState
              icon={<Search className="w-10 h-10" />}
              title="No waves found"
              description="Search for wave cycles or create one from a program detail page."
            />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Wave</TableHead>
                  <TableHead>Program</TableHead>
                  <TableHead>Dates</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Cases</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredWaves.map((wave) => {
                  const program = programs.find((p) => p.id === wave.programId);
                  const caseCount = cases.filter((c) => c.waveId === wave.id).length;
                  return (
                    <TableRow key={wave.id}>
                      <TableCell>
                        <Link to={`/waves/${wave.id}`} className="font-medium text-slate-900 hover:text-brand-600">
                          {wave.name}
                        </Link>
                        <div className="text-xs text-slate-500">{wave.description}</div>
                      </TableCell>
                      <TableCell>{program?.name ?? 'Unknown'}</TableCell>
                      <TableCell>
                        {new Date(wave.startDate).toLocaleDateString()} - {new Date(wave.endDate).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Badge variant={STATUS_VARIANT[wave.status]}>{wave.status}</Badge>
                      </TableCell>
                      <TableCell className="text-right">{caseCount}</TableCell>
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
