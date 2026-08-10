import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search } from 'lucide-react';
import { useStore } from '../../store';
import { ProgramStatus } from '../../types/enums';
import { Card, CardContent } from '../../components/ui/Card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../components/ui/Table';
import { Badge } from '../../components/ui/Badge';
import { Input } from '../../components/ui/Input';
import { EmptyState } from '../../components/ui/EmptyState';

const PROGRAM_STATUS_VARIANTS: Record<ProgramStatus, 'default' | 'success' | 'warning' | 'danger' | 'info'> = {
  [ProgramStatus.DRAFT]: 'default',
  [ProgramStatus.ACTIVE]: 'success',
  [ProgramStatus.PAUSED]: 'warning',
  [ProgramStatus.ARCHIVED]: 'danger',
};

export default function ProgramListPage() {
  const programs = useStore((s) => s.programs);
  const waves = useStore((s) => s.waves);
  const cases = useStore((s) => s.cases);
  const users = useStore((s) => s.users);
  const [search, setSearch] = useState('');

  const filteredPrograms = useMemo(() => {
    return programs.filter((program) => {
      const query = search.trim().toLowerCase();
      if (!query) return true;
      return (
        program.name.toLowerCase().includes(query) ||
        (program.description?.toLowerCase().includes(query) ?? false)
      );
    });
  }, [programs, search]);

  const rows = useMemo(() => {
    return filteredPrograms.map((program) => {
      const programWaves = waves.filter((wave) => wave.programId === program.id);
      const programCases = cases.filter((c) => c.programId === program.id);
      const organizer = users.find((u) => u.id === program.organizerId);
      return {
        ...program,
        waveCount: programWaves.length,
        caseCount: programCases.length,
        organizerName: organizer ? `${organizer.firstName} ${organizer.lastName}` : 'Unknown',
      };
    });
  }, [filteredPrograms, waves, cases, users]);

  return (
    <div className="space-y-6 animate-fade-in max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Programs</h1>
          <p className="text-sm text-slate-500 mt-1">Manage hospital care programs, sprints, and participation waves.</p>
        </div>
        <div className="w-full sm:w-96">
          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search programs..."
            leftIcon={<Search className="w-4 h-4" />}
          />
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          {rows.length === 0 ? (
            <EmptyState
              icon={<Search className="w-10 h-10" />}
              title="No programs found"
              description="Try another search term or add a new program in the admin console."
            />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Program</TableHead>
                  <TableHead>Organizer</TableHead>
                  <TableHead>Waves</TableHead>
                  <TableHead>Cases</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Details</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((program) => (
                  <TableRow key={program.id}>
                    <TableCell>
                      <Link to={`/programs/${program.id}`} className="font-medium text-slate-900 hover:text-brand-600">
                        {program.name}
                      </Link>
                      <div className="text-xs text-slate-500">{program.description}</div>
                    </TableCell>
                    <TableCell>{program.organizerName}</TableCell>
                    <TableCell>{program.waveCount}</TableCell>
                    <TableCell>{program.caseCount}</TableCell>
                    <TableCell>
                      <Badge variant={PROGRAM_STATUS_VARIANTS[program.status]}>{program.status}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Link to={`/programs/${program.id}`} className="text-sm font-medium text-blue-600 hover:text-blue-800">
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
