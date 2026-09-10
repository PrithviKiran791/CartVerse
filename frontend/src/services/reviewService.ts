// ─── Frontend Review & Comment API Service Layer ──────────────────────────────
// Communicates with backend /api/products/:productId/reviews and /api/reviews
// No mock, hardcoded, or fake sample reviews.

import {
  Review,
  Comment,
  ProductReviewSummary,
  NewReviewInput,
  NewCommentInput,
  GetProductReviewsResponse,
} from '../types/reviews';
import { useAuthStore } from '../store/useAuthStore';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

/**
 * Builds standard auth headers
 */
const getAuthHeaders = (): HeadersInit => {
  const token = useAuthStore.getState().token;
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

/**
 * Fetch paginated, published reviews & server-computed summary for a product
 */
export const fetchProductReviews = async (
  productId: string,
  params: { page?: number; limit?: number; sort?: string } = {}
): Promise<GetProductReviewsResponse> => {
  const { page = 1, limit = 10, sort = 'recent' } = params;
  const query = new URLSearchParams({
    page: String(page),
    limit: String(limit),
    sort,
  });

  const res = await fetch(`${BASE_URL}/products/${encodeURIComponent(productId)}/reviews?${query}`, {
    method: 'GET',
    headers: getAuthHeaders(),
    credentials: 'include',
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || 'Failed to fetch product reviews');
  }

  const data: GetProductReviewsResponse = await res.json();
  return data;
};

/**
 * Submit a new review for a product (requires authentication)
 */
export const submitProductReview = async (
  productId: string,
  input: NewReviewInput
): Promise<{ message: string; review: Review }> => {
  const res = await fetch(`${BASE_URL}/products/${encodeURIComponent(productId)}/reviews`, {
    method: 'POST',
    headers: getAuthHeaders(),
    credentials: 'include',
    body: JSON.stringify({
      rating: input.rating,
      title: input.title,
      body: input.body || input.comment,
      images: input.images || [],
    }),
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.message || 'Failed to submit review');
  }

  return data;
};

/**
 * Update an existing review (owner only)
 */
export const updateProductReview = async (
  reviewId: string,
  input: Partial<NewReviewInput>
): Promise<{ message: string; review: Review }> => {
  const res = await fetch(`${BASE_URL}/reviews/${reviewId}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    credentials: 'include',
    body: JSON.stringify({
      rating: input.rating,
      title: input.title,
      body: input.body || input.comment,
      images: input.images,
    }),
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.message || 'Failed to update review');
  }

  return data;
};

/**
 * Delete a review (owner or admin)
 */
export const deleteProductReview = async (
  reviewId: string
): Promise<{ message: string }> => {
  const res = await fetch(`${BASE_URL}/reviews/${reviewId}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
    credentials: 'include',
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.message || 'Failed to delete review');
  }

  return data;
};

/**
 * Vote a review as helpful (or toggle vote)
 */
export const voteReviewHelpful = async (
  reviewId: string
): Promise<{ helpfulVotes: number; isHelpfulVoted: boolean }> => {
  const res = await fetch(`${BASE_URL}/reviews/${reviewId}/helpful`, {
    method: 'POST',
    headers: getAuthHeaders(),
    credentials: 'include',
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.message || 'Failed to record helpful vote');
  }

  return data;
};

/**
 * Report an inappropriate review
 */
export const reportProductReview = async (
  reviewId: string
): Promise<{ message: string; isHidden: boolean }> => {
  const res = await fetch(`${BASE_URL}/reviews/${reviewId}/report`, {
    method: 'POST',
    headers: getAuthHeaders(),
    credentials: 'include',
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.message || 'Failed to report review');
  }

  return data;
};

/**
 * Calculates review statistics when needed locally.
 * Note: Empty reviews return 0 average and 0 total, NEVER fake 5.0 or sample counts.
 */
export const calculateReviewSummary = (reviews: Review[]): ProductReviewSummary => {
  if (!reviews || reviews.length === 0) {
    return {
      avgRating: 0,
      averageRating: 0,
      reviewCount: 0,
      totalReviews: 0,
      breakdown: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
      percentageRecommended: 0,
    };
  }

  const breakdown = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  let sum = 0;
  let recommendedCount = 0;

  reviews.forEach((r) => {
    sum += r.rating;
    const roundedRating = Math.min(5, Math.max(1, Math.round(r.rating))) as 1 | 2 | 3 | 4 | 5;
    breakdown[roundedRating] = (breakdown[roundedRating] || 0) + 1;
    if (r.rating >= 4) recommendedCount++;
  });

  const avgRating = Number((sum / reviews.length).toFixed(1));
  const percentageRecommended = Math.round((recommendedCount / reviews.length) * 100);

  return {
    avgRating,
    averageRating: avgRating,
    reviewCount: reviews.length,
    totalReviews: reviews.length,
    breakdown,
    percentageRecommended,
  };
};
