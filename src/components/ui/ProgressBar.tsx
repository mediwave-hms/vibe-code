import React from 'react';
import { cn } from '../../lib/cn';

export interface ProgressBarProps {
  value: number;
  label?: string;
  showPercentage?: boolean;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'urgent' | 'brand';
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  label,
  showPercentage = false,
  variant = 'brand',
  className,
}) => {
  const clampedValue = Math.min(100, Math.max(0, value));

  const variantStyles = {
    default: 'bg-slate-500',
    success: 'bg-emerald-500',
    warning: 'bg-amber-500',
    danger: 'bg-red-500',
    urgent: 'bg-urgent',
    brand: 'bg-brand-500',
  };

  return (
    <div className={cn('w-full', className)}>
      {(label || showPercentage) && (
        <div className="flex items-center justify-between mb-2">
          {label && (
            <span className="text-sm font-medium text-slate-700">{label}</span>
          )}
          {showPercentage && (
            <span className="text-sm font-medium text-slate-500">
              {Math.round(clampedValue)}%
            </span>
          )}
        </div>
      )}
      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
        <div
          className={cn(
            'h-full rounded-full transition-all duration-500 ease-out',
            variantStyles[variant]
          )}
          style={{ width: `${clampedValue}%` }}
        />
      </div>
    </div>
  );
};
