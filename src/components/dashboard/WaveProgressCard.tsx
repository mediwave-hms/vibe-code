import { Link } from 'react-router-dom';
import {
  Clock,
  AlertTriangle,
  Calendar as CalendarIcon,
  TrendingDown,
  ChevronRight,
  UserRound,
} from 'lucide-react';
import { useWaveCountdown } from '../../hooks/useWaveCountdown';
import { useStore } from '../../store';
import { CaseStatus, WaveStatus, Role } from '../../types/enums';
import { cn } from '../../lib/cn';
import { useAuth } from '../../hooks/useAuth';
import { getWaveDurationDays, formatDate } from '../../utils/dates';

interface StaleCase {
  id: string;
  title: string;
  patientName: string;
  daysStale: number;
  assignedClinicianName: string;
}

function getUserFullName(user: { firstName?: string; lastName?: string; fullName?: string } | null | undefined): string {
  if (!user) return 'Unassigned';
  if (user.fullName) return user.fullName;
  return `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim() || 'Unassigned';
}

function computeWaveProgress(start: Date, end: Date): number {
  const total = new Date(end).getTime() - new Date(start).getTime();
  const elapsed = Date.now() - new Date(start).getTime();
  if (total <= 0) return 100;
  return Math.min(100, Math.max(0, Math.round((elapsed / total) * 100)));
}

export function WaveProgressCard() {
  const { currentWave, daysLeft, hoursLeft, minutesLeft, isEndingSoon } = useWaveCountdown();
  const { user } = useAuth();
  const cases = useStore((s) => s.cases);
  const users = useStore((s) => s.users);
  const waves = useStore((s) => s.waves);

  const activeWave = currentWave ?? waves.find((w) => w.status === WaveStatus.ACTIVE);

  const progress = activeWave
    ? computeWaveProgress(activeWave.startDate, activeWave.endDate)
    : 0;
  const duration = activeWave ? getWaveDurationDays(activeWave.startDate, activeWave.endDate) : 0;

  const clinicianId =
    user?.role !== Role.ADMIN && (user?.role as string) !== 'DEPT_HEAD' ? user?.id : undefined;

  const staleCases: StaleCase[] = cases
    .filter((c) => {
      if (activeWave && c.waveId !== activeWave.id) return false;
      if (
        c.status !== CaseStatus.ASSIGNED &&
        c.status !== CaseStatus.IN_PROGRESS
      )
        return false;
      if (clinicianId && c.assignedClinicianId !== clinicianId) return false;
      if (!c.assignedDate) return false;
      const daysSinceAssign = Math.floor(
        (Date.now() - new Date(c.assignedDate).getTime()) / (1000 * 60 * 60 * 24)
      );
      return daysSinceAssign >= 10;
    })
    .slice(0, 3)
    .map((c) => {
      const patient = users.find((u) => u.id === c.patientId);
      const clinician = users.find((u) => u.id === c.assignedClinicianId);
      const daysSinceAssign = c.assignedDate
        ? Math.floor((Date.now() - new Date(c.assignedDate).getTime()) / (1000 * 60 * 60 * 24))
        : 0;
      return {
        id: c.id,
        title: c.title,
        patientName: patient
          ? getUserFullName(patient)
          : `Patient ${(c.patientId || '').slice(0, 6)}`,
        assignedClinicianName: getUserFullName(clinician),
        daysStale: daysSinceAssign,
      };
    });

  const circumference = 2 * Math.PI * 44;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm h-full flex flex-col">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold text-slate-900">Active wave progress</h3>
          <p className="text-xs text-slate-500 mt-0.5">
            {activeWave ? (
              <>
                {activeWave.name
                  ? `Wave ${activeWave.name}`
                  : 'Current cycle'}
                {' · '}
                {formatDate(activeWave.startDate)} – {formatDate(activeWave.endDate)}
              </>
            ) : (
              'No active wave'
            )}
          </p>
        </div>
        <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
          <CalendarIcon className="w-4.5 h-4.5" />
        </div>
      </div>

      {isEndingSoon && (
        <div className="mb-4 rounded-xl bg-amber-50 border border-amber-200 p-3 flex gap-2.5 items-start">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div className="text-xs">
            <p className="font-semibold text-amber-800 mb-0.5">Wave ending soon</p>
            <p className="text-amber-700/80 leading-relaxed">
              Resolve and close remaining cases before the rollover window closes.
            </p>
          </div>
        </div>
      )}

      <div className="flex items-center gap-5 mb-5">
        <div className="relative w-28 h-28 shrink-0">
          <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
            <circle
              cx="50"
              cy="50"
              r="44"
              fill="none"
              stroke="#e2e8f0"
              strokeWidth="8"
            />
            <circle
              cx="50"
              cy="50"
              r="44"
              fill="none"
              stroke={isEndingSoon ? '#f59e0b' : '#3b82f6'}
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              style={{ transition: 'stroke-dashoffset 500ms ease' }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-bold text-slate-900">{progress}%</span>
            <span className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">
              complete
            </span>
          </div>
        </div>

        <div className="flex-1 space-y-2.5">
          <div className="flex items-center gap-2">
            <Clock className={cn('w-4 h-4', isEndingSoon ? 'text-amber-600' : 'text-slate-400')} />
            <div>
              <p className="text-xs text-slate-500">Time remaining</p>
              <p className="text-sm font-semibold text-slate-900">
                {daysLeft > 0 && `${daysLeft}d `}
                {hoursLeft}h {minutesLeft}m
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <TrendingDown className="w-4 h-4 text-slate-400" />
            <div>
              <p className="text-xs text-slate-500">Cycle length</p>
              <p className="text-sm font-semibold text-slate-900">{duration} days</p>
            </div>
          </div>
          <Link
            to="/waves"
            className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700"
          >
            View all waves
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      <div className="border-t border-slate-100 pt-4 mt-auto">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
            {clinicianId ? 'Your stale cases' : 'Cases needing attention'}
          </h4>
          <span className="text-[11px] font-medium text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200">
            ≥ 10d idle
          </span>
        </div>

        {staleCases.length === 0 ? (
          <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-3 text-center">
            <p className="text-xs text-emerald-700 font-medium">
              ✨ All cases are within SLA — great work!
            </p>
          </div>
        ) : (
          <ul className="space-y-2">
            {staleCases.map((sc) => (
              <li key={sc.id}>
                <Link
                  to={`/cases/${sc.id}`}
                  className="block rounded-xl border border-slate-100 hover:border-slate-200 hover:bg-slate-50 p-3 transition-colors"
                >
                  <div className="flex items-start gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
                      <UserRound className="w-4 h-4 text-slate-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-semibold text-slate-900 truncate">
                        {sc.title}
                      </p>
                      <p className="text-xs text-slate-500 truncate">
                        {sc.patientName} · {sc.assignedClinicianName}
                      </p>
                    </div>
                    <span className="text-[11px] font-semibold text-rose-700 bg-rose-100 px-2 py-0.5 rounded-md shrink-0">
                      +{sc.daysStale}d
                    </span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default WaveProgressCard;
