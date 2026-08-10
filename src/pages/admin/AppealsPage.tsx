import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../../store';
import { NotificationType } from '../../types/enums';
import { Card, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../components/ui/Table';
import { EmptyState } from '../../components/ui/EmptyState';
import { toastSuccess } from '../../lib/toast';

export default function AppealsPage() {
  const notifications = useStore((s) => s.notifications);
  const users = useStore((s) => s.users);
  const markAsRead = useStore((s) => s.markAsRead);
  const addNotification = useStore((s) => s.addNotification);

  const pendingAppeals = useMemo(
    () => notifications.filter((notification) => notification.relatedEntityType === 'Appeal' && !notification.read),
    [notifications]
  );

  const handleResolve = (notificationId: string) => {
    markAsRead(notificationId);
    addNotification({
      userId: 'admin',
      title: 'Appeal resolved',
      message: 'The appeal was reviewed and the case was closed out for follow-up.',
      type: NotificationType.INFO,
      link: '/appeals',
      relatedEntityId: notificationId,
      relatedEntityType: 'Appeal',
    });
    toastSuccess('Appeal resolved', 'The appeal has been marked as reviewed.');
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Appeals</h1>
          <p className="text-sm text-slate-500 mt-1">Review and resolve staff onboarding appeals submitted by the team.</p>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          {pendingAppeals.length === 0 ? (
            <EmptyState
              icon={<span className="text-4xl">✅</span>}
              title="No appeals pending"
              description="All appeals have been addressed."
            />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Appeal</TableHead>
                  <TableHead>Requester</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pendingAppeals.map((appeal) => {
                  const requester = users.find((user) => user.id === appeal.relatedEntityId);
                  return (
                    <TableRow key={appeal.id}>
                      <TableCell>
                        <div className="font-medium text-slate-900">{appeal.title}</div>
                        <div className="text-xs text-slate-500">{appeal.message}</div>
                      </TableCell>
                      <TableCell>{requester ? `${requester.firstName} ${requester.lastName}` : 'Unknown'}</TableCell>
                      <TableCell>{new Date(appeal.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          {requester && (
                            <Link to={`/staff/${requester.id}`}>
                              <Button size="sm" variant="secondary">View Staff</Button>
                            </Link>
                          )}
                          <Button size="sm" variant="primary" onClick={() => handleResolve(appeal.id)}>
                            Resolve
                          </Button>
                        </div>
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
