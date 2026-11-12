'use client';

import React, { useState } from 'react';
import { Proposal } from '@/types';
import { useApp } from '@/context/AppContext';
import { X, Star, Send, Award } from 'lucide-react';

interface ReviewModalProps {
  proposal: Proposal;
  onClose: () => void;
}

export const ReviewModal: React.FC<ReviewModalProps> = ({ proposal, onClose }) => {
  const { currentUser, submitReview } = useApp();
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [comment, setComment] = useState<string>('');
  const [submitting, setSubmitting] = useState<boolean>(false);

  const isClient = currentUser?.role === 'client';
  const targetUserId = isClient ? proposal.studentId : (proposal as any).clientId || 'client-1';
  const targetUserName = isClient ? proposal.studentName : 'Client Employer';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !comment.trim()) return;

    setSubmitting(true);
    try {
      await submitReview({
        fromUserId: currentUser.id,
        fromUserName: currentUser.name,
        fromUserRole: currentUser.role,
        toUserId: targetUserId,
        projectId: proposal.projectId,
        projectTitle: proposal.projectTitle,
        rating,
        comment,
      });
      onClose();
    } catch (e) {
      console.error(e);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-gray-100 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between pb-4 border-b border-gray-100">
          <div>
            <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">
              Rating & Review
            </span>
            <h3 className="text-lg font-extrabold text-gray-900 mt-0.5">
              Review for {targetUserName}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="pt-4 space-y-4">
          <p className="text-xs text-gray-500">
            Project: <span className="font-semibold text-gray-800">{proposal.projectTitle}</span>
          </p>

          {/* Star selector */}
          <div className="text-center py-3 bg-amber-50/50 rounded-2xl border border-amber-100/60">
            <span className="text-xs font-bold text-gray-700 block mb-2">
              Select Star Rating
            </span>
            <div className="flex items-center justify-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setRating(star)}
                  className="p-1 transition-transform hover:scale-125 focus:outline-none"
                >
                  <Star
                    className={`w-7 h-7 transition-colors ${
                      (hoverRating || rating) >= star
                        ? 'fill-amber-400 text-amber-400'
                        : 'text-gray-300'
                    }`}
                  />
                </button>
              ))}
            </div>
            <p className="text-xs font-bold text-amber-800 mt-2">
              {rating === 5 ? '5.0 - Outstanding Work' :
               rating === 4 ? '4.0 - Very Good' :
               rating === 3 ? '3.0 - Satisfactory' :
               rating === 2 ? '2.0 - Needs Improvement' :
               '1.0 - Poor'}
            </p>
          </div>

          <div>
            <label className="text-xs font-bold text-gray-700 block mb-1">
              Feedback / Review Comment
            </label>
            <textarea
              rows={3}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share how the collaboration went, technical skills, timeliness, and communication..."
              className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 leading-relaxed"
              required
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2.5 bg-gray-900 hover:bg-black text-white rounded-xl text-xs font-bold shadow-md transition-all flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{submitting ? 'Submitting...' : 'Submit Review'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

