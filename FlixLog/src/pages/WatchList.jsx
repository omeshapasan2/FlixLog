import React, { useState } from 'react';
import { useMoviesSeriesContext } from '../context/MoviesSeriesContext';
import ListCard from '../components/ListCard';
import { Link } from 'react-router-dom';
import { Bookmark, SortAsc, Filter } from 'lucide-react';

function WatchList() {
  const { 
    watchlist, 
    finishedList, 
    onHoldList, 
    droppedList,
    sortPreference,
    setSortPreference 
  } = useMoviesSeriesContext();
  
  const [activeTab, setActiveTab] = useState('watchlist');
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false);

  const tabs = [
    { id: 'watchlist', label: 'Watchlist', data: watchlist },
    { id: 'finished', label: 'Finished', data: finishedList },
    { id: 'onhold', label: 'On Hold', data: onHoldList },
    { id: 'dropped', label: 'Dropped', data: droppedList }
  ];

  const sortOptions = [
    { id: 'dateAdded', label: 'Date Added' },
    { id: 'popularity', label: 'Most Popular' },
    { id: 'ongoing', label: 'Ongoing' },
    { id: 'notFinished', label: 'Not Finished' }
  ];

  const getCurrentData = () => {
    const currentTab = tabs.find(tab => tab.id === activeTab);
    let data = currentTab?.data || [];
    
    // Apply sorting
    switch (sortPreference) {
      case 'dateAdded':
        return [...data].sort((a, b) => new Date(b.dateAdded || 0) - new Date(a.dateAdded || 0));
      case 'popularity':
        return [...data].sort((a, b) => (b.vote_average || 0) - (a.vote_average || 0));
      case 'ongoing':
        return [...data].filter(item => item.status === 'Returning Series' || item.status === 'In Production');
      case 'notFinished':
        return [...data].filter(item => item.status !== 'Ended' && item.status !== 'Released');
      default:
        return data;
    }
  };

  const currentData = getCurrentData();
  const hasItems = currentData && currentData.length > 0;

  const handleSortChange = (sortId) => {
    setSortPreference(sortId);
    setSortDropdownOpen(false);
  };

  if (hasItems) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                My Collection
              </h1>
              
              {/* Sort Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setSortDropdownOpen(!sortDropdownOpen)}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  <SortAsc className="w-4 h-4" />
                  <span className="text-sm font-medium">
                    {sortOptions.find(opt => opt.id === sortPreference)?.label || 'Date Added'}
                  </span>
                </button>
                
                {sortDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-10">
                    {sortOptions.map((option) => (
                      <button
                        key={option.id}
                        onClick={() => handleSortChange(option.id)}
                        className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors first:rounded-t-lg last:rounded-b-lg ${
                          sortPreference === option.id 
                            ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' 
                            : 'text-gray-700 dark:text-gray-300'
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Tabs */}
            <div className="flex space-x-8 border-b border-gray-200 dark:border-gray-700">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`pb-4 px-1 text-sm font-medium transition-colors relative ${
                    activeTab === tab.id
                      ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                      : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                  }`}
                >
                  {tab.label}
                  {tab.data && tab.data.length > 0 && (
                    <span className="ml-2 px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-full">
                      {tab.data.length}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="space-y-4">
            {currentData.map((item) => (
              <ListCard 
                key={`${item.id}-${activeTab}`} 
                seriesmovies={item} 
                currentStatus={activeTab}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              My Collection
            </h1>
          </div>

          {/* Tabs */}
          <div className="flex space-x-8 border-b border-gray-200 dark:border-gray-700">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`pb-4 px-1 text-sm font-medium transition-colors relative ${
                  activeTab === tab.id
                    ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                {tab.label}
                {tab.data && tab.data.length > 0 && (
                  <span className="ml-2 px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-full">
                    {tab.data.length}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Empty State */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
          {/* Icon */}
          <div className="mb-8 p-6 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20 rounded-full shadow-lg">
            <Bookmark className="w-16 h-16 text-blue-500 dark:text-blue-400" strokeWidth={1.5} />
          </div>

          {/* Heading */}
          <h3 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6">
            No {tabs.find(tab => tab.id === activeTab)?.label} Yet
          </h3>

          {/* Description */}
          <div className="max-w-md space-y-4">
            <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
              Start building your collection by adding movies and TV shows to your watchlist.
            </p>
            
            <p className="text-base text-gray-500 dark:text-gray-400 leading-relaxed">
              You can organize them by status: Watchlist, Finished, On Hold, or Dropped.
            </p>
          </div>

          {/* Call to Action */}
          <div className="mt-8">
            <Link to="/" className="inline-block">
              <button className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-medium rounded-full shadow-lg transform hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-200 dark:focus:ring-blue-800">
                Discover Movies & TV Shows
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WatchList;