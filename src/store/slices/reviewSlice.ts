import { StateCreator } from 'zustand';
import { Review, Case } from '../../types/models';

export interface ReviewSlice {
  reviews: Review[];
  submitReview: (
    caseId: string,
    reviewerId: string,
    revieweeId: string,
    overall: number,
    categories: Record<string, number>,
    comment?: string
  ) => void;
  updateReview: (reviewId: string, patch: Partial<Review>) => void;
  hasSubmittedReview: (caseId: string, reviewerId: string) => boolean;
  getUserReviews: (userId: string, cases?: Case[]) => Review[];
  addBulkReviews: (reviews: Review[]) => void;
}

export const createReviewSlice: StateCreator<ReviewSlice> = (set, get) => ({
  reviews: [],

  submitReview: (caseId, reviewerId, revieweeId, overall, categories, comment) => {
    const now = new Date();
    const review: Review = {
      id: `r_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      caseId,
      reviewerId,
      revieweeId,
      overallRating: overall,
      categories,
      comment,
      createdAt: now,
      updatedAt: now,
    };
    set((state) => ({ reviews: [...state.reviews, review] }));
  },

  updateReview: (reviewId, patch) => {
    set((state) => ({
      reviews: state.reviews.map((r: Review) =>
        r.id === reviewId ? { ...r, ...patch, updatedAt: new Date() } : r
      ),
    }));
  },

  hasSubmittedReview: (caseId, reviewerId) => {
    return get().reviews.some((r) => r.caseId === caseId && r.reviewerId === reviewerId);
  },

  getUserReviews: (userId, cases) => {
    if (cases) {
      const caseIds = new Set(cases.map((c: Case) => c.id));
      return get().reviews.filter(
        (r) => (r.reviewerId === userId || r.revieweeId === userId) && caseIds.has(r.caseId)
      );
    }
    return get().reviews.filter((r: Review) => r.reviewerId === userId || r.revieweeId === userId);
  },

  addBulkReviews: (reviews) => {
    set((state) => ({ reviews: [...state.reviews, ...reviews] }));
  },
});
