import React, { useState, useEffect } from 'react';

function Filter() {
  // Collapsible state
  const [isExpanded, setIsExpanded] = useState(false);

  // For Year Range Filter
  const [filters, setFilters] = useState({
    yearStart: "1900",
    yearEnd: "2025",
    rating: ""
  });

  // For checkboxes
  const [movieChecked, setMovieChecked] = useState(false);
  const [seriesChecked, setSeriesChecked] = useState(false);

  // For actor search
  const [actorSearch, setActorSearch] = useState("");

  // For genre selection
  const [selectedGenre, setSelectedGenre] = useState("");

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value
    }));
  };

  // For Rating Filter
  const [ratingValue, setRatingValue] = useState(filters.rating || "");
  const [tempRatingValue, setTempRatingValue] = useState(filters.rating || "");
  const [showRatingValue, setShowRatingValue] = useState(false);
  const [sliderPosition, setSliderPosition] = useState(0);

  useEffect(() => {
    // Update rating position when value changes
    if (tempRatingValue) {
      const percentage = ((tempRatingValue - 1) / 9) * 100;
      setSliderPosition(percentage);
    } else {
      setSliderPosition(0);
    }
  }, [tempRatingValue]);

  const handleRatingChange = (e) => {
    const value = e.target.value;
    setRatingValue(value);
    setTempRatingValue(value);
    handleFilterChange("rating", value);
  };

  const handleRatingSliderChange = (e) => {
    const value = e.target.value;
    setTempRatingValue(value);
    setShowRatingValue(true);
  };

  const handleSliderMouseUp = () => {
    setRatingValue(tempRatingValue);
    handleFilterChange("rating", tempRatingValue);
  };

  const handleSliderMouseEnter = () => {
    setShowRatingValue(true);
  };

  const handleSliderMouseLeave = () => {
    setShowRatingValue(false);
  };

  const adjustRating = (increment) => {
    const currentValue = parseFloat(ratingValue || 1);
    const newValue = increment > 0 
      ? Math.min(currentValue + 0.1, 10).toFixed(1)
      : Math.max(currentValue - 0.1, 1).toFixed(1);
    setRatingValue(newValue);
    setTempRatingValue(newValue);
    handleFilterChange("rating", newValue);
  };

  // Count active filters
  const getActiveFilterCount = () => {
    let count = 0;
    if (movieChecked) count++;
    if (seriesChecked) count++;
    if (actorSearch.trim()) count++;
    if (selectedGenre) count++;
    if (filters.yearStart !== "1900" || filters.yearEnd !== "2025") count++;
    if (filters.rating) count++;
    return count;
  };

  const clearAllFilters = () => {
    setFilters({ yearStart: "1900", yearEnd: "2025", rating: "" });
    setMovieChecked(false);
    setSeriesChecked(false);
    setActorSearch("");
    setSelectedGenre("");
    setRatingValue("");
    setTempRatingValue("");
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 mb-6 overflow-hidden transition-all duration-300">
      {/* Header - Always Visible */}
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
        
        {!isExpanded && getActiveFilterCount() > 0 && (
          <div className="mt-2 flex flex-wrap gap-2">
            {movieChecked && (
              <span className="inline-flex items-center px-2 py-1 rounded-md text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                Movies
              </span>
            )}
            {seriesChecked && (
              <span className="inline-flex items-center px-2 py-1 rounded-md text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                Series
              </span>
            )}
            {actorSearch.trim() && (
              <span className="inline-flex items-center px-2 py-1 rounded-md text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                Actor: {actorSearch.length > 15 ? actorSearch.slice(0, 15) + '...' : actorSearch}
              </span>
            )}
            {selectedGenre && (
              <span className="inline-flex items-center px-2 py-1 rounded-md text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                {selectedGenre.charAt(0).toUpperCase() + selectedGenre.slice(1)}
              </span>
            )}
            {(filters.yearStart !== "1900" || filters.yearEnd !== "2025") && (
              <span className="inline-flex items-center px-2 py-1 rounded-md text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                {filters.yearStart} - {filters.yearEnd}
              </span>
            )}
            {filters.rating && (
              <span className="inline-flex items-center px-2 py-1 rounded-md text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                Rating: {Number(filters.rating).toFixed(1)}+
              </span>
            )}
          </div>
        )}
      </div>

      {/* Collapsible Content */}
      <div className={`transition-all duration-300 ease-in-out ${
        isExpanded ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
      } overflow-hidden`}>
        <div className="p-6 pt-0">
          {/* Description */}
          <div className="mb-6">
            <p className="text-sm text-gray-600 dark:text-gray-400">Refine your search with the filters below</p>
          </div>

          {/* Filter Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        
        {/* Content Type Filter */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Content Type</label>
          <div className="flex flex-col space-y-3">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                checked={movieChecked}
                onChange={(e) => setMovieChecked(e.target.checked)}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
              />
              <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Movies</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                checked={seriesChecked}
                onChange={(e) => setSeriesChecked(e.target.checked)}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
              />
              <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Series</span>
            </label>
          </div>
        </div>

        {/* Actor Search Filter */}
        <div className="space-y-3">
          <label htmlFor="actor-search" className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Search by Actor
          </label>
          <div className="relative">
            <input
              id="actor-search"
              type="text"
              placeholder="Enter actor name..."
              value={actorSearch}
              onChange={(e) => setActorSearch(e.target.value)}
              className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            </div>
          </div>
        </div>

        {/* Genre Filter */}
        <div className="space-y-3">
          <label htmlFor="genre-select" className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Genre
          </label>
          <select
            id="genre-select"
            value={selectedGenre}
            onChange={(e) => setSelectedGenre(e.target.value)}
            className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
          >
            <option value="">All Genres</option>
            <option value="action">Action</option>
            <option value="adventure">Adventure</option>
            <option value="comedy">Comedy</option>
            <option value="drama">Drama</option>
            <option value="horror">Horror</option>
            <option value="romance">Romance</option>
            <option value="sci-fi">Sci-Fi</option>
            <option value="thriller">Thriller</option>
          </select>
        </div>

        {/* Year Range Filter */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Year Range</label>
          <div className="flex space-x-2">
            <div className="flex-1">
              <input
                type="number"
                placeholder="From"
                value={filters.yearStart || ""}
                onChange={(e) => handleFilterChange("yearStart", e.target.value)}
                className="w-full px-3 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
            </div>
            <div className="flex items-center">
              <span className="text-gray-400">—</span>
            </div>
            <div className="flex-1">
              <input
                type="number"
                placeholder="To"
                value={filters.yearEnd || ""}
                onChange={(e) => handleFilterChange("yearEnd", e.target.value)}
                className="w-full px-3 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
            </div>
          </div>
        </div>

        {/* Rating Filter */}
        <div className="space-y-3 lg:col-span-2">
          <label htmlFor="rating" className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Minimum Rating (1-10)
          </label>
          
          <div className="flex items-center space-x-4">
            {/* Number Input with Spinner */}
            <div className="relative">
              <input
                id="rating"
                type="number"
                min="1"
                max="10"
                step="0.1"
                value={ratingValue}
                onChange={handleRatingChange}
                placeholder="1.0"
                className="w-20 px-3 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 pr-8"
              />
              <div className="absolute inset-y-0 right-0 flex flex-col">
                <button
                  type="button"
                  onClick={() => adjustRating(0.1)}
                  className="flex-1 flex items-center justify-center w-6 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200"
                >
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={() => adjustRating(-0.1)}
                  className="flex-1 flex items-center justify-center w-6 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200"
                >
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Slider */}
            <div className="flex-1 relative">
              <div className="relative">
                <input
                  type="range"
                  min="1"
                  max="10"
                  step="0.1"
                  value={tempRatingValue || 1}
                  onChange={handleRatingSliderChange}
                  onMouseUp={handleSliderMouseUp}
                  onMouseEnter={handleSliderMouseEnter}
                  onMouseLeave={handleSliderMouseLeave}
                  className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                  style={{
                    background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${sliderPosition}%, #d1d5db ${sliderPosition}%, #d1d5db 100%)`
                  }}
                />
                
                {/* Tooltip */}
                {showRatingValue && tempRatingValue && (
                  <div 
                    className="absolute -top-10 transform -translate-x-1/2 px-2 py-1 bg-gray-800 dark:bg-gray-200 text-white dark:text-gray-800 text-xs rounded shadow-lg pointer-events-none"
                    style={{ left: `${sliderPosition}%` }}
                  >
                    {Number(tempRatingValue).toFixed(1)}
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800 dark:border-t-gray-200"></div>
                  </div>
                )}
              </div>
              
              {/* Slider Labels */}
              <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                <span>1.0</span>
                <span>10.0</span>
              </div>
            </div>
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

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 20px;
          height: 20px;
          background: #3b82f6;
          border-radius: 50%;
          cursor: pointer;
          border: 2px solid white;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }
        
        .slider::-moz-range-thumb {
          width: 20px;
          height: 20px;
          background: #3b82f6;
          border-radius: 50%;
          cursor: pointer;
          border: 2px solid white;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }
      `}</style>
    </div>
  );
}

export default Filter;