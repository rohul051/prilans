'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { X, Check, Award, GraduationCap, MapPin, DollarSign, Sparkles } from 'lucide-react';
import { ExperienceLevel } from '@/types';

const POPULAR_SKILLS = [
  'React', 'Next.js', 'Tailwind CSS', 'Figma', 'UI Design', 'Web Design',
  'WordPress', 'Node.js', 'Python', 'Firebase', 'Graphic Design', 'Logo Design',
  'Content Writing', 'SEO', 'JavaScript', 'TypeScript', 'PHP', 'Django'
];

export const StudentProfileModal: React.FC = () => {
  const { 
    isProfileModalOpen, 
    setIsProfileModalOpen, 
    currentUser, 
    updateStudentProfile 
  } = useApp();

  const [name, setName] = useState('');
  const [university, setUniversity] = useState('');
  const [major, setMajor] = useState('');
  const [bio, setBio] = useState('');
  const [hourlyRate, setHourlyRate] = useState<number>(20);
  const [experienceLevel, setExperienceLevel] = useState<ExperienceLevel>('Entry Level');
  const [skills, setSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState('');
  const [location, setLocation] = useState('');
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (currentUser) {
      setName(currentUser.name || '');
      setUniversity(currentUser.university || '');
      setMajor(currentUser.major || '');
      setBio(currentUser.bio || '');
      setHourlyRate(currentUser.hourlyRate || 15);
      setExperienceLevel(currentUser.experienceLevel || 'Entry Level');
      setSkills(currentUser.skills || []);
      setLocation(currentUser.location || '');
    }
  }, [currentUser]);

  if (!isProfileModalOpen) return null;

  const handleAddSkill = (skill: string) => {
    const trimmed = skill.trim();
    if (trimmed && !skills.includes(trimmed)) {
      setSkills([...skills, trimmed]);
      setSkillInput('');
    }
  };

  const handleRemoveSkill = (skill: string) => {
    setSkills(skills.filter((s) => s !== skill));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateStudentProfile({
        name,
        university,
        major,
        bio,
        hourlyRate,
        experienceLevel,
        skills,
        location,
      });
      setSavedSuccess(true);
      setTimeout(() => {
        setSavedSuccess(false);
        setIsProfileModalOpen(false);
      }, 1000);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-100 animate-in fade-in zoom-in-95 duration-200">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
                Student Profile
              </span>
              <h2 className="text-xl font-extrabold text-gray-900">
                Create & Edit Skill Profile
              </h2>
            </div>
          </div>
          <button
            onClick={() => setIsProfileModalOpen(false)}
            className="p-2 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {savedSuccess && (
            <div className="p-3 bg-emerald-50 text-emerald-800 text-xs rounded-xl flex items-center gap-2 border border-emerald-100">
              <Check className="w-4 h-4 text-emerald-600" />
              <span>Profile updated successfully in database!</span>
            </div>
          )}

          {/* Name & Rate */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2 px-3 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900"
                required
              />
            </div>

            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">
                Hourly Rate ($/hr)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-xs text-gray-400 font-bold">$</span>
                <input
                  type="number"
                  min="5"
                  value={hourlyRate}
                  onChange={(e) => setHourlyRate(parseFloat(e.target.value) || 0)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2 pl-7 pr-3 text-xs font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900"
                  required
                />
              </div>
            </div>
          </div>

          {/* University & Department */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">
                University / Institution
              </label>
              <input
                type="text"
                value={university}
                onChange={(e) => setUniversity(e.target.value)}
                placeholder="e.g. University Name"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2 px-3 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900"
                required
              />
            </div>

            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">
                Major / Department
              </label>
              <input
                type="text"
                value={major}
                onChange={(e) => setMajor(e.target.value)}
                placeholder="Software Engineering / CSE"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2 px-3 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900"
                required
              />
            </div>
          </div>

          {/* Experience Level & Location */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">
                Experience Level
              </label>
              <select
                value={experienceLevel}
                onChange={(e) => setExperienceLevel(e.target.value as ExperienceLevel)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2 px-3 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900"
              >
                <option value="Entry Level">Entry Level</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Expert">Expert</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">
                Location
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Dhaka, Bangladesh"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2 px-3 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900"
              />
            </div>
          </div>

          {/* Bio */}
          <div>
            <label className="text-xs font-bold text-gray-700 block mb-1">
              Student Bio & Summary
            </label>
            <textarea
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Highlight your academic focus, projects you've worked on, and passion for software development or design..."
              className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 leading-relaxed"
            />
          </div>

          {/* Skills Management */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold text-gray-700">
                Skills Profile ({skills.length} skills added)
              </label>
              <span className="text-[11px] text-blue-600 font-medium">Used for project matching</span>
            </div>

            {/* Current skill tags */}
            <div className="flex flex-wrap gap-1.5 p-2 bg-gray-50 border border-gray-200 rounded-xl min-h-[46px] mb-2.5">
              {skills.length === 0 ? (
                <span className="text-xs text-gray-400 italic">No skills added yet. Pick from below or type custom skills.</span>
              ) : (
                skills.map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white border border-gray-300 text-gray-800 rounded-lg text-xs font-semibold shadow-xs"
                  >
                    <span>{skill}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveSkill(skill)}
                      className="text-gray-400 hover:text-red-600 font-bold ml-0.5"
                    >
                      ×
                    </button>
                  </span>
                ))
              )}
            </div>

            {/* Custom skill input */}
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddSkill(skillInput);
                  }
                }}
                placeholder="Add custom skill (e.g. Flutter, Vue, Content Strategy)"
                className="flex-1 bg-gray-50 border border-gray-200 rounded-xl py-2 px-3 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900"
              />
              <button
                type="button"
                onClick={() => handleAddSkill(skillInput)}
                className="px-4 py-2 bg-gray-900 text-white hover:bg-black rounded-xl text-xs font-bold transition-colors"
              >
                Add
              </button>
            </div>

            {/* Suggested skill chips */}
            <div>
              <p className="text-[11px] text-gray-400 mb-1.5 font-medium">Suggested Student Skills:</p>
              <div className="flex flex-wrap gap-1">
                {POPULAR_SKILLS.filter((s) => !skills.includes(s)).slice(0, 8).map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => handleAddSkill(s)}
                    className="text-[11px] px-2 py-0.5 bg-gray-100 hover:bg-blue-50 hover:text-blue-700 text-gray-600 rounded-md transition-colors"
                  >
                    + {s}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-gray-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsProfileModalOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-600 hover:bg-gray-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 bg-gray-900 hover:bg-black text-white rounded-xl text-xs font-bold shadow-md transition-all flex items-center gap-2"
            >
              <Award className="w-4 h-4" />
              <span>{saving ? 'Saving...' : 'Save Profile'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

