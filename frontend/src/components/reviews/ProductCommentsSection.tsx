import React, { useState } from 'react';
import { MessageSquare, Heart, CornerDownRight, Send, User } from 'lucide-react';
import { useReviewStore } from '../../store/useReviewStore';
import { useUIStore } from '../../store/useUIStore';
import { Comment } from '../../types/reviews';

interface ProductCommentsSectionProps {
  productId: string;
}

export const ProductCommentsSection: React.FC<ProductCommentsSectionProps> = ({ productId }) => {
  const { getCommentsForProduct, addComment, likeComment } = useReviewStore();
  const { addToast } = useUIStore();

  const [userName, setUserName] = useState('');
  const [commentText, setCommentText] = useState('');
  const [activeReplyId, setActiveReplyId] = useState<string | null>(null);
  const [replyUserName, setReplyUserName] = useState('');
  const [replyText, setReplyText] = useState('');

  const comments = getCommentsForProduct(productId);

  const handlePostTopComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    addComment(productId, {
      userName: userName || 'Builder Community',
      text: commentText,
    });

    addToast({
      type: 'success',
      title: 'Comment Posted',
      message: 'Your question/comment has been added to the discussion.',
    });

    setCommentText('');
  };

  const handlePostReply = (parentId: string) => {
    if (!replyText.trim()) return;

    addComment(productId, {
      userName: replyUserName || 'Community Member',
      text: replyText,
      parentId,
    });

    addToast({
      type: 'success',
      title: 'Reply Posted',
      message: 'Your reply has been added to the discussion thread.',
    });

    setActiveReplyId(null);
    setReplyText('');
  };

  return (
    <div className="bg-neutral-900/80 border border-neutral-800 rounded-3xl p-6 sm:p-8 backdrop-blur-md space-y-6 my-8">
      <div className="border-b border-neutral-800 pb-4">
        <h3 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-red-500" />
          <span>Product Q&A & Community Discussion</span>
          <span className="text-xs font-mono bg-neutral-800 text-neutral-300 px-2 py-0.5 rounded-full font-normal">
            {comments.length} Threads
          </span>
        </h3>
        <p className="text-xs text-neutral-400 font-mono mt-1">
          Ask compatibility questions, share setup tips, or get community advice.
        </p>
      </div>

      {/* Post Top-Level Question / Comment Form */}
      <form onSubmit={handlePostTopComment} className="bg-neutral-950 border border-neutral-850 p-4 rounded-2xl space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <input
            type="text"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            placeholder="Your Name (e.g. Rahul Verma)"
            className="bg-neutral-900 border border-neutral-800 rounded-xl px-3.5 py-2 text-xs text-white outline-none focus:border-red-500 font-mono"
          />
        </div>
        <textarea
          rows={2}
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          placeholder="Ask a compatibility question or leave a note about this component..."
          className="w-full bg-neutral-900 border border-neutral-800 rounded-xl p-3 text-xs text-white outline-none focus:border-red-500 font-mono"
        />
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-5 py-2 bg-red-600 hover:bg-red-500 text-white font-bold text-xs rounded-xl shadow-lg flex items-center gap-1.5 cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Post Discussion</span>
          </button>
        </div>
      </form>

      {/* Discussion Threads */}
      <div className="space-y-4">
        {comments.map((cmt) => (
          <div key={cmt.id} className="bg-neutral-950/70 border border-neutral-850 p-5 rounded-2xl space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-full bg-neutral-800 text-neutral-200 font-mono font-bold text-xs flex items-center justify-center border border-neutral-700">
                  {cmt.userAvatar || 'CV'}
                </div>
                <div>
                  <span className="text-xs font-bold text-white block">{cmt.userName}</span>
                  <span className="text-[10px] font-mono text-neutral-500">
                    {new Date(cmt.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                </div>
              </div>

              {/* Like Comment Button */}
              <button
                onClick={() => likeComment(productId, cmt.id)}
                className="flex items-center gap-1 text-xs font-mono text-neutral-400 hover:text-red-400 transition-colors cursor-pointer"
              >
                <Heart className="w-4 h-4 text-red-500" />
                <span>{cmt.likeCount}</span>
              </button>
            </div>

            {/* Comment Body */}
            <p className="text-xs text-neutral-200 leading-relaxed font-sans pl-9">{cmt.text}</p>

            {/* Reply trigger button */}
            <div className="pl-9">
              <button
                onClick={() => setActiveReplyId(activeReplyId === cmt.id ? null : cmt.id)}
                className="text-[11px] font-mono text-red-400 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <CornerDownRight className="w-3 h-3" />
                <span>Reply to Thread</span>
              </button>
            </div>

            {/* Inline Reply Form */}
            {activeReplyId === cmt.id && (
              <div className="ml-9 p-3 bg-neutral-900 border border-neutral-800 rounded-xl space-y-2 animate-in fade-in">
                <input
                  type="text"
                  value={replyUserName}
                  onChange={(e) => setReplyUserName(e.target.value)}
                  placeholder="Your Name"
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-1.5 text-xs text-white outline-none font-mono"
                />
                <textarea
                  rows={2}
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Write your reply..."
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-2 text-xs text-white outline-none font-mono"
                />
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => setActiveReplyId(null)}
                    className="px-3 py-1 text-xs font-mono text-neutral-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handlePostReply(cmt.id)}
                    className="px-4 py-1 bg-red-600 hover:bg-red-500 text-white font-mono font-bold text-xs rounded-lg"
                  >
                    Send Reply
                  </button>
                </div>
              </div>
            )}

            {/* Nested Thread Replies */}
            {cmt.replies && cmt.replies.length > 0 && (
              <div className="ml-9 space-y-2 border-l-2 border-neutral-800 pl-4 pt-2">
                {cmt.replies.map((reply) => (
                  <div key={reply.id} className="bg-neutral-900/60 p-3 rounded-xl border border-neutral-850">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-red-400 font-mono">{reply.userName}</span>
                      <button
                        onClick={() => likeComment(productId, reply.id)}
                        className="flex items-center gap-1 text-[11px] font-mono text-neutral-400 hover:text-red-400"
                      >
                        <Heart className="w-3 h-3 text-red-500" />
                        <span>{reply.likeCount}</span>
                      </button>
                    </div>
                    <p className="text-xs text-neutral-300 font-sans">{reply.text}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
