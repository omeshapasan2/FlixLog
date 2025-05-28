import { createContext, useState, useContext, useEffect } from "react";
import { auth, db } from "../api/firebase"; 
import { onAuthStateChanged } from "firebase/auth";
import { doc, setDoc, getDoc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";

const MoviesSeriesContext = createContext();

export const useMoviesSeriesContext = () => {
    const context = useContext(MoviesSeriesContext);
    if (!context) {
        throw new Error('useMoviesSeriesContext must be used within a MoviesSeriesProvider');
    }
    return context;
};

export const MoviesSeriesProvider = ({ children }) => {
    // Core movie/series data
    const [seriesMovies, setSeriesMovies] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [user, setUser] = useState(null);

    // User lists
    const [favorites, setFavorites] = useState([]);
    const [watchlist, setWatchList] = useState([]);
    const [finishedList, setFinishedList] = useState([]);
    const [onHoldList, setOnHoldList] = useState([]);
    const [droppedList, setDroppedList] = useState([]);

    // User preferences
    const [sortPreference, setSortPreference] = useState('dateAdded');

    // Filter states
    const [filters, setFilters] = useState({
        yearStart: "1900",
        yearEnd: "2025",
        rating: 5.0,
        genres: [],
        specialFilter: 'none',
    });
    const [movieFilters, setMovieFilters] = useState({
        actors: [],
        certification: "",
    });
    const [tvFilters, setTvFilters] = useState({
        networks: [],
        status: "",
    });
    const [contentType, setContentType] = useState('movie');

    // Helper function to create Firestore document reference
    const getDocRef = (collection, userId) => doc(db, collection, userId);

    // Helper function to initialize empty collection if it doesn't exist
    const initializeCollection = async (collection, userId) => {
        const docRef = getDocRef(collection, userId);
        const snapshot = await getDoc(docRef);
        
        if (!snapshot.exists()) {
            await setDoc(docRef, { movies: [] });
            return [];
        }
        
        return snapshot.data().movies || [];
    };

    // Helper function to update Firestore collection
    const updateFirestoreCollection = async (collection, userId, operation, item) => {
        const docRef = getDocRef(collection, userId);
        
        try {
            if (operation === 'add') {
                await updateDoc(docRef, {
                    movies: arrayUnion(item)
                });
            } else if (operation === 'remove') {
                await updateDoc(docRef, {
                    movies: arrayRemove(item)
                });
            }
        } catch (error) {
            console.error(`Error updating ${collection}:`, error);
            throw error;
        }
    };

    // Auth state listener and Firestore sync
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            setUser(currentUser);
            setLoading(true);
            
            if (currentUser) {
                try {
                    // Initialize all collections in parallel
                    const [
                        favoritesData,
                        watchlistData,
                        finishedData,
                        onHoldData,
                        droppedData
                    ] = await Promise.all([
                        initializeCollection("favorites", currentUser.uid),
                        initializeCollection("watchlist", currentUser.uid),
                        initializeCollection("finished", currentUser.uid),
                        initializeCollection("onhold", currentUser.uid),
                        initializeCollection("dropped", currentUser.uid)
                    ]);

                    // Set all state at once
                    setFavorites(favoritesData);
                    setWatchList(watchlistData);
                    setFinishedList(finishedData);
                    setOnHoldList(onHoldData);
                    setDroppedList(droppedData);

                    // Get user preferences
                    const prefsRef = getDocRef("preferences", currentUser.uid);
                    const prefsSnapshot = await getDoc(prefsRef);
                    
                    if (prefsSnapshot.exists()) {
                        setSortPreference(prefsSnapshot.data().sortPreference || 'dateAdded');
                    } else {
                        setSortPreference('dateAdded');
                        await setDoc(prefsRef, { sortPreference: 'dateAdded' });
                    }
                    
                } catch (error) {
                    console.error("Error fetching user data:", error);
                    setError("Failed to load user data");
                } finally {
                    setLoading(false);
                }
            } else {
                // User is logged out, clear all data
                setFavorites([]);
                setWatchList([]);
                setFinishedList([]);
                setOnHoldList([]);
                setDroppedList([]);
                setSortPreference('dateAdded');
                setLoading(false);
            }
        });

        return () => unsubscribe();
    }, []);

    // Update sort preference in Firestore when it changes
    useEffect(() => {
        const updateSortPreference = async () => {
            if (user && sortPreference) {
                try {
                    const prefsRef = getDocRef("preferences", user.uid);
                    await updateDoc(prefsRef, {
                        sortPreference: sortPreference
                    });
                } catch (error) {
                    console.error("Error updating sort preference:", error);
                    setError("Failed to update sort preference");
                }
            }
        };

        updateSortPreference();
    }, [sortPreference, user]);

    // FAVORITES FUNCTIONS
    const addToFavorites = async (item) => {
        if (!user) {
            setError("Please log in to add favorites");
            return;
        }

        if (favorites.some(fav => fav.id === item.id)) {
            return; // Item already exists
        }

        try {
            // Update local state first for immediate UI feedback
            setFavorites(prev => [...prev, item]);
            
            // Update Firestore
            await updateFirestoreCollection("favorites", user.uid, 'add', item);
            
        } catch (error) {
            // Revert local state on error
            setFavorites(prev => prev.filter(fav => fav.id !== item.id));
            setError("Failed to add to favorites");
        }
    };

    const removeFromFavorites = async (itemId) => {
        if (!user) {
            setError("Please log in to remove favorites");
            return;
        }

        const movieToRemove = favorites.find(m => m.id === itemId);
        if (!movieToRemove) return;

        try {
            // Update local state first
            setFavorites(prev => prev.filter(item => item.id !== itemId));
            
            // Update Firestore
            await updateFirestoreCollection("favorites", user.uid, 'remove', movieToRemove);
            
        } catch (error) {
            // Revert local state on error
            setFavorites(prev => [...prev, movieToRemove]);
            setError("Failed to remove from favorites");
        }
    };

    const isFavorite = (itemId) => {
        return favorites.some(item => item.id === itemId);
    };

    // WATCHLIST FUNCTIONS
    const addToWatchList = async (item) => {
        if (!user) {
            setError("Please log in to add to watchlist");
            return;
        }

        if (watchlist.some(wl => wl.id === item.id)) return;

        const itemWithDate = { ...item, dateAdded: new Date().toISOString() };

        try {
            setWatchList(prev => [...prev, itemWithDate]);
            await updateFirestoreCollection("watchlist", user.uid, 'add', itemWithDate);
        } catch (error) {
            setWatchList(prev => prev.filter(wl => wl.id !== item.id));
            setError("Failed to add to watchlist");
        }
    };

    const removeFromWatchList = async (itemId) => {
        if (!user) return;

        const movieToRemove = watchlist.find(m => m.id === itemId);
        if (!movieToRemove) return;

        try {
            setWatchList(prev => prev.filter(item => item.id !== itemId));
            await updateFirestoreCollection("watchlist", user.uid, 'remove', movieToRemove);
        } catch (error) {
            setWatchList(prev => [...prev, movieToRemove]);
            setError("Failed to remove from watchlist");
        }
    };

    const isWatchList = (itemId) => {
        return watchlist.some(item => item.id === itemId);
    };

    // FINISHED LIST FUNCTIONS
    const addToFinished = async (item) => {
        if (!user) return;

        if (finishedList.some(f => f.id === item.id)) return;

        const itemWithDate = { ...item, dateAdded: new Date().toISOString() };

        try {
            setFinishedList(prev => [...prev, itemWithDate]);
            await updateFirestoreCollection("finished", user.uid, 'add', itemWithDate);
        } catch (error) {
            setFinishedList(prev => prev.filter(f => f.id !== item.id));
            setError("Failed to add to finished list");
        }
    };

    const removeFromFinished = async (itemId) => {
        if (!user) return;

        const movieToRemove = finishedList.find(m => m.id === itemId);
        if (!movieToRemove) return;

        try {
            setFinishedList(prev => prev.filter(item => item.id !== itemId));
            await updateFirestoreCollection("finished", user.uid, 'remove', movieToRemove);
        } catch (error) {
            setFinishedList(prev => [...prev, movieToRemove]);
            setError("Failed to remove from finished list");
        }
    };

    // ON-HOLD LIST FUNCTIONS
    const addToOnHold = async (item) => {
        if (!user) return;

        if (onHoldList.some(oh => oh.id === item.id)) return;

        const itemWithDate = { ...item, dateAdded: new Date().toISOString() };

        try {
            setOnHoldList(prev => [...prev, itemWithDate]);
            await updateFirestoreCollection("onhold", user.uid, 'add', itemWithDate);
        } catch (error) {
            setOnHoldList(prev => prev.filter(oh => oh.id !== item.id));
            setError("Failed to add to on-hold list");
        }
    };

    const removeFromOnHold = async (itemId) => {
        if (!user) return;

        const movieToRemove = onHoldList.find(m => m.id === itemId);
        if (!movieToRemove) return;

        try {
            setOnHoldList(prev => prev.filter(item => item.id !== itemId));
            await updateFirestoreCollection("onhold", user.uid, 'remove', movieToRemove);
        } catch (error) {
            setOnHoldList(prev => [...prev, movieToRemove]);
            setError("Failed to remove from on-hold list");
        }
    };

    // DROPPED LIST FUNCTIONS
    const addToDropped = async (item) => {
        if (!user) return;

        if (droppedList.some(d => d.id === item.id)) return;

        const itemWithDate = { ...item, dateAdded: new Date().toISOString() };

        try {
            setDroppedList(prev => [...prev, itemWithDate]);
            await updateFirestoreCollection("dropped", user.uid, 'add', itemWithDate);
        } catch (error) {
            setDroppedList(prev => prev.filter(d => d.id !== item.id));
            setError("Failed to add to dropped list");
        }
    };

    const removeFromDropped = async (itemId) => {
        if (!user) return;

        const movieToRemove = droppedList.find(m => m.id === itemId);
        if (!movieToRemove) return;

        try {
            setDroppedList(prev => prev.filter(item => item.id !== itemId));
            await updateFirestoreCollection("dropped", user.uid, 'remove', movieToRemove);
        } catch (error) {
            setDroppedList(prev => [...prev, movieToRemove]);
            setError("Failed to remove from dropped list");
        }
    };

    // MOVE FUNCTIONS FOR STATUS CHANGES
    const moveToWatchlist = (item) => addToWatchList(item);
    const moveToFinished = (item) => addToFinished(item);
    const moveToOnHold = (item) => addToOnHold(item);
    const moveToDropped = (item) => addToDropped(item);

    // UTILITY FUNCTIONS
    const clearError = () => setError(null);

    const getItemStatus = (itemId) => {
        if (watchlist.some(item => item.id === itemId)) return 'watchlist';
        if (finishedList.some(item => item.id === itemId)) return 'finished';
        if (onHoldList.some(item => item.id === itemId)) return 'onhold';
        if (droppedList.some(item => item.id === itemId)) return 'dropped';
        return null;
    };

    const getTotalItems = () => {
        return watchlist.length + finishedList.length + onHoldList.length + droppedList.length;
    };

    // CONTEXT VALUE
    const value = {
        // Core data
        seriesMovies,
        setSeriesMovies,
        loading,
        setLoading,
        error,
        setError,
        clearError,
        user,

        // Lists
        favorites,
        watchlist,
        finishedList,
        onHoldList,
        droppedList,

        // Favorites functions
        addToFavorites,
        removeFromFavorites,
        isFavorite,

        // Watchlist functions
        addToWatchList,
        removeFromWatchList,
        isWatchList,

        // List management functions
        addToFinished,
        removeFromFinished,
        addToOnHold,
        removeFromOnHold,
        addToDropped,
        removeFromDropped,

        // Move functions
        moveToWatchlist,
        moveToFinished,
        moveToOnHold,
        moveToDropped,

        // Utility functions
        getItemStatus,
        getTotalItems,

        // Preferences
        sortPreference,
        setSortPreference,

        // Filters
        filters,
        setFilters,
        movieFilters,
        setMovieFilters,
        tvFilters,
        setTvFilters,
        contentType,
        setContentType,
    };

    return (
        <MoviesSeriesContext.Provider value={value}>
            {children}
        </MoviesSeriesContext.Provider>
    );
};