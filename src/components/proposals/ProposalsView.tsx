'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Proposal, ApplicationStatus } from '@/types';
import { 
  FileText, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  Star, 
  MessageSquare, 
  ExternalLink,
  DollarSign,
  Calendar,
  Sparkles
} from 'lucide-react';
import { ReviewModal } from '../modals/ReviewModal';

export const ProposalsView: React.FC = () => {
  const { proposals, currentUser, projects } = useApp();
  const [selectedProposalForReview, setSelectedProposalForReview] = useState<Proposal | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Filter proposals relevant to the logged-in student (or all if admin)
  const userProposals = proposals.filter((p) => {
    if (currentUser?.role === 'admin') return true;
    if (currentUser?.role === 'client') {
      const clientProjectIds = projects.filter((prj) => prj.client.id === currentUser.id).map((prj) => prj.id);
      return clientProjectIds.includes(p.projectId);
    }
    return p.studentId === currentUser?.id;
  });

  const filtered = userProposals.filter((p) => {
    if (statusFilter === 'all') return true;
    return p.status === statusFilter;
  });

  const getStatusBadge = (status: ApplicationStatus) => {
    switch (status) {
      case 'accepted':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
            <CheckCircle className="w-3.5 h-3.5" />
            <span>Accepted</span>
          </span>
        );
      case 'shortlisted':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-800 border border-purple-300">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Shortlisted</span>
          </span>
        );
      case 'under_review':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-300">
            <Clock className="w-3.5 h-3.5" />
            <span>Under Review</span>
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-800 border border-red-300">
            <XCircle className="w-3.5 h-3.5" />
            <span>Rejected</span>
          </span>
        );
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300">
            <Star className="w-3.5 h-3.5" />
            <span>Completed</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-700 border border-gray-300">
            <Clock className="w-3.5 h-3.5" />
            <span>Pending</span>
          </span>
        );
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded uppercase tracking-wider">
              Application Tracking
            </span>
          </div>
          <h2 className="text-2xl font-extrabold text-gray-900 mt-1">
            Application Status & Proposals
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Track real-time progress on projects you applied for, review client feedback, and leave reviews.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5 bg-gray-100 p-1.5 rounded-xl text-xs font-medium">
          {['all', 'pending', 'under_review', 'shortlisted', 'accepted'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg capitalize transition-all ${
                statusFilter === st
                  ? 'bg-white text-gray-900 font-bold shadow-xs'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {st.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Proposals List */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
          <div className="w-12 h-12 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center mx-auto mb-3">
            <FileText className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-gray-900 text-base mb-1">
            No applications found
          </h3>
          <p className="text-xs text-gray-500 max-w-sm mx-auto mb-4">
            You haven't submitted any proposals matching this filter yet. Browse available projects and apply!
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((prop) => (
            <div
              key={prop.id}
              className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-sm transition-all"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-4 border-b border-gray-100">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-semibold text-gray-400">
                      Application ID: #{prop.id.slice(-6)}
                    </span>
                    <span className="text-gray-300">•</span>
                    <span className="text-xs text-gray-400">
                      Submitted on {new Date(prop.submittedAt).toLocaleDateString()}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">
                    {prop.projectTitle}
                  </h3>
                </div>

                <div className="flex items-center gap-3">
                  {getStatusBadge(prop.status)}
                </div>
              </div>

              {/* Proposal details */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-4 text-xs border-b border-gray-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-600">
                    <DollarSign className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-gray-400 text-[11px]">Proposed Bid</p>
                    <p className="font-bold text-gray-900">
                      ${prop.bidAmount.toFixed(2)} ({prop.bidType})
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-600">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-gray-400 text-[11px]">Timeline</p>
                    <p className="font-bold text-gray-900">
                      {prop.estimatedDays} Business Days
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-600">
                    <ExternalLink className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-gray-400 text-[11px]">Portfolio Link</p>
                    <p className="font-bold text-blue-600 truncate max-w-[180px]">
                      {prop.portfolioLink ? (
                        <a href={prop.portfolioLink} target="_blank" rel="noreferrer" className="hover:underline">
                          {prop.portfolioLink}
                        </a>
                      ) : (
                        'None attached'
                      )}
                    </p>
                  </div>
                </div>
              </div>

              {/* Cover Letter */}
              <div className="pt-4">
                <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Cover Letter Submitted
                </h4>
                <p className="text-xs text-gray-600 leading-relaxed bg-gray-50 p-3.5 rounded-xl border border-gray-100">
                  {prop.coverLetter}
                </p>
              </div>

              {/* Client Feedback (if any) */}
              {prop.clientFeedback && (
                <div className="mt-3 p-3.5 bg-blue-50/70 border border-blue-100 rounded-xl">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-blue-900 mb-1">
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Client Feedback:</span>
                  </div>
                  <p className="text-xs text-blue-800 leading-relaxed">
                    "{prop.clientFeedback}"
                  </p>
                </div>
              )}

              {/* Rating & Review prompt if accepted/completed */}
              {(prop.status === 'accepted' || prop.status === 'completed') && (
                <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                    <span className="text-xs font-semibold text-gray-700">
                      Project Rating & Review
                    </span>
                  </div>

                  {prop.studentReviewSubmitted ? (
                    <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-lg">
                      ✓ Review Submitted
                    </span>
                  ) : (
                    <button
                      onClick={() => setSelectedProposalForReview(prop)}
                      className="px-4 py-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold shadow-sm transition-all"
                    >
                      Rate & Review Client
                    </button>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Review Modal */}
      {selectedProposalForReview && (
        <ReviewModal
          proposal={selectedProposalForReview}
          onClose={() => setSelectedProposalForReview(null)}
        />
      )}
    </div>
  );
};

