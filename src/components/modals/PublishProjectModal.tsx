'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { X, Plus, Sparkles, AlertCircle } from 'lucide-react';
import { ExperienceLevel } from '@/types';

export const PublishProjectModal: React.FC = () => {
  const { 
    isPublishModalOpen, 
    setIsPublishModalOpen, 
    currentUser, 
    publishProject 
  } = useApp();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Web Design');
  const [description, setDescription] = useState('');
  const [experienceLevel, setExperienceLevel] = useState<ExperienceLevel>('Entry Level');
  const [projectType, setProjectType] = useState<'Hourly' | 'Fixed Price'>('Hourly');
  const [budget, setBudget] = useState<number>(20);
  const [skillInput, setSkillInput] = useState('');
  const [skills, setSkills] = useState<string[]>([]);
  const [location, setLocation] = useState('Remote');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!isPublishModalOpen) return null;

  const handleAddSkill = () => {
    if (skillInput.trim() && !skills.includes(skillInput.trim())) {
      setSkills([...skills, skillInput.trim()]);
      setSkillInput('');
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(skills.filter((s) => s !== skillToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      setError('Please provide both project title and description.');
      return;
    }
    if (skills.length === 0) {
      setError('Please add at least one required skill tag.');
      return;
    }

    setSubmitting(true);
    try {
      await publishProject({
        title,
        description,
        category,
        experienceLevel,
        projectType,
        budget,
        budgetUnit: projectType === 'Hourly' ? 'hour' : 'project',
        skillsRequired: skills,
        client: {
          id: currentUser?.id || 'client-user',
          name: currentUser?.name || 'Employer',
          email: currentUser?.email || '',
          country: currentUser?.location?.split(',').pop()?.trim() || 'Remote',
          verified: !!currentUser?.verified,
          viewsCount: 1,
          hiredCount: currentUser?.hiredCount || 0,
        },
        location,
      });

      setIsPublishModalOpen(false);
      // Reset
      setTitle('');
      setDescription('');
    } catch (err: any) {
      setError(err?.message || 'Failed to publish project');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-100 animate-in fade-in zoom-in-95 duration-200">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
              Employer / Client Portal
            </span>
            <h2 className="text-xl font-extrabold text-gray-900 mt-0.5">
              Publish a Project / Job Request
            </h2>
          </div>
          <button
            onClick={() => setIsPublishModalOpen(false)}
            className="p-2 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl flex items-center gap-2 border border-red-100">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="text-xs font-bold text-gray-700 block mb-1">
              Project Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Modern Landing Page Redesign for Educational App"
              className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2 px-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2 px-3 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900"
              >
                <option value="Web Design">Web Design</option>
                <option value="Web Development">Web Development</option>
                <option value="UI/UX Design">UI/UX Design</option>
                <option value="Programming">Programming</option>
                <option value="Content Writing">Content Writing</option>
                <option value="Graphic Design">Graphic Design</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">
                Required Experience
              </label>
              <select
                value={experienceLevel}
                onChange={(e) => setExperienceLevel(e.target.value as ExperienceLevel)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2 px-3 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900"
              >
                <option value="Entry Level">Entry Level (Great for Students)</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Expert">Expert</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">
                Project Type
              </label>
              <div className="grid grid-cols-2 p-1 bg-gray-100 rounded-xl text-xs">
                <button
                  type="button"
                  onClick={() => setProjectType('Hourly')}
                  className={`py-1.5 rounded-lg font-medium transition-all ${
                    projectType === 'Hourly' ? 'bg-white shadow-sm font-bold text-gray-900' : 'text-gray-600'
                  }`}
                >
                  Hourly
                </button>
                <button
                  type="button"
                  onClick={() => setProjectType('Fixed Price')}
                  className={`py-1.5 rounded-lg font-medium transition-all ${
                    projectType === 'Fixed Price' ? 'bg-white shadow-sm font-bold text-gray-900' : 'text-gray-600'
                  }`}
                >
                  Fixed
                </button>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">
                Budget ({projectType === 'Hourly' ? '$/hour' : 'Total $'})
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-sm text-gray-400 font-bold">$</span>
                <input
                  type="number"
                  min="5"
                  step="1"
                  value={budget}
                  onChange={(e) => setBudget(parseFloat(e.target.value) || 0)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl py-1.5 pl-7 pr-3 text-sm font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900"
                  required
                />
              </div>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-gray-700 block mb-1">
              Required Skills (Tags)
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddSkill();
                  }
                }}
                placeholder="Type a skill and press Add (e.g. Next.js, Figma, WordPress)"
                className="flex-1 bg-gray-50 border border-gray-200 rounded-xl py-2 px-3 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900"
              />
              <button
                type="button"
                onClick={handleAddSkill}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl text-xs font-bold transition-colors"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-1.5 min-h-[30px]">
              {skills.map((s) => (
                <span
                  key={s}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-blue-50 text-blue-700 border border-blue-200 rounded-lg text-xs font-medium"
                >
                  {s}
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(s)}
                    className="hover:text-red-600"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-gray-700 block mb-1">
              Project Description & Deliverables
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Outline what needs to be created, key requirements, and expectations for the university student..."
              className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 leading-relaxed"
              required
            />
          </div>

          <div>
            <label className="text-xs font-bold text-gray-700 block mb-1">
              Location / Timezone
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. Dhaka, Bangladesh (Remote)"
              className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2 px-3 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900"
            />
          </div>

          <div className="pt-3 border-t border-gray-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsPublishModalOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-600 hover:bg-gray-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2.5 bg-gray-900 hover:bg-black text-white rounded-xl text-xs font-bold shadow-md transition-all flex items-center gap-2 disabled:opacity-50"
            >
              <Plus className="w-4 h-4" />
              <span>{submitting ? 'Publishing...' : 'Publish Project'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

