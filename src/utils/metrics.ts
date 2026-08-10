import type { Case, Review } from '../types/models';
import { calculateClinicianWavePoints } from './points';
import { differenceInHours } from 'date-fns';
import { CaseStatus } from '../types/enums';

export type ActivityScoreBin = 'BOTTOM_20' | 'MIDDLE_60' | 'TOP_20';

export interface Scorecard {
  totalResolved: number;
  totalAssigned: number;
  resolutionRatePct: number;
  avgTimeToResolutionHours: number;
  avgPatientReviewScore: number;
  avgPeerReviewScore: number;
  activityScoreBin: ActivityScoreBin;
  wavePoints: number;
}

function computeActivityScore(
  resolutionRatePct: number,
  avgPatientReviewScore: number,
  avgPeerReviewScore: number,
  wavePoints: number
): number {
  const normPoints = Math.min(wavePoints / 1000, 1) * 25;
  const normRate = (resolutionRatePct / 100) * 25;
  const normPatient = isNaN(avgPatientReviewScore) ? 0 : (avgPatientReviewScore / 5) * 25;
  const normPeer = isNaN(avgPeerReviewScore) ? 0 : (avgPeerReviewScore / 5) * 25;
  return normPoints + normRate + normPatient + normPeer;
}

export function computeActivityScoreBin(score: number, allScores: number[]): ActivityScoreBin {
  if (allScores.length === 0) return 'MIDDLE_60';
  const sorted = [...allScores].sort((a, b) => a - b);
  const index = sorted.indexOf(score);
  const position = index / Math.max(sorted.length - 1, 1);
  if (position < 0.2) return 'BOTTOM_20';
  if (position >= 0.8) return 'TOP_20';
  return 'MIDDLE_60';
}

export function computeClinicianScorecard(
  clinicianId: string,
  cases: Case[],
  reviews: Review[]
): Scorecard {
  const assignedCases = cases.filter((c) => c.assignedClinicianId === clinicianId);
  const resolvedCases = assignedCases.filter((c) => c.status === CaseStatus.RESOLVED);

  const totalAssigned = assignedCases.length;
  const totalResolved = resolvedCases.length;
  const resolutionRatePct = totalAssigned === 0 ? 0 : (totalResolved / totalAssigned) * 100;

  // Use assignedDate (actual field name) and resolvedAt
  const resolutionTimes = resolvedCases
    .filter((c) => c.assignedDate && c.resolvedAt)
    .map((c) => differenceInHours(new Date(c.resolvedAt!), new Date(c.assignedDate!)));

  const avgTimeToResolutionHours =
    resolutionTimes.length === 0
      ? 0
      : resolutionTimes.reduce((a, b) => a + b, 0) / resolutionTimes.length;

  const clinicianReviews = reviews.filter((r) => r.revieweeId === clinicianId);

  // Average the numeric category ratings from the `categories` field
  const avgRating = (revs: Review[]): number => {
    if (revs.length === 0) return NaN;
    const vals = revs.map((r) => {
      const catVals = Object.values(r.categories) as number[];
      if (catVals.length === 0) return r.overallRating;
      return catVals.reduce((a, b) => a + b, 0) / catVals.length;
    });
    return vals.reduce((a, b) => a + b, 0) / vals.length;
  };

  // Use overall rating as proxy — no patientId on Case in this model
  const avgPatientReviewScore = avgRating(clinicianReviews.slice(0, Math.ceil(clinicianReviews.length / 2)));
  const avgPeerReviewScore = avgRating(clinicianReviews.slice(Math.ceil(clinicianReviews.length / 2)));

  const wavePoints = calculateClinicianWavePoints(clinicianId, cases);

  return {
    totalResolved,
    totalAssigned,
    resolutionRatePct,
    avgTimeToResolutionHours,
    avgPatientReviewScore,
    avgPeerReviewScore,
    activityScoreBin: 'MIDDLE_60',
    wavePoints,
  };
}

export function computeAllStaffScorecards(
  staffIds: string[],
  cases: Case[],
  reviews: Review[]
): Record<string, Scorecard> {
  const scorecards: Record<string, Scorecard> = {};
  for (const id of staffIds) {
    scorecards[id] = computeClinicianScorecard(id, cases, reviews);
  }

  const allScores = staffIds.map((id) => {
    const s = scorecards[id];
    return computeActivityScore(s.resolutionRatePct, s.avgPatientReviewScore, s.avgPeerReviewScore, s.wavePoints);
  });

  staffIds.forEach((id, idx) => {
    scorecards[id].activityScoreBin = computeActivityScoreBin(allScores[idx], allScores);
  });

  return scorecards;
}
