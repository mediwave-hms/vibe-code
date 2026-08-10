import { useStore } from '../../store';
import { Card, CardContent } from '../../components/ui/Card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../components/ui/Table';
import { Badge } from '../../components/ui/Badge';
import { EmptyState } from '../../components/ui/EmptyState';

export default function RoomListPage() {
  const rooms = useStore((s) => s.rooms);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Rooms</h1>
        <p className="text-sm text-slate-500 mt-1">View available and occupied rooms across the hospital.</p>
      </div>
      <Card>
        <CardContent className="p-0">
          {rooms.length === 0 ? (
            <EmptyState title="No rooms" description="No room data is available yet." />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Room</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rooms.map((room) => (
                  <TableRow key={room.id}>
                    <TableCell>{room.name}</TableCell>
                    <TableCell>{room.type}</TableCell>
                    <TableCell><Badge variant="secondary">{room.status}</Badge></TableCell>
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
