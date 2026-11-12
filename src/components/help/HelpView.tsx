'use client';

import React from 'react';
import { 
  CheckCircle2, 
  Sparkles, 
  GraduationCap, 
  Briefcase,
  HelpCircle,
  ShieldCheck,
  Award
} from 'lucide-react';

export const HelpView: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-6 py-8 space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-gray-200">
        <div className="flex items-center gap-2 mb-1">
          <GraduationCap className="w-5 h-5 text-blue-600" />
          <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
            User Guide & Help Center
          </span>
        </div>
        <h2 className="text-2xl font-extrabold text-gray-900">
          How to Use Prilans
        </h2>
        <p className="text-xs text-gray-500 mt-1">
          Everything you need to know about publishing projects, building your student portfolio, and collaborating securely.
        </p>
      </div>

      {/* For Students */}
      <div className="bg-white p-6 rounded-2xl border border-gray-200 space-y-4">
        <h3 className="font-extrabold text-gray-900 text-base flex items-center gap-2">
          <GraduationCap className="w-5 h-5 text-blue-600" />
          <span>For University Students</span>
        </h3>

        <div className="space-y-3 text-xs">
          {[
            {
              title: 'Create & Verify Your Profile',
              desc: 'Set up your student profile with your university, major, hourly rate, and skill tags. Verified students receive a trust badge that boosts proposal visibility.',
            },
            {
              title: 'Showcase Your Portfolio',
              desc: 'Navigate to "My Portfolio" to upload academic projects, side-projects, Figma prototypes, and GitHub repositories.',
            },
            {
              title: 'Apply for Projects & Track Proposals',
              desc: 'Browse open projects in the marketplace, submit customized proposals with your delivery timeline, and track review status under "My Proposals".',
            },
            {
              title: 'Ratings & Testimonials',
              desc: 'Once an engagement is completed, clients leave verified ratings and written reviews that build your professional credibility.',
            },
          ].map((item, idx) => (
            <div key={idx} className="p-3.5 bg-gray-50 rounded-xl border border-gray-100 flex items-start gap-3">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-gray-900">{item.title}</h4>
                <p className="text-gray-600 mt-0.5 leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* For Clients & Employers */}
      <div className="bg-white p-6 rounded-2xl border border-gray-200 space-y-4">
        <h3 className="font-extrabold text-gray-900 text-base flex items-center gap-2">
          <Briefcase className="w-5 h-5 text-purple-600" />
          <span>For Clients & Employers</span>
        </h3>

        <div className="space-y-3 text-xs">
          {[
            {
              title: 'Publish Projects in Minutes',
              desc: 'Post job requests with your budget (hourly or fixed), required skills, deliverables, and experience level preferences.',
            },
            {
              title: 'Intelligent Student Matching',
              desc: 'Use our AI matching engine to automatically discover and invite top students whose verified skills match your project needs.',
            },
            {
              title: 'Review Applicants & Update Status',
              desc: 'Evaluate applicant proposals, review their portfolio showcases, and move candidates to "Under Review", "Shortlisted", or "Accepted".',
            },
          ].map((item, idx) => (
            <div key={idx} className="p-3.5 bg-gray-50 rounded-xl border border-gray-100 flex items-start gap-3">
              <CheckCircle2 className="w-4 h-4 text-purple-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-gray-900">{item.title}</h4>
                <p className="text-gray-600 mt-0.5 leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
