import { useEffect, useState } from 'react';
import { REVIEW_DEADLINE_DAYS_DEFAULT } from '../data/constants';

export function useReviewDeadline(
  resolvedAt: Date | null | undefined,
  deadlineDays: number = REVIEW_DEADLINE_DAYS_DEFAULT
) {
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 60 * 1000);
    return () => clearInterval(t);
  }, []);

  const deadlineDate = resolvedAt
    ? new Date(new Date(resolvedAt).getTime() + deadlineDays * 24 * 60 * 60 * 1000)
    : null;

  let totalMsLeft = 0;
  let isOpen = false;
  if (deadlineDate) {
    totalMsLeft = deadlineDate.getTime() - now;
    isOpen = totalMsLeft > 0;
  }

  const daysLeft = Math.max(0, Math.floor(totalMsLeft / (1000 * 60 * 60 * 24)));
  const hoursLeft = Math.max(
    0,
    Math.floor((totalMsLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  );
  const isDeadlineApproaching = isOpen && totalMsLeft < 3 * 24 * 60 * 60 * 1000;

  return {
    daysLeft,
    hoursLeft,
    isOpen,
    deadlineDate,
    isDeadlineApproaching,
  };
}

export default useReviewDeadline;
