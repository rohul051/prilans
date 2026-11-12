'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { ExperienceLevel } from '@/types';
import { RotateCcw } from 'lucide-react';

export const ProjectFilters: React.FC = () => {
  const { filters, setFilters, resetFilters, projects } = useApp();

  // Counts for experience level
  const entryCount = projects.filter((p) => p.experienceLevel === 'Entry Level').length;
  const interCount = projects.filter((p) => p.experienceLevel === 'Intermediate').length;
  const expertCount = projects.filter((p) => p.experienceLevel === 'Expert').length;
  const totalCount = projects.length;

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilters((prev) => ({ ...prev, category: e.target.value }));
  };

  const handleExperienceToggle = (level: ExperienceLevel) => {
    setFilters((prev) => {
      const exists = prev.experienceLevels.includes(level);
      const updated = exists
        ? prev.experienceLevels.filter((l) => l !== level)
        : [...prev.experienceLevels, level];
      return { ...prev, experienceLevels: updated };
    });
  };

  const handleProjectTypeTab = (type: 'Hourly' | 'Fixed Price' | 'Any') => {
    setFilters((prev) => ({
      ...prev,
      projectType: prev.projectType === type ? 'Any' : type,
    }));
  };

  const handleBudgetChange = (range: string) => {
    setFilters((prev) => ({
      ...prev,
      budgetRange: prev.budgetRange === range ? 'Any' : range,
    }));
  };

  const handleProposalsChange = (range: string) => {
    setFilters((prev) => ({
      ...prev,
      proposalsRange: prev.proposalsRange === range ? 'Any' : range,
    }));
  };

  return (
    <div className="w-full lg:w-64 bg-white p-5 rounded-2xl border border-gray-200 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-gray-100">
        <h3 className="font-bold text-gray-900 text-base">Filters</h3>
        <button
          onClick={resetFilters}
          className="text-xs text-gray-400 hover:text-gray-900 flex items-center gap-1 transition-colors font-medium"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset</span>
        </button>
      </div>

      {/* Category Dropdown */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block">
          Category
        </label>
        <select
          value={filters.category}
          onChange={handleCategoryChange}
          className="w-full bg-gray-50 border border-gray-200 text-gray-800 text-xs rounded-xl p-2.5 focus:outline-none focus:ring-1 focus:ring-gray-400"
        >
          <option value="All">Select categories (All)</option>
          <option value="Web Design">Web Design</option>
          <option value="Web Development">Web Development</option>
          <option value="UI/UX Design">UI/UX Design</option>
          <option value="Programming">Programming</option>
          <option value="Content Writing">Content Writing</option>
          <option value="Graphic Design">Graphic Design</option>
        </select>
      </div>

      {/* Experience Level */}
      <div className="space-y-2.5">
        <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider">
          Experience Level
        </h4>
        <div className="space-y-2 text-xs text-gray-700">
          <label className="flex items-center justify-between cursor-pointer group">
            <span className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={filters.experienceLevels.length === 0}
                onChange={() => setFilters((prev) => ({ ...prev, experienceLevels: [] }))}
                className="w-3.5 h-3.5 rounded border-gray-300 text-gray-900 focus:ring-0"
              />
              <span className="group-hover:text-gray-900 font-medium">Any</span>
            </span>
            <span className="text-[11px] text-gray-400">{totalCount}</span>
          </label>

          <label className="flex items-center justify-between cursor-pointer group">
            <span className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={filters.experienceLevels.includes('Entry Level')}
                onChange={() => handleExperienceToggle('Entry Level')}
                className="w-3.5 h-3.5 rounded border-gray-300 text-gray-900 focus:ring-0"
              />
              <span className="group-hover:text-gray-900">Entry Level</span>
            </span>
            <span className="text-[11px] text-gray-400">{entryCount}</span>
          </label>

          <label className="flex items-center justify-between cursor-pointer group">
            <span className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={filters.experienceLevels.includes('Intermediate')}
                onChange={() => handleExperienceToggle('Intermediate')}
                className="w-3.5 h-3.5 rounded border-gray-300 text-gray-900 focus:ring-0"
              />
              <span className="group-hover:text-gray-900">Intermediate</span>
            </span>
            <span className="text-[11px] text-gray-400">{interCount}</span>
          </label>

          <label className="flex items-center justify-between cursor-pointer group">
            <span className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={filters.experienceLevels.includes('Expert')}
                onChange={() => handleExperienceToggle('Expert')}
                className="w-3.5 h-3.5 rounded border-gray-300 text-gray-900 focus:ring-0"
              />
              <span className="group-hover:text-gray-900">Expert</span>
            </span>
            <span className="text-[11px] text-gray-400">{expertCount}</span>
          </label>
        </div>
      </div>

      {/* Project Type */}
      <div className="space-y-3">
        <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider">
          Project Type
        </h4>
        
        {/* Toggle Hourly / Fixed Price */}
        <div className="grid grid-cols-2 p-1 bg-gray-100 rounded-xl text-xs font-medium">
          <button
            onClick={() => handleProjectTypeTab('Hourly')}
            className={`py-1.5 rounded-lg transition-all ${
              filters.projectType === 'Hourly'
                ? 'bg-white shadow-sm font-bold text-gray-900'
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            Hourly
          </button>
          <button
            onClick={() => handleProjectTypeTab('Fixed Price')}
            className={`py-1.5 rounded-lg transition-all ${
              filters.projectType === 'Fixed Price'
                ? 'bg-white shadow-sm font-bold text-gray-900'
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            Fixed Price
          </button>
        </div>

        {/* Budget Brackets */}
        <div className="space-y-2 text-xs text-gray-700">
          {[
            { label: 'Any', value: 'Any' },
            { label: 'Less than $100', value: '<100' },
            { label: '$100 to $500', value: '100-500' },
            { label: '$500 to $1k', value: '500-1000' },
            { label: '$1k to $5k', value: '1000-5000' },
            { label: '$5k+', value: '5000+' },
          ].map((item) => (
            <label key={item.value} className="flex items-center gap-2 cursor-pointer group">
              <input
                type="radio"
                name="budget"
                checked={filters.budgetRange === item.value}
                onChange={() => handleBudgetChange(item.value)}
                className="w-3.5 h-3.5 text-gray-900 border-gray-300 focus:ring-0"
              />
              <span className="group-hover:text-gray-900">{item.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Number of Proposals */}
      <div className="space-y-2.5">
        <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider">
          Number of Proposals
        </h4>
        <div className="space-y-2 text-xs text-gray-700">
          {[
            { label: 'Any', value: 'Any' },
            { label: 'Less than 5', value: '<5' },
            { label: '5 to 10', value: '5-10' },
            { label: '10 to 15', value: '10-15' },
            { label: '15 to 20', value: '15-20' },
          ].map((item) => (
            <label key={item.value} className="flex items-center gap-2 cursor-pointer group">
              <input
                type="radio"
                name="proposals"
                checked={filters.proposalsRange === item.value}
                onChange={() => handleProposalsChange(item.value)}
                className="w-3.5 h-3.5 text-gray-900 border-gray-300 focus:ring-0"
              />
              <span className="group-hover:text-gray-900">{item.label}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};

