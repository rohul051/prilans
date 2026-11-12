'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { X, Send, Sparkles, AlertCircle } from 'lucide-react';
import { DataService } from '@/lib/dataService';

export const ApplyModal: React.FC = () => {
  const { 
    selectedProjectForApply, 
    setSelectedProjectForApply, 
    currentUser, 
    applyForProject 
  } = useApp();

  const [bidAmount, setBidAmount] = useState<number>(selectedProjectForApply?.budget || 20);
  const [estimatedDays, setEstimatedDays] = useState<number>(5);
  const [coverLetter, setCoverLetter] = useState<string>('');
  const [portfolioLink, setPortfolioLink] = useState<string>(
    currentUser?.portfolio?.[0]?.liveUrl || ''
  );
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  if (!selectedProjectForApply) return null;

  const match = DataService.calculateProjectMatch(
    currentUser?.skills || [], 
    selectedProjectForApply.skillsRequired
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    if (!coverLetter.trim()) {
      setError('Please provide a brief cover letter explaining your solution and approach.');
      return;
    }

    setSubmitting(true);
    try {
      await applyForProject({
        projectId: selectedProjectForApply.id,
        projectTitle: selectedProjectForApply.title,
        studentId: currentUser.id,
        studentName: currentUser.name,
        studentAvatar: currentUser.avatar,
        studentEmail: currentUser.email,
        studentUniversity: currentUser.university || 'University Student',
        studentSkills: currentUser.skills || [],
        studentExperienceLevel: currentUser.experienceLevel,
        bidAmount,
        bidType: selectedProjectForApply.projectType,
        estimatedDays,
        coverLetter,
        portfolioLink,
      });

      setSelectedProjectForApply(null);
    } catch (err: any) {
      setError(err?.message || 'Error submitting application');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-100 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
              Submit Proposal
            </span>
            <h2 className="text-xl font-extrabold text-gray-900 mt-1 line-clamp-1">
              {selectedProjectForApply.title}
            </h2>
          </div>
          <button
            onClick={() => setSelectedProjectForApply(null)}
            className="p-2 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {error && (
            <div className="p-3.5 bg-red-50 text-red-700 text-xs rounded-xl flex items-center gap-2 border border-red-100">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Skill Match Highlight */}
          <div className="p-4 bg-emerald-50/70 border border-emerald-100 rounded-2xl flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">
                {match.score}%
              </div>
              <div>
                <p className="text-xs font-bold text-emerald-900">
                  Skill Match with Your Student Profile
                </p>
                <p className="text-[11px] text-emerald-700">
                  {match.matchedSkills.length > 0
                    ? `Matched: ${match.matchedSkills.join(', ')}`
                    : 'You can still apply and showcase your portfolio!'}
                </p>
              </div>
            </div>
            <Sparkles className="w-5 h-5 text-emerald-500" />
          </div>

          {/* Rate & Days Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1.5">
                Your Bid ({selectedProjectForApply.projectType === 'Hourly' ? '$/hour' : 'Total $'})
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-sm text-gray-400 font-bold">$</span>
                <input
                  type="number"
                  min="5"
                  step="0.5"
                  value={bidAmount}
                  onChange={(e) => setBidAmount(parseFloat(e.target.value) || 0)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2 pl-7 pr-3 text-sm font-semibold text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900"
                  required
                />
              </div>
              <span className="text-[10px] text-gray-400 mt-1 block">
                Client budget: ${selectedProjectForApply.budget.toFixed(2)}
              </span>
            </div>

            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1.5">
                Estimated Delivery (Days)
              </label>
              <input
                type="number"
                min="1"
                max="60"
                value={estimatedDays}
                onChange={(e) => setEstimatedDays(parseInt(e.target.value) || 1)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2 px-3 text-sm font-semibold text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900"
                required
              />
              <span className="text-[10px] text-gray-400 mt-1 block">
                Realistic timeline for high quality
              </span>
            </div>
          </div>

          {/* Cover Letter */}
          <div>
            <label className="text-xs font-bold text-gray-700 block mb-1.5">
              Cover Letter & Approach
            </label>
            <textarea
              rows={4}
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              placeholder="Introduce yourself, your university background, and how you will solve the client's needs..."
              className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 leading-relaxed"
              required
            />
          </div>

          {/* Portfolio or GitHub Link */}
          <div>
            <label className="text-xs font-bold text-gray-700 block mb-1.5">
              Portfolio Link / GitHub Repository
            </label>
            <input
              type="url"
              value={portfolioLink}
              onChange={(e) => setPortfolioLink(e.target.value)}
              placeholder="https://github.com/... or https://portfolio.com"
              className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2 px-3 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900"
            />
          </div>

          {/* Submit Buttons */}
          <div className="pt-3 border-t border-gray-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setSelectedProjectForApply(null)}
              className="px-5 py-2.5 rounded-xl text-xs font-semibold text-gray-600 hover:bg-gray-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2.5 bg-gray-900 hover:bg-black text-white rounded-xl text-xs font-bold shadow-md transition-all flex items-center gap-2 disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{submitting ? 'Submitting...' : 'Submit Application'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

