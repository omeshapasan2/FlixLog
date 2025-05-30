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

    // Default lists (keeping existing ones)
    const [favorites, setFavorites] = useState([]);
    const [watchlist, setWatchList] = useState([]);
    const [finishedList, setFinishedList] = useState([]);
    const [onHoldList, setOnHoldList] = useState([]);
    const [droppedList, setDroppedList] = useState([]);

    // New default lists
    const [planToWatchList, setPlanToWatchList] = useState([]);
    const [ongoingList, setOngoingList] = useState([]);
    const [upcomingList, setUpcomingList] = useState([]);

    // Custom categories
    const [customCategories, setCustomCategories] = useState([]);
    const [categoryLists, setCategoryLists] = useState({});

    // User preferences
    const [sortPreference, setSortPreference] = useState('dateAdded');

    // Filter states
    const [filters, setFilters] = useState({
        yearStart: "2020",
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

    // Default categories configuration
    const defaultCategories = [
        { id: 'watchlist', label: 'Watchlist', color: '#3b82f6' },
        { id: 'plantowatch', label: 'Plan to Watch', color: '#8b5cf6' },
        { id: 'ongoing', label: 'Ongoing', color: '#10b981' },
        { id: 'upcoming', label: 'Upcoming', color: '#f59e0b' },
        { id: 'finished', label: 'Finished', color: '#06b6d4' },
        { id: 'onhold', label: 'On Hold', color: '#f97316' },
        { id: 'dropped', label: 'Dropped', color: '#ef4444' }
    ];

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

    // Initialize custom categories in Firestore
    const initializeCustomCategories = async (userId) => {
        const docRef = getDocRef("customCategories", userId);
        const snapshot = await getDoc(docRef);
        
        if (!snapshot.exists()) {
            await setDoc(docRef, { categories: [] });
            return [];
        }
        
        return snapshot.data().categories || [];
    };

    // Auth state listener and Firestore sync
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            setUser(currentUser);
            setLoading(true);
            
            if (currentUser) {
                try {
                    // Initialize all default collections in parallel
                    const [
                        favoritesData,
                        watchlistData,
                        finishedData,
                        onHoldData,
                        droppedData,
                        planToWatchData,
                        ongoingData,
                        upcomingData,
                        customCategoriesData
                    ] = await Promise.all([
                        initializeCollection("favorites", currentUser.uid),
                        initializeCollection("watchlist", currentUser.uid),
                        initializeCollection("finished", currentUser.uid),
                        initializeCollection("onhold", currentUser.uid),
                        initializeCollection("dropped", currentUser.uid),
                        initializeCollection("plantowatch", currentUser.uid),
                        initializeCollection("ongoing", currentUser.uid),
                        initializeCollection("upcoming", currentUser.uid),
                        initializeCustomCategories(currentUser.uid)
                    ]);

                    // Set all default state
                    setFavorites(favoritesData);
                    setWatchList(watchlistData);
                    setFinishedList(finishedData);
                    setOnHoldList(onHoldData);
                    setDroppedList(droppedData);
                    setPlanToWatchList(planToWatchData);
                    setOngoingList(ongoingData);
                    setUpcomingList(upcomingData);
                    setCustomCategories(customCategoriesData);

                    // Load custom category lists
                    const customListsData = {};
                    for (const category of customCategoriesData) {
                        const listData = await initializeCollection(`custom_${category.id}`, currentUser.uid);
                        customListsData[category.id] = listData;
                    }
                    setCategoryLists(customListsData);

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
                setPlanToWatchList([]);
                setOngoingList([]);
                setUpcomingList([]);
                setCustomCategories([]);
                setCategoryLists({});
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

    // CUSTOM CATEGORY FUNCTIONS
    const createCustomCategory = async (categoryName, color = '#6b7280') => {
        if (!user) {
            setError("Please log in to create categories");
            return;
        }

        if (!categoryName.trim()) {
            setError("Category name cannot be empty");
            return;
        }

        // Check if category already exists
        if (customCategories.some(cat => cat.name.toLowerCase() === categoryName.toLowerCase())) {
            setError("Category with this name already exists");
            return;
        }

        const newCategory = {
            id: `custom_${Date.now()}_${categoryName.replace(/\s+/g, '_').toLowerCase()}`,
            name: categoryName.trim(), // Changed from 'label' to 'name' to match ListCard
            label: categoryName.trim(), // Keep both for backward compatibility
            color: color,
            createdAt: new Date().toISOString()
        };

        try {
            // Update local state first
            setCustomCategories(prev => [...prev, newCategory]);
            setCategoryLists(prev => ({ ...prev, [newCategory.id]: [] }));

            // Update Firestore
            const docRef = getDocRef("customCategories", user.uid);
            await updateDoc(docRef, {
                categories: arrayUnion(newCategory)
            });

            // Initialize the collection for this category
            await initializeCollection(`custom_${newCategory.id}`, user.uid);

            return newCategory;
        } catch (error) {
            // Revert local state on error
            setCustomCategories(prev => prev.filter(cat => cat.id !== newCategory.id));
            setCategoryLists(prev => {
                const updated = { ...prev };
                delete updated[newCategory.id];
                return updated;
            });
            setError("Failed to create custom category");
            throw error;
        }
    };

    const deleteCustomCategory = async (categoryId) => {
        if (!user) return;

        const categoryToDelete = customCategories.find(cat => cat.id === categoryId);
        if (!categoryToDelete) return;

        try {
            // Update local state first
            setCustomCategories(prev => prev.filter(cat => cat.id !== categoryId));
            setCategoryLists(prev => {
                const updated = { ...prev };
                delete updated[categoryId];
                return updated;
            });

            // Update Firestore
            const docRef = getDocRef("customCategories", user.uid);
            await updateDoc(docRef, {
                categories: arrayRemove(categoryToDelete)
            });

            // Note: We don't delete the collection data in case user wants to restore
            
        } catch (error) {
            // Revert local state on error
            setCustomCategories(prev => [...prev, categoryToDelete]);
            setCategoryLists(prev => ({ ...prev, [categoryId]: [] }));
            setError("Failed to delete custom category");
        }
    };

    const addToCustomCategory = async (categoryId, item) => {
        if (!user) return;

        const currentList = categoryLists[categoryId] || [];
        if (currentList.some(listItem => listItem.id === item.id)) return;

        const itemWithDate = { ...item, dateAdded: new Date().toISOString() };

        try {
            // Update local state
            setCategoryLists(prev => ({
                ...prev,
                [categoryId]: [...(prev[categoryId] || []), itemWithDate]
            }));

            // Update Firestore
            await updateFirestoreCollection(`custom_${categoryId}`, user.uid, 'add', itemWithDate);
        } catch (error) {
            // Revert local state on error
            setCategoryLists(prev => ({
                ...prev,
                [categoryId]: (prev[categoryId] || []).filter(listItem => listItem.id !== item.id)
            }));
            setError("Failed to add to custom category");
        }
    };

    const removeFromCustomCategory = async (categoryId, itemId) => {
        if (!user) return;

        const currentList = categoryLists[categoryId] || [];
        const movieToRemove = currentList.find(m => m.id === itemId);
        if (!movieToRemove) return;

        try {
            // Update local state
            setCategoryLists(prev => ({
                ...prev,
                [categoryId]: (prev[categoryId] || []).filter(item => item.id !== itemId)
            }));

            // Update Firestore
            await updateFirestoreCollection(`custom_${categoryId}`, user.uid, 'remove', movieToRemove);
        } catch (error) {
            // Revert local state on error
            setCategoryLists(prev => ({
                ...prev,
                [categoryId]: [...(prev[categoryId] || []), movieToRemove]
            }));
            setError("Failed to remove from custom category");
        }
    };

    // FAVORITES FUNCTIONS
    const addToFavorites = async (item) => {
        if (!user) {
            setError("Please log in to add favorites");
            return;
        }

        if (favorites.some(fav => fav.id === item.id)) return;

        try {
            setFavorites(prev => [...prev, item]);
            await updateFirestoreCollection("favorites", user.uid, 'add', item);
        } catch (error) {
            setFavorites(prev => prev.filter(fav => fav.id !== item.id));
            setError("Failed to add to favorites");
        }
    };

    const removeFromFavorites = async (itemId) => {
        if (!user) return;

        const movieToRemove = favorites.find(m => m.id === itemId);
        if (!movieToRemove) return;

        try {
            setFavorites(prev => prev.filter(item => item.id !== itemId));
            await updateFirestoreCollection("favorites", user.uid, 'remove', movieToRemove);
        } catch (error) {
            setFavorites(prev => [...prev, movieToRemove]);
            setError("Failed to remove from favorites");
        }
    };

    const isFavorite = (itemId) => {
        return favorites.some(item => item.id === itemId);
    };

    // WATCHLIST FUNCTIONS
    const addToWatchList = async (item) => {
        if (!user) return;
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

    // ALIAS FUNCTION FOR LISTCARD COMPATIBILITY
    const moveToWatchlist = addToWatchList;

    // PLAN TO WATCH FUNCTIONS
    const addToPlanToWatch = async (item) => {
        if (!user) return;
        if (planToWatchList.some(p => p.id === item.id)) return;

        const itemWithDate = { ...item, dateAdded: new Date().toISOString() };

        try {
            setPlanToWatchList(prev => [...prev, itemWithDate]);
            await updateFirestoreCollection("plantowatch", user.uid, 'add', itemWithDate);
        } catch (error) {
            setPlanToWatchList(prev => prev.filter(p => p.id !== item.id));
            setError("Failed to add to plan to watch");
        }
    };

    const removeFromPlanToWatch = async (itemId) => {
        if (!user) return;

        const movieToRemove = planToWatchList.find(m => m.id === itemId);
        if (!movieToRemove) return;

        try {
            setPlanToWatchList(prev => prev.filter(item => item.id !== itemId));
            await updateFirestoreCollection("plantowatch", user.uid, 'remove', movieToRemove);
        } catch (error) {
            setPlanToWatchList(prev => [...prev, movieToRemove]);
            setError("Failed to remove from plan to watch");
        }
    };

    // ALIAS FUNCTION FOR LISTCARD COMPATIBILITY
    const moveToPlanToWatch = addToPlanToWatch;

    // ONGOING FUNCTIONS
    const addToOngoing = async (item) => {
        if (!user) return;
        if (ongoingList.some(o => o.id === item.id)) return;

        const itemWithDate = { ...item, dateAdded: new Date().toISOString() };

        try {
            setOngoingList(prev => [...prev, itemWithDate]);
            await updateFirestoreCollection("ongoing", user.uid, 'add', itemWithDate);
        } catch (error) {
            setOngoingList(prev => prev.filter(o => o.id !== item.id));
            setError("Failed to add to ongoing");
        }
    };

    const removeFromOngoing = async (itemId) => {
        if (!user) return;

        const movieToRemove = ongoingList.find(m => m.id === itemId);
        if (!movieToRemove) return;

        try {
            setOngoingList(prev => prev.filter(item => item.id !== itemId));
            await updateFirestoreCollection("ongoing", user.uid, 'remove', movieToRemove);
        } catch (error) {
            setOngoingList(prev => [...prev, movieToRemove]);
            setError("Failed to remove from ongoing");
        }
    };

    // ALIAS FUNCTION FOR LISTCARD COMPATIBILITY
    const moveToOngoing = addToOngoing;

    // UPCOMING FUNCTIONS
    const addToUpcoming = async (item) => {
        if (!user) return;
        if (upcomingList.some(u => u.id === item.id)) return;

        const itemWithDate = { ...item, dateAdded: new Date().toISOString() };

        try {
            setUpcomingList(prev => [...prev, itemWithDate]);
            await updateFirestoreCollection("upcoming", user.uid, 'add', itemWithDate);
        } catch (error) {
            setUpcomingList(prev => prev.filter(u => u.id !== item.id));
            setError("Failed to add to upcoming");
        }
    };

    const removeFromUpcoming = async (itemId) => {
        if (!user) return;

        const movieToRemove = upcomingList.find(m => m.id === itemId);
        if (!movieToRemove) return;

        try {
            setUpcomingList(prev => prev.filter(item => item.id !== itemId));
            await updateFirestoreCollection("upcoming", user.uid, 'remove', movieToRemove);
        } catch (error) {
            setUpcomingList(prev => [...prev, movieToRemove]);
            setError("Failed to remove from upcoming");
        }
    };

    // ALIAS FUNCTION FOR LISTCARD COMPATIBILITY
    const moveToUpcoming = addToUpcoming;

    // FINISHED FUNCTIONS
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

    // ALIAS FUNCTION FOR LISTCARD COMPATIBILITY
    const moveToFinished = addToFinished;

    // ON HOLD FUNCTIONS
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

    // ALIAS FUNCTION FOR LISTCARD COMPATIBILITY
    const moveToOnHold = addToOnHold;

    // DROPPED FUNCTIONS
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

    // ALIAS FUNCTION FOR LISTCARD COMPATIBILITY
    const moveToDropped = addToDropped;

    // UTILITY FUNCTIONS
    const clearError = () => setError(null);

    const getItemStatus = (itemId) => {
        if (watchlist.some(item => item.id === itemId)) return 'watchlist';
        if (planToWatchList.some(item => item.id === itemId)) return 'plantowatch';
        if (ongoingList.some(item => item.id === itemId)) return 'ongoing';
        if (upcomingList.some(item => item.id === itemId)) return 'upcoming';
        if (finishedList.some(item => item.id === itemId)) return 'finished';
        if (onHoldList.some(item => item.id === itemId)) return 'onhold';
        if (droppedList.some(item => item.id === itemId)) return 'dropped';
        
        // Check custom categories
        for (const categoryId of Object.keys(categoryLists)) {
            if (categoryLists[categoryId].some(item => item.id === itemId)) {
                return categoryId;
            }
        }
        
        return null;
    };

    const getTotalItems = () => {
        const defaultCount = watchlist.length + planToWatchList.length + ongoingList.length + 
                           upcomingList.length + finishedList.length + onHoldList.length + droppedList.length;
        const customCount = Object.values(categoryLists).reduce((total, list) => total + list.length, 0);
        return defaultCount + customCount;
    };

    const getAllCategories = () => {
        return [...defaultCategories, ...customCategories];
    };

    const getCategoryData = (categoryId) => {
        switch (categoryId) {
            case 'watchlist': return watchlist;
            case 'plantowatch': return planToWatchList;
            case 'ongoing': return ongoingList;
            case 'upcoming': return upcomingList;
            case 'finished': return finishedList;
            case 'onhold': return onHoldList;
            case 'dropped': return droppedList;
            default: return categoryLists[categoryId] || [];
        }
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

        // Default lists
        favorites,
        watchlist,
        finishedList,
        onHoldList,
        droppedList,
        planToWatchList,
        ongoingList,
        upcomingList,

        // Custom categories
        customCategories,
        categoryLists,
        defaultCategories,

        // Favorites functions
        addToFavorites,
        removeFromFavorites,
        isFavorite,

        // Default list functions (add/remove)
        addToWatchList,
        removeFromWatchList,
        isWatchList,
        addToPlanToWatch,
        removeFromPlanToWatch,
        addToOngoing,
        removeFromOngoing,
        addToUpcoming,
        removeFromUpcoming,
        addToFinished,
        removeFromFinished,
        addToOnHold,
        removeFromOnHold,
        addToDropped,
        removeFromDropped,

        // Alias functions for ListCard compatibility (move functions)
        moveToWatchlist,
        moveToPlanToWatch,
        moveToOngoing,
        moveToUpcoming,
        moveToFinished,
        moveToOnHold,
        moveToDropped,

        // Custom category functions
        createCustomCategory,
        deleteCustomCategory,
        addToCustomCategory,
        removeFromCustomCategory,

        // Utility functions
        getItemStatus,
        getTotalItems,
        getAllCategories,
        getCategoryData,

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