// ─── Dynamic Real-Time Review & Comment Store (Zustand) ────────────────────────
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Review, Comment, ProductReviewSummary, NewReviewInput, NewCommentInput } from '../types/reviews';
import { calculateReviewSummary } from '../services/reviewService';

interface ReviewStoreState {
  reviewsRecord: Record<string, Review[]>;
  commentsRecord: Record<string, Comment[]>;

  // Review Actions
  getReviewsForProduct: (productId: string) => Review[];
  getReviewSummary: (productId: string) => ProductReviewSummary;
  setProductReviews: (productId: string, reviews: Review[]) => void;
  addReview: (productId: string, input: NewReviewInput, user?: { name: string; avatar?: string }) => void;
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

      getReviewsForProduct: (productId: string) => {
        const { reviewsRecord } = get();
        return reviewsRecord[productId] || [];
      },

      getReviewSummary: (productId: string) => {
        const reviews = get().getReviewsForProduct(productId);
        return calculateReviewSummary(reviews);
      },

      setProductReviews: (productId: string, reviews: Review[]) => {
        set((state) => ({
          reviewsRecord: {
            ...state.reviewsRecord,
            [productId]: reviews,
          },
        }));
      },

      addReview: (productId: string, input: NewReviewInput, user?: { name: string; avatar?: string }) => {
        const newReview: Review = {
          id: `rev-${productId}-${Date.now()}`,
          productId,
          userName: user?.name || 'Verified Customer',
          userAvatar: user?.avatar,
          rating: input.rating,
          title: input.title?.trim() || '',
          body: (input.body || input.comment || '').trim(),
          comment: (input.body || input.comment || '').trim(),
          images: input.images || [],
          pros: input.pros?.filter((p) => p.trim()) || [],
          cons: input.cons?.filter((c) => c.trim()) || [],
          verifiedPurchase: true,
          helpfulVotes: 0,
          helpfulCount: 0,
          isHelpfulVoted: false,
          status: 'published',
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
              const currentVotes = rev.helpfulVotes || rev.helpfulCount || 0;
              return {
                ...rev,
                helpfulVotes: isHelpful ? currentVotes + 1 : Math.max(0, currentVotes - 1),
                helpfulCount: isHelpful ? currentVotes + 1 : Math.max(0, currentVotes - 1),
                isHelpfulVoted: isHelpful,
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
        return commentsRecord[productId] || [];
      },

      addComment: (productId: string, input: NewCommentInput) => {
        const initials =
          input.userName
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
