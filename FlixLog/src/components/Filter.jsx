import React, { useState, useEffect, useCallback } from 'react';
import { useMoviesSeriesContext } from '../context/MoviesSeriesContext';
import { discoverMedia } from '../api/api';
import ActorFilter from './ActorFilter';
import debounce from 'lodash/debounce';

function Filter() {
  const {
    setSeriesMovies,
    setLoading,
    setError,
    filters,
    setFilters,
    movieFilters,
    setMovieFilters,
    tvFilters,
    setTvFilters,
    contentType,
    setContentType,
  } = useMoviesSeriesContext();
  const [isExpanded, setIsExpanded] = useState(false);

  const genreOptions = {
    movie: [
      { id: 28, name: "Action" },
      { id: 12, name: "Adventure" },
      { id: 16, name: "Animation" },
      { id: 35, name: "Comedy" },
      { id: 80, name: "Crime" },
      { id: 99, name: "Documentary" },
      { id: 18, name: "Drama" },
      { id: 10751, name: "Family" },
      { id: 14, name: "Fantasy" },
      { id: 36, name: "History" },
      { id: 27, name: "Horror" },
      { id: 10402, name: "Music" },
      { id: 9648, name: "Mystery" },
      { id: 10749, name: "Romance" },
      { id: 878, name: "Science Fiction" },
      { id: 10770, name: "TV Movie" },
      { id: 53, name: "Thriller" },
      { id: 10752, name: "War" },
      { id: 37, name: "Western" },
    ],
    tv: [
      { id: 10759, name: "Action & Adventure" },
      { id: 16, name: "Animation" },
      { id: 35, name: "Comedy" },
      { id: 80, name: "Crime" },
      { id: 99, name: "Documentary" },
      { id: 18, name: "Drama" },
      { id: 10751, name: "Family" },
      { id: 10762, name: "Kids" },
      { id: 9648, name: "Mystery" },
      { id: 10763, name: "News" },
      { id: 10764, name: "Reality" },
      { id: 10765, name: "Sci-Fi & Fantasy" },
      { id: 10766, name: "Soap" },
      { id: 10767, name: "Talk" },
      { id: 10768, name: "War & Politics" },
      { id: 37, name: "Western" },
    ],
  };

  const specialGenres = [
    { id: 'anime', name: 'Anime Only' },
    { id: 'kdrama', name: 'K-Dramas', disabled: contentType === 'movie' },
    { id: 'indian', name: 'Indian Movies', disabled: contentType === 'tv' },
    { id: 'hollywood', name: 'Hollywood', disabled: contentType === 'tv' },
  ];

  const buildQueryParams = useCallback(() => {
    const params = {};

    if (filters.specialFilter !== 'none') {
      switch (filters.specialFilter) {
        case 'anime':
          params.with_genres = '16';
          if (contentType === 'movie') {
            params.with_original_language = 'ja';
          } else {
            params.with_origin_country = 'JP';
          }
          break;
        case 'kdrama':
          params.with_origin_country = 'KR';
          params.with_genres = '18';
          break;
        case 'indian':
          params.with_original_language = 'hi';
          params.with_origin_country = 'IN';
          break;
        case 'hollywood':
          params.with_origin_country = 'US';
          break;
        default:
          break;
      }
    } else if (filters.genres.length > 0) {
      params.with_genres = filters.genres.join(',');
    }

    if (filters.rating !== 5.0) {
      params['vote_average.gte'] = filters.rating;
    }

    if (contentType === 'movie') {
      if (filters.yearStart && filters.yearStart !== "2020") {
        params['primary_release_date.gte'] = `${filters.yearStart}-01-01`;
      }
      if (filters.yearEnd && filters.yearEnd !== "2025") {
        params['primary_release_date.lte'] = `${filters.yearEnd}-12-31`;
      }
      if (movieFilters.certification) {
        params.certification = movieFilters.certification;
        params.certification_country = 'US';
      }
      if (movieFilters.actors.length > 0) {
        params.with_cast = movieFilters.actors.join(',');
      }
    } else if (contentType === 'tv') {
      if (filters.yearStart && filters.yearStart !== "2020") {
        params['first_air_date.gte'] = `${filters.yearStart}-01-01`;
      }
      if (filters.yearEnd && filters.yearEnd !== "2025") {
        params['first_air_date.lte'] = `${filters.yearEnd}-12-31`;
      }
      if (tvFilters.networks.length > 0) {
        params.with_networks = tvFilters.networks.join('|');
      }
      if (tvFilters.status) {
        params.with_status = tvFilters.status;
      }
    }

    params.language = 'en-US';
    params.page = 1;
    params.sort_by = 'popularity.desc';

    return params;
  }, [filters, movieFilters, tvFilters, contentType]);

  const fetchFilteredResults = useCallback(
    debounce(async (params, mediaType) => {
      setLoading(true);
      try {
        const results = await discoverMedia(mediaType, params);
        setSeriesMovies(results);
        setError(null);
      } catch (err) {
        setError(err.message || `Failed to fetch ${mediaType} results`);
        console.error(`Error fetching ${mediaType}:`, err);
      } finally {
        setLoading(false);
      }
    }, 500),
    [setSeriesMovies, setLoading, setError]
  );

  useEffect(() => {
    const params = buildQueryParams();
    fetchFilteredResults(params, contentType);
  }, [filters, movieFilters, tvFilters, contentType, fetchFilteredResults]);

  const handleContentTypeChange = (type) => {
    setContentType(type);
    if (type === 'movie') {
      setTvFilters({
        networks: [],
        status: "",
      });
      if (filters.specialFilter === 'kdrama') {
        setFilters(prev => ({ ...prev, genres: [], specialFilter: 'none' }));
      }
    } else if (type === 'tv') {
      setMovieFilters({
        actors: [],
        certification: "",
      });
      if (filters.specialFilter === 'indian' || filters.specialFilter === 'hollywood') {
        setFilters(prev => ({ ...prev, genres: [], specialFilter: 'none' }));
      }
    } else {
      setFilters(prev => ({ ...prev, genres: [], specialFilter: 'none' }));
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

  const handleGenreToggle = (genreId) => {
    setFilters(prev => ({
      ...prev,
      genres: prev.genres.includes(genreId)
        ? prev.genres.filter(id => id !== genreId)
        : [...prev.genres, genreId],
      specialFilter: 'none',
    }));
  };

  const handleSpecialFilter = (specialId) => {
    setFilters(prev => ({
      ...prev,
      specialFilter: prev.specialFilter === specialId ? 'none' : specialId,
      genres: [],
    }));
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (filters.yearStart !== "2020" || filters.yearEnd !== "2025") count++;
    if (filters.rating !== 5.0) count++;
    if (filters.genres.length > 0 || filters.specialFilter !== 'none') count++;
    if (contentType === 'movie') {
      if (movieFilters.actors.length > 0) count++;
      if (movieFilters.certification) count++;
    } else if (contentType === 'tv') {
      if (tvFilters.networks.length > 0) count++;
      if (tvFilters.status) count++;
    }
    return count;
  };

  const clearAllFilters = () => {
    setFilters({ yearStart: "2020", yearEnd: "2025", rating: 5.0, genres: [], specialFilter: 'none' });
    setMovieFilters({ actors: [], certification: "" });
    setTvFilters({ networks: [], status: "" });
  };

  const handleApplyFilters = () => {
    const params = buildQueryParams();
    fetchFilteredResults(params, contentType);
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 mb-6 overflow-hidden transition-all duration-300">
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
      <div className={`transition-all duration-300 ease-in-out ${isExpanded ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'} overflow-hidden`}>
        <div className="p-6 pt-0">
          <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 text-center">
              Content Type
            </h3>
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
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            <div className="space-y-3">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {contentType === 'movie' ? 'Release Year' : 'First Air Date'} Range
              </label>
              <div className="items-center space-x-2">
                <input
                  type="number"
                  placeholder="From"
                  value={filters.yearStart || ""}
                  onChange={(e) => handleFilterChange("yearStart", e.target.value)}
                  className="w-20 px-3 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
                <span className="items-center text-gray-400">—</span>
                <input
                  type="number"
                  placeholder="To"
                  value={filters.yearEnd || ""}
                  onChange={(e) => handleFilterChange("yearEnd", e.target.value)}
                  className="w-20 px-3 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              </div>
            </div>
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
                  className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-2">
                  <span>1.0</span>
                  <span>10.0</span>
                </div>
              </div>
            </div>
            {contentType === 'movie' && (
              <div className="space-y-3">
                <ActorFilter onChange={(actors) => handleMovieFilterChange('actors', actors)} />
              </div>
            )}
            {contentType === 'tv' && (
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
            {contentType === 'tv' && (
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
            {contentType === 'movie' && (
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
          </div>
          <div className="mt-6 space-y-4">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Genres {(filters.genres.length > 0 || filters.specialFilter !== 'none') && (
                <span className="text-xs text-blue-600 dark:text-blue-400">
                  ({filters.genres.length + (filters.specialFilter !== 'none' ? 1 : 0)} selected)
                </span>
              )}
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2">
              {specialGenres.map((genre) => (
                <button
                  key={genre.id}
                  onClick={() => handleSpecialFilter(genre.id)}
                  className={`px-3 py-2 text-xs font-medium rounded-lg border transition-all duration-200 ${
                    genre.disabled
                      ? 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 border-gray-300 dark:border-gray-600 cursor-not-allowed'
                      : filters.specialFilter === genre.id
                        ? 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 border-blue-300 dark:border-blue-700 shadow-sm'
                        : 'bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                  disabled={genre.disabled}
                >
                  {genre.name}
                </button>
              ))}
              {genreOptions[contentType].map((genre) => (
                <button
                  key={genre.id}
                  onClick={() => handleGenreToggle(genre.id)}
                  className={`px-3 py-2 text-xs font-medium rounded-lg border transition-all duration-200 ${
                    filters.specialFilter !== 'none'
                      ? 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 border-gray-300 dark:border-gray-600 cursor-not-allowed'
                      : filters.genres.includes(genre.id)
                        ? 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 border-blue-300 dark:border-blue-700 shadow-sm'
                        : 'bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                  disabled={filters.specialFilter !== 'none'}
                >
                  {genre.name}
                </button>
              ))}
            </div>
          </div>
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
              onClick={handleApplyFilters}
              className="px-6 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors duration-200 shadow-sm"
            >
              Apply Filters
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Filter;