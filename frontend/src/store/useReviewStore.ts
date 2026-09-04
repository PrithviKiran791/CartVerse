// ─── Dynamic Real-Time Review & Comment Store (Zustand) ────────────────────────
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Review, Comment, ProductReviewSummary, NewReviewInput, NewCommentInput } from '../types/reviews';
import { generateInitialMockReviews, generateInitialMockComments, calculateReviewSummary } from '../services/reviewService';

interface ReviewStoreState {
  reviewsRecord: Record<string, Review[]>;
  commentsRecord: Record<string, Comment[]>;

  // Review Actions
  getReviewsForProduct: (productId: string, productName?: string) => Review[];
  getReviewSummary: (productId: string, productName?: string) => ProductReviewSummary;
  addReview: (productId: string, input: NewReviewInput) => void;
  voteReviewHelpful: (productId: string, reviewId: string, isHelpful: boolean) => void;

  // Comment Actions
  getCommentsForProduct: (productId: string) => Comment[];
  addComment: (productId: string, input: NewCommentInput) => void;
  likeComment: (productId: string, commentId: string) => void;
}

export const useReviewStore = create<ReviewStoreState>()(
  persist(
    (set, get) => ({
      reviewsRecord: {},
      commentsRecord: {},

      getReviewsForProduct: (productId: string, productName: string = 'Hardware Component') => {
        const { reviewsRecord } = get();
        if (!reviewsRecord[productId]) {
          const initialReviews = generateInitialMockReviews(productId, productName);
          set((state) => ({
            reviewsRecord: { ...state.reviewsRecord, [productId]: initialReviews },
          }));
          return initialReviews;
        }
        return reviewsRecord[productId];
      },

      getReviewSummary: (productId: string, productName: string = 'Hardware Component') => {
        const reviews = get().getReviewsForProduct(productId, productName);
        return calculateReviewSummary(reviews);
      },

      addReview: (productId: string, input: NewReviewInput) => {
        const newReview: Review = {
          id: `rev-${productId}-${Date.now()}`,
          productId,
          userName: input.userName.trim() || 'Verified Customer',
          rating: input.rating,
          title: input.title.trim() || 'Product Review',
          comment: input.comment.trim(),
          pros: input.pros?.filter(p => p.trim()) || [],
          cons: input.cons?.filter(c => c.trim()) || [],
          verifiedPurchase: true,
          helpfulCount: 0,
          unhelpfulCount: 0,
          createdAt: new Date().toISOString(),
        };

        set((state) => {
          const currentReviews = state.reviewsRecord[productId] || [];
          return {
            reviewsRecord: {
              ...state.reviewsRecord,
              [productId]: [newReview, ...currentReviews],
            },
          };
        });
      },

      voteReviewHelpful: (productId: string, reviewId: string, isHelpful: boolean) => {
        set((state) => {
          const currentReviews = state.reviewsRecord[productId] || [];
          const updatedReviews = currentReviews.map((rev) => {
            if (rev.id === reviewId) {
              return {
                ...rev,
                helpfulCount: isHelpful ? rev.helpfulCount + 1 : rev.helpfulCount,
                unhelpfulCount: !isHelpful ? rev.unhelpfulCount + 1 : rev.unhelpfulCount,
              };
            }
            return rev;
          });

          return {
            reviewsRecord: { ...state.reviewsRecord, [productId]: updatedReviews },
          };
        });
      },

      getCommentsForProduct: (productId: string) => {
        const { commentsRecord } = get();
        if (!commentsRecord[productId]) {
          const initialComments = generateInitialMockComments(productId);
          set((state) => ({
            commentsRecord: { ...state.commentsRecord, [productId]: initialComments },
          }));
          return initialComments;
        }
        return commentsRecord[productId];
      },

      addComment: (productId: string, input: NewCommentInput) => {
        const initials = input.userName
          .split(' ')
          .map((n) => n[0])
          .join('')
          .toUpperCase()
          .slice(0, 2) || 'CV';

        const newComment: Comment = {
          id: `cmt-${productId}-${Date.now()}`,
          productId,
          userName: input.userName.trim() || 'Anonymous Builder',
          userAvatar: initials,
          text: input.text.trim(),
          likeCount: 0,
          createdAt: new Date().toISOString(),
          parentId: input.parentId,
          replies: [],
        };

        set((state) => {
          const currentComments = state.commentsRecord[productId] || [];

          if (input.parentId) {
            // Add reply to existing parent comment
            const updatedComments = currentComments.map((cmt) => {
              if (cmt.id === input.parentId) {
                return {
                  ...cmt,
                  replies: [...(cmt.replies || []), newComment],
                };
              }
              return cmt;
            });
            return {
              commentsRecord: { ...state.commentsRecord, [productId]: updatedComments },
            };
          }

          // New top-level comment
          return {
            commentsRecord: {
              ...state.commentsRecord,
              [productId]: [newComment, ...currentComments],
            },
          };
        });
      },

      likeComment: (productId: string, commentId: string) => {
        set((state) => {
          const currentComments = state.commentsRecord[productId] || [];

          const updateCommentLikes = (list: Comment[]): Comment[] => {
            return list.map((cmt) => {
              if (cmt.id === commentId) {
                return { ...cmt, likeCount: cmt.likeCount + 1 };
              }
              if (cmt.replies && cmt.replies.length > 0) {
                return { ...cmt, replies: updateCommentLikes(cmt.replies) };
              }
              return cmt;
            });
          };

          return {
            commentsRecord: {
              ...state.commentsRecord,
              [productId]: updateCommentLikes(currentComments),
            },
          };
        });
      },
    }),
    {
      name: 'cartverse-reviews-storage',
    }
  )
);
