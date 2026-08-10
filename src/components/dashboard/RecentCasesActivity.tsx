import {
  FilePlus2,
  UserCheck,
  CheckCircle2,
  XCircle,
  MessageSquarePlus,
  Stethoscope,
  ChevronRight,
} from 'lucide-react';
import { useStore } from '../../store';
import { Link } from 'react-router-dom';
import { cn } from '../../lib/cn';
import { formatCaseId } from '../../utils/formatters';

interface TimelineEvent {
  id: string;
  caseId: string;
  caseTitle: string;
  actorName: string;
  action: string;
  timestamp: Date;
  icon: React.ComponentType<{ className?: string }>;
  iconTone: 'blue' | 'emerald' | 'amber' | 'violet' | 'rose' | 'sky';
  details?: string;
}

const actionStyles: Record<string, { icon: TimelineEvent['icon']; tone: TimelineEvent['iconTone']; label: (d?: string) => string }> = {
  CASE_CREATED: {
    icon: FilePlus2,
    tone: 'blue',
    label: () => 'opened a new case',
  },
  CASE_ASSIGNED: {
    icon: UserCheck,
    tone: 'violet',
    label: (d) => `assigned case${d ? ` · ${d}` : ''}`,
  },
  CASE_IN_PROGRESS: {
    icon: Stethoscope,
    tone: 'sky',
    label: () => 'began case workup',
  },
  CASE_RESOLVED: {
    icon: CheckCircle2,
    tone: 'emerald',
    label: (d) => `resolved case${d ? ` · ${d}` : ''}`,
  },
  CASE_CLOSED: {
    icon: XCircle,
    tone: 'rose',
    label: () => 'closed the case',
  },
  CASE_NOTE_ADDED: {
    icon: MessageSquarePlus,
    tone: 'amber',
    label: () => 'added a progress note',
  },
};

const toneClasses: Record<TimelineEvent['iconTone'], string> = {
  blue: 'bg-blue-50 text-blue-600 ring-blue-100',
  emerald: 'bg-emerald-50 text-emerald-600 ring-emerald-100',
  amber: 'bg-amber-50 text-amber-600 ring-amber-100',
  violet: 'bg-violet-50 text-violet-600 ring-violet-100',
  rose: 'bg-rose-50 text-rose-600 ring-rose-100',
  sky: 'bg-sky-50 text-sky-600 ring-sky-100',
};

function getUserFullName(u: { firstName?: string; lastName?: string; fullName?: string } | null | undefined): string {
  if (!u) return 'System';
  if (u.fullName) return u.fullName;
  return `${u.firstName ?? ''} ${u.lastName ?? ''}`.trim() || 'System';
}

function timeAgo(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - new Date(date).getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);
  if (diffMins < 1) return 'just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return new Date(date).toLocaleDateString();
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0])
    .join('')
    .toUpperCase();
}

