'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { ProjectCard } from './ProjectCard';
import { LayoutGrid, List, Sparkles, ChevronDown } from 'lucide-react';

export const ProjectList: React.FC = () => {
  const { filteredProjects, filters, setFilters, currentUser } = useApp();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilters((prev) => ({
      ...prev,
      sortBy: e.target.value as any,
    }));
  };

  return (
    <div className="flex-1 space-y-4">
      {/* Results Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-gray-200">
        <div className="flex items-center gap-2">
          <span className="font-bold text-gray-900 text-sm">
            Showing Results
          </span>
          <span className="text-xs font-semibold text-gray-400">
            ({filteredProjects.length.toLocaleString()})
          </span>

          {filters.onlyRecommended && currentUser?.role === 'student' && (
            <span className="ml-2 inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
              <Sparkles className="w-3 h-3 text-amber-500" />
              Skill-Matched Only
            </span>
          )}
        </div>

        {/* Sort & View Mode */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center">
            <span className="text-xs text-gray-500 mr-2">Sort by:</span>
            <select
              value={filters.sortBy}
              onChange={handleSortChange}
              className="bg-transparent text-xs font-bold text-gray-900 pr-6 py-1 focus:outline-none cursor-pointer"
            >
              <option value="newest">Newest</option>
              <option value="highest_budget">Highest Budget</option>
              <option value="lowest_budget">Lowest Budget</option>
              <option value="most_proposals">Most Proposals</option>
            </select>
          </div>

          <div className="flex items-center border border-gray-200 rounded-lg p-0.5">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-md transition-colors ${
                viewMode === 'grid' ? 'bg-gray-100 text-gray-900' : 'text-gray-400 hover:text-gray-600'
              }`}
              title="Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-md transition-colors ${
                viewMode === 'list' ? 'bg-gray-100 text-gray-900' : 'text-gray-400 hover:text-gray-600'
              }`}
              title="List View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Projects Grid / List */}
      {filteredProjects.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
          <div className="w-12 h-12 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center mx-auto mb-3">
            <List className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-gray-900 text-base mb-1">No projects found</h3>
          <p className="text-xs text-gray-500 max-w-sm mx-auto mb-4">
            Try adjusting your search criteria, clearing some filters, or publishing a new project request.
          </p>
        </div>
      ) : (
        <div
          className={
            viewMode === 'grid'
              ? 'grid grid-cols-1 md:grid-cols-2 gap-4'
              : 'space-y-4'
          }
        >
          {filteredProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}
    </div>
  );
};

