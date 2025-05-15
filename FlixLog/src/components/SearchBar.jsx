import React, { useState } from 'react'
import { searchAll } from '../api/api';
import { useMoviesSeriesContext } from '../context/MoviesSeriesContext';

function SearchBar() {
    const [searchQuery, setSearchQuery] = useState('');
    const { loading, setLoading, seriesMovies, setSeriesMovies, error, setError } = useMoviesSeriesContext();

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
        <div>
            <form
                onSubmit={handleSearch}
                className="max-w-[600px] mx-auto mb-8 sm:mb-4 flex gap-4 px-4 box-border"
            >
                <input
                    type="text"
                    placeholder="Search for movies..."
                    className="flex-1 px-4 py-3 rounded bg-gray-200 text-black text-base 
                               focus:outline-none focus:ring-2 focus:ring-gray-400
                               dark:bg-gray-800 dark:text-white dark:focus:ring-gray-500"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button
                    type="submit"
                    className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded font-medium 
                               whitespace-nowrap transition-colors duration-200
                               dark:bg-red-600 dark:hover:bg-red-500"
                >
                    Search
                </button>
            </form>
        </div>
    );
}

export default SearchBar
