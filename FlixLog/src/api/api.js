import { useState } from "react";

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

export const getOngoingSeries = async (id) => {
    const ongoingURL = `${TMDB_BASE_URL}/tv/${id}?api_key=${TMDB_API_KEY}`;

    try {
        const response = await fetch(ongoingURL);
        const json = await response.json();

        if (json.status !== "Returning Series" || !json.next_episode_to_air) {
        return null; // Skip not ongoing shows
        }

        return {
        id: json.id,
        name: json.name,
        season: json.next_episode_to_air?.season_number || null,
        episode: json.next_episode_to_air?.episode_number || null,
        airdate: json.next_episode_to_air?.air_date || null,
        image: json.poster_path 
                ? `https://image.tmdb.org/t/p/w500${json.poster_path}` 
                : null,
            backdrop: json.backdrop_path 
                ? `https://image.tmdb.org/t/p/w780${json.backdrop_path}` 
                : null
        };
    } catch (error) {
        console.error("Error fetching ongoing series:", error);
        return null;
    }
}

// Get movie or TV show details
export const getDetails = async (id, mediaType) => {
    const endpoint = mediaType === 'movie' ? 'movie' : 'tv';
    const res = await fetch(`${TMDB_BASE_URL}/${endpoint}/${id}?api_key=${TMDB_API_KEY}`);
    
    if (!res.ok) {
        throw new Error("Failed to fetch details");
    }
    
    const data = await res.json();
    return { ...data, media_type: mediaType };
};

// Get cast and crew
export const getCredits = async (id, mediaType) => {
    const endpoint = mediaType === 'movie' ? 'movie' : 'tv';
    const res = await fetch(`${TMDB_BASE_URL}/${endpoint}/${id}/credits?api_key=${TMDB_API_KEY}`);
    
    if (!res.ok) {
        throw new Error("Failed to fetch credits");
    }
    
    return await res.json();
};

// Get videos (trailers, etc.)
export const getVideos = async (id, mediaType) => {
    const endpoint = mediaType === 'movie' ? 'movie' : 'tv';
    const res = await fetch(`${TMDB_BASE_URL}/${endpoint}/${id}/videos?api_key=${TMDB_API_KEY}`);
    
    if (!res.ok) {
        throw new Error("Failed to fetch videos");
    }
    
    return await res.json();
};

// Get recommendations
export const getRecommendations = async (id, mediaType) => {
    const endpoint = mediaType === 'movie' ? 'movie' : 'tv';
    const res = await fetch(`${TMDB_BASE_URL}/${endpoint}/${id}/recommendations?api_key=${TMDB_API_KEY}`);
    
    if (!res.ok) {
        throw new Error("Failed to fetch recommendations");
    }
    
    const data = await res.json();
    // Add media_type to each recommendation
    const resultsWithMediaType = data.results.map(item => ({
        ...item,
        media_type: mediaType
    }));
    
    return { ...data, results: resultsWithMediaType };
};

// Get TV series seasons and episodes
export const getSeasonDetails = async (id, seasonNumber) => {
    const res = await fetch(`${TMDB_BASE_URL}/tv/${id}/season/${seasonNumber}?api_key=${TMDB_API_KEY}`);
    
    if (!res.ok) {
        throw new Error("Failed to fetch season details");
    }
    
    return await res.json();
};

// Get all seasons for a TV series (basic info)
export const getAllSeasons = async (id) => {
    const res = await fetch(`${TMDB_BASE_URL}/tv/${id}?api_key=${TMDB_API_KEY}`);
    
    if (!res.ok) {
        throw new Error("Failed to fetch series details");
    }
    
    const data = await res.json();
    return data.seasons || [];
};

// Get images (backdrops, posters)
export const getImages = async (id, mediaType) => {
    const endpoint = mediaType === 'movie' ? 'movie' : 'tv';
    const res = await fetch(`${TMDB_BASE_URL}/${endpoint}/${id}/images?api_key=${TMDB_API_KEY}`);
    
    if (!res.ok) {
        throw new Error("Failed to fetch images");
    }
    
    return await res.json();
};

// Discover movies or TV shows based on filters
export const discoverMedia = async (mediaType, params = {}) => {
  const endpoint = mediaType === 'movie' ? 'movie' : 'tv';
  const queryString = new URLSearchParams({
    api_key: TMDB_API_KEY,
    ...params,
  }).toString();
  const res = await fetch(`${TMDB_BASE_URL}/discover/${endpoint}?${queryString}`);

  if (!res.ok) {
    throw new Error(`Failed to fetch ${mediaType} results`);
  }

  const data = await res.json();
  return data.results.map(item => ({ ...item, media_type: mediaType }));
};