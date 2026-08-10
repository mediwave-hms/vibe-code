import { useStore } from '../../store';
import { Card, CardContent } from '../../components/ui/Card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../components/ui/Table';
import { Badge } from '../../components/ui/Badge';
import { EmptyState } from '../../components/ui/EmptyState';
import { Payment } from '../../types/models';

export default function PaymentsPage() {
  const payments = useStore((s) => (s.payments ? s.payments : []));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Payments</h1>
        <p className="text-sm text-slate-500 mt-1">Review processed payments and reconcile invoices.</p>
      </div>

      <Card>
        <CardContent className="p-0">
          {payments.length === 0 ? (
            <EmptyState title="No payments" description="Payments will appear here once processed." />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Payment</TableHead>
                  <TableHead>Invoice</TableHead>
                  <TableHead>Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payments.map((p: Payment) => (
                  <TableRow key={p.id}>
                    <TableCell>{p.id}</TableCell>
                    <TableCell>{p.invoiceId}</TableCell>
                    <TableCell>
                      <div>${(p.amount ?? 0).toFixed(2)}</div>
                      <Badge variant="info">{p.method}</Badge>
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
