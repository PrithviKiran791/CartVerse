// ─── Dynamic Real-Time Review & Comment Data Models ───────────────────────────

export interface Review {
  _id?: string;
  id: string;
  productId: string;
  userId?: string;
  userName: string;
  userAvatar?: string;
  orderId?: string | null;
  rating: number; // 1 to 5 integer
  title: string;
  body: string;
  comment?: string; // Backwards compatibility with comment field
  images?: string[];
  pros?: string[];
  cons?: string[];
  verifiedPurchase: boolean;
  helpfulVotes: number;
  helpfulCount?: number; // Backwards compatibility
  isHelpfulVoted?: boolean;
  status?: 'published' | 'pending' | 'rejected';
  reportCount?: number;
  editedAt?: string | null;
  createdAt: string; // ISO date format
  updatedAt?: string;
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
  avgRating: number;
  averageRating?: number; // Backwards compatibility
  reviewCount: number;
  totalReviews?: number; // Backwards compatibility
  breakdown: RatingBreakdown;
  percentageRecommended: number;
}

export interface ReviewPagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
  hasMore: boolean;
}

export interface GetProductReviewsResponse {
  reviews: Review[];
  pagination: ReviewPagination;
  summary: ProductReviewSummary;
  currentUserReview: Review | null;
}

export interface NewReviewInput {
  rating: number;
  title?: string;
  body: string;
  comment?: string;
  images?: string[];
  pros?: string[];
  cons?: string[];
}

export interface NewCommentInput {
  userName: string;
  text: string;
  parentId?: string;
}
