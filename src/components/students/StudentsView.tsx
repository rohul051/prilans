'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { User, ExperienceLevel } from '@/types';
import { 
  Users, 
  Search, 
  Star, 
  CheckCircle2, 
  GraduationCap, 
  Sparkles, 
  FolderGit2, 
  Send,
  ExternalLink
} from 'lucide-react';

export const StudentsView: React.FC = () => {
  const { users, projects, setSelectedProjectForMatch, currentUser } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSkill, setSelectedSkill] = useState('All');
  const [selectedLevel, setSelectedLevel] = useState('All');

  const students = users.filter((u) => u.role === 'student');

  const allSkills = Array.from(
    new Set(students.flatMap((s) => s.skills || []))
  );

  const filteredStudents = students.filter((s) => {
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase().trim();
      const matchName = s.name.toLowerCase().includes(q);
      const matchUniv = s.university?.toLowerCase().includes(q);
      const matchMajor = s.major?.toLowerCase().includes(q);
      const matchSkills = s.skills.some((sk) => sk.toLowerCase().includes(q));
      if (!matchName && !matchUniv && !matchMajor && !matchSkills) return false;
    }

    if (selectedSkill !== 'All') {
      if (!s.skills.includes(selectedSkill)) return false;
    }

    if (selectedLevel !== 'All') {
      if (s.experienceLevel !== selectedLevel) return false;
    }

    return true;
  });

  return (
    <div className="max-w-6xl mx-auto px-6 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded uppercase tracking-wider">
              Talent Directory
            </span>
          </div>
          <h2 className="text-2xl font-extrabold text-gray-900 mt-1">
            Browse University Freelancers & Students
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Discover vetted university students with skills in web development, UI/UX design, writing, and engineering.
          </p>
        </div>

        {projects.length > 0 && (
          <button
            onClick={() => setSelectedProjectForMatch(projects[0])}
            className="flex items-center gap-2 px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold shadow-sm transition-all"
          >
            <Sparkles className="w-4 h-4 text-purple-200" />
            <span>Match Students to Job</span>
          </button>
        )}
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200 flex flex-col md:flex-row items-center gap-3">
        <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl flex-1 w-full">
          <Search className="w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by student name, skill (Figma, React), or major..."
            className="w-full text-xs text-gray-900 placeholder-gray-400 bg-transparent focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <select
            value={selectedSkill}
            onChange={(e) => setSelectedSkill(e.target.value)}
            className="bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs text-gray-800 focus:outline-none"
          >
            <option value="All">All Skills</option>
            {allSkills.map((sk) => (
              <option key={sk} value={sk}>
                {sk}
              </option>
            ))}
          </select>

          <select
            value={selectedLevel}
            onChange={(e) => setSelectedLevel(e.target.value)}
            className="bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs text-gray-800 focus:outline-none"
          >
            <option value="All">All Levels</option>
            <option value="Entry Level">Entry Level</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Expert">Expert</option>
          </select>
        </div>
      </div>

      {/* Students Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredStudents.map((student) => (
          <div
            key={student.id}
            className="bg-white border border-gray-200 rounded-2xl p-5 hover:shadow-md transition-shadow flex flex-col justify-between group"
          >
            <div>
              {/* Header */}
              <div className="flex items-start justify-between gap-3 mb-4">
                <div className="flex items-center gap-3">
                  <img
                    src={student.avatar}
                    alt={student.name}
                    className="w-12 h-12 rounded-full object-cover border border-gray-200 group-hover:scale-105 transition-transform"
                  />
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h4 className="font-bold text-gray-900 text-sm">{student.name}</h4>
                      {student.verified && (
                        <CheckCircle2 className="w-4 h-4 text-blue-500 flex-shrink-0" />
                      )}
                    </div>
                    <p className="text-[11px] text-gray-500 flex items-center gap-1 mt-0.5">
                      <GraduationCap className="w-3.5 h-3.5 text-gray-400" />
                      <span className="truncate max-w-[170px]">{student.university || 'University Student'}</span>
                    </p>
                  </div>
                </div>

                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-gray-100 text-gray-700">
                  {student.experienceLevel}
                </span>
              </div>

              {/* Bio */}
              <p className="text-xs text-gray-600 line-clamp-3 mb-4 leading-relaxed">
                {student.bio || 'Student developer and designer available for projects.'}
              </p>

              {/* Skills */}
              <div className="flex flex-wrap gap-1.5 mb-4">
                {student.skills.slice(0, 6).map((sk) => (
                  <span
                    key={sk}
                    className="text-[11px] font-medium px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-100"
                  >
                    {sk}
                  </span>
                ))}
                {student.skills.length > 6 && (
                  <span className="text-[10px] text-gray-400 px-1 py-0.5">
                    +{student.skills.length - 6} more
                  </span>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1 font-bold text-amber-600">
                  <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                  <span>{student.avgRating && student.avgRating > 0 ? student.avgRating.toFixed(1) : 'New'}</span>
                </span>
                <span className="text-gray-300">•</span>
                <span className="font-bold text-gray-900">
                  {student.hourlyRate ? `$${student.hourlyRate}/hr` : 'Negotiable'}
                </span>
              </div>

              {projects.length > 0 && (
                <button
                  onClick={() => setSelectedProjectForMatch(projects[0])}
                  className="px-3 py-1.5 bg-gray-900 hover:bg-black text-white rounded-lg font-bold text-[11px] transition-colors"
                >
                  Match to Job
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

