import React, { useState, useEffect } from 'react'
import { searchAll } from '../api/api';
import { useMoviesSeriesContext } from '../context/MoviesSeriesContext';
import { Link, useNavigate } from 'react-router-dom';

function SearchBar() {
    const [searchQuery, setSearchQuery] = useState('');
    const { loading, setLoading, seriesMovies, setSeriesMovies, error, setError } = useMoviesSeriesContext();
    const [recommendations, setRecommendations] = useState([]);
    const [isInputFocused, setIsInputFocused] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const delayDebounce = setTimeout(async() => {
            if(searchQuery.trim()){
                try{
                    const results = await searchAll(searchQuery);
                    setRecommendations(results.slice(0, 5)); // Limit to 5
                } catch(err) {
                    console.error("Error fetching search results:", err);
                    setError("Failed to load search results");
                    setRecommendations([]);
                } 
            } else {
                setRecommendations([]);
            }
        }, 300);

        return () => clearTimeout(delayDebounce);
    }, [searchQuery]);

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!searchQuery.trim()) return
        if (loading) return

        setLoading(true);
        
        try {
            const searchResults = await searchAll(searchQuery);
            setSeriesMovies(searchResults);
            setError(null);
        } catch (err) {
            console.log(err)
            setError("Failed to load search results");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="relative max-w-[600px] mx-auto px-4">
            {/* Modern Search Bar */}
            <form onSubmit={handleSearch} className="relative mb-8 sm:mb-4">
                <div className={`relative flex items-center gap-2 px-4 py-3 bg-white/70 dark:bg-gray-800/70 rounded-3xl transition-all duration-500 transform ${isInputFocused ? 'scale-105 shadow-2xl' : 'shadow-lg hover:shadow-xl'} backdrop-blur-sm`}>
                    
                    {/* Animated Gradient Shadow */}
                    <div className={`absolute inset-0 -z-10 rounded-3xl opacity-70 blur-xl transition-all duration-500 ${isInputFocused ? 'opacity-90 blur-2xl' : ''}`}
                        style={{
                            background: `
                                radial-gradient(at 85% 51%, hsla(60,60%,61%,0.8) 0px, transparent 50%),
                                radial-gradient(at 74% 68%, hsla(235,69%,77%,0.8) 0px, transparent 50%),
                                radial-gradient(at 64% 79%, hsla(284,72%,73%,0.8) 0px, transparent 50%),
                                radial-gradient(at 75% 16%, hsla(283,60%,72%,0.8) 0px, transparent 50%),
                                radial-gradient(at 90% 65%, hsla(153,70%,64%,0.8) 0px, transparent 50%),
                                radial-gradient(at 91% 83%, hsla(283,74%,69%,0.8) 0px, transparent 50%),
                                radial-gradient(at 72% 91%, hsla(213,75%,75%,0.8) 0px, transparent 50%)
                            `
                        }}>
                    </div>

                    {/* Search Icon */}
                    <button 
                        type="submit"
                        className={`flex items-center justify-center p-2 rounded-xl bg-transparent hover:bg-white/40 dark:hover:bg-gray-600/40 transition-all duration-300 transform ${isInputFocused ? 'scale-110' : 'hover:scale-105'}`}
                    >
                        <svg 
                            fill="none" 
                            xmlns="http://www.w3.org/2000/svg" 
                            viewBox="0 0 20 20" 
                            className={`w-5 h-5 transition-all duration-300 ${isInputFocused ? 'text-purple-600 dark:text-purple-400' : 'text-gray-800 dark:text-gray-300'}`}
                        >
                            <path 
                                d="M4 9a5 5 0 1110 0A5 5 0 014 9zm5-7a7 7 0 104.2 12.6.999.999 0 00.093.107l3 3a1 1 0 001.414-1.414l-3-3a.999.999 0 00-.107-.093A7 7 0 009 2z" 
                                fillRule="evenodd" 
                                fill="currentColor"
                            />
                        </svg>
                    </button>

                    {/* Search Input */}
                    <input
                        type="text"
                        placeholder="Search for movies and TV shows..."
                        className="flex-1 px-3 py-2 bg-transparent rounded-2xl outline-none border-none text-gray-900 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-0 transition-all duration-300"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onFocus={() => setIsInputFocused(true)}
                        onBlur={() => setIsInputFocused(false)}
                    />

                    {/* Loading Spinner */}
                    {loading && (
                        <div className="flex items-center justify-center p-2">
                            <div className="w-5 h-5 border-2 border-purple-300 border-t-purple-600 rounded-full animate-spin"></div>
                        </div>
                    )}
                </div>
            </form>

            {/* Search Recommendations Dropdown */}
            {recommendations.length > 0 && (
                <div className="absolute top-full left-4 right-4 z-50 mt-2 animate-in fade-in slide-in-from-top-2 duration-300">
                    <ul className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-md border border-gray-200/50 dark:border-gray-600/50 rounded-2xl shadow-2xl overflow-hidden">
                        {recommendations.map((item, index) => (
                            <li 
                                key={item.id} 
                                className={`transform transition-all duration-300 hover:scale-[1.02] hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 dark:hover:from-gray-700 dark:hover:to-gray-600 ${index !== recommendations.length - 1 ? 'border-b border-gray-100 dark:border-gray-700' : ''}`}
                                style={{ animationDelay: `${index * 50}ms` }}
                            >
                                <Link 
                                    to={`/details/${item.id}/${item.media_type}`}
                                    className="flex items-center p-4 transition-all duration-300 group"
                                >
                                    <div className="relative overflow-hidden rounded-lg mr-4 transform transition-transform duration-300 group-hover:scale-105">
                                        <img 
                                            src={
                                                item.poster_path 
                                                    ? `https://image.tmdb.org/t/p/w500${item.poster_path}` 
                                                    : 'https://via.placeholder.com/150'
                                            }
                                            alt={item.title || item.name}
                                            className='w-12 h-16 object-cover transition-transform duration-300 group-hover:scale-110'
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <span className='text-gray-900 dark:text-white font-medium text-sm truncate block transition-colors duration-300 group-hover:text-purple-600 dark:group-hover:text-purple-400'>
                                            {item.title || item.name}
                                        </span>
                                        <span className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                                            {item.media_type === 'movie' ? 'Movie' : 'TV Show'}
                                        </span>
                                    </div>
                                    <div className="ml-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
                                        <svg className="w-4 h-4 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </div>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Error Message */}
            {error && (
                <div className="mt-4 p-3 bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 rounded-lg animate-in fade-in slide-in-from-top-1 duration-300">
                    <p className="text-red-700 dark:text-red-300 text-sm text-center">{error}</p>
                </div>
            )}
        </div>
    );
}

export default SearchBar;