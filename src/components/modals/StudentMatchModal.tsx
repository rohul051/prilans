'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { DataService } from '@/lib/dataService';
import { 
  X, 
  Sparkles, 
  CheckCircle, 
  Send, 
  Star, 
  GraduationCap, 
  DollarSign, 
  Award,
  AlertCircle
} from 'lucide-react';

export const StudentMatchModal: React.FC = () => {
  const { 
    selectedProjectForMatch, 
    setSelectedProjectForMatch, 
    users, 
    projects 
  } = useApp();

  const [activeProjectId, setActiveProjectId] = useState<string>(
    selectedProjectForMatch?.id || projects[0]?.id || ''
  );
  const [invitedStudents, setInvitedStudents] = useState<{ [key: string]: boolean }>({});

  if (!selectedProjectForMatch) return null;

  const currentProject = projects.find((p) => p.id === activeProjectId) || selectedProjectForMatch;

  // Run the Bonus Matching Algorithm
  const recommendations = DataService.getRecommendedStudentsForProject(
    currentProject,
    users
  );

  const handleInvite = async (studentId: string, studentName: string) => {
    try {
      await DataService.addNotification({
        id: `notif-${Date.now()}`,
        userId: studentId,
        title: 'Direct Project Invitation! 🎯',
        message: `You were matched & invited for "${currentProject.title}" based on your skills!`,
        read: false,
        createdAt: new Date().toISOString(),
        type: 'system',
      });
      setInvitedStudents((prev) => ({ ...prev, [studentId]: true }));
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-gray-100 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-6 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white/95 backdrop-blur-sm z-10">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-full border border-purple-200">
                Intelligent Skill Matcher
              </span>
            </div>
            <h2 className="text-xl font-extrabold text-gray-900 mt-1 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-500 fill-amber-500" />
              <span>Recommended Students for this Project</span>
            </h2>
          </div>

          <button
            onClick={() => setSelectedProjectForMatch(null)}
            className="p-2 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Project Selector & Skills required overview */}
        <div className="p-6 bg-gray-50 border-b border-gray-100 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
              Evaluating Project:
            </span>
            <select
              value={currentProject.id}
              onChange={(e) => setActiveProjectId(e.target.value)}
              className="text-xs font-semibold bg-white border border-gray-300 rounded-lg px-2.5 py-1 text-gray-800 focus:outline-none"
            >
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.title}
                </option>
              ))}
            </select>
          </div>

          <h3 className="font-extrabold text-gray-900 text-base">
            {currentProject.title}
          </h3>

          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            <span className="text-xs text-gray-500 font-medium">Required Skills:</span>
            {currentProject.skillsRequired.map((skill) => (
              <span
                key={skill}
                className="text-[11px] font-bold px-2.5 py-0.5 bg-white border border-gray-200 text-gray-800 rounded-md"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Students Ranked List */}
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider">
              Ranked Candidates ({recommendations.length} students analyzed)
            </h4>
            <span className="text-[11px] text-gray-400">
              Ranked by: Skill Overlap (70%) + Experience (15%) + Rating (15%)
            </span>
          </div>

          {recommendations.length === 0 ? (
            <div className="p-8 text-center bg-gray-50 rounded-2xl border border-gray-100 text-xs text-gray-500">
              No registered students found in Firestore yet to match for this project.
            </div>
          ) : (
            recommendations.map((item, index) => {
              const { student, matchScore, matchedSkills, missingSkills, reasons } = item;
              const isInvited = invitedStudents[student.id];

              return (
                <div
                  key={student.id}
                  className={`p-5 rounded-2xl border transition-all ${
                    index === 0
                      ? 'bg-amber-50/30 border-amber-300 shadow-xs'
                      : 'bg-white border-gray-200 hover:border-gray-300'
                  }`}
                >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-3">
                  <div className="flex items-center gap-3.5">
                    <div className="relative">
                      <img
                        src={student.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(student.name)}`}
                        alt={student.name}
                        className="w-12 h-12 rounded-full object-cover border border-gray-200"
                      />
                      {index === 0 && (
                        <span className="absolute -top-1 -right-1 bg-amber-500 text-white rounded-full p-1 text-[9px] font-black" title="#1 Best Match">
                          🏆
                        </span>
                      )}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-gray-900 text-base">
                          {student.name}
                        </h4>
                        <span className="text-[10px] font-bold px-2 py-0.5 bg-gray-100 text-gray-700 rounded-md">
                          {student.experienceLevel}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 flex items-center gap-1.5 mt-0.5">
                        <GraduationCap className="w-3.5 h-3.5 text-blue-500" />
                        <span>{student.university || 'University Student'}</span>
                        {student.major && (
                          <>
                            <span>•</span>
                            <span className="text-gray-400">{student.major}</span>
                          </>
                        )}
                      </p>
                    </div>
                  </div>

                  {/* Match Score Badge */}
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className="flex items-center gap-1 justify-end">
                        <span className="text-2xl font-black text-gray-900">
                          {matchScore}%
                        </span>
                        <Sparkles className="w-4 h-4 text-amber-500 fill-amber-500" />
                      </div>
                      <span className="text-[10px] font-bold text-purple-700 uppercase tracking-wider">
                        Match Score
                      </span>
                    </div>

                    <button
                      onClick={() => handleInvite(student.id, student.name)}
                      disabled={isInvited}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 ${
                        isInvited
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-gray-900 hover:bg-black text-white hover:scale-105'
                      }`}
                    >
                      {isInvited ? (
                        <>
                          <CheckCircle className="w-3.5 h-3.5" />
                          <span>Invited ✓</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-3.5 h-3.5" />
                          <span>Invite Student</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Rating & Rate stats */}
                <div className="flex items-center gap-4 text-xs text-gray-600 mb-3 bg-white/80 p-2.5 rounded-xl border border-gray-100">
                  <span className="flex items-center gap-1 font-semibold text-amber-600">
                    <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                    <span>{student.avgRating && student.avgRating > 0 ? student.avgRating.toFixed(1) : 'New'}</span>
                    <span className="text-gray-400">({student.totalReviews || 0} reviews)</span>
                  </span>

                  <span className="text-gray-300">•</span>

                  <span className="font-semibold text-gray-800">
                    Rate: {student.hourlyRate ? `$${student.hourlyRate}/hour` : 'Negotiable'}
                  </span>

                  <span className="text-gray-300">•</span>

                  <span className="text-gray-500">
                    {student.portfolio?.length || 0} showcase projects
                  </span>
                </div>

                {/* Matched skills pill list */}
                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center gap-1.5 text-xs">
                    <span className="text-[11px] font-bold text-gray-500">Skills Matched:</span>
                    {matchedSkills.map((s) => (
                      <span
                        key={s}
                        className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200"
                      >
                        ✓ {s}
                      </span>
                    ))}
                    {missingSkills.map((s) => (
                      <span
                        key={s}
                        className="text-[10px] font-medium px-2 py-0.5 rounded bg-gray-100 text-gray-400"
                      >
                        - {s}
                      </span>
                    ))}
                  </div>

                  {/* Reasons explanation bullets */}
                  <div className="text-[11px] text-gray-500 space-y-0.5 pl-1 pt-1">
                    {reasons.map((r, i) => (
                      <p key={i} className="flex items-center gap-1.5">
                        <span className="w-1 h-1 rounded-full bg-blue-500"></span>
                        <span>{r}</span>
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            );
          })
        )}
        </div>
      </div>
    </div>
  );
};

