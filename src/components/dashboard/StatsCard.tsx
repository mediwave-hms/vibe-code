import type { ReactNode } from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { cn } from '../../lib/cn';

type TrendDirection = 'up' | 'down' | 'flat';
type AccentColor = 'blue' | 'emerald' | 'amber' | 'violet' | 'rose' | 'sky';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  trendValue?: number | string;
  trendDirection?: TrendDirection;
  subtitle?: string;
  statusBadge?: { label: string; tone: 'success' | 'warning' | 'danger' | 'info' | 'neutral' };
  accentColor?: AccentColor;
}

const accentStyles: Record<AccentColor, string> = {
  blue: 'from-blue-500 to-blue-600',
  emerald: 'from-emerald-500 to-emerald-600',
  amber: 'from-amber-500 to-amber-600',
  violet: 'from-violet-500 to-violet-600',
  rose: 'from-rose-500 to-rose-600',
  sky: 'from-sky-500 to-sky-600',
};

const badgeTones = {
  success: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  warning: 'bg-amber-50 text-amber-700 border-amber-200',
  danger: 'bg-rose-50 text-rose-700 border-rose-200',
  info: 'bg-blue-50 text-blue-700 border-blue-200',
  neutral: 'bg-slate-100 text-slate-700 border-slate-200',
};

export function StatsCard({
  title,
  value,
  icon,
  trendValue,
  trendDirection = 'flat',
  subtitle,
  statusBadge,
  accentColor = 'blue',
}: StatsCardProps) {
  const TrendIcon =
    trendDirection === 'up' ? TrendingUp : trendDirection === 'down' ? TrendingDown : Minus;
  const trendColor =
    trendDirection === 'up'
      ? 'text-emerald-600'
      : trendDirection === 'down'
      ? 'text-rose-600'
      : 'text-slate-500';

  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <div className={cn('h-1.5 bg-gradient-to-r', accentStyles[accentColor])} />
      <div className="p-5">
        <div className="flex items-start justify-between mb-3">
          <div>
            <p className="text-[13px] font-medium text-slate-500 mb-1">{title}</p>
            <p className="text-2xl font-bold text-slate-900 tracking-tight">{value}</p>
          </div>
          <div
            className={cn(
              'w-10 h-10 rounded-xl bg-gradient-to-br flex items-center justify-center text-white shadow-sm shrink-0',
              accentStyles[accentColor]
            )}
          >
            {icon}
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap min-h-[24px]">
          {typeof trendValue !== 'undefined' && (
            <span className={cn('inline-flex items-center gap-1 text-xs font-semibold', trendColor)}>
              <TrendIcon className="w-3.5 h-3.5" />
              {trendDirection !== 'flat' && trendDirection !== undefined && (
                <>{trendDirection === 'up' ? '+' : '-'}</>
              )}
              {trendValue}
              <span className="text-slate-400 font-normal">vs last wave</span>
            </span>
          )}

          {statusBadge && (
            <span
              className={cn(
                'inline-flex items-center px-2 py-0.5 rounded-md border text-[11px] font-semibold',
                badgeTones[statusBadge.tone]
              )}
            >
              {statusBadge.label}
            </span>
          )}

          {!statusBadge && !trendValue && subtitle && (
            <span className="text-xs text-slate-500">{subtitle}</span>
          )}
        </div>

        {subtitle && (trendValue || statusBadge) && (
          <p className="mt-1.5 text-xs text-slate-500">{subtitle}</p>
        )}
      </div>
    </div>
  );
}

export default StatsCard;
