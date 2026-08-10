import {
  addDays,
  differenceInDays,
  format,
  isBefore,
  isAfter,
  isWithinInterval,
  parseISO,
} from 'date-fns';
import type { Wave } from '../types/models';

export function getReviewDeadline(resolvedAt: Date): Date {
  return addDays(resolvedAt, 14);
}

export function isReviewWindowOpen(
  resolvedAt: Date | string | undefined | null
): boolean {
  if (!resolvedAt) return false;
  const resolvedDate =
    typeof resolvedAt === 'string' ? parseISO(resolvedAt) : resolvedAt;
  const deadline = getReviewDeadline(resolvedDate);
  return isBefore(new Date(), deadline);
}

export function getAppealEligibleDate(
  rejectionDate: Date,
  appealCount: number
): Date | null {
  if (appealCount >= 2) return null;
  const daysToAdd = appealCount === 0 ? 14 : 30;
  return addDays(rejectionDate, daysToAdd);
}

export function canSubmitAppeal(
  rejectionDate: Date,
  appealCount: number
): boolean {
  const eligibleDate = getAppealEligibleDate(rejectionDate, appealCount);
  if (!eligibleDate) return false;
  return (
    isAfter(new Date(), eligibleDate) ||
    differenceInDays(new Date(), eligibleDate) >= 0
  );
}

export function getWaveDurationDays(start: Date, end: Date): number {
  return differenceInDays(end, start) + 1;
}

export function formatDate(
  date: Date | string,
  fmt: string = 'MMM dd, yyyy'
): string {
  const d = typeof date === 'string' ? parseISO(date) : date;
  return format(d, fmt);
}

export function formatDateTime(date: Date | string): string {
  const d = typeof date === 'string' ? parseISO(date) : date;
  return format(d, 'MMM dd, yyyy hh:mm a');
}

export function daysUntil(target: Date): number {
  return differenceInDays(target, new Date());
}

export function isDateInWave(date: Date, wave: Wave): boolean {
  return isWithinInterval(date, {
    start: wave.startDate,
    end: wave.endDate,
  });
}
