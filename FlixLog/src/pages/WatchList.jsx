import React, { useState } from 'react';
import { useMoviesSeriesContext } from '../context/MoviesSeriesContext';
import ListCard from '../components/ListCard';
import { Link } from 'react-router-dom';
import { Bookmark, SortAsc, Filter, Plus, X, Trash2, Palette } from 'lucide-react';

function WatchList() {
  const { 
    getAllCategories,
    getCategoryData,
    createCustomCategory,
    deleteCustomCategory,
    sortPreference,
    setSortPreference,
    customCategories 
  } = useMoviesSeriesContext();
  
  const [activeTab, setActiveTab] = useState('watchlist');
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false);
  const [showCreateCategory, setShowCreateCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryColor, setNewCategoryColor] = useState('#6b7280');
  const [isCreating, setIsCreating] = useState(false);

  const allCategories = getAllCategories();

  const colorOptions = [
    '#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#06b6d4', 
    '#f97316', '#ef4444', '#6b7280', '#ec4899', '#84cc16'
  ];

  const sortOptions = [
    { id: 'dateAdded', label: 'Date Added' },
    { id: 'popularity', label: 'Most Popular' },
    { id: 'ongoing', label: 'Ongoing' },
    { id: 'notFinished', label: 'Not Finished' }
  ];

  const getCurrentData = () => {
    const categoryData = getCategoryData(activeTab);
    let data = categoryData || [];
    
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
  const activeCategory = allCategories.find(cat => cat.id === activeTab);

  const handleSortChange = (sortId) => {
    setSortPreference(sortId);
    setSortDropdownOpen(false);
  };

  const handleCreateCategory = async () => {
    if (!newCategoryName.trim() || isCreating) return;
    
    setIsCreating(true);
    try {
      const newCategory = await createCustomCategory(newCategoryName, newCategoryColor);
      if (newCategory) {
        setNewCategoryName('');
        setNewCategoryColor('#6b7280');
        setShowCreateCategory(false);
        setActiveTab(newCategory.id);
      }
    } catch (error) {
      console.error('Failed to create category:', error);
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    if (window.confirm('Are you sure you want to delete this category? This action cannot be undone.')) {
      try {
        await deleteCustomCategory(categoryId);
        if (activeTab === categoryId) {
          setActiveTab('watchlist');
        }
      } catch (error) {
        console.error('Failed to delete category:', error);
      }
    }
  };

  if (hasItems) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="h-12" />
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                My Collection
              </h1>
              
              <div className="flex items-center gap-4">
                {/* Create Category Button */}
                <button
                  onClick={() => setShowCreateCategory(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-lg transition-all duration-300 transform hover:scale-105"
                >
                  <Plus className="w-4 h-4" />
                  <span className="text-sm font-medium">New Category</span>
                </button>

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
            </div>

            {/* Tabs */}
            <div className="flex space-x-4 border-b border-gray-200 dark:border-gray-700 overflow-x-auto pb-4">
              {allCategories.map((category) => {
                const categoryData = getCategoryData(category.id);
                const isCustom = customCategories.some(cat => cat.id === category.id);
                
                return (
                  <div key={category.id} className="flex items-center group">
                    <button
                      onClick={() => setActiveTab(category.id)}
                      className={`pb-4 px-3 text-sm font-medium transition-colors relative whitespace-nowrap flex items-center gap-2 ${
                        activeTab === category.id
                          ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                          : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                      }`}
                    >
                      <div 
                        className="w-2 h-2 rounded-full" 
                        style={{ backgroundColor: category.color }}
                      />
                      {category.label}
                      {categoryData && categoryData.length > 0 && (
                        <span className="ml-2 px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-full">
                          {categoryData.length}
                        </span>
                      )}
                    </button>
                    
                    {isCustom && (
                      <button
                        onClick={() => handleDeleteCategory(category.id)}
                        className="ml-2 p-1 text-red-500 hover:text-red-700 opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Delete category"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Create Category Modal */}
        {showCreateCategory && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  Create New Category
                </h3>
                <button
                  onClick={() => setShowCreateCategory(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Category Name
                  </label>
                  <input
                    type="text"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    placeholder="Enter category name..."
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    maxLength={30}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Color
                  </label>
                  <div className="flex gap-2 flex-wrap">
                    {colorOptions.map((color) => (
                      <button
                        key={color}
                        onClick={() => setNewCategoryColor(color)}
                        className={`w-8 h-8 rounded-full border-2 transition-all ${
                          newCategoryColor === color 
                            ? 'border-gray-900 dark:border-gray-100' 
                            : 'border-gray-300 dark:border-gray-600'
                        }`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowCreateCategory(false)}
                  className="flex-1 px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateCategory}
                  disabled={!newCategoryName.trim() || isCreating}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isCreating ? 'Creating...' : 'Create'}
                </button>
              </div>
            </div>
          </div>
        )}

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
          <div className="flex justify-between items-center py-6">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              My Collection
            </h1>
            
            {/* Create Category Button */}
            <button
              onClick={() => setShowCreateCategory(true)}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-lg transition-all duration-300 transform hover:scale-105"
            >
              <Plus className="w-4 h-4" />
              <span className="text-sm font-medium">New Category</span>
            </button>
          </div>

          {/* Tabs */}
          <div className="flex space-x-4 border-b border-gray-200 dark:border-gray-700 overflow-x-auto pb-4">
            {allCategories.map((category) => {
              const categoryData = getCategoryData(category.id);
              const isCustom = customCategories.some(cat => cat.id === category.id);
              
              return (
                <div key={category.id} className="flex items-center group">
                  <button
                    onClick={() => setActiveTab(category.id)}
                    className={`pb-4 px-3 text-sm font-medium transition-colors relative whitespace-nowrap flex items-center gap-2 ${
                      activeTab === category.id
                        ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                        : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                    }`}
                  >
                    <div 
                      className="w-2 h-2 rounded-full" 
                      style={{ backgroundColor: category.color }}
                    />
                    {category.label}
                    {categoryData && categoryData.length > 0 && (
                      <span className="ml-2 px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-full">
                        {categoryData.length}
                      </span>
                    )}
                  </button>
                  
                  {isCustom && (
                    <button
                      onClick={() => handleDeleteCategory(category.id)}
                      className="ml-2 p-1 text-red-500 hover:text-red-700 opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Delete category"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Create Category Modal */}
      {showCreateCategory && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Create New Category
              </h3>
              <button
                onClick={() => setShowCreateCategory(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Category Name
                </label>
                <input
                  type="text"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  placeholder="Enter category name..."
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  maxLength={30}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Color
                </label>
                <div className="flex gap-2 flex-wrap">
                  {colorOptions.map((color) => (
                    <button
                      key={color}
                      onClick={() => setNewCategoryColor(color)}
                      className={`w-8 h-8 rounded-full border-2 transition-all ${
                        newCategoryColor === color 
                          ? 'border-gray-900 dark:border-gray-100' 
                          : 'border-gray-300 dark:border-gray-600'
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowCreateCategory(false)}
                className="flex-1 px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateCategory}
                disabled={!newCategoryName.trim() || isCreating}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isCreating ? 'Creating...' : 'Create'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Empty State */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
          {/* Icon */}
          <div className="mb-8 p-6 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20 rounded-full shadow-lg">
            <Bookmark className="w-16 h-16 text-blue-500 dark:text-blue-400" strokeWidth={1.5} />
          </div>

          {/* Heading */}
          <h3 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6">
            No {activeCategory?.label || 'Items'} Yet
          </h3>

          {/* Description */}
          <div className="max-w-md space-y-4">
            <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
              Start building your collection by adding movies and TV shows to your categories.
            </p>
            
            <p className="text-base text-gray-500 dark:text-gray-400 leading-relaxed">
              You can organize them by status or create your own custom categories.
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