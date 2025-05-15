import { createContext, useState, useContext, useEffect } from "react";

const MoviesSeriesContext = createContext();

export const useMoviesSeriesContext = () => useContext(MoviesSeriesContext);

export const MoviesSeriesProvider = ({children}) => {
    const [favorites, setFavorites] = useState(() => {
    // This function runs only on initial mount
    const storedFavs = localStorage.getItem("favorites");
    return storedFavs ? JSON.parse(storedFavs) : [];
    });

    const [seriesMovies, setSeriesMovies] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        console.log("Saving favorites:", favorites);
        localStorage.setItem('favorites', JSON.stringify(favorites));
    }, [favorites]);

    // useEffect(() => {
    //     const storedFavs = localStorage.getItem("favorites");
    //     console.log("Retrieved favorites:", storedFavs);
    //     if (storedFavs) {
    //         setFavorites(JSON.parse(storedFavs));
    //     }
    // }, [])

    const addToFavorites = (item) => {
        setFavorites(prev => {
            // Check if item already exists
            if (prev.some(fav => fav.id === item.id)) {
                return prev; // Item already exists, don't add duplicate
            }
            return [...prev, item]; // Add new item
        });
    }

    const removeFromFavorites = (itemId) => {
        setFavorites(prev => prev.filter(item => item.id !== itemId));
    }

    const isFavorite = (itemId) => {
        return favorites.some(item => item.id === itemId);
    }

    const value = {
        favorites,
        addToFavorites,
        removeFromFavorites,
        isFavorite,
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