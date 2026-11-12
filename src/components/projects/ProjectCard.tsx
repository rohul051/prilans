'use client';

import React from 'react';
import { Project } from '@/types';
import { useApp } from '@/context/AppContext';
import { DataService } from '@/lib/dataService';
import { 
  CheckCircle2, 
  MapPin, 
  Eye, 
  FileText, 
  MoreVertical, 
  Sparkles,
  Users2
} from 'lucide-react';

interface ProjectCardProps {
  project: Project;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  const { 
    currentUser, 
    proposals, 
    setSelectedProjectForApply,
    setSelectedProjectForMatch,
    setActiveTab
  } = useApp();

  // Check if current student has already applied
  const existingProposal = proposals.find(
    (p) => p.projectId === project.id && p.studentId === currentUser?.id
  );

  // Compute skill-based match for current student (Advanced Feature 1)
  const isStudent = currentUser?.role === 'student';
  const matchInfo = isStudent
    ? DataService.calculateProjectMatch(currentUser?.skills || [], project.skillsRequired)
    : null;

  const isClientOwner = currentUser?.id === project.client.id;

  return (
    <div className="bg-white border border-gray-200/90 rounded-2xl p-5 hover:shadow-md transition-all duration-200 flex flex-col justify-between group">
      <div>
        {/* Top Header Row */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-md bg-gray-100 text-gray-700">
              {project.experienceLevel}
            </span>
            {isStudent && matchInfo && matchInfo.score >= 50 && (
              <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                <Sparkles className="w-3 h-3 text-emerald-500" />
                <span>{matchInfo.score}% Match</span>
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400">
              {project.timeAgo || 'Recently'}
            </span>
            <button className="text-gray-400 hover:text-gray-600 p-1">
              <MoreVertical className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Project Title */}
        <h3 className="font-bold text-gray-900 text-base leading-snug group-hover:text-blue-600 transition-colors cursor-pointer mb-2">
          {project.title}
        </h3>

        {/* Client Badges Row */}
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-500 mb-3">
          {project.client.verified && (
            <span className="flex items-center gap-1 text-emerald-600 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Verified</span>
            </span>
          )}

          <span className="flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-gray-400" />
            <span>{project.client.country}</span>
          </span>

          {project.client.viewsCount ? (
            <span className="flex items-center gap-1 text-gray-400">
              <Eye className="w-3.5 h-3.5" />
              <span>{project.client.viewsCount} viewed</span>
            </span>
          ) : null}

          {project.client.hiredCount && project.client.hiredCount > 0 ? (
            <span className="text-gray-400">
              • {project.client.hiredCount} hired
            </span>
          ) : null}
        </div>

        {/* Description */}
        <p className="text-xs text-gray-600 leading-relaxed mb-4 line-clamp-2">
          {project.description}
        </p>

        {/* Skill Tags */}
        <div className="flex flex-wrap gap-1.5 mb-5">
          {project.skillsRequired.map((skill, idx) => {
            const hasSkill = isStudent && currentUser?.skills?.some(
              (s) => s.toLowerCase() === skill.toLowerCase()
            );

            return (
              <span
                key={idx}
                className={`text-[11px] font-medium px-2.5 py-1 rounded-lg transition-colors ${
                  hasSkill
                    ? 'bg-blue-50 text-blue-700 border border-blue-200'
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                {skill}
              </span>
            );
          })}
        </div>
      </div>

      {/* Footer Details & Action Button */}
      <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
        <div>
          <span className="font-extrabold text-sm text-gray-900">
            ${project.budget.toFixed(2)}
          </span>
          <span className="text-xs text-gray-400 font-normal">
            {project.projectType === 'Hourly' ? ' / hour' : ' (Fixed)'}
          </span>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-gray-500">
          <FileText className="w-3.5 h-3.5 text-gray-400" />
          <span>{project.proposalsCount || 0} proposals</span>
        </div>

        <div>
          {isClientOwner ? (
            <button
              onClick={() => {
                setSelectedProjectForMatch(project);
              }}
              className="px-3.5 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-semibold shadow-sm transition-all flex items-center gap-1.5"
            >
              <Users2 className="w-3.5 h-3.5" />
              <span>Match Students</span>
            </button>
          ) : existingProposal ? (
            <button
              onClick={() => setActiveTab('my-proposals')}
              className="px-3.5 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Status: {existingProposal.status.replace('_', ' ')}</span>
            </button>
          ) : (
            <button
              onClick={() => setSelectedProjectForApply(project)}
              className="px-4 py-2 bg-gray-900 hover:bg-black text-white rounded-xl text-xs font-semibold shadow-sm transition-all hover:scale-105 active:scale-95"
            >
              Apply Now
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

