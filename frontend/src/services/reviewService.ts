// ─── Frontend Review & Comment API Service Layer ──────────────────────────────
// Serves dynamic reviews and comments for CartVerse products.
// Prepared as functional service contracts for seamless integration with the backend API.

import { Review, Comment, ProductReviewSummary, NewReviewInput, NewCommentInput } from '../types/reviews';

// Mock initial reviews generated procedurally per product
export const generateInitialMockReviews = (productId: string, productName: string): Review[] => {
  return [
    {
      id: `rev-${productId}-1`,
      productId,
      userName: 'Aarav Sharma',
      rating: 5,
      title: 'Absurdly powerful & stable under heavy loads!',
      comment: `Upgraded to this ${productName} for my gaming and video editing setup. Benchmark scores exceeded expectations, thermals stayed below 68°C during stress tests. 100% recommended!`,
      pros: ['Thermal performance', 'Build quality', 'High FPS in 1440p/4K'],
      cons: ['Slight power draw under synthetic load'],
      verifiedPurchase: true,
      helpfulCount: 24,
      unhelpfulCount: 2,
      createdAt: new Date(Date.now() - 5 * 86400000).toISOString(),
    },
    {
      id: `rev-${productId}-2`,
      productId,
      userName: 'Rohan Patel',
      rating: 4,
      title: 'Great value for custom PC builds',
      comment: `Installation was straightforward. Packaging from CartVerse was top notch with insured delivery. Excellent performance per rupee ratio!`,
      pros: ['Fast shipping', 'Genuine warranty card included'],
      cons: ['Requires proper airflow in cabinet'],
      verifiedPurchase: true,
      helpfulCount: 11,
      unhelpfulCount: 1,
      createdAt: new Date(Date.now() - 12 * 86400000).toISOString(),
    },
    {
      id: `rev-${productId}-3`,
      productId,
      userName: 'Priya Nambiar',
      rating: 5,
      title: 'Worth every rupee!',
      comment: 'Replaced my 4-year-old hardware with this model. Smooth experience out of the box with zero stability issues.',
      pros: ['Quiet operation', 'Plug and play'],
      cons: [],
      verifiedPurchase: true,
      helpfulCount: 8,
      unhelpfulCount: 0,
      createdAt: new Date(Date.now() - 20 * 86400000).toISOString(),
    },
  ];
};

// Mock initial comments for product discussion threads
export const generateInitialMockComments = (productId: string): Comment[] => {
  return [
    {
      id: `cmt-${productId}-1`,
      productId,
      userName: 'Vikram Singh',
      userAvatar: 'VS',
      text: 'Does this come with the original brand warranty seal and Indian tax invoice?',
      likeCount: 6,
      createdAt: new Date(Date.now() - 3 * 86400000).toISOString(),
      replies: [
        {
          id: `cmt-${productId}-1-rep-1`,
          productId,
          userName: 'CartVerse Tech Team',
          userAvatar: 'CV',
          text: 'Yes! All items shipped by CartVerse include 100% official brand warranty and a valid GST invoice for claim processing.',
          likeCount: 9,
          createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
          parentId: `cmt-${productId}-1`,
        },
      ],
    },
    {
      id: `cmt-${productId}-2`,
      productId,
      userName: 'Karan Mehta',
      userAvatar: 'KM',
      text: 'Can anyone confirm what power supply wattage is recommended for this component?',
      likeCount: 4,
      createdAt: new Date(Date.now() - 6 * 86400000).toISOString(),
      replies: [],
    },
  ];
};

/**
 * Calculates review statistics (average rating, distribution breakdown, recommendation %)
 */
export const calculateReviewSummary = (reviews: Review[]): ProductReviewSummary => {
  if (reviews.length === 0) {
    return {
      averageRating: 5.0,
      totalReviews: 0,
      breakdown: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
      percentageRecommended: 100,
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

  const averageRating = Number((sum / reviews.length).toFixed(1));
  const percentageRecommended = Math.round((recommendedCount / reviews.length) * 100);

  return {
    averageRating,
    totalReviews: reviews.length,
    breakdown,
    percentageRecommended,
  };
};
