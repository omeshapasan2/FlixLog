import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useMoviesSeriesContext } from "../context/MoviesSeriesContext";
import { Heart, Bookmark, Check, Pause, X, ChevronDown, Trash2, Clock, Play, Calendar } from "lucide-react";

function ListCard({ seriesmovies, currentStatus }) {
    const title = seriesmovies.title || seriesmovies.name;
    const year = (seriesmovies.release_date || seriesmovies.first_air_date || "").split("-")[0];
    
    // Determine media type
    const mediaType = seriesmovies.media_type || 
                     (seriesmovies.title ? 'movie' : 'tv') || 
                     (seriesmovies.release_date ? 'movie' : 'tv');

    const { 
        addToFavorites, 
        removeFromFavorites, 
        isFavorite,
        moveToWatchlist,
        moveToFinished,
        moveToOnHold,
        moveToDropped,
        // Add these new functions to your context if they don't exist
        moveToPlanToWatch,
        moveToOngoing,
        moveToUpcoming,
        removeFromWatchList,
        removeFromFinished,
        removeFromOnHold,
        removeFromDropped,
        // Add these new remove functions to your context if they don't exist
        removeFromPlanToWatch,
        removeFromOngoing,
        removeFromUpcoming,
        getAllCategories,
        addToCustomCategory,
        removeFromCustomCategory,
        customCategories
    } = useMoviesSeriesContext();

    const [dropdownOpen, setDropdownOpen] = useState(false);
    const favorite = isFavorite(seriesmovies.id);

    // Get all available categories
    const allCategories = getAllCategories();

    // Find current category info
    const currentCategory = allCategories.find(cat => cat.id === currentStatus);
    const isCustomCategory = customCategories.some(cat => cat.id === currentStatus);

    // Define default status options (these are the core categories)
    const defaultStatusOptions = [
        { 
            id: 'watchlist', 
            label: 'Watchlist', 
            icon: Bookmark, 
            color: 'text-blue-600 dark:text-blue-400',
            bgColor: 'bg-blue-50 dark:bg-blue-900/20'
        },
        { 
            id: 'plantowatch', 
            label: 'Plan to Watch', 
            icon: Calendar, 
            color: 'text-purple-600 dark:text-purple-400',
            bgColor: 'bg-purple-50 dark:bg-purple-900/20'
        },
        { 
            id: 'ongoing', 
            label: 'Ongoing', 
            icon: Play, 
            color: 'text-orange-600 dark:text-orange-400',
            bgColor: 'bg-orange-50 dark:bg-orange-900/20'
        },
        { 
            id: 'upcoming', 
            label: 'Upcoming', 
            icon: Clock, 
            color: 'text-cyan-600 dark:text-cyan-400',
            bgColor: 'bg-cyan-50 dark:bg-cyan-900/20'
        },
        { 
            id: 'finished', 
            label: 'Finished', 
            icon: Check, 
            color: 'text-green-600 dark:text-green-400',
            bgColor: 'bg-green-50 dark:bg-green-900/20'
        },
        { 
            id: 'onhold', 
            label: 'On Hold', 
            icon: Pause, 
            color: 'text-yellow-600 dark:text-yellow-400',
            bgColor: 'bg-yellow-50 dark:bg-yellow-900/20'
        },
        { 
            id: 'dropped', 
            label: 'Dropped', 
            icon: X, 
            color: 'text-red-600 dark:text-red-400',
            bgColor: 'bg-red-50 dark:bg-red-900/20'
        }
    ];

    // Get current category display info
    const getCurrentCategoryDisplay = () => {
        if (isCustomCategory) {
            const customCat = customCategories.find(cat => cat.id === currentStatus);
            return {
                label: customCat?.name || 'Custom',
                color: `text-gray-700 dark:text-gray-300`,
                bgColor: 'bg-gray-100 dark:bg-gray-700',
                customColor: customCat?.color || '#6b7280'
            };
        }
        
        const defaultOption = defaultStatusOptions.find(opt => opt.id === currentStatus);
        return defaultOption || {
            label: currentCategory?.label || 'Status',
            color: 'text-gray-600 dark:text-gray-400',
            bgColor: 'bg-gray-100 dark:bg-gray-700'
        };
    };

    const currentDisplay = getCurrentCategoryDisplay();

    // Handle favorite toggle
    function onFavoriteClick(e) {
        e.preventDefault();
        e.stopPropagation();
        if (favorite) {
            removeFromFavorites(seriesmovies.id);
        } else {
            addToFavorites({ ...seriesmovies, media_type: mediaType });
        }
    }

    // Handle status/category change
    function handleCategoryChange(newCategoryId) {
        const itemWithDate = { 
            ...seriesmovies, 
            media_type: mediaType,
            dateAdded: new Date().toISOString()
        };

        // Remove from current category
        if (isCustomCategory) {
            removeFromCustomCategory(currentStatus, seriesmovies.id);
        } else {
            // Remove from default status categories
            switch (currentStatus) {
                case 'watchlist':
                    removeFromWatchList(seriesmovies.id);
                    break;
                case 'plantowatch':
                    removeFromPlanToWatch && removeFromPlanToWatch(seriesmovies.id);
                    break;
                case 'ongoing':
                    removeFromOngoing && removeFromOngoing(seriesmovies.id);
                    break;
                case 'upcoming':
                    removeFromUpcoming && removeFromUpcoming(seriesmovies.id);
                    break;
                case 'finished':
                    removeFromFinished(seriesmovies.id);
                    break;
                case 'onhold':
                    removeFromOnHold(seriesmovies.id);
                    break;
                case 'dropped':
                    removeFromDropped(seriesmovies.id);
                    break;
            }
        }

        // Add to new category
        const isNewCategoryCustom = customCategories.some(cat => cat.id === newCategoryId);
        
        if (isNewCategoryCustom) {
            addToCustomCategory(newCategoryId, itemWithDate);
        } else {
            // Add to default status categories
            switch (newCategoryId) {
                case 'watchlist':
                    moveToWatchlist(itemWithDate);
                    break;
                case 'plantowatch':
                    moveToPlanToWatch && moveToPlanToWatch(itemWithDate);
                    break;
                case 'ongoing':
                    moveToOngoing && moveToOngoing(itemWithDate);
                    break;
                case 'upcoming':
                    moveToUpcoming && moveToUpcoming(itemWithDate);
                    break;
                case 'finished':
                    moveToFinished(itemWithDate);
                    break;
                case 'onhold':
                    moveToOnHold(itemWithDate);
                    break;
                case 'dropped':
                    moveToDropped(itemWithDate);
                    break;
            }
        }

        setDropdownOpen(false);
    }

    // Handle remove from current category
    function handleRemoveFromCategory(e) {
        e.preventDefault();
        e.stopPropagation();
        
        if (isCustomCategory) {
            removeFromCustomCategory(currentStatus, seriesmovies.id);
        } else {
            switch (currentStatus) {
                case 'watchlist':
                    removeFromWatchList(seriesmovies.id);
                    break;
                case 'plantowatch':
                    removeFromPlanToWatch && removeFromPlanToWatch(seriesmovies.id);
                    break;
                case 'ongoing':
                    removeFromOngoing && removeFromOngoing(seriesmovies.id);
                    break;
                case 'upcoming':
                    removeFromUpcoming && removeFromUpcoming(seriesmovies.id);
                    break;
                case 'finished':
                    removeFromFinished(seriesmovies.id);
                    break;
                case 'onhold':
                    removeFromOnHold(seriesmovies.id);
                    break;
                case 'dropped':
                    removeFromDropped(seriesmovies.id);
                    break;
            }
        }
    }

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow duration-200">
            <div className="flex p-4 gap-4">
                {/* Poster */}
                <Link 
                    to={`/details/${seriesmovies.id}/${mediaType}`}
                    className="flex-shrink-0"
                >
                    <div className="w-16 h-24 sm:w-20 sm:h-30 bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden">
                        <img
                            src={`https://image.tmdb.org/t/p/w200${seriesmovies.poster_path}`}
                            alt={title}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                                e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iMTIwIiB2aWV3Qm94PSIwIDAgODAgMTIwIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8cmVjdCB3aWR0aD0iODAiIGhlaWdodD0iMTIwIiBmaWxsPSIjNEI1NTYzIi8+CjxwYXRoIGQ9Ik0yOCA0MEg1MlY0NEgyOFY0MFoiIGZpbGw9IiM5Q0EzQUYiLz4KPHA=';
                            }}
                        />
                    </div>
                </Link>

                {/* Content */}
                <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                        <div className="flex-1 min-w-0">
                            <Link 
                                to={`/details/${seriesmovies.id}/${mediaType}`}
                                className="no-underline"
                            >
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400 transition-colors truncate">
                                    {title}
                                </h3>
                            </Link>
                            
                            <div className="flex items-center gap-4 mt-1 text-sm text-gray-600 dark:text-gray-400">
                                <span>{year}</span>
                                <span className="flex items-center gap-1">
                                    ⭐ {seriesmovies.vote_average ? seriesmovies.vote_average.toFixed(1) : 'N/A'}
                                </span>
                                <span className="capitalize text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-full">
                                    {mediaType}
                                </span>
                            </div>

                            {/* Overview - hidden on mobile */}
                            <p className="hidden sm:block text-sm text-gray-600 dark:text-gray-400 mt-2 line-clamp-2">
                                {seriesmovies.overview || 'No description available.'}
                            </p>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center gap-2 flex-shrink-0">
                            {/* Favorite Button */}
                            <button
                                onClick={onFavoriteClick}
                                className={`p-2 rounded-full transition-colors ${
                                    favorite 
                                        ? "bg-red-500 text-white hover:bg-red-600" 
                                        : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600"
                                }`}
                                title={favorite ? "Remove from favorites" : "Add to favorites"}
                            >
                                <Heart size={16} className={favorite ? "fill-current" : ""} />
                            </button>

                            {/* Remove from Category Button */}
                            <button
                                onClick={handleRemoveFromCategory}
                                className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-red-100 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                                title="Remove from this category"
                            >
                                <Trash2 size={16} />
                            </button>

                            {/* Category Dropdown */}
                            <div className="relative">
                                <button
                                    onClick={() => setDropdownOpen(!dropdownOpen)}
                                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                                        currentDisplay.bgColor
                                    } ${currentDisplay.color}`}
                                    style={currentDisplay.customColor ? {
                                        backgroundColor: `${currentDisplay.customColor}20`,
                                        color: currentDisplay.customColor
                                    } : {}}
                                >
                                    {isCustomCategory ? (
                                        <div 
                                            className="w-3 h-3 rounded-full" 
                                            style={{ backgroundColor: currentDisplay.customColor }}
                                        />
                                    ) : (
                                        defaultStatusOptions.find(opt => opt.id === currentStatus)?.icon && 
                                        React.createElement(defaultStatusOptions.find(opt => opt.id === currentStatus).icon, { size: 16 })
                                    )}
                                    <span className="hidden sm:inline">
                                        {currentDisplay.label}
                                    </span>
                                    <ChevronDown size={14} className={`transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
                                </button>

                                {dropdownOpen && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-10 max-h-60 overflow-y-auto">
                                        {/* Default Status Categories */}
                                        <div className="py-1">
                                            <div className="px-3 py-2 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                Status
                                            </div>
                                            {defaultStatusOptions.map((option) => {
                                                const IconComponent = option.icon;
                                                return (
                                                    <button
                                                        key={option.id}
                                                        onClick={() => handleCategoryChange(option.id)}
                                                        className={`w-full flex items-center gap-2 px-3 py-2 text-sm text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                                                            currentStatus === option.id 
                                                                ? `${option.bgColor} ${option.color}` 
                                                                : 'text-gray-700 dark:text-gray-300'
                                                        }`}
                                                    >
                                                        <IconComponent size={16} />
                                                        {option.label}
                                                    </button>
                                                );
                                            })}
                                        </div>

                                        {/* Custom Categories */}
                                        {customCategories.length > 0 && (
                                            <div className="py-1 border-t border-gray-200 dark:border-gray-600">
                                                <div className="px-3 py-2 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                    Custom
                                                </div>
                                                {customCategories.map((category) => (
                                                    <button
                                                        key={category.id}
                                                        onClick={() => handleCategoryChange(category.id)}
                                                        className={`w-full flex items-center gap-2 px-3 py-2 text-sm text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                                                            currentStatus === category.id 
                                                                ? 'bg-gray-100 dark:bg-gray-700' 
                                                                : 'text-gray-700 dark:text-gray-300'
                                                        }`}
                                                        style={currentStatus === category.id ? {
                                                            backgroundColor: `${category.color}20`,
                                                            color: category.color
                                                        } : {}}
                                                    >
                                                        <div 
                                                            className="w-3 h-3 rounded-full" 
                                                            style={{ backgroundColor: category.color }}
                                                        />
                                                        {category.name}
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Backdrop - visible on mobile */}
            <div className="sm:hidden">
                {seriesmovies.backdrop_path && (
                    <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded-b-lg overflow-hidden">
                        <img
                            src={`https://image.tmdb.org/t/p/w500${seriesmovies.backdrop_path}`}
                            alt={`${title} backdrop`}
                            className="w-full h-full object-cover opacity-80"
                        />
                    </div>
                )}
            </div>
        </div>
    );
}

export default ListCard;