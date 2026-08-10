import { Link } from 'react-router-dom';
import { Trophy, ChevronRight, Crown, Medal, Award, TrendingUp } from 'lucide-react';
import { useStore } from '../../store';
import { WaveStatus, Role } from '../../types/enums';
import { computeAllStaffScorecards, type ActivityScoreBin } from '../../utils/metrics';
import { cn } from '../../lib/cn';

function getUserFullName(u: { firstName?: string; lastName?: string; fullName?: string } | null | undefined): string {
  if (!u) return 'Unknown';
  if (u.fullName) return u.fullName;
  return `${u.firstName ?? ''} ${u.lastName ?? ''}`.trim() || 'Unknown';
}

const binStyles: Record<ActivityScoreBin, string> = {
  TOP_20: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  MIDDLE_60: 'bg-blue-50 text-blue-700 border-blue-200',
  BOTTOM_20: 'bg-amber-50 text-amber-700 border-amber-200',
};

const binLabels: Record<ActivityScoreBin, string> = {
  TOP_20: 'Top 20%',
  MIDDLE_60: 'Middle 60%',
  BOTTOM_20: 'Bottom 20%',
};

function initials(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0])
    .join('')
    .toUpperCase();
}

interface RankedPerformer {
  id: string;
  name: string;
  role: string;
  wavePoints: number;
  bin: ActivityScoreBin;
  resolutionRatePct: number;
  avgReviewScore: number;
  rank: number;
}

export function TopPerformersCard() {
  const users = useStore((s) => s.users);
  const cases = useStore((s) => s.cases);
  const reviews = useStore((s) => s.reviews);
  const waves = useStore((s) => s.waves);

  const activeWaveIds = waves
    .filter((w) => w.status === WaveStatus.ACTIVE)
    .map((w) => w.id);

  const activeCases =
    activeWaveIds.length > 0
      ? cases.filter((c) => c.waveId && activeWaveIds.includes(c.waveId))
      : cases;

  const clinicianRoles = [Role.DOCTOR, Role.NURSE];
  const staffIds = users
    .filter((u) => clinicianRoles.includes(u.role) || u.role === Role.ADMIN)
    .map((u) => u.id);

  const scorecards = computeAllStaffScorecards(staffIds, activeCases, reviews);

  const performers: RankedPerformer[] = staffIds
    .map((id) => {
      const u = users.find((x) => x.id === id)!;
      const sc = scorecards[id]!;
      const avgReview =
        [sc.avgPatientReviewScore, sc.avgPeerReviewScore].filter((n) => !isNaN(n)).reduce(
          (a, b, _, arr) => a + b / Math.max(arr.length, 1),
          0
        );
      return {
        id,
        name: getUserFullName(u),
        role: u.role,
        wavePoints: sc.wavePoints,
        bin: sc.activityScoreBin,
        resolutionRatePct: sc.resolutionRatePct,
        avgReviewScore: isNaN(avgReview) ? 0 : avgReview,
        rank: 0,
      };
    })
    .sort((a, b) => b.wavePoints - a.wavePoints)
    .slice(0, 5)
    .map((p, idx) => ({ ...p, rank: idx + 1 }));

  const totalPoints = performers.reduce((s, p) => s + p.wavePoints, 0);
  const maxPoints = performers[0]?.wavePoints || 1;

  const rankStyles = [
    { icon: Crown, ring: 'ring-amber-200', bg: 'bg-gradient-to-br from-amber-400 to-yellow-500', text: 'text-white' },
    { icon: Medal, ring: 'ring-slate-200', bg: 'bg-gradient-to-br from-slate-300 to-slate-400', text: 'text-white' },
    { icon: Award, ring: 'ring-orange-200', bg: 'bg-gradient-to-br from-orange-400 to-amber-600', text: 'text-white' },
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm h-full flex flex-col">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold text-slate-900">Top performers this wave</h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Ranked by earned case points · scorecard rankings
          </p>
        </div>
        <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
          <Trophy className="w-4.5 h-4.5" />
        </div>
      </div>

      {performers.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center py-10">
          <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center mb-3">
            <Trophy className="w-7 h-7 text-slate-400" />
          </div>
          <p className="text-sm font-semibold text-slate-900 mb-0.5">Nothing to rank yet</p>
          <p className="text-xs text-slate-500 max-w-[220px]">
            Performance rankings will appear once cases are resolved this wave.
          </p>
        </div>
      ) : (
        <div className="flex-1 min-h-0">
          <ul className="space-y-2.5 mb-4">
            {performers.map((p) => {
              const rankStyle = rankStyles[p.rank - 1] ?? {
                icon: TrendingUp,
                ring: 'ring-slate-100',
                bg: 'bg-slate-200',
                text: 'text-slate-700',
              };
              const RankIcon = rankStyle.icon;
              const barPct = Math.round((p.wavePoints / Math.max(maxPoints, 1)) * 100);
              return (
                <li key={p.id}>
                  <Link
                    to={`/staff/${p.id}`}
                    className="group block rounded-xl border border-slate-100 hover:border-slate-200 hover:bg-slate-50 p-3 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={cn(
                          'w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ring-2',
                          rankStyle.ring,
                          rankStyle.bg,
                          rankStyle.text
                        )}
                      >
                        <RankIcon className="w-4.5 h-4.5" />
                      </div>

                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-slate-500 to-violet-500 flex items-center justify-center text-white text-[11px] font-bold shrink-0">
                        {initials(p.name)}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <p className="text-[13px] font-semibold text-slate-900 truncate">
                            {p.name}
                          </p>
                          <span
                            className={cn(
                              'text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded border',
                              binStyles[p.bin]
                            )}
                          >
                            {binLabels[p.bin]}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-[11px] text-slate-500">
                          <span className="inline-flex items-center gap-1">
                            <TrendingUp className="w-3 h-3 text-emerald-500" />
                            {p.resolutionRatePct.toFixed(0)}% resolved
                          </span>
                          {p.avgReviewScore > 0 && (
                            <span>★ {p.avgReviewScore.toFixed(1)} avg</span>
                          )}
                        </div>

                        <div className="mt-1.5 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className={cn(
                              'h-full rounded-full transition-all',
                              p.rank === 1
                                ? 'bg-gradient-to-r from-amber-400 to-yellow-500'
                                : p.rank === 2
                                ? 'bg-gradient-to-r from-slate-300 to-slate-500'
                                : p.rank === 3
                                ? 'bg-gradient-to-r from-orange-400 to-amber-500'
                                : 'bg-gradient-to-r from-blue-400 to-violet-500'
                            )}
                            style={{ width: `${barPct}%` }}
                          />
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <p className="text-[15px] font-bold text-slate-900 tabular-nums">
                          {p.wavePoints}
                        </p>
                        <p className="text-[10px] font-medium text-slate-500 uppercase tracking-wider">
                          pts
                        </p>
                      </div>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="mt-auto pt-3 border-t border-slate-100 flex items-center justify-between">
            <div>
              <p className="text-[11px] text-slate-500">Team total this wave</p>
              <p className="text-sm font-bold text-slate-900 tabular-nums">
                {totalPoints.toLocaleString()} pts · {performers.length} ranked
              </p>
            </div>
            <Link
              to="/staff"
              className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700"
            >
              Staff leaderboard
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default TopPerformersCard;
