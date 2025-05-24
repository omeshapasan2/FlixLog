import { createContext, useState, useContext, useEffect } from "react";
import { auth, db } from "../api/firebase"; 
import { onAuthStateChanged } from "firebase/auth";
import { doc, setDoc, getDoc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";

const MoviesSeriesContext = createContext();

export const useMoviesSeriesContext = () => useContext(MoviesSeriesContext);

export const MoviesSeriesProvider = ({children}) => {
    const [seriesMovies, setSeriesMovies] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [user, setUser] = useState(null);

    // State to manage favorites
    const [favorites, setFavorites] = useState([]);

    // State to manage WatchList
    const [watchlist, setWatchList] = useState([]);

    // Auth state listener and Firestore sync
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            setUser(user);
            if (user) {
                try {
                    // Get favorites from Firestore
                    const favRef = doc(db, "favorites", user.uid);
                    const favSnapshot = await getDoc(favRef);
                    if (favSnapshot.exists()) {
                        setFavorites(favSnapshot.data().movies || []);
                    } else {
                        setFavorites([]);
                        await setDoc(favRef, { movies: [] });
                    }

                    // Get watchlist from Firestore
                    const watchRef = doc(db, "watchlist", user.uid);
                    const watchSnapshot = await getDoc(watchRef);
                    if (watchSnapshot.exists()) {
                        setWatchList(watchSnapshot.data().movies || []);
                    } else {
                        setWatchList([]);
                        await setDoc(watchRef, { movies: [] });
                    }
                } catch (error) {
                    console.error("Error fetching user data:", error);
                    setError("Failed to load user data");
                }
            } else {
                // User is logged out, clear data
                setFavorites([]);
                setWatchList([]);
            }
        });

        return () => unsubscribe();
    }, []);

    // Function to Add to favorites
    const addToFavorites = async (item) => {
        if (!user) {
            console.log("User not authenticated");
            return;
        }

        try {
            // Check if item already exists locally
            if (favorites.some(fav => fav.id === item.id)) {
                return; // Item already exists, don't add duplicate
            }

            const favRef = doc(db, "favorites", user.uid);
            
            // Update local state first for immediate UI feedback
            setFavorites(prev => [...prev, item]);

            // Update Firestore
            await updateDoc(favRef, {
                movies: arrayUnion(item)
            });

            console.log("Added to favorites:", item);
        } catch (error) {
            console.error("Error adding to favorites:", error);
            setError("Failed to add to favorites");
            // Revert local state on error
            setFavorites(prev => prev.filter(fav => fav.id !== item.id));
        }
    }

    // Function to remove from favorites
    const removeFromFavorites = async (itemId) => {
        if (!user) {
            console.log("User not authenticated");
            return;
        }

        try {
            const movieToRemove = favorites.find(m => m.id === itemId);
            if (!movieToRemove) return;

            const favRef = doc(db, "favorites", user.uid);
            
            // Update local state first for immediate UI feedback
            setFavorites(prev => prev.filter(item => item.id !== itemId));

            // Update Firestore
            await updateDoc(favRef, {
                movies: arrayRemove(movieToRemove)
            });

            console.log("Removed from favorites:", itemId);
        } catch (error) {
            console.error("Error removing from favorites:", error);
            setError("Failed to remove from favorites");
            // Revert local state on error
            setFavorites(prev => [...prev, movieToRemove]);
        }
    }

    // Function to check if item is in favorites
    const isFavorite = (itemId) => {
        return favorites.some(item => item.id === itemId);
    }

    // Function to add to watchlist
    const addToWatchList = async (item) => {
        if (!user) {
            console.log("User not authenticated");
            return;
        }

        try {
            // Check if item already exists locally
            if (watchlist.some(wl => wl.id === item.id)) {
                return; // Item already exists, don't add duplicate
            }

            const watchRef = doc(db, "watchlist", user.uid);
            
            // Update local state first for immediate UI feedback
            setWatchList(prev => [...prev, item]);

            // Update Firestore
            await updateDoc(watchRef, {
                movies: arrayUnion(item)
            });

            console.log("Added to watchlist:", item);
        } catch (error) {
            console.error("Error adding to watchlist:", error);
            setError("Failed to add to watchlist");
            // Revert local state on error
            setWatchList(prev => prev.filter(wl => wl.id !== item.id));
        }
    }

    // Function to remove from watchlist
    const removeFromWatchList = async (itemId) => {
        if (!user) {
            console.log("User not authenticated");
            return;
        }

        try {
            const movieToRemove = watchlist.find(m => m.id === itemId);
            if (!movieToRemove) return;

            const watchRef = doc(db, "watchlist", user.uid);
            
            // Update local state first for immediate UI feedback
            setWatchList(prev => prev.filter(item => item.id !== itemId));

            // Update Firestore
            await updateDoc(watchRef, {
                movies: arrayRemove(movieToRemove)
            });

            console.log("Removed from watchlist:", itemId);
        } catch (error) {
            console.error("Error removing from watchlist:", error);
            setError("Failed to remove from watchlist");
            // Revert local state on error
            setWatchList(prev => [...prev, movieToRemove]);
        }
    }

    // Function to check if item is in watchlist
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
        setError,
        user
    }

    return (
        <MoviesSeriesContext.Provider value={value}>
            {children}
        </MoviesSeriesContext.Provider>
    )
}