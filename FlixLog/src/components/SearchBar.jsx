import React, { useState, useEffect } from 'react'
import { searchAll } from '../api/api';
import { useMoviesSeriesContext } from '../context/MoviesSeriesContext';
import {  Link, useNavigate } from 'react-router-dom';

function SearchBar() {
    const [searchQuery, setSearchQuery] = useState('');
    const { loading, setLoading, seriesMovies, setSeriesMovies, error, setError } = useMoviesSeriesContext();
    const [recommendations, setRecommendations] = useState([]);
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
            {loading && <p className="text-center text-gray-500">Loading...</p>}
            {recommendations.length > 0 && (
                <ul className="absolute bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded mt-1 max-w-[600px] mx-auto left-0 right-0 z-50">
                    {recommendations.map((item) => (
                        <li key={item.id} className="flex p-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                            <Link to={`/details/${item.id}/${item.media_type}`}>
                                <img src={
                                    item.poster_path 
                                        ? `https://image.tmdb.org/t/p/w500${item.poster_path}` 
                                        : 'https://via.placeholder.com/150'
                                }
                                    className='w-16 h-24 object-cover rounded mr-2 inline-block'
                                />
                                <span className='text-black dark:text-white font-medium font-'>
                                    {item.title || item.name}
                                    <hr/>
                                </span>
                            </Link>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default SearchBar
