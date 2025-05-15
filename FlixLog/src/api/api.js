const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const TMDB_BASE_URL = "https://api.themoviedb.org/3";

export const getTrendingAll = async () => {
    // call to load both movies and TV series from the TMDB API
    const [movieRes, tvRes] = await Promise.all([
        fetch(`${TMDB_BASE_URL}/movie/popular?api_key=${TMDB_API_KEY}`),
        fetch(`${TMDB_BASE_URL}/tv/popular?api_key=${TMDB_API_KEY}`)
    ]);

    // Convert raw API responses into JS objects
    const movies = await movieRes.json();
    const tvShows = await tvRes.json();

    // Add media_type to each item
    //  Each movie gets: media_type: 'movie'
    //  Each TV show gets: media_type: 'tv'
    const movieData = movies.results.map(item => ({...item, media_type: 'movie' }));
    const tvData = tvShows.results.map(item => ({ ...item, media_type: 'tv'}));

    //Combine both into one array
    const combined = [...movieData, tvData];

    // return combined array
    return[...movieData, ...tvData];
};

export const searchAll = async (query) => {
    const res = await fetch(
        `${TMDB_BASE_URL}/search/multi?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}`
    );

    if (!res.ok) {
        throw new Error("Failed to fetch search results");
    }

    const data = await res.json();

    // Filter only 'movie' and 'tv' types (exclude 'person', etc.)
    const filteredResults = data.results.filter(
        item => item.media_type === 'movie' || item.media_type === 'tv'
    );

    return filteredResults;
};