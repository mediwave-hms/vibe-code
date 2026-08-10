import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../../store';
import { Card, CardContent } from '../../components/ui/Card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../components/ui/Table';
import { Badge } from '../../components/ui/Badge';
import { EmptyState } from '../../components/ui/EmptyState';
import { Button } from '../../components/ui/Button';

export default function ReviewQueuePage() {
  const cases = useStore((s) => s.cases);
  const reviews = useStore((s) => s.reviews);

  const pendingCases = useMemo(() => {
    const reviewedCaseIds = new Set(reviews.map((review) => review.caseId));
    return cases.filter((theCase) => theCase.status === 'CLOSED' || theCase.status === 'RESOLVED').filter((theCase) => !reviewedCaseIds.has(theCase.id));
  }, [cases, reviews]);

  return (
    <div className="space-y-6 animate-fade-in max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Review Queue</h1>
        <p className="text-sm text-slate-500 mt-1">Submit reviews for resolved and closed case work.</p>
      </div>

      <Card>
        <CardContent className="p-0">
          {pendingCases.length === 0 ? (
            <EmptyState
              icon={<span className="text-4xl">✅</span>}
              title="No reviews pending"
              description="All closed cases have received reviews or are still in progress."
            />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Case</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Updated</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pendingCases.map((theCase) => (
                  <TableRow key={theCase.id}>
                    <TableCell>
                      <div className="font-medium text-slate-900">{theCase.title}</div>
                      <div className="text-xs text-slate-500">{theCase.department}</div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={theCase.status === 'RESOLVED' ? 'warning' : 'success'}>{theCase.status}</Badge>
                    </TableCell>
                    <TableCell>{new Date(theCase.updatedAt).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right">
                      <Link to={`/reviews/submit/${theCase.id}`}>
                        <Button size="sm">Submit Review</Button>
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
