import React from 'react';
import { cn } from '../../lib/cn';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'secondary' | 'success' | 'warning' | 'danger' | 'info' | 'urgent' | 'brand';
}

export const Badge: React.FC<BadgeProps> = ({
  variant = 'default',
  className,
  children,
  ...props
}) => {
  const variantStyles = {
    default: 'badge-default',
    secondary: 'badge-default',
    success: 'badge-success',
    warning: 'badge-warning',
    danger: 'badge-danger',
    info: 'badge-info',
    urgent: 'badge-urgent',
    brand: 'badge-brand',
  };

  return (
    <span className={cn('badge', variantStyles[variant], className)} {...props}>
      {children}
    </span>
  );
};
