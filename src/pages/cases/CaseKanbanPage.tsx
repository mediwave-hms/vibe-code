import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../../store';
import { CaseStatus } from '../../types/enums';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';

const columns: Array<{ key: CaseStatus; title: string }> = [
  { key: CaseStatus.OPEN, title: 'Open' },
  { key: CaseStatus.ASSIGNED, title: 'Assigned' },
  { key: CaseStatus.IN_PROGRESS, title: 'In Progress' },
  { key: CaseStatus.RESOLVED, title: 'Resolved' },
  { key: CaseStatus.CLOSED, title: 'Closed' },
];

export default function CaseKanbanPage() {
  const cases = useStore((s) => s.cases);

  const grouped = useMemo(() => {
    return columns.reduce((acc, column) => {
      acc[column.key] = cases.filter((theCase) => theCase.status === column.key);
      return acc;
    }, {} as Record<CaseStatus, typeof cases>);
  }, [cases]);

  return (
    <div className="space-y-6 animate-fade-in max-w-full mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Case Kanban</h1>
        <p className="text-sm text-slate-500 mt-1">Track clinical case work across status columns.</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-5 gap-4">
        {columns.map((column) => (
          <div key={column.key} className="space-y-3">
            <div className="text-sm font-semibold text-slate-700">{column.title} ({grouped[column.key]?.length ?? 0})</div>
            <div className="space-y-3">
              {grouped[column.key]?.map((theCase) => (
                <Card key={theCase.id} className="p-4 border border-slate-200 bg-white shadow-sm">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <Link to={`/cases/${theCase.id}`} className="font-medium text-slate-900 hover:text-brand-600">
                        {theCase.title}
                      </Link>
                      <div className="text-xs text-slate-500 mt-1">{theCase.department}</div>
                    </div>
                    <Badge variant="info">{theCase.complexity}</Badge>
                  </div>
                  <div className="mt-3 text-sm text-slate-500">{theCase.description}</div>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
