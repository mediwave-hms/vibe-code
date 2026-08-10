import { Link } from 'react-router-dom';
import {
  FolderOpenDot,
  ChevronRight,
  UserRound,
  Clock,
  FileCheck2,
} from 'lucide-react';
import { useStore } from '../../store';
import { useAuth } from '../../hooks/useAuth';
import { Role, CaseStatus, ApplicationStatus } from '../../types/enums';
import { cn } from '../../lib/cn';
import { formatCaseId } from '../../utils/formatters';
import { formatDateTime } from '../../utils/dates';

function getUserFullName(user: { firstName?: string; lastName?: string; fullName?: string } | null | undefined): string {
  if (!user) return 'Unknown';
  if (user.fullName) return user.fullName;
  return `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim() || 'Unknown';
}

const statusStyles: Record<ApplicationStatus, string> = {
  [ApplicationStatus.ACTIVE]:
    'bg-blue-50 text-blue-700 border-blue-200',
  [ApplicationStatus.ACCEPTED]:
    'bg-emerald-50 text-emerald-700 border-emerald-200',
  [ApplicationStatus.INACTIVE]:
    'bg-slate-100 text-slate-600 border-slate-200',
  [ApplicationStatus.REJECTED]:
    'bg-rose-50 text-rose-700 border-rose-200',
  [ApplicationStatus.WITHDRAWN]:
    'bg-slate-50 text-slate-600 border-slate-200',
  [ApplicationStatus.PENDING]: 'bg-amber-50 text-amber-700 border-amber-200',
};

const statusLabels: Record<ApplicationStatus, string> = {
  [ApplicationStatus.ACTIVE]: 'Active',
  [ApplicationStatus.ACCEPTED]: 'Accepted',
  [ApplicationStatus.INACTIVE]: 'Inactive',
  [ApplicationStatus.REJECTED]: 'Rejected',
  [ApplicationStatus.WITHDRAWN]: 'Withdrawn',
  [ApplicationStatus.PENDING]: 'Pending',
};

export function PendingApplicationsCard() {
  const { user } = useAuth();
  const cases = useStore((s) => s.cases);
  const caseApplications = useStore((s) => s.caseApplications);
  const users = useStore((s) => s.users);

  const isDeptHeadOrAdmin =
    user?.role === Role.ADMIN || (user?.role as string) === 'DEPT_HEAD';
  const clinicianId = user?.id;

  if (isDeptHeadOrAdmin) {
    const casesWithPending = cases
      .filter((c) => {
        if (
          c.status !== CaseStatus.OPEN &&
          (c.status as string) !== 'APPLICATIONS_RECEIVED' &&
          c.status !== CaseStatus.ASSIGNED
        ) {
          return false;
        }
        const pending = caseApplications.filter(
          (a) =>
            a.caseId === c.id &&
            (a.status === ApplicationStatus.ACTIVE ||
              (a.status as string) === 'PENDING')
        );
        return pending.length > 0;
      })
      .map((c) => {
        const pendingApps = caseApplications.filter(
          (a) =>
            a.caseId === c.id &&
            (a.status === ApplicationStatus.ACTIVE ||
              (a.status as string) === 'PENDING')
        );
        const patient = users.find((u) => u.id === c.patientId);
        return {
          id: c.id,
          title: c.title,
          status: c.status,
          patientName: patient
            ? getUserFullName(patient)
            : `Patient ${(c.patientId || '').slice(0, 6)}`,
          pendingCount: pendingApps.length,
          latestAppliedAt:
            pendingApps.length > 0
              ? pendingApps.reduce(
                  (latest, a) =>
                    new Date(a.appliedAt) > new Date(latest.appliedAt) ? a : latest
                ).appliedAt
              : null,
        };
      })
      .slice(0, 6);

    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm h-full flex flex-col">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-sm font-semibold text-slate-900">
              Pending case applications
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Review and assign clinicians to open cases
            </p>
          </div>
          <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <FileCheck2 className="w-4.5 h-4.5" />
          </div>
        </div>

        {casesWithPending.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center py-8">
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center mb-3">
              <FolderOpenDot className="w-7 h-7 text-emerald-600" />
            </div>
            <p className="text-sm font-semibold text-slate-900 mb-0.5">
              Inbox zero
            </p>
            <p className="text-xs text-slate-500 max-w-[200px]">
              No open cases waiting for assignment right now.
            </p>
          </div>
        ) : (
          <div className="flex-1 min-h-0">
            <div className="rounded-xl border border-slate-200 overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="text-left text-[11px] font-semibold uppercase tracking-wider text-slate-500 px-3 py-2">
                      Case
                    </th>
                    <th className="text-left text-[11px] font-semibold uppercase tracking-wider text-slate-500 px-3 py-2">
                      Applicants
                    </th>
                    <th className="text-right text-[11px] font-semibold uppercase tracking-wider text-slate-500 px-3 py-2 pr-3">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {casesWithPending.map((c) => (
                    <tr
                      key={c.id}
                      className="hover:bg-slate-50 transition-colors"
                    >
                      <td className="px-3 py-2.5">
                        <p className="text-[13px] font-semibold text-slate-900 truncate max-w-[180px]">
                          {c.title}
                        </p>
                        <p className="text-[11px] text-slate-500 flex items-center gap-1">
                          <span className="font-mono">{formatCaseId(c.id)}</span>
                          <span>·</span>
                          <span>{c.patientName}</span>
                        </p>
                      </td>
                      <td className="px-3 py-2.5">
                        <span
                          className={cn(
                            'inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold border',
                            c.status === CaseStatus.OPEN
                              ? 'bg-sky-50 text-sky-700 border-sky-200'
                              : 'bg-blue-50 text-blue-700 border-blue-200'
                          )}
                        >
                          <UserRound className="w-3 h-3" />
                          {c.pendingCount} pending
                        </span>
                        {c.latestAppliedAt && (
                          <p className="text-[10px] text-slate-400 mt-1 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {formatDateTime(c.latestAppliedAt)}
                          </p>
                        )}
                      </td>
                      <td className="px-3 py-2.5 text-right pr-3">
                        <Link
                          to={`/cases/${c.id}`}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-slate-900 text-white hover:bg-slate-800 transition-colors"
                        >
                          Review
                          <ChevronRight className="w-3.5 h-3.5" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-3 pt-3 border-t border-slate-100">
              <Link
                to="/cases"
                className="text-xs font-semibold text-blue-600 hover:text-blue-700 inline-flex items-center gap-1"
              >
                View all cases
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        )}
      </div>
    );
  }

  const myApplications = caseApplications
    .filter((a) => clinicianId && a.clinicianId === clinicianId)
    .slice()
    .sort(
      (a, b) =>
        new Date(b.appliedAt).getTime() - new Date(a.appliedAt).getTime()
    )
    .slice(0, 6)
    .map((a) => {
      const c = cases.find((cc) => cc.id === a.caseId);
      return {
        application: a,
        caseTitle: c?.title ?? 'Unknown case',
        caseId: a.caseId,
      };
    });

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm h-full flex flex-col">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold text-slate-900">My applications</h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Cases you've applied to and their status
          </p>
        </div>
        <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
          <FileCheck2 className="w-4.5 h-4.5" />
        </div>
      </div>

      {myApplications.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center py-8">
          <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center mb-3">
            <FolderOpenDot className="w-7 h-7 text-slate-400" />
          </div>
          <p className="text-sm font-semibold text-slate-900 mb-0.5">
            No applications yet
          </p>
          <p className="text-xs text-slate-500 max-w-[200px]">
            Browse open cases and apply to build your caseload this wave.
          </p>
          <Link
            to="/cases"
            className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-medium hover:bg-slate-800 transition-colors"
          >
            Browse cases
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      ) : (
        <div className="flex-1 min-h-0">
          <ul className="space-y-2">
            {myApplications.map(({ application, caseTitle, caseId }) => (
              <li key={application.id}>
                <Link
                  to={`/cases/${caseId}`}
                  className="block rounded-xl border border-slate-100 hover:border-slate-200 hover:bg-slate-50 p-3 transition-colors"
                >
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <p className="text-[13px] font-semibold text-slate-900 truncate">
                      {caseTitle}
                    </p>
                    <span
                      className={cn(
                        'inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-semibold border shrink-0',
                        statusStyles[
                          (application.status === ApplicationStatus.ACTIVE
                            ? 'PENDING'
                            : application.status) as ApplicationStatus
                        ] ?? statusStyles[ApplicationStatus.INACTIVE]
                      )}
                    >
                      {application.status === ApplicationStatus.ACTIVE
                        ? 'Pending'
                        : statusLabels[application.status as ApplicationStatus] ?? application.status}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-500">
                    <span className="font-mono">{formatCaseId(caseId)}</span>
                    <span>Applied {formatDateTime(application.appliedAt)}</span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-3 pt-3 border-t border-slate-100">
            <Link
              to="/cases"
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 inline-flex items-center gap-1"
            >
              Find more cases
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default PendingApplicationsCard;
