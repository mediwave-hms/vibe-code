import React from 'react';
import { cn } from '../../lib/cn';
import { ProgressBar } from '../ui/ProgressBar';

export interface WaveProgressBadgeProps {
  wave: {
    number: number;
    startDate: string;
    endDate: string;
  };
  className?: string;
}

export const WaveProgressBadge: React.FC<WaveProgressBadgeProps> = ({ wave, className }) => {
  const start = new Date(wave.startDate).getTime();
  const end = new Date(wave.endDate).getTime();
  const now = Date.now();

  const totalDuration = end - start;
  const elapsed = now - start;
  const progress = Math.min(100, Math.max(0, (elapsed / totalDuration) * 100));

  const msPerDay = 1000 * 60 * 60 * 24;
  const daysLeft = Math.max(0, Math.ceil((end - now) / msPerDay));

  const isUrgent = daysLeft <= 3;

  return (
    <div
      className={cn(
        'flex items-center gap-3 px-4 py-2 rounded-lg border',
        isUrgent
          ? 'bg-urgent/10 border-urgent/20'
          : 'bg-brand-50 border-brand-100',
        className
      )}
    >
      <div className="flex flex-col min-w-[140px]">
        <span
          className={cn(
            'text-xs font-semibold',
            isUrgent ? 'text-urgent' : 'text-brand-700'
          )}
        >
          Wave {wave.number} · {daysLeft}d left
        </span>
        <ProgressBar
          value={progress}
          variant={isUrgent ? 'urgent' : 'brand'}
          className="mt-1"
        />
      </div>
    </div>
  );
};
