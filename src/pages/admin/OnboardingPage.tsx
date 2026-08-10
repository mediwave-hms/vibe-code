import { useMemo } from 'react';
import { useStore } from '../../store';
import { Role, NotificationType } from '../../types/enums';
import { Card, CardContent } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../components/ui/Table';
import { EmptyState } from '../../components/ui/EmptyState';
import { toastSuccess, toastError } from '../../lib/toast';

export default function OnboardingPage() {
  const users = useStore((s) => s.users);
  const updateStaff = useStore((s) => s.updateStaff);
  const deleteStaff = useStore((s) => s.deleteStaff);
  const addNotification = useStore((s) => s.addNotification);

  const pendingApplicants = useMemo(
    () => users.filter((user) => user.role !== Role.PATIENT && !user.isActive),
    [users]
  );

  const handleApprove = (applicantId: string, name: string) => {
    const updated = updateStaff(applicantId, {
      isActive: true,
      dateOfJoining: new Date(),
      updatedAt: new Date(),
    });
    if (updated) {
      addNotification({
        userId: updated.id,
        title: 'Onboarding approved',
        message: `Welcome aboard, ${name}! Your account has been activated and access has been granted.`,
        type: NotificationType.SUCCESS,
        link: '/staff',
        relatedEntityId: updated.id,
        relatedEntityType: 'Onboarding',
      });
      addNotification({
        userId: 'admin',
        title: 'Staff activation completed',
        message: `${name} has been activated and assigned to the staff directory.`,
        type: NotificationType.INFO,
        link: '/onboarding',
        relatedEntityId: updated.id,
        relatedEntityType: 'Onboarding',
      });
      toastSuccess('Applicant approved', `${name} can now access the system.`);
    } else {
      toastError('Approval failed', 'Could not activate the applicant.');
    }
  };

  const handleReject = (applicantId: string, name: string) => {
    const removed = deleteStaff(applicantId);
    if (removed) {
      addNotification({
        userId: 'admin',
        title: 'Onboarding rejected',
        message: `${name} was removed from onboarding pending review.`,
        type: NotificationType.WARNING,
        link: '/onboarding',
        relatedEntityId: applicantId,
        relatedEntityType: 'Onboarding',
      });
      toastSuccess('Applicant rejected', `${name} has been removed from pending onboarding.`);
    } else {
      toastError('Rejection failed', 'Could not reject the applicant.');
    }
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Staff Onboarding</h1>
          <p className="text-sm text-slate-500 mt-1">Review and approve pending staff onboarding applications.</p>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          {pendingApplicants.length === 0 ? (
            <EmptyState
              icon={<span className="text-4xl">✅</span>}
              title="No pending applications"
              description="All staff onboarding requests have been processed."
            />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pendingApplicants.map((applicant) => (
                  <TableRow key={applicant.id}>
                    <TableCell>
                      <div className="font-medium text-slate-900">{applicant.firstName} {applicant.lastName}</div>
                      <div className="text-xs text-slate-500">{applicant.email}</div>
                    </TableCell>
                    <TableCell>{applicant.role}</TableCell>
                    <TableCell>{applicant.department ?? 'N/A'}</TableCell>
                    <TableCell>
                      <Badge variant="warning">Pending</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button size="sm" variant="primary" onClick={() => handleApprove(applicant.id, `${applicant.firstName} ${applicant.lastName}`)}>
                          Approve
                        </Button>
                        <Button size="sm" variant="danger" onClick={() => handleReject(applicant.id, `${applicant.firstName} ${applicant.lastName}`)}>
                          Reject
                        </Button>
                      </div>
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
