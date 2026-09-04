import React, { useState } from 'react';
import { Star, ThumbsUp, ThumbsDown, CheckCircle2, MessageSquare, Plus, Filter, SortAsc } from 'lucide-react';
import { useReviewStore } from '../../store/useReviewStore';
import { useUIStore } from '../../store/useUIStore';

interface ProductReviewsSectionProps {
  productId: string;
  productName: string;
}

export const ProductReviewsSection: React.FC<ProductReviewsSectionProps> = ({
  productId,
  productName,
}) => {
  const { getReviewsForProduct, getReviewSummary, addReview, voteReviewHelpful } = useReviewStore();
  const { addToast } = useUIStore();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [filterRating, setFilterRating] = useState<number | 'all'>('all');
  const [sortBy, setSortBy] = useState<'recent' | 'highest' | 'helpful'>('recent');

  // Form State
  const [userName, setUserName] = useState('');
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [proInput, setProInput] = useState('');
  const [conInput, setConInput] = useState('');
  const [pros, setPros] = useState<string[]>([]);
  const [cons, setCons] = useState<string[]>([]);

  const reviews = getReviewsForProduct(productId, productName);
  const summary = getReviewSummary(productId, productName);

  const handleAddPro = () => {
    if (proInput.trim()) {
      setPros([...pros, proInput.trim()]);
      setProInput('');
    }
  };

  const handleAddCon = () => {
    if (conInput.trim()) {
      setCons([...cons, conInput.trim()]);
      setConInput('');
    }
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) {
      addToast({ type: 'warning', title: 'Review Required', message: 'Please enter review comments.' });
      return;
    }

    addReview(productId, {
      userName: userName || 'Verified Buyer',
      rating,
      title: title || `${rating}-Star Hardware Review`,
      comment,
      pros,
      cons,
    });

    addToast({ type: 'success', title: 'Review Submitted!', message: 'Thank you for your real-time review.' });

    // Reset Form
    setIsFormOpen(false);
    setUserName('');
    setRating(5);
    setTitle('');
    setComment('');
    setPros([]);
    setCons([]);
  };

  // Filter & Sort
  const processedReviews = reviews
    .filter((rev) => (filterRating === 'all' ? true : rev.rating === filterRating))
    .sort((a, b) => {
      if (sortBy === 'highest') return b.rating - a.rating;
      if (sortBy === 'helpful') return b.helpfulCount - a.helpfulCount;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

  return (
    <div className="bg-neutral-900/80 border border-neutral-800 rounded-3xl p-6 sm:p-8 backdrop-blur-md space-y-8 my-8">
      {/* Header & Write Review Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-800 pb-6">
        <div>
          <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <span>Customer Reviews</span>
            <span className="text-xs font-mono bg-neutral-800 text-neutral-300 px-2.5 py-1 rounded-full font-normal">
              {summary.totalReviews} Total
            </span>
          </h3>
          <p className="text-xs text-neutral-400 font-mono mt-1">
            Real-Time Verified Ratings & Feedback for {productName}
          </p>
        </div>

        <button
          onClick={() => setIsFormOpen(!isFormOpen)}
          className="px-5 py-2.5 bg-red-600 hover:bg-red-500 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Write a Review</span>
        </button>
      </div>

      {/* Rating Summary Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-neutral-950/80 border border-neutral-800 p-6 rounded-2xl">
        {/* Rating Score Big Pill */}
        <div className="flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-neutral-800 pb-6 md:pb-0 md:pr-6">
          <div className="text-5xl font-black text-white font-mono">{summary.averageRating}</div>
          <div className="flex items-center gap-1 my-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`w-5 h-5 ${
                  star <= Math.round(summary.averageRating)
                    ? 'fill-amber-400 text-amber-400'
                    : 'text-neutral-700'
                }`}
              />
            ))}
          </div>
          <span className="text-xs text-neutral-400 font-mono text-center">
            {summary.percentageRecommended}% of buyers recommend this product
          </span>
        </div>

        {/* 5-Star Breakdown Bars */}
        <div className="col-span-2 space-y-2 justify-center flex flex-col">
          {[5, 4, 3, 2, 1].map((starKey) => {
            const count = summary.breakdown[starKey as 1 | 2 | 3 | 4 | 5] || 0;
            const pct = summary.totalReviews > 0 ? Math.round((count / summary.totalReviews) * 100) : 0;

            return (
              <button
                key={starKey}
                onClick={() => setFilterRating(filterRating === starKey ? 'all' : (starKey as number))}
                className="flex items-center gap-3 w-full group text-left cursor-pointer"
              >
                <div className="flex items-center gap-1 w-12 text-xs font-mono text-neutral-400 group-hover:text-white">
                  <span>{starKey}</span>
                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                </div>

                <div className="flex-1 h-2.5 bg-neutral-900 border border-neutral-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-amber-400 transition-all duration-300 rounded-full"
                    style={{ width: `${pct}%` }}
                  />
                </div>

                <span className="w-12 text-right text-xs font-mono text-neutral-500 group-hover:text-neutral-300">
                  {pct}%
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Write Review Form Collapsible */}
      {isFormOpen && (
        <form onSubmit={handleSubmitReview} className="bg-neutral-950 border border-neutral-800 p-6 rounded-2xl space-y-4 animate-in fade-in">
          <h4 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
            Write Your Product Review
          </h4>

          {/* Star Rating Picker */}
          <div>
            <label className="block text-xs text-neutral-400 mb-1.5 font-mono">Overall Rating:</label>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="p-1 cursor-pointer"
                >
                  <Star
                    className={`w-6 h-6 transition-colors ${
                      star <= (hoverRating || rating)
                        ? 'fill-amber-400 text-amber-400'
                        : 'text-neutral-700'
                    }`}
                  />
                </button>
              ))}
              <span className="ml-2 font-mono text-xs text-amber-400 font-bold">
                {hoverRating || rating} / 5 Stars
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-neutral-400 mb-1 font-mono">Your Name / Alias:</label>
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="e.g. Vikram Sharma"
                className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none focus:border-red-500"
              />
            </div>
            <div>
              <label className="block text-xs text-neutral-400 mb-1 font-mono">Review Headline:</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Excellent thermals and performance!"
                className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none focus:border-red-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs text-neutral-400 mb-1 font-mono">Detailed Feedback:</label>
            <textarea
              rows={3}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Describe your gaming, workstation, or physical setup experience with this product..."
              className="w-full bg-neutral-900 border border-neutral-800 rounded-xl p-3.5 text-xs text-white outline-none focus:border-red-500"
            />
          </div>

          {/* Pros & Cons Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-emerald-400 mb-1 font-mono">Add Pro (+):</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={proInput}
                  onChange={(e) => setProInput(e.target.value)}
                  placeholder="e.g. Low power draw"
                  className="flex-1 bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white outline-none"
                />
                <button
                  type="button"
                  onClick={handleAddPro}
                  className="px-3 py-2 bg-emerald-950 border border-emerald-800 text-emerald-300 font-bold text-xs rounded-xl"
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-1 mt-2">
                {pros.map((p, idx) => (
                  <span key={idx} className="bg-emerald-950/60 text-emerald-400 border border-emerald-800 text-[10px] px-2 py-0.5 rounded font-mono">
                    + {p}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs text-red-400 mb-1 font-mono">Add Con (-):</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={conInput}
                  onChange={(e) => setConInput(e.target.value)}
                  placeholder="e.g. Needs large cabinet"
                  className="flex-1 bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white outline-none"
                />
                <button
                  type="button"
                  onClick={handleAddCon}
                  className="px-3 py-2 bg-red-950 border border-red-800 text-red-300 font-bold text-xs rounded-xl"
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-1 mt-2">
                {cons.map((c, idx) => (
                  <span key={idx} className="bg-red-950/60 text-red-400 border border-red-800 text-[10px] px-2 py-0.5 rounded font-mono">
                    - {c}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsFormOpen(false)}
              className="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-neutral-300 font-bold text-xs rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-red-600 hover:bg-red-500 text-white font-bold text-xs rounded-xl shadow-lg"
            >
              Submit Review
            </button>
          </div>
        </form>
      )}

      {/* Filter & Sort Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 font-mono text-xs border-b border-neutral-800 pb-4">
        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-neutral-400" />
          <span className="text-neutral-400 uppercase">Filter:</span>
          {['all', 5, 4, 3, 2, 1].map((f) => (
            <button
              key={f}
              onClick={() => setFilterRating(f as number | 'all')}
              className={`px-2.5 py-1 rounded-lg border uppercase ${
                filterRating === f
                  ? 'bg-red-600 text-white border-red-500 font-bold'
                  : 'bg-neutral-900 text-neutral-400 border-neutral-800 hover:text-white'
              }`}
            >
              {f === 'all' ? 'All' : `${f}★`}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <SortAsc className="w-3.5 h-3.5 text-neutral-400" />
          <span className="text-neutral-400 uppercase">Sort By:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'recent' | 'highest' | 'helpful')}
            className="bg-neutral-900 text-white border border-neutral-800 rounded-lg px-2.5 py-1 outline-none text-xs"
          >
            <option value="recent">Most Recent</option>
            <option value="highest">Highest Rating</option>
            <option value="helpful">Most Helpful</option>
          </select>
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {processedReviews.length === 0 ? (
          <div className="text-center py-8 text-neutral-500 font-mono text-xs">
            No reviews match the selected filter rating.
          </div>
        ) : (
          processedReviews.map((rev) => (
            <div key={rev.id} className="bg-neutral-950/70 border border-neutral-850 p-5 rounded-2xl space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-neutral-800 font-mono font-bold text-xs text-neutral-200 flex items-center justify-center border border-neutral-700">
                    {rev.userName.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white">{rev.userName}</span>
                      {rev.verifiedPurchase && (
                        <span className="flex items-center gap-1 text-[10px] font-mono bg-emerald-950 text-emerald-400 border border-emerald-800 px-1.5 py-0.2 rounded">
                          <CheckCircle2 className="w-3 h-3" />
                          Verified Buyer
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] font-mono text-neutral-500">
                      {new Date(rev.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                </div>

                {/* Rating Stars */}
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      className={`w-4 h-4 ${
                        s <= rev.rating ? 'fill-amber-400 text-amber-400' : 'text-neutral-800'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Title & Comment */}
              <div>
                <h4 className="text-sm font-bold text-white tracking-tight">{rev.title}</h4>
                <p className="text-xs text-neutral-300 mt-1 leading-relaxed">{rev.comment}</p>
              </div>

              {/* Pros & Cons Chips */}
              {((rev.pros && rev.pros.length > 0) || (rev.cons && rev.cons.length > 0)) && (
                <div className="flex flex-wrap gap-2 pt-2 border-t border-neutral-900">
                  {rev.pros?.map((p, pIdx) => (
                    <span key={pIdx} className="text-[10px] font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-900/60 px-2 py-0.5 rounded">
                      + {p}
                    </span>
                  ))}
                  {rev.cons?.map((c, cIdx) => (
                    <span key={cIdx} className="text-[10px] font-mono text-red-400 bg-red-950/40 border border-red-900/60 px-2 py-0.5 rounded">
                      - {c}
                    </span>
                  ))}
                </div>
              )}

              {/* Helpful feedback voting */}
              <div className="flex items-center gap-4 pt-2 text-neutral-500 font-mono text-[11px]">
                <span>Was this review helpful?</span>
                <button
                  onClick={() => voteReviewHelpful(productId, rev.id, true)}
                  className="flex items-center gap-1 hover:text-emerald-400 transition-colors cursor-pointer"
                >
                  <ThumbsUp className="w-3.5 h-3.5" />
                  <span>({rev.helpfulCount})</span>
                </button>
                <button
                  onClick={() => voteReviewHelpful(productId, rev.id, false)}
                  className="flex items-center gap-1 hover:text-red-400 transition-colors cursor-pointer"
                >
                  <ThumbsDown className="w-3.5 h-3.5" />
                  <span>({rev.unhelpfulCount})</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
