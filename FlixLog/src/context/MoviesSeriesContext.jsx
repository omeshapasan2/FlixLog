import { createContext, useState, useContext, useEffect } from "react";

const MoviesSeriesContext = createContext();

export const useMoviesSeriesContext = () => useContext(MoviesSeriesContext);

export const MoviesSeriesProvider = ({children}) => {
    const [seriesMovies, setSeriesMovies] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // State to manage favorites
    // Initialize favorites from localStorage or set to empty array
    const [favorites, setFavorites] = useState(() => {
        const storedFavs = localStorage.getItem("favorites");
        return storedFavs ? JSON.parse(storedFavs) : [];
    });

    // State to manage WatchList --
    // Initialize watchlist from localStorage or set to empty array
    const [watchlist, setWatchList] = useState(() => {
        const storedWatchList = localStorage.getItem("watchlist");
        return storedWatchList ? JSON.parse(storedWatchList) : [];
    });

    // Effect to save favorites to localStorage whenever it changes
    useEffect(() => {
        console.log("Saving favorites:", favorites);
        localStorage.setItem('favorites', JSON.stringify(favorites));
    }, [favorites]);

    // Effect to save watchlist to localStorage whenever it changes --
    useEffect(() => {
        console.log("Saving watchlist:", watchlist);
        localStorage.setItem('watchlist', JSON.stringify(watchlist));
    }, [watchlist]);

    // Function to Add to favorites
    const addToFavorites = (item) => {
        setFavorites(prev => {
            // Check if item already exists
            if (prev.some(fav => fav.id === item.id)) {
                return prev; // Item already exists, don't add duplicate
            }
            return [...prev, item]; // Add new item
        });
    }

    // Function to remove from favorites
    const removeFromFavorites = (itemId) => {
        setFavorites(prev => prev.filter(item => item.id !== itemId));
    }

    // Function to check if item is in favorites
    const isFavorite = (itemId) => {
        return favorites.some(item => item.id === itemId);
    }

    // ---------------------------------------------------------------

    // Function to add to watchlist --
    const addToWatchList = (item) => {
        setWatchList(prev => {
            // Check if item already exists
            if (prev.some(wl => wl.id === item.id)) {
                return prev; // Item already exists, don't add duplicate
            }
            return [...prev, item]; // Add new item
        });
    }

    // Function to remove from watchlist --
    const removeFromWatchList = (itemId) => {
        setWatchList(prev => prev.filter(item => item.id !== itemId));
    }

    // Function to check if item is in watchlist --
    const isWatchList = (itemId) => {
        return watchlist.some(item => item.id === itemId);
    }

    const value = {
        favorites,
        addToFavorites,
        removeFromFavorites,
        isFavorite,
        watchlist,
        addToWatchList,
        removeFromWatchList,
        isWatchList,
        seriesMovies,
        setSeriesMovies,
        loading, 
        setLoading,
        error,
        setError
    }

    return (
        <MoviesSeriesContext.Provider value={value}>
            {children}
        </MoviesSeriesContext.Provider>
    )
}