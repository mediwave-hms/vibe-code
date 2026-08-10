import { useStore } from '../../store';
import { Card, CardContent } from '../../components/ui/Card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../components/ui/Table';
import { Badge } from '../../components/ui/Badge';
import { EmptyState } from '../../components/ui/EmptyState';

export default function PharmacyPage() {
  const medications = useStore((s) => s.medications);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Pharmacy Inventory</h1>
        <p className="text-sm text-slate-500 mt-1">Review stock levels for current medications.</p>
      </div>
      <Card>
        <CardContent className="p-0">
          {medications.length === 0 ? (
            <EmptyState title="No medications" description="Pharmacy inventory will appear here once medications are loaded." />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Medication</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Stock</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {medications.map((medication) => (
                  <TableRow key={medication.id}>
                    <TableCell>{medication.name}</TableCell>
                    <TableCell>{medication.category}</TableCell>
                    <TableCell><Badge variant="secondary">{medication.stockQuantity}</Badge></TableCell>
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
