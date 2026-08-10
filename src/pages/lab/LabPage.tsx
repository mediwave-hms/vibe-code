import { useStore } from '../../store';
import { Card, CardContent } from '../../components/ui/Card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../components/ui/Table';
import { Badge } from '../../components/ui/Badge';
import { EmptyState } from '../../components/ui/EmptyState';

export default function LabPage() {
  const labTests = useStore((s) => s.labTests);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Laboratory</h1>
        <p className="text-sm text-slate-500 mt-1">Review labs and pending test requests.</p>
      </div>
      <Card>
        <CardContent className="p-0">
          {labTests.length === 0 ? (
            <EmptyState title="No lab tests" description="No laboratory tests have been recorded yet." />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Test</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Collection</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {labTests.map((test) => (
                  <TableRow key={test.id}>
                    <TableCell>{test.name}</TableCell>
                    <TableCell>{test.category ?? test.sampleType}</TableCell>
                    <TableCell><Badge variant="info">{test.sampleType}</Badge></TableCell>
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
