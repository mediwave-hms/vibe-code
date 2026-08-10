import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search } from 'lucide-react';
import { useStore } from '../../store';
import { CaseStatus, CaseComplexity } from '../../types/enums';
import { Card, CardContent } from '../../components/ui/Card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../components/ui/Table';
import { Badge } from '../../components/ui/Badge';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Button } from '../../components/ui/Button';
import { EmptyState } from '../../components/ui/EmptyState';

const CASE_STATUS_VARIANT: Record<CaseStatus, 'default' | 'success' | 'warning' | 'danger' | 'info' | 'brand'> = {
  [CaseStatus.OPEN]: 'info',
  [CaseStatus.ASSIGNED]: 'warning',
  [CaseStatus.IN_PROGRESS]: 'brand',
  [CaseStatus.RESOLVED]: 'success',
  [CaseStatus.CLOSED]: 'default',
  [CaseStatus.ROLLED_OVER]: 'danger',
  [CaseStatus.CANCELLED]: 'danger',
};

export default function CaseListPage() {
  const cases = useStore((s) => s.cases);
  const programs = useStore((s) => s.programs);
  const waves = useStore((s) => s.waves);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [complexityFilter, setComplexityFilter] = useState('');

  const filteredCases = useMemo(() => {
    return cases.filter((theCase) => {
      const q = search.trim().toLowerCase();
      if (q) {
        const content = `${theCase.title} ${theCase.description}`.toLowerCase();
        if (!content.includes(q)) return false;
      }
      if (statusFilter && theCase.status !== statusFilter) return false;
      if (complexityFilter && theCase.complexity !== complexityFilter) return false;
      return true;
    });
  }, [cases, search, statusFilter, complexityFilter]);

  return (
    <div className="space-y-6 animate-fade-in max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Cases</h1>
          <p className="text-sm text-slate-500 mt-1">Review active case work, assignments, and clinical progress.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <Link to="/cases/new">
            <Button leftIcon={<Search className="w-4 h-4" />}>New Case</Button>
          </Link>
        </div>
      </div>

      <Card>
        <CardContent className="pt-5">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search cases..."
                leftIcon={<Search className="w-4 h-4" />}
              />
            </div>
            <div>
              <Select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
                <option value="">All statuses</option>
                {Object.values(CaseStatus).map((status) => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </Select>
            </div>
            <div>
              <Select value={complexityFilter} onChange={(event) => setComplexityFilter(event.target.value)}>
                <option value="">All complexities</option>
                {Object.values(CaseComplexity).map((complexity) => (
                  <option key={complexity} value={complexity}>{complexity}</option>
                ))}
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          {filteredCases.length === 0 ? (
            <EmptyState
              icon={<span className="text-4xl">📂</span>}
              title="No cases found"
              description="Refine search filters or add a new case to get started."
            />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Case</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Program / Wave</TableHead>
                  <TableHead>Complexity</TableHead>
                  <TableHead className="text-right">Details</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCases.map((theCase) => {
                  const program = programs.find((p) => p.id === theCase.programId);
                  const wave = waves.find((w) => w.id === theCase.waveId);
                  return (
                    <TableRow key={theCase.id}>
                      <TableCell>
                        <Link to={`/cases/${theCase.id}`} className="font-medium text-slate-900 hover:text-brand-600">
                          {theCase.title}
                        </Link>
                        <div className="text-xs text-slate-500">{theCase.department}</div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={CASE_STATUS_VARIANT[theCase.status]}>{theCase.status}</Badge>
                      </TableCell>
                      <TableCell>
                        <div>{program?.name ?? 'Unknown program'}</div>
                        <div className="text-xs text-slate-500">{wave?.name ?? 'No wave'}</div>
                      </TableCell>
                      <TableCell>{theCase.complexity}</TableCell>
                      <TableCell className="text-right">
                        <Link to={`/cases/${theCase.id}`} className="text-sm font-medium text-blue-600 hover:text-blue-800">
                          View
                        </Link>
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
