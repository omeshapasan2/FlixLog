import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useMoviesSeriesContext } from "../context/MoviesSeriesContext";
import { Heart, Bookmark, Check, Pause, X, ChevronDown } from "lucide-react";

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
        removeFromWatchList,
        removeFromFinished,
        removeFromOnHold,
        removeFromDropped
    } = useMoviesSeriesContext();

    const [dropdownOpen, setDropdownOpen] = useState(false);
    const favorite = isFavorite(seriesmovies.id);

    const statusOptions = [
        { 
            id: 'watchlist', 
            label: 'Watchlist', 
            icon: Bookmark, 
            color: 'text-blue-600 dark:text-blue-400',
            bgColor: 'bg-blue-50 dark:bg-blue-900/20'
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

    const currentStatusOption = statusOptions.find(opt => opt.id === currentStatus);

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

    // Handle status change
    function handleStatusChange(newStatus) {
        const itemWithDate = { 
            ...seriesmovies, 
            media_type: mediaType,
            dateAdded: new Date().toISOString()
        };

        // Remove from current status
        switch (currentStatus) {
            case 'watchlist':
                removeFromWatchList(seriesmovies.id);
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

        // Add to new status
        switch (newStatus) {
            case 'watchlist':
                moveToWatchlist(itemWithDate);
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

        setDropdownOpen(false);
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
                                e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iMTIwIiB2aWV3Qm94PSIwIDAgODAgMTIwIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8cmVjdCB3aWR0aD0iODAiIGhlaWdodD0iMTIwIiBmaWxsPSIjNEI1NTYzIi8+CjxwYXRoIGQ9Ik0yOCA0MEg1MlY0NEgyOFY0MFoiIGZpbGw9IiM5Q0EzQUYiLz4KPHA';
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

                            {/* Status Dropdown */}
                            <div className="relative">
                                <button
                                    onClick={() => setDropdownOpen(!dropdownOpen)}
                                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                                        currentStatusOption?.bgColor || 'bg-gray-100 dark:bg-gray-700'
                                    } ${currentStatusOption?.color || 'text-gray-600 dark:text-gray-400'}`}
                                >
                                    {currentStatusOption?.icon && (
                                        <currentStatusOption.icon size={16} />
                                    )}
                                    <span className="hidden sm:inline">
                                        {currentStatusOption?.label || 'Status'}
                                    </span>
                                    <ChevronDown size={14} className={`transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
                                </button>

                                {dropdownOpen && (
                                    <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-10">
                                        {statusOptions.map((option) => {
                                            const IconComponent = option.icon;
                                            return (
                                                <button
                                                    key={option.id}
                                                    onClick={() => handleStatusChange(option.id)}
                                                    className={`w-full flex items-center gap-2 px-3 py-2 text-sm text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors first:rounded-t-lg last:rounded-b-lg ${
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