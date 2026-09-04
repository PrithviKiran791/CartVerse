// ─── Dynamic Real-Time Review & Comment Data Models ───────────────────────────

export interface Review {
  id: string;
  productId: string;
  userName: string;
  rating: number; // 1 to 5
  title: string;
  comment: string;
  pros?: string[];
  cons?: string[];
  verifiedPurchase: boolean;
  helpfulCount: number;
  unhelpfulCount: number;
  createdAt: string; // ISO date format
}

export interface Comment {
  id: string;
  productId: string;
  userName: string;
  userAvatar?: string;
  text: string;
  likeCount: number;
  createdAt: string; // ISO date format
  parentId?: string; // Optional for nested thread replies
  replies?: Comment[];
}

export interface RatingBreakdown {
  5: number;
  4: number;
  3: number;
  2: number;
  1: number;
}

export interface ProductReviewSummary {
  averageRating: number;
  totalReviews: number;
  breakdown: RatingBreakdown;
  percentageRecommended: number;
}

export interface NewReviewInput {
  userName: string;
  rating: number;
  title: string;
  comment: string;
  pros?: string[];
  cons?: string[];
}

export interface NewCommentInput {
  userName: string;
  text: string;
  parentId?: string;
}
