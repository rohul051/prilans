'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Search, MapPin, Plus, Sparkles } from 'lucide-react';

export const ProjectHeader: React.FC = () => {
  const { 
    filters, 
    setFilters, 
    currentUser, 
    setIsPublishModalOpen 
  } = useApp();

  const [localSearch, setLocalSearch] = useState(filters.searchQuery);
  const [localLocation, setLocalLocation] = useState(filters.locationQuery);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFilters((prev) => ({
      ...prev,
      searchQuery: localSearch,
      locationQuery: localLocation,
    }));
  };

  const toggleRecommendationFilter = () => {
    setFilters((prev) => ({
      ...prev,
      onlyRecommended: !prev.onlyRecommended,
    }));
  };

  return (
    <div className="bg-white border-b border-gray-200 px-8 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Title and Action */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
              Find Millions of Projects Here!
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              Explore our newest project opportunities and apply for the top positions available today.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {currentUser?.role === 'student' && (
              <button
                onClick={toggleRecommendationFilter}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all ${
                  filters.onlyRecommended
                    ? 'bg-amber-500 text-white border-amber-600 shadow-sm ring-2 ring-amber-300'
                    : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                }`}
                title="Filter projects matching your student skills (Advanced Feature)"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>{filters.onlyRecommended ? 'Showing Skill Matches' : 'My Skill Matches'}</span>
              </button>
            )}

            <button
              onClick={() => setIsPublishModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-gray-900 hover:bg-black text-white rounded-xl text-xs font-semibold shadow-sm transition-all hover:scale-[1.02]"
            >
              <Plus className="w-4 h-4" />
              <span>Publish Project</span>
            </button>
          </div>
        </div>

        {/* Search Bar matching screenshot */}
        <form
          onSubmit={handleSearchSubmit}
          className="bg-white border border-gray-300 rounded-2xl p-1.5 shadow-sm flex flex-col md:flex-row items-center gap-2"
        >
          {/* Keyword Search */}
          <div className="flex items-center gap-3 px-3.5 py-2 flex-1 w-full border-b md:border-b-0 md:border-r border-gray-200">
            <Search className="w-5 h-5 text-gray-400 flex-shrink-0" />
            <input
              type="text"
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              placeholder="Web Design, React, WordPress..."
              className="w-full text-sm text-gray-900 placeholder-gray-400 bg-transparent focus:outline-none"
            />
          </div>

          {/* Location Search */}
          <div className="flex items-center gap-3 px-3.5 py-2 flex-1 w-full">
            <MapPin className="w-5 h-5 text-gray-400 flex-shrink-0" />
            <input
              type="text"
              value={localLocation}
              onChange={(e) => setLocalLocation(e.target.value)}
              placeholder="City, state, or zip code"
              className="w-full text-sm text-gray-900 placeholder-gray-400 bg-transparent focus:outline-none"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full md:w-auto px-7 py-3 bg-gray-900 hover:bg-black text-white rounded-xl text-sm font-semibold transition-colors flex items-center justify-center gap-2 flex-shrink-0"
          >
            Find Projects
          </button>
        </form>
      </div>
    </div>
  );
};

