import React, { useState, useEffect, useCallback } from 'react';
import {
  Star,
  ThumbsUp,
  ShieldCheck,
  Plus,
  ArrowUpDown,
  Flag,
  Edit3,
  Trash2,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  LogIn,
  Loader2,
  MessageSquareOff,
} from 'lucide-react';
import {
  Review,
  ProductReviewSummary,
  ReviewPagination,
  NewReviewInput,
} from '../../types/reviews';
import {
  fetchProductReviews,
  submitProductReview,
  updateProductReview,
  deleteProductReview,
  voteReviewHelpful,
  reportProductReview,
} from '../../services/reviewService';
import { useAuthStore } from '../../store/useAuthStore';
import { useUIStore } from '../../store/useUIStore';
import { Link } from 'react-router-dom';

interface ProductReviewsSectionProps {
  productId: string;
  productName: string;
}

export const ProductReviewsSection: React.FC<ProductReviewsSectionProps> = ({
  productId,
  productName,
}) => {
  const { user, isAuthenticated } = useAuthStore();
  const { addToast } = useUIStore();

  // Review List State
  const [reviews, setReviews] = useState<Review[]>([]);
  const [summary, setSummary] = useState<ProductReviewSummary>({
    avgRating: 0,
    reviewCount: 0,
    breakdown: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
    percentageRecommended: 0,
  });
  const [pagination, setPagination] = useState<ReviewPagination>({
    page: 1,
    limit: 8,
    total: 0,
    pages: 1,
    hasMore: false,
  });
  const [currentUserReview, setCurrentUserReview] = useState<Review | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [sortBy, setSortBy] = useState<'recent' | 'helpful' | 'rating_high' | 'rating_low'>('recent');

  // Form State
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formRating, setFormRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [formTitle, setFormTitle] = useState('');
  const [formBody, setFormBody] = useState('');
  const [formImageUrl, setFormImageUrl] = useState('');
  const [formImages, setFormImages] = useState<string[]>([]);
  const [reportingReviewId, setReportingReviewId] = useState<string | null>(null);

  // Fetch reviews from API
  const loadReviews = useCallback(
    async (pageToLoad: number, append: boolean = false) => {
      if (append) {
        setIsLoadingMore(true);
      } else {
        setIsLoading(true);
      }

      try {
        const data = await fetchProductReviews(productId, {
          page: pageToLoad,
          limit: 8,
          sort: sortBy,
        });

        if (append) {
          setReviews((prev) => [...prev, ...data.reviews]);
        } else {
          setReviews(data.reviews);
        }

        setSummary(data.summary);
        setPagination(data.pagination);
        setCurrentUserReview(data.currentUserReview);
      } catch (err: any) {
        console.error('Failed to load reviews:', err.message);
      } finally {
        setIsLoading(false);
        setIsLoadingMore(false);
      }
    },
    [productId, sortBy]
  );

  // Initial fetch and sort changes
  useEffect(() => {
    loadReviews(1, false);
  }, [loadReviews]);

  // Real-time polling: refetch reviews every 30 seconds while active
  useEffect(() => {
    const interval = setInterval(() => {
      // Background silent refresh for current page
      fetchProductReviews(productId, {
        page: 1,
        limit: pagination.limit * pagination.page,
        sort: sortBy,
      })
        .then((data) => {
          setReviews(data.reviews);
          setSummary(data.summary);
          setPagination((prev) => ({
            ...prev,
            total: data.pagination.total,
            pages: data.pagination.pages,
            hasMore: data.pagination.hasMore,
          }));
          setCurrentUserReview(data.currentUserReview);
        })
        .catch(() => {});
    }, 30000);

    return () => clearInterval(interval);
  }, [productId, sortBy, pagination.limit, pagination.page]);

  // Open Form for Editing
  const handleOpenEdit = () => {
    if (currentUserReview) {
      setFormRating(currentUserReview.rating);
      setFormTitle(currentUserReview.title || '');
      setFormBody(currentUserReview.body || currentUserReview.comment || '');
      setFormImages(currentUserReview.images || []);
      setIsFormOpen(true);
    }
  };

  // Open Form for New Submission
  const handleOpenNew = () => {
    if (!isAuthenticated) {
      addToast({
        type: 'info',
        title: 'Authentication Required',
        message: 'Please sign in to write a review for this product.',
      });
      return;
    }
    setFormRating(5);
    setFormTitle('');
    setFormBody('');
    setFormImages([]);
    setIsFormOpen(true);
  };

  const handleAddImage = () => {
    if (formImageUrl.trim()) {
      if (formImages.length >= 3) {
        addToast({
          type: 'warning',
          title: 'Limit Reached',
          message: 'You can attach a maximum of 3 images per review.',
        });
        return;
      }
      setFormImages([...formImages, formImageUrl.trim()]);
      setFormImageUrl('');
    }
  };

  const handleRemoveImage = (index: number) => {
    setFormImages(formImages.filter((_, i) => i !== index));
  };

  // Submit or Update Review
  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formBody.trim() || formBody.trim().length < 5) {
      addToast({
        type: 'warning',
        title: 'Review Too Short',
        message: 'Please write at least 5 characters in your review body.',
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const reviewPayload: NewReviewInput = {
        rating: formRating,
        title: formTitle.trim(),
        body: formBody.trim(),
        images: formImages,
      };

      if (currentUserReview?._id || currentUserReview?.id) {
        const reviewId = currentUserReview._id || currentUserReview.id;
        const res = await updateProductReview(reviewId, reviewPayload);
        addToast({
          type: 'success',
          title: 'Review Updated',
          message: res.message || 'Your review has been updated successfully.',
        });
      } else {
        const res = await submitProductReview(productId, reviewPayload);
        addToast({
          type: 'success',
          title: 'Review Submitted',
          message: res.message || 'Thank you for submitting your real-time review.',
        });
      }

      setIsFormOpen(false);
      // Reload reviews immediately
      loadReviews(1, false);
    } catch (err: any) {
      addToast({
        type: 'error',
        title: 'Submission Error',
        message: err.message || 'Could not save your review.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete own review
  const handleDeleteReview = async () => {
    if (!currentUserReview) return;
    const reviewId = currentUserReview._id || currentUserReview.id;
    if (!window.confirm('Are you sure you want to permanently delete your review?')) return;

    try {
      await deleteProductReview(reviewId);
      addToast({
        type: 'success',
        title: 'Review Deleted',
        message: 'Your review has been removed.',
      });
      setIsFormOpen(false);
      loadReviews(1, false);
    } catch (err: any) {
      addToast({
        type: 'error',
        title: 'Delete Failed',
        message: err.message || 'Could not delete review.',
      });
    }
  };

  // Optimistic Helpful Vote
  const handleVoteHelpful = async (review: Review) => {
    if (!isAuthenticated) {
      addToast({
        type: 'info',
        title: 'Sign In Required',
        message: 'Please sign in to vote on reviews.',
      });
      return;
    }

    const reviewId = review._id || review.id;
    const currentVoted = Boolean(review.isHelpfulVoted);
    const prevVotes = review.helpfulVotes ?? review.helpfulCount ?? 0;

    // Optimistic UI update
    setReviews((prev) =>
      prev.map((r) => {
        if ((r._id || r.id) === reviewId) {
          return {
            ...r,
            isHelpfulVoted: !currentVoted,
            helpfulVotes: currentVoted ? Math.max(0, prevVotes - 1) : prevVotes + 1,
            helpfulCount: currentVoted ? Math.max(0, prevVotes - 1) : prevVotes + 1,
          };
        }
        return r;
      })
    );

    try {
      await voteReviewHelpful(reviewId);
    } catch (err: any) {
      // Rollback on error
      setReviews((prev) =>
        prev.map((r) => {
          if ((r._id || r.id) === reviewId) {
            return {
              ...r,
              isHelpfulVoted: currentVoted,
              helpfulVotes: prevVotes,
              helpfulCount: prevVotes,
            };
          }
          return r;
        })
      );
      addToast({
        type: 'error',
        title: 'Vote Error',
        message: err.message || 'Could not register helpful vote.',
      });
    }
  };

  // Report Inappropriate Review
  const handleReport = async (reviewId: string) => {
    if (!isAuthenticated) {
      addToast({
        type: 'info',
        title: 'Sign In Required',
        message: 'Please sign in to report a review.',
      });
      return;
    }

    if (!window.confirm('Report this review for violating community guidelines?')) return;

    try {
      const res = await reportProductReview(reviewId);
      addToast({
        type: 'info',
        title: 'Report Received',
        message: res.message || 'Thank you. Our moderators will review this content.',
      });

      if (res.isHidden) {
        // Remove from current view
        setReviews((prev) => prev.filter((r) => (r._id || r.id) !== reviewId));
      }
    } catch (err: any) {
      addToast({
        type: 'error',
        title: 'Report Failed',
        message: err.message || 'Could not submit report.',
      });
    }
  };

  // Rating descriptor labels
  const getRatingLabel = (score: number) => {
    switch (score) {
      case 5:
        return '5 Stars — Exceptional Performance';
      case 4:
        return '4 Stars — Very Good & Recommended';
      case 3:
        return '3 Stars — Adequate / Average';
      case 2:
        return '2 Stars — Below Expectations';
      case 1:
        return '1 Star — Major Issues / Unacceptable';
      default:
        return `${score} Stars`;
    }
  };

  return (
    <div className="bg-neutral-900/80 border border-neutral-800 rounded-3xl p-6 sm:p-8 backdrop-blur-md space-y-8 my-8">
      {/* Header & Write Review Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-800 pb-6">
        <div>
          <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <span>Customer Reviews & Ratings</span>
            <span className="text-xs font-mono bg-neutral-800 text-neutral-300 px-2.5 py-1 rounded-full font-normal">
              {summary.reviewCount} {summary.reviewCount === 1 ? 'Review' : 'Reviews'}
            </span>
          </h3>
          <p className="text-xs text-neutral-400 font-mono mt-1">
            Real, verified customer ratings & benchmark experiences for {productName}
          </p>
        </div>

        <div>
          {currentUserReview ? (
            <button
              type="button"
              onClick={handleOpenEdit}
              className="px-5 py-2.5 bg-neutral-800 hover:bg-neutral-750 text-white font-mono font-bold text-xs uppercase tracking-wider rounded-xl border border-neutral-700 hover:border-red-500/60 shadow-lg flex items-center gap-2 transition-all cursor-pointer"
            >
              <Edit3 className="w-4 h-4 text-red-500" />
              <span>Edit Your Review</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={handleOpenNew}
              className="px-5 py-2.5 bg-red-600 hover:bg-red-500 text-white font-mono font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg flex items-center gap-2 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Write a Review</span>
            </button>
          )}
        </div>
      </div>

      {/* Review Submission / Editing Modal Form */}
      {isFormOpen && (
        <form
          onSubmit={handleSubmitReview}
          className="bg-neutral-950 border border-red-500/30 rounded-2xl p-6 space-y-5 animate-in fade-in duration-200"
        >
          <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
            <h4 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2 font-mono">
              <Star className="w-4 h-4 text-red-500 fill-red-500" />
              <span>{currentUserReview ? 'Edit Your Product Review' : 'Share Your Experience'}</span>
            </h4>
            <button
              type="button"
              onClick={() => setIsFormOpen(false)}
              className="text-xs text-neutral-400 hover:text-white font-mono"
            >
              Cancel
            </button>
          </div>

          {/* Interactive Star Picker */}
          <div>
            <label className="block text-xs font-mono uppercase text-neutral-400 mb-2">
              Overall Hardware Rating *
            </label>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setFormRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="p-1 text-neutral-600 hover:text-amber-400 transition-colors focus:outline-none"
                  >
                    <Star
                      className={`w-6 h-6 ${
                        (hoverRating || formRating) >= star
                          ? 'text-amber-400 fill-amber-400'
                          : 'text-neutral-700'
                      }`}
                    />
                  </button>
                ))}
              </div>
              <span className="text-xs font-mono text-neutral-300 font-bold ml-2">
                {getRatingLabel(hoverRating || formRating)}
              </span>
            </div>
          </div>

          {/* Headline / Title */}
          <div>
            <label className="block text-xs font-mono uppercase text-neutral-400 mb-1.5">
              Review Title (Optional)
            </label>
            <input
              type="text"
              value={formTitle}
              onChange={(e) => setFormTitle(e.target.value)}
              placeholder="e.g. Blazing fast thermals, runs cyberpunk at 120 FPS!"
              maxLength={120}
              className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-neutral-500 font-mono outline-none focus:border-red-500"
            />
          </div>

          {/* Review Body */}
          <div>
            <label className="block text-xs font-mono uppercase text-neutral-400 mb-1.5">
              Detailed Feedback & Build Experience * (Min 5 Characters)
            </label>
            <textarea
              rows={4}
              value={formBody}
              onChange={(e) => setFormBody(e.target.value)}
              placeholder="Share how this hardware performs in your rig, installation experience, thermals, acoustic profile, or silicon stability..."
              required
              minLength={5}
              maxLength={2000}
              className="w-full bg-neutral-900 border border-neutral-800 rounded-xl p-4 text-xs text-white placeholder-neutral-500 font-mono outline-none focus:border-red-500 leading-relaxed"
            />
            <div className="flex justify-between items-center text-[10px] font-mono text-neutral-500 mt-1">
              <span>Minimum 5 characters required</span>
              <span>{formBody.length} / 2000</span>
            </div>
          </div>

          {/* Image Attachments */}
          <div>
            <label className="block text-xs font-mono uppercase text-neutral-400 mb-1.5">
              Build / Benchmark Images (Optional URL, Max 3)
            </label>
            <div className="flex gap-2">
              <input
                type="url"
                value={formImageUrl}
                onChange={(e) => setFormImageUrl(e.target.value)}
                placeholder="https://images.cloudinary.com/... or image link"
                className="flex-1 bg-neutral-900 border border-neutral-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-neutral-500 font-mono outline-none focus:border-red-500"
              />
              <button
                type="button"
                onClick={handleAddImage}
                disabled={!formImageUrl.trim() || formImages.length >= 3}
                className="px-4 py-2 bg-neutral-800 hover:bg-neutral-750 disabled:opacity-40 text-neutral-200 text-xs font-mono rounded-xl border border-neutral-700 cursor-pointer"
              >
                Add Image
              </button>
            </div>
            {formImages.length > 0 && (
              <div className="flex gap-2 mt-2">
                {formImages.map((img, idx) => (
                  <div key={idx} className="relative w-16 h-16 rounded-lg overflow-hidden border border-neutral-700">
                    <img src={img} alt="Preview" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(idx)}
                      className="absolute top-1 right-1 bg-black/80 rounded-full w-4 h-4 text-[10px] text-white flex items-center justify-center hover:bg-red-600"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Form Actions */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-neutral-800">
            {currentUserReview && (
              <button
                type="button"
                onClick={handleDeleteReview}
                className="text-xs font-mono text-red-400 hover:text-red-300 flex items-center gap-1.5 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Review</span>
              </button>
            )}
            <div className="flex items-center gap-3 ml-auto">
              <button
                type="button"
                onClick={() => setIsFormOpen(false)}
                className="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-xs font-mono text-neutral-400 rounded-xl cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2.5 bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white font-mono font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg flex items-center gap-2 cursor-pointer"
              >
                {isSubmitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                <span>{currentUserReview ? 'Update Review' : 'Publish Review'}</span>
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Ratings Summary & Breakdown Widget */}
      {summary.reviewCount > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 bg-neutral-950/70 border border-neutral-800 p-6 rounded-2xl">
          {/* Left: Score Badge */}
          <div className="md:col-span-4 flex flex-col items-center justify-center text-center p-4 border-b md:border-b-0 md:border-r border-neutral-800">
            <span className="text-5xl sm:text-6xl font-black text-white font-mono tracking-tight">
              {summary.avgRating.toFixed(1)}
            </span>
            <div className="flex items-center gap-1 my-2">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star
                  key={s}
                  className={`w-4 h-4 ${
                    summary.avgRating >= s
                      ? 'text-amber-400 fill-amber-400'
                      : summary.avgRating >= s - 0.5
                      ? 'text-amber-400 fill-amber-400/50'
                      : 'text-neutral-700'
                  }`}
                />
              ))}
            </div>
            <span className="text-xs font-mono text-neutral-400">
              Based on {summary.reviewCount} verified {summary.reviewCount === 1 ? 'rating' : 'ratings'}
            </span>
            <span className="text-[11px] font-mono text-emerald-400 font-bold mt-1">
              {summary.percentageRecommended}% of customers recommend this hardware
            </span>
          </div>

          {/* Right: Server-Calculated Distribution Bar Chart */}
          <div className="md:col-span-8 flex flex-col justify-center space-y-2">
            {[5, 4, 3, 2, 1].map((star) => {
              const count = summary.breakdown[star as 1 | 2 | 3 | 4 | 5] || 0;
              const percent = summary.reviewCount > 0 ? Math.round((count / summary.reviewCount) * 100) : 0;
              return (
                <div key={star} className="flex items-center gap-3 text-xs font-mono">
                  <div className="flex items-center gap-1 w-12 shrink-0">
                    <span className="text-white font-bold">{star}</span>
                    <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                  </div>
                  <div className="flex-1 h-2 bg-neutral-900 rounded-full overflow-hidden border border-neutral-800">
                    <div
                      className="h-full bg-gradient-to-r from-red-600 to-amber-500 rounded-full transition-all duration-500"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                  <span className="w-10 text-right text-neutral-400 text-[11px]">{percent}%</span>
                  <span className="w-10 text-right text-neutral-500 text-[11px]">({count})</span>
                </div>
              );
            })}
          </div>
        </div>
      ) : null}

      {/* Sorting & Filter Controls */}
      {summary.reviewCount > 0 && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono">
          <div className="text-neutral-400">
            Showing <span className="text-white font-bold">{reviews.length}</span> of{' '}
            <span className="text-white font-bold">{summary.reviewCount}</span> verified reviews
          </div>

          <div className="flex items-center gap-2">
            <span className="text-neutral-500 uppercase tracking-wider text-[11px]">Sort By:</span>
            <div className="inline-flex rounded-xl bg-neutral-950 border border-neutral-800 p-1">
              <button
                type="button"
                onClick={() => setSortBy('recent')}
                className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                  sortBy === 'recent' ? 'bg-red-600 text-white font-bold' : 'text-neutral-400 hover:text-white'
                }`}
              >
                Recent
              </button>
              <button
                type="button"
                onClick={() => setSortBy('helpful')}
                className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                  sortBy === 'helpful' ? 'bg-red-600 text-white font-bold' : 'text-neutral-400 hover:text-white'
                }`}
              >
                Helpful
              </button>
              <button
                type="button"
                onClick={() => setSortBy('rating_high')}
                className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                  sortBy === 'rating_high' ? 'bg-red-600 text-white font-bold' : 'text-neutral-400 hover:text-white'
                }`}
              >
                Highest
              </button>
              <button
                type="button"
                onClick={() => setSortBy('rating_low')}
                className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                  sortBy === 'rating_low' ? 'bg-red-600 text-white font-bold' : 'text-neutral-400 hover:text-white'
                }`}
              >
                Lowest
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reviews List / Loading / Empty State */}
      {isLoading ? (
        <div className="py-16 text-center space-y-3">
          <Loader2 className="w-8 h-8 text-red-500 animate-spin mx-auto" />
          <p className="text-xs font-mono text-neutral-400">Loading verified community reviews...</p>
        </div>
      ) : reviews.length === 0 ? (
        /* Empty State: No real reviews yet — genuine empty state with clear CTA */
        <div className="bg-neutral-950/60 border border-neutral-800/80 rounded-2xl p-10 sm:p-14 text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-neutral-900 border border-neutral-800 flex items-center justify-center mx-auto text-neutral-500">
            <MessageSquareOff className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-lg font-black text-white uppercase tracking-wider font-mono">
              No reviews yet
            </h4>
            <p className="text-xs text-neutral-400 font-mono mt-1 max-w-md mx-auto">
              Be the first to review this component. Share your benchmarks, thermals, and build experience with the CartVerse community.
            </p>
          </div>
          <button
            type="button"
            onClick={handleOpenNew}
            className="px-6 py-2.5 bg-red-600 hover:bg-red-500 text-white font-mono font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg inline-flex items-center gap-2 cursor-pointer transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Write the First Review</span>
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((rev) => {
            const revId = rev._id || rev.id;
            const isOwnReview = currentUserReview && (currentUserReview._id || currentUserReview.id) === revId;
            const reviewVotes = rev.helpfulVotes ?? rev.helpfulCount ?? 0;

            return (
              <div
                key={revId}
                className="bg-neutral-950/80 border border-neutral-800/90 rounded-2xl p-5 sm:p-6 space-y-3.5 hover:border-neutral-700 transition-colors"
              >
                {/* Header: User & Rating */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-neutral-850 pb-3">
                  <div className="flex items-center gap-3">
                    {/* User Avatar Initial */}
                    <div className="w-8 h-8 rounded-full bg-neutral-800 border border-neutral-700 flex items-center justify-center font-mono text-xs font-bold text-white uppercase">
                      {rev.userName.slice(0, 2) || 'CV'}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black text-white font-mono">{rev.userName}</span>
                        {rev.verifiedPurchase && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-mono text-emerald-400 bg-emerald-950/50 border border-emerald-500/30 px-2 py-0.5 rounded-full font-bold">
                            <ShieldCheck className="w-3 h-3" />
                            Verified Purchase
                          </span>
                        )}
                        {isOwnReview && (
                          <span className="text-[10px] font-mono bg-red-950 text-red-300 border border-red-500/30 px-2 py-0.5 rounded-full font-bold">
                            Your Review
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-[10px] font-mono text-neutral-500 mt-0.5">
                        <span>{new Date(rev.createdAt).toLocaleDateString('en-IN', { dateStyle: 'medium' })}</span>
                        {rev.editedAt && <span>· Edited</span>}
                      </div>
                    </div>
                  </div>

                  {/* Stars */}
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        className={`w-3.5 h-3.5 ${
                          rev.rating >= s ? 'text-amber-400 fill-amber-400' : 'text-neutral-700'
                        }`}
                      />
                    ))}
                    <span className="text-xs font-mono font-bold text-white ml-1.5">{rev.rating}.0</span>
                  </div>
                </div>

                {/* Review Title & Body */}
                <div className="space-y-1.5">
                  {rev.title && (
                    <h5 className="text-sm font-black text-white font-mono tracking-tight">{rev.title}</h5>
                  )}
                  <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed font-sans whitespace-pre-line">
                    {rev.body || rev.comment}
                  </p>
                </div>

                {/* Attached Images */}
                {rev.images && rev.images.length > 0 && (
                  <div className="flex gap-2 pt-1">
                    {rev.images.map((img, idx) => (
                      <a
                        key={idx}
                        href={img}
                        target="_blank"
                        rel="noreferrer"
                        className="w-16 h-16 rounded-xl overflow-hidden border border-neutral-800 hover:border-red-500 transition-colors block"
                      >
                        <img src={img} alt="Review attachment" className="w-full h-full object-cover" />
                      </a>
                    ))}
                  </div>
                )}

                {/* Actions Bar: Helpful Vote & Report */}
                <div className="flex items-center justify-between pt-2 border-t border-neutral-850 text-xs font-mono">
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => handleVoteHelpful(rev)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs transition-colors cursor-pointer ${
                        rev.isHelpfulVoted
                          ? 'bg-red-950/60 border-red-500 text-red-300 font-bold'
                          : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white hover:border-neutral-700'
                      }`}
                    >
                      <ThumbsUp className="w-3.5 h-3.5" />
                      <span>Helpful ({reviewVotes})</span>
                    </button>
                  </div>

                  <div className="flex items-center gap-3">
                    {isOwnReview ? (
                      <button
                        type="button"
                        onClick={handleOpenEdit}
                        className="text-neutral-400 hover:text-white flex items-center gap-1 text-[11px] cursor-pointer"
                      >
                        <Edit3 className="w-3.5 h-3.5 text-red-500" />
                        <span>Edit</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleReport(revId)}
                        className="text-neutral-500 hover:text-red-400 flex items-center gap-1 text-[11px] cursor-pointer transition-colors"
                      >
                        <Flag className="w-3 h-3" />
                        <span>Report</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {/* Load More Pagination */}
          {pagination.hasMore && (
            <div className="text-center pt-4">
              <button
                type="button"
                onClick={() => loadReviews(pagination.page + 1, true)}
                disabled={isLoadingMore}
                className="px-6 py-2.5 bg-neutral-900 hover:bg-neutral-850 border border-neutral-800 text-neutral-200 font-mono font-bold text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer inline-flex items-center gap-2"
              >
                {isLoadingMore && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                <span>Load More Reviews</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProductReviewsSection;
