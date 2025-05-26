// Enhanced Filter.jsx with modern styling and interactive content type selector
import React, { useState, useEffect } from 'react';
import ActorFilter from './ActorFilter';

function Filter() {
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Content type state - only 'movie' or 'tv' now
  const [contentType, setContentType] = useState('movie'); // 'movie' or 'tv'
  
  // Common filters
  const [filters, setFilters] = useState({
    yearStart: "1900",
    yearEnd: "2025",
    rating: 5.0, // Default slider value
    genres: []
  });

  // Movie-specific filters
  const [movieFilters, setMovieFilters] = useState({
    actors: [],
    directors: [],
    runtime: { min: "", max: "" },
    certification: ""
  });

  // TV-specific filters
  const [tvFilters, setTvFilters] = useState({
    networks: [],
    status: "",
    type: "",
    originCountry: "",
    runtime: { min: "", max: "" }
  });

  // Get the appropriate filter options based on content type
  const getFilterOptions = () => {
    switch(contentType) {
      case 'movie':
        return {
          showActorFilter: true,
          showDirectorFilter: true,
          showCertification: true,
          showNetworks: false,
          showStatus: false,
          showType: false,
          yearLabel: "Release Year",
          runtimeLabel: "Movie Runtime"
        };
      case 'tv':
        return {
          showActorFilter: false,
          showDirectorFilter: false,
          showCertification: false,
          showNetworks: true,
          showStatus: true,
          showType: true,
          yearLabel: "First Air Date",
          runtimeLabel: "Episode Runtime"
        };
      default:
        return {
          showActorFilter: true,
          showDirectorFilter: false,
          showCertification: false,
          showNetworks: false,
          showStatus: false,
          showType: false,
          yearLabel: "Year",
          runtimeLabel: "Runtime"
        };
    }
  };

  const filterOptions = getFilterOptions();

  // Handle content type change with animation
  const handleContentTypeChange = (type) => {
    setContentType(type);
    // Reset type-specific filters when switching
    if (type === 'movie') {
      setTvFilters({
        networks: [],
        status: "",
        type: "",
        originCountry: "",
        runtime: { min: "", max: "" }
      });
    } else if (type === 'tv') {
      setMovieFilters({
        actors: [],
        directors: [],
        runtime: { min: "", max: "" },
        certification: ""
      });
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleMovieFilterChange = (key, value) => {
    setMovieFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleTvFilterChange = (key, value) => {
    setTvFilters(prev => ({ ...prev, [key]: value }));
  };

  // Count active filters
  const getActiveFilterCount = () => {
    let count = 0;
    if (filters.yearStart !== "1900" || filters.yearEnd !== "2025") count++;
    if (filters.rating !== 5.0) count++;
    if (filters.genres.length > 0) count++;
    
    if (contentType === 'movie') {
      if (movieFilters.actors.length > 0) count++;
      if (movieFilters.directors.length > 0) count++;
      if (movieFilters.certification) count++;
      if (movieFilters.runtime.min || movieFilters.runtime.max) count++;
    } else if (contentType === 'tv') {
      if (tvFilters.networks.length > 0) count++;
      if (tvFilters.status) count++;
      if (tvFilters.type) count++;
      if (tvFilters.originCountry) count++;
      if (tvFilters.runtime.min || tvFilters.runtime.max) count++;
    }
    
    return count;
  };

  const clearAllFilters = () => {
    setFilters({ yearStart: "1900", yearEnd: "2025", rating: 5.0, genres: [] });
    setMovieFilters({ actors: [], directors: [], runtime: { min: "", max: "" }, certification: "" });
    setTvFilters({ networks: [], status: "", type: "", originCountry: "", runtime: { min: "", max: "" } });
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 mb-6 overflow-hidden transition-all duration-300">
      {/* Filters Header - Collapsible */}
      <div 
        className="p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <svg 
                className={`w-5 h-5 text-gray-600 dark:text-gray-400 transition-transform duration-200 ${
                  isExpanded ? 'rotate-90' : ''
                }`} 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
              <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Filters</h2>
            </div>
            {getActiveFilterCount() > 0 && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                {getActiveFilterCount()} active
              </span>
            )}
          </div>
          
          <div className="flex items-center space-x-2">
            {getActiveFilterCount() > 0 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  clearAllFilters();
                }}
                className="text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors duration-200"
              >
                Clear all
              </button>
            )}
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {isExpanded ? 'Collapse' : 'Expand'}
            </span>
          </div>
        </div>
      </div>

      {/* Collapsible Filters Content */}
      <div className={`transition-all duration-300 ease-in-out ${
        isExpanded ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
      } overflow-hidden`}>
        <div className="p-6 pt-0">
          {/* Content Type Selector - Inside Filters */}
          <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 text-center">
              Content Type
            </h3>
            
            {/* Interactive Toggle Buttons */}
            <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1 max-w-sm mx-auto">
              <button
                onClick={() => handleContentTypeChange('movie')}
                className={`flex-1 py-2.5 px-4 rounded-md text-sm font-medium transition-all duration-300 ${
                  contentType === 'movie'
                    ? 'bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow-sm transform scale-105'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
                }`}
              >
                Movies
              </button>
              <button
                onClick={() => handleContentTypeChange('tv')}
                className={`flex-1 py-2.5 px-4 rounded-md text-sm font-medium transition-all duration-300 ${
                  contentType === 'tv'
                    ? 'bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow-sm transform scale-105'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
                }`}
              >
                Series
              </button>
            </div>
          </div>

          {/* Dynamic Filter Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            
            {/* Year Range Filter - Always shown */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {filterOptions.yearLabel} Range
              </label>
              <div className="items-center space-x-2">
                <input
                  type="number"
                  placeholder="From"
                  value={filters.yearStart || ""}
                  onChange={(e) => handleFilterChange("yearStart", e.target.value)}
                  className="w-20 px-3 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
                <span className=" items-center text-gray-400">—</span>
                <input
                  type="number"
                  placeholder="To"
                  value={filters.yearEnd || ""}
                  onChange={(e) => handleFilterChange("yearEnd", e.target.value)}
                  className="w-20 px-3 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              </div>
            </div>

            {/* Rating Slider - Always shown */}
            <div className="space-y-4">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Minimum Rating: {filters.rating}/10
              </label>
              <div className="px-2">
                <input
                  type="range"
                  min="1"
                  max="10"
                  step="0.1"
                  value={filters.rating}
                  onChange={(e) => handleFilterChange("rating", parseFloat(e.target.value))}
                  className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-2">
                  <span>1.0</span>
                  <span>10.0</span>
                </div>
              </div>
            </div>

            {/* Actor Filter - Only for Movies */}
            {filterOptions.showActorFilter && (
              <div className="space-y-3">
                <ActorFilter onChange={(actors) => handleMovieFilterChange('actors', actors)} />
              </div>
            )}

            {/* Networks Filter - Only for TV */}
            {filterOptions.showNetworks && (
              <div className="space-y-3">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Network
                </label>
                <select
                  value={tvFilters.networks[0] || ""}
                  onChange={(e) => handleTvFilterChange("networks", e.target.value ? [e.target.value] : [])}
                  className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                >
                  <option value="">All Networks</option>
                  <option value="213">Netflix</option>
                  <option value="1024">Amazon Prime Video</option>
                  <option value="2739">Disney+</option>
                  <option value="453">Hulu</option>
                  <option value="49">HBO</option>
                  <option value="174">AMC</option>
                  <option value="16">CBS</option>
                  <option value="13">NBC</option>
                  <option value="2">ABC</option>
                  <option value="19">FOX</option>
                </select>
              </div>
            )}

            {/* TV Status Filter - Only for TV */}
            {filterOptions.showStatus && (
              <div className="space-y-3">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Series Status
                </label>
                <select
                  value={tvFilters.status}
                  onChange={(e) => handleTvFilterChange("status", e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                >
                  <option value="">All Status</option>
                  <option value="0">Returning Series</option>
                  <option value="1">Planned</option>
                  <option value="2">In Production</option>
                  <option value="3">Ended</option>
                  <option value="4">Cancelled</option>
                  <option value="5">Pilot</option>
                </select>
              </div>
            )}

            {/* Movie Certification - Only for Movies */}
            {filterOptions.showCertification && (
              <div className="space-y-3">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Rating
                </label>
                <select
                  value={movieFilters.certification}
                  onChange={(e) => handleMovieFilterChange("certification", e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                >
                  <option value="">All Ratings</option>
                  <option value="G">G</option>
                  <option value="PG">PG</option>
                  <option value="PG-13">PG-13</option>
                  <option value="R">R</option>
                  <option value="NC-17">NC-17</option>
                </select>
              </div>
            )}

            {/* Runtime Filter */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {filterOptions.runtimeLabel} (minutes)
              </label>
              <div className="flex space-x-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={contentType === 'movie' ? movieFilters.runtime.min : tvFilters.runtime.min}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (contentType === 'movie') {
                      handleMovieFilterChange('runtime', { ...movieFilters.runtime, min: value });
                    } else {
                      handleTvFilterChange('runtime', { ...tvFilters.runtime, min: value });
                    }
                  }}
                  className="flex-1 px-3 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
                <span className="flex items-center text-gray-400">—</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={contentType === 'movie' ? movieFilters.runtime.max : tvFilters.runtime.max}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (contentType === 'movie') {
                      handleMovieFilterChange('runtime', { ...movieFilters.runtime, max: value });
                    } else {
                      handleTvFilterChange('runtime', { ...tvFilters.runtime, max: value });
                    }
                  }}
                  className="flex-1 px-3 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={clearAllFilters}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200"
            >
              Clear All
            </button>
            <button
              type="button"
              className="px-6 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors duration-200 shadow-sm"
            >
              Apply Filters
            </button>
          </div>
        </div>
      </div>

      {/* Custom CSS for slider styling */}
      <style jsx>{`
        .slider {
          -webkit-appearance: none;
          appearance: none;
          height: 6px;
          background: linear-gradient(to right, #e5e7eb 0%, #e5e7eb 100%);
          border-radius: 3px;
          outline: none;
        }
        
        .slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          height: 18px;
          width: 18px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          transition: all 0.15s ease-in-out;
          position: relative;
          z-index: 2;
        }
        
        .slider::-webkit-slider-thumb:hover {
          background: #2563eb;
          transform: scale(1.1);
          box-shadow: 0 4px 8px rgba(59, 130, 246, 0.3);
        }
        
        .slider::-moz-range-thumb {
          height: 18px;
          width: 18px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
          border: none;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          transition: all 0.15s ease-in-out;
          position: relative;
          z-index: 2;
        }
        
        .slider::-moz-range-thumb:hover {
          background: #2563eb;
          transform: scale(1.1);
          box-shadow: 0 4px 8px rgba(59, 130, 246, 0.3);
        }
        
        .slider::-moz-range-track {
          height: 6px;
          background: #e5e7eb;
          border-radius: 3px;
          border: none;
        }
        
        @media (prefers-color-scheme: dark) {
          .slider {
            background: linear-gradient(to right, #374151 0%, #374151 100%);
          }
          
          .slider::-moz-range-track {
            background: #374151;
          }
        }
      `}</style>
    </div>
  );
}

export default Filter;