export function RecentCasesActivity() {
  const cases = useStore((s) => s.cases);
  const users = useStore((s) => s.users);

  const allEvents: TimelineEvent[] = cases
    .flatMap((c) => {
      const timeline = c.timeline as Array<{
        timestamp: Date;
        actorUserId?: string;
        action: string;
        details?: string;
      }> | null;

      if (!timeline || timeline.length === 0) {
        const fallbackEvents: TimelineEvent[] = [];
        if (c.createdAt) {
          fallbackEvents.push({
            id: `${c.id}-created`,
            caseId: c.id,
            caseTitle: c.title,
            actorName: 'System',
            action: 'CASE_CREATED',
            timestamp: new Date(c.createdAt),
            icon: actionStyles.CASE_CREATED.icon,
            iconTone: actionStyles.CASE_CREATED.tone,
          });
        }
        if (c.assignedDate && c.assignedClinicianId) {
          const actor = users.find((u) => u.id === c.assignedClinicianId);
          fallbackEvents.push({
            id: `${c.id}-assigned`,
            caseId: c.id,
            caseTitle: c.title,
            actorName: getUserFullName(actor),
            action: 'CASE_ASSIGNED',
            timestamp: new Date(c.assignedDate),
            icon: actionStyles.CASE_ASSIGNED.icon,
            iconTone: actionStyles.CASE_ASSIGNED.tone,
            details: c.diagnosis,
          });
        }
        if (c.resolvedAt) {
          fallbackEvents.push({
            id: `${c.id}-resolved`,
            caseId: c.id,
            caseTitle: c.title,
            actorName: getUserFullName(
              users.find((u) => u.id === c.assignedClinicianId)
            ),
            action: 'CASE_RESOLVED',
            timestamp: new Date(c.resolvedAt),
            icon: actionStyles.CASE_RESOLVED.icon,
            iconTone: actionStyles.CASE_RESOLVED.tone,
            details: c.treatmentPlan ? 'treatment plan set' : undefined,
          });
        }
        if (c.closedAt) {
          fallbackEvents.push({
            id: `${c.id}-closed`,
            caseId: c.id,
            caseTitle: c.title,
            actorName: 'Admin',
            action: 'CASE_CLOSED',
            timestamp: new Date(c.closedAt),
            icon: actionStyles.CASE_CLOSED.icon,
            iconTone: actionStyles.CASE_CLOSED.tone,
          });
        }
        return fallbackEvents;
      }

      return timeline.map((entry, idx) => {
        const actor = users.find((u) => u.id === entry.actorUserId);
        const style =
          actionStyles[entry.action] ??
          actionStyles.CASE_NOTE_ADDED;
        return {
          id: `${c.id}-${idx}-${entry.action}`,
          caseId: c.id,
          caseTitle: c.title,
          actorName: getUserFullName(actor),
          action: entry.action,
          timestamp: new Date(entry.timestamp),
          icon: style.icon,
          iconTone: style.tone,
          details: entry.details,
        };
      });
    })
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 10);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm h-full flex flex-col">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold text-slate-900">Recent case activity</h3>
          <p className="text-xs text-slate-500 mt-0.5">Live timeline across all programs</p>
        </div>
        <div className="w-9 h-9 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center">
          <MessageSquarePlus className="w-4.5 h-4.5" />
        </div>
      </div>

      {allEvents.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center py-8">
          <p className="text-sm text-slate-500">No recent activity</p>
        </div>
      ) : (
        <div className="flex-1 min-h-0 -mx-1">
          <ul className="relative pl-4 pr-2 space-y-0.5 max-h-[340px] overflow-y-auto scrollbar-thin">
            <div className="absolute left-[22px] top-1 bottom-1 timeline-line" />
            {allEvents.map((ev) => {
              const Style = actionStyles[ev.action] ?? actionStyles.CASE_NOTE_ADDED;
              const label = Style.label(ev.details);
              const Icon = ev.icon;
              return (
                <li key={ev.id} className="relative pb-4 last:pb-0">
                  <div className="absolute -left-[2px] top-1.5 flex items-center justify-center">
                    <div
                      className={cn(
                        'w-[26px] h-[26px] rounded-full ring-4 flex items-center justify-center z-10',
                        toneClasses[ev.iconTone]
                      )}
                    >
                      <Icon className="w-[13px] h-[13px]" />
                    </div>
                  </div>

                  <div className="pl-9">
                    <div className="flex items-start gap-2 mb-1">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center text-[10px] font-bold text-slate-700 shrink-0 mt-0.5">
                        {getInitials(ev.actorName)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[13px] leading-snug text-slate-800">
                          <span className="font-semibold text-slate-900">
                            {ev.actorName}
                          </span>{' '}
                          <span className="text-slate-600">{label}</span>
                        </p>
                      </div>
                      <span className="text-[10px] font-medium text-slate-400 shrink-0">
                        {timeAgo(ev.timestamp)}
                      </span>
                    </div>
                    <Link
                      to={`/cases/${ev.caseId}`}
                      className="group inline-flex items-center gap-1.5 text-[12px] font-medium text-slate-500 hover:text-blue-600 ml-8"
                    >
                      <span className="font-mono">{formatCaseId(ev.caseId)}</span>
                      <span className="text-slate-700 group-hover:text-blue-700 truncate max-w-[220px]">
                        {ev.caseTitle}
                      </span>
                      <ChevronRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-blue-500" />
                    </Link>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}

export default RecentCasesActivity;
