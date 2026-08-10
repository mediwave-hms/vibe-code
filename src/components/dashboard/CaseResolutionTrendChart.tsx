import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  type TooltipProps,
} from 'recharts';
import { cn } from '../../lib/cn';

interface TrendDatum {
  wave: string;
  opened: number;
  resolved: number;
}

interface CaseResolutionTrendChartProps {
  data?: TrendDatum[];
  className?: string;
}

const defaultData: TrendDatum[] = [
  { wave: 'Wave 1', opened: 42, resolved: 36 },
  { wave: 'Wave 2', opened: 55, resolved: 48 },
  { wave: 'Wave 3', opened: 49, resolved: 52 },
  { wave: 'Wave 4', opened: 67, resolved: 61 },
  { wave: 'Wave 5', opened: 73, resolved: 70 },
  { wave: 'Wave 6', opened: 58, resolved: 44 },
];

function CustomTooltip({ active, payload, label }: TooltipProps<number, string>) {
  if (!active || !payload || payload.length === 0) return null;
  const opened = payload.find((p) => p.dataKey === 'opened');
  const resolved = payload.find((p) => p.dataKey === 'resolved');
  return (
    <div className="rounded-xl bg-white shadow-xl border border-slate-200 p-3.5 text-sm min-w-[180px]">
      <p className="font-semibold text-slate-900 mb-2.5">{label}</p>
      <div className="space-y-2">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
            <span className="text-slate-600">Opened</span>
          </div>
          <span className="font-semibold text-slate-900">{opened?.value ?? 0}</span>
        </div>
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span className="text-slate-600">Resolved</span>
          </div>
          <span className="font-semibold text-slate-900">{resolved?.value ?? 0}</span>
        </div>
      </div>
    </div>
  );
}

export function CaseResolutionTrendChart({
  data = defaultData,
  className,
}: CaseResolutionTrendChartProps) {
  return (
    <div className={cn('bg-white rounded-2xl border border-slate-200 p-5 shadow-sm', className)}>
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold text-slate-900">Case resolution trend</h3>
          <p className="text-xs text-slate-500 mt-0.5">Opened vs resolved over last 6 waves</p>
        </div>
        <div className="flex items-center gap-3 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
            <span className="text-slate-600 font-medium">Opened</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span className="text-slate-600 font-medium">Resolved</span>
          </div>
        </div>
      </div>

      <div className="h-64 sm:h-72">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorOpened" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.35} />
                <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorResolved" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10b981" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
            <XAxis
              dataKey="wave"
              tick={{ fontSize: 12, fill: '#64748b' }}
              tickLine={false}
              axisLine={{ stroke: '#e2e8f0' }}
            />
            <YAxis
              tick={{ fontSize: 12, fill: '#64748b' }}
              tickLine={false}
              axisLine={false}
              allowDecimals={false}
            />
            <Tooltip
              cursor={{ stroke: '#cbd5e1', strokeDasharray: '4 4' }}
              content={<CustomTooltip />}
            />
            <Area
              type="monotone"
              dataKey="opened"
              stroke="#3b82f6"
              strokeWidth={2.5}
              fill="url(#colorOpened)"
              activeDot={{ r: 5, strokeWidth: 0, fill: '#3b82f6' }}
            />
            <Area
              type="monotone"
              dataKey="resolved"
              stroke="#10b981"
              strokeWidth={2.5}
              fill="url(#colorResolved)"
              activeDot={{ r: 5, strokeWidth: 0, fill: '#10b981' }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default CaseResolutionTrendChart;
