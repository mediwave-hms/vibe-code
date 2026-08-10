import React from 'react';
import { cn } from '../../lib/cn';

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  leftAdornment?: React.ReactNode;
}

export const Select: React.FC<SelectProps> = ({
  leftAdornment,
  className,
  children,
  ...props
}) => {
  return (
    <div className="relative w-full">
      {leftAdornment && (
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
          {leftAdornment}
        </div>
      )}
      <select
        className={cn(
          'input appearance-none pr-10 cursor-pointer',
          leftAdornment && 'pl-10',
          className
        )}
        {...props}
      >
        {children}
      </select>
      <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </div>
    </div>
  );
};
