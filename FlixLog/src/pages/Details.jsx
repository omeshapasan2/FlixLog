import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useMoviesSeriesContext } from '../context/MoviesSeriesContext';
import { getDetails, getCredits, getVideos, getRecommendations, getSeasonDetails, getImages } from '../api/api';
import Card from '../components/Card';
import { Heart, Bookmark } from "lucide-react";
import { IoIosArrowBack } from 'react-icons/io';

function Details() {
    const { id, mediaType: urlMediaType } = useParams();
    const navigate = useNavigate();
    const [details, setDetails] = useState(null);
    const [credits, setCredits] = useState(null);
    const [videos, setVideos] = useState([]);
    const [recommendations, setRecommendations] = useState([]);
    const [images, setImages] = useState(null);
    const [seasons, setSeasons] = useState([]);
    const [selectedSeason, setSelectedSeason] = useState(1);
    const [episodes, setEpisodes] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [expandedSeasons, setExpandedSeasons] = useState(new Set());

    const { addToFavorites, removeFromFavorites, isFavorite, addToWatchList, removeFromWatchList, isWatchList } = useMoviesSeriesContext();

    // Use URL media type or determine from data
    const [mediaType, setMediaType] = useState(urlMediaType || null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);

                // Use provided media type or try to determine it
                let detailsData = null;
                let currentMediaType = urlMediaType;

                if (currentMediaType) {
                    // If media type is provided in URL, use it directly
                    try {
                        detailsData = await getDetails(id, currentMediaType);
                    } catch (err) {
                        throw new Error(`${currentMediaType === 'movie' ? 'Movie' : 'TV Show'} not found`);
                    }
                } else {
                    // Fallback: try to determine media type
                    try {
                        detailsData = await getDetails(id, 'movie');
                        currentMediaType = 'movie';
                    } catch {
                        try {
                            detailsData = await getDetails(id, 'tv');
                            currentMediaType = 'tv';
                        } catch {
                            throw new Error('Content not found');
                        }
                    }
                }

                setDetails(detailsData);
                setMediaType(currentMediaType);

                // Fetch additional data
                const [creditsData, videosData, recommendationsData, imagesData] = await Promise.all([
                    getCredits(id, currentMediaType),
                    getVideos(id, currentMediaType),
                    getRecommendations(id, currentMediaType),
                    getImages(id, currentMediaType)
                ]);

                setCredits(creditsData);
                setVideos(videosData.results || []);
                setRecommendations(recommendationsData.results || []);
                setImages(imagesData);

                // If it's a TV series, fetch seasons
                if (currentMediaType === 'tv' && detailsData.seasons) {
                    setSeasons(detailsData.seasons);
                    // Fetch first season episodes by default
                    if (detailsData.seasons.length > 0) {
                        const firstSeason = detailsData.seasons.find(s => s.season_number > 0) || detailsData.seasons[0];
                        const seasonData = await getSeasonDetails(id, firstSeason.season_number);
                        setEpisodes({ [firstSeason.season_number]: seasonData.episodes || [] });
                        setSelectedSeason(firstSeason.season_number);
                    }
                }

            } catch (err) {
                console.error('Error fetching details:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        if (id && (urlMediaType || !mediaType)) {
            fetchData();
        }
    }, [id, urlMediaType]);

    const handleSeasonToggle = async (seasonNumber) => {
        const isExpanded = expandedSeasons.has(seasonNumber);
        const newExpanded = new Set(expandedSeasons);
        
        if (isExpanded) {
            newExpanded.delete(seasonNumber);
        } else {
            newExpanded.add(seasonNumber);
            // Fetch episodes for this season if not already loaded
            try {
                const seasonData = await getSeasonDetails(id, seasonNumber);
                setEpisodes(prev => ({
                    ...prev,
                    [seasonNumber]: seasonData.episodes || []
                }));
            } catch (err) {
                console.error('Error fetching season data:', err);
            }
        }
        
        setExpandedSeasons(newExpanded);
    };

    const handleFavoriteClick = () => {
        if (isFavorite(details.id)) {
            removeFromFavorites(details.id);
        } else {
            addToFavorites(details);
        }
    };

    const handleWatchListClick = () => {
        if (isWatchList(details.id)) {
            removeFromWatchList(details.id);
        } else {
            addToWatchList(details);
        }
    };

    const handleBackClick = () => {
        navigate(-1);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-white dark:bg-[#0d0d0d] flex items-center justify-center">
                <div className="text-xl text-gray-600 dark:text-gray-400">Loading...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-white dark:bg-[#0d0d0d] flex items-center justify-center px-4">
                <div className="text-xl text-red-500 text-center">Error: {error}</div>
            </div>
        );
    }

    if (!details) return null;

    const title = details.title || details.name;
    const year = (details.release_date || details.first_air_date || "").split("-")[0];
    const rating = details.vote_average ? details.vote_average.toFixed(1) : 'N/A';
    const trailer = videos.find(video => video.type === 'Trailer' && video.site === 'YouTube');

    return (
        <div className="min-h-screen bg-white dark:bg-[#0d0d0d] text-black dark:text-white">
            <div className="h-20" />
            {/* Back Button - Fixed Position */}
            <button
                onClick={handleBackClick}
                className="fixed top-20 left-4 z-2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-all duration-200 backdrop-blur-sm border border-white/20 hover:scale-110"
                aria-label="Go back"
            >
                <IoIosArrowBack size={24} />
            </button>

            {/* Hero Section with Backdrop */}
            <div className="relative min-h-screen">
                {details.backdrop_path && (
                    <div className="fixed inset-0 z-0">
                        <img
                            src={`https://image.tmdb.org/t/p/original${details.backdrop_path}`}
                            alt={title}
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/60"></div>
                    </div>
                )}
                
                {/* Mobile and Desktop Hero Layout */}
                <div className="relative z-10 container mx-auto px-4 min-h-screen flex items-end pb-8 md:pb-20">
                    {/* Desktop Layout */}
                    <div className="hidden md:flex gap-8 w-full">
                        {/* Poster */}
                        <div className="flex-shrink-0">
                            <img
                                src={`https://image.tmdb.org/t/p/w500${details.poster_path}`}
                                alt={title}
                                className="w-80 rounded-lg shadow-2xl"
                            />
                        </div>
                        
                        {/* Main Info */}
                        <div className="flex-1 text-white">
                            <h1 className="text-5xl font-bold mb-4">{title}</h1>
                            <div className="flex items-center gap-4 mb-6">
                                <span className="text-xl">{year}</span>
                                <div className="flex items-center gap-2">
                                    <span className="text-yellow-400">⭐</span>
                                    <span className="text-xl">{rating}</span>
                                </div>
                                {details.runtime && (
                                    <span className="text-xl">{Math.floor(details.runtime / 60)}h {details.runtime % 60}m</span>
                                )}
                            </div>
                            
                            {/* Genres */}
                            <div className="flex flex-wrap gap-2 mb-6">
                                {details.genres?.map(genre => (
                                    <span key={genre.id} className="px-3 py-1 bg-white/20 rounded-full text-sm">
                                        {genre.name}
                                    </span>
                                ))}
                            </div>
                            
                            {/* Description */}
                            <p className="text-lg mb-6 max-w-3xl leading-relaxed">{details.overview}</p>
                            
                            {/* Action Buttons */}
                            <div className="flex gap-4 mb-6">
                                <button
                                    onClick={handleFavoriteClick}
                                    className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 flex items-center gap-2 ${
                                        isFavorite(details.id)
                                        ? 'bg-red-500 hover:bg-red-600 text-white'
                                        : 'bg-white/20 hover:bg-white/30 text-white'
                                    }`}
                                >
                                    <Heart size={20} className={isFavorite(details.id) ? 'fill-white' : ''} />
                                    {isFavorite(details.id) ? 'Remove from Favorites' : 'Add to Favorites'}
                                </button>

                                <button
                                    onClick={handleWatchListClick}
                                    className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 flex items-center gap-2 ${
                                        isWatchList(details.id)
                                        ? 'bg-blue-500 hover:bg-blue-600 text-white'
                                        : 'bg-white/20 hover:bg-white/30 text-white'
                                    }`}
                                >
                                    <Bookmark size={20} className={isWatchList(details.id) ? 'fill-white' : ''} />
                                    {isWatchList(details.id) ? 'Remove from Watchlist' : 'Add to Watchlist'}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Mobile Layout */}
                    <div className="md:hidden w-full text-white">
                        <div className="text-center mb-6">
                            <img
                                src={`https://image.tmdb.org/t/p/w500${details.poster_path}`}
                                alt={title}
                                className="w-48 mx-auto rounded-lg shadow-2xl mb-4"
                            />
                            <h1 className="text-3xl font-bold mb-2">{title}</h1>
                            <div className="flex items-center justify-center gap-3 mb-4 text-sm">
                                <span>{year}</span>
                                <div className="flex items-center gap-1">
                                    <span className="text-yellow-400">⭐</span>
                                    <span>{rating}</span>
                                </div>
                                {details.runtime && (
                                    <span>{Math.floor(details.runtime / 60)}h {details.runtime % 60}m</span>
                                )}
                            </div>
                            
                            {/* Genres */}
                            <div className="flex flex-wrap gap-2 justify-center mb-4">
                                {details.genres?.map(genre => (
                                    <span key={genre.id} className="px-2 py-1 bg-white/20 rounded-full text-xs">
                                        {genre.name}
                                    </span>
                                ))}
                            </div>
                            
                            {/* Description */}
                            <p className="text-sm mb-6 leading-relaxed px-2">{details.overview}</p>
                            
                            {/* Action Buttons - Mobile */}
                            <div className="flex flex-col gap-3 px-4">
                                <button
                                    onClick={handleFavoriteClick}
                                    className={`px-4 py-3 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center gap-2 text-sm ${
                                        isFavorite(details.id)
                                        ? 'bg-red-500 hover:bg-red-600 text-white'
                                        : 'bg-white/20 hover:bg-white/30 text-white'
                                    }`}
                                >
                                    <Heart size={18} className={isFavorite(details.id) ? 'fill-white' : ''} />
                                    {isFavorite(details.id) ? 'Remove from Favorites' : 'Add to Favorites'}
                                </button>

                                <button
                                    onClick={handleWatchListClick}
                                    className={`px-4 py-3 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center gap-2 text-sm ${
                                        isWatchList(details.id)
                                        ? 'bg-blue-500 hover:bg-blue-600 text-white'
                                        : 'bg-white/20 hover:bg-white/30 text-white'
                                    }`}
                                >
                                    <Bookmark size={18} className={isWatchList(details.id) ? 'fill-white' : ''} />
                                    {isWatchList(details.id) ? 'Remove from Watchlist' : 'Add to Watchlist'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Cast Section */}
            {credits?.cast && credits.cast.length > 0 && (
                <section className="relative z-10 py-8 md:py-12">
                    <div className="container mx-auto px-4">
                        <h2 className="text-2xl md:text-3xl font-bold text-white mb-4 md:mb-6">Cast</h2>
                        <div className="flex gap-3 md:gap-4 overflow-x-auto pb-4">
                            {credits.cast.slice(0, 10).map(person => (
                                <div key={person.id} className="flex-shrink-0 w-24 md:w-32 text-center">
                                    <img
                                        src={
                                            person.profile_path
                                                ? `https://image.tmdb.org/t/p/w185${person.profile_path}`
                                                : 'https://via.placeholder.com/185x278?text=No+Image'
                                        }
                                        alt={person.name}
                                        className="w-24 h-36 md:w-32 md:h-48 object-cover rounded-lg mb-2"
                                    />
                                    <p className="font-semibold text-xs md:text-sm text-white">{person.name}</p>
                                    <p className="text-xs text-gray-300">{person.character}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Trailer Section */}
            {trailer && (
                <section className="relative z-10 py-8 md:py-12">
                    <div className="container mx-auto px-4">
                        <h2 className="text-2xl md:text-3xl font-bold text-white mb-4 md:mb-6 text-center">Watch Trailer</h2>
                        <div className="max-w-4xl mx-auto">
                            <div className="relative pb-[56.25%] h-0">
                                <iframe
                                    src={`https://www.youtube.com/embed/${trailer.key}`}
                                    title={`${title} Trailer`}
                                    className="absolute top-0 left-0 w-full h-full rounded-lg"
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                ></iframe>
                            </div>
                        </div>
                    </div>
                </section>
            )}

            <div className="relative z-10 rounded-2xl bg-white/10 dark:bg-[#0d0d0d]/30 backdrop-blur-md border border-white/20 shadow-lg text-white">
                <div className="container mx-auto px-4 py-8 md:py-12">

                    {/* Episodes Section (TV Series only) */}
                    {mediaType === 'tv' && seasons.length > 0 && (
                        <section className="mb-8 md:mb-12">
                            <h2 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6">Episodes</h2>
                            {seasons.map(season => (
                                <div key={season.id} className="mb-4 md:mb-6">
                                    <button
                                        onClick={() => handleSeasonToggle(season.season_number)}
                                        className="w-full text-left p-4 md:p-6 bg-gradient-to-r from-white-600 to-white-600 dark:from-white-700 dark:to-white-700 rounded-xl hover:from-white-700 hover:to-white-700 dark:hover:from-white-800 dark:hover:to-indigo-800 transition-all duration-300 ease-in-out transform hover:scale-[1.01] shadow-lg hover:shadow-xl border-2 border-purple-500/20"
                                    >
                                        <div className="flex justify-between items-center">
                                            <h3 className="text-lg md:text-xl font-bold text-white drop-shadow-sm">
                                                🎬 {season.name} ({season.episode_count} episodes)
                                            </h3>
                                            <span 
                                                className={`text-xl md:text-2xl text-white font-bold transition-transform duration-300 ease-in-out ${
                                                    expandedSeasons.has(season.season_number) ? 'rotate-180' : 'rotate-0'
                                                }`}
                                            >
                                                {expandedSeasons.has(season.season_number) ? '−' : '+'}
                                            </span>
                                        </div>
                                        {season.overview && (
                                            <p className="text-purple-100 dark:text-purple-200 mt-2 md:mt-3 leading-relaxed text-sm md:text-base">{season.overview}</p>
                                        )}
                                    </button>
                                    
                                    {/* Animated Episodes Container */}
                                    <div 
                                        className={`overflow-hidden transition-all duration-500 ease-in-out ${
                                            expandedSeasons.has(season.season_number) ? 'max-h-[5000px] opacity-100' : 'max-h-0 opacity-0'
                                        }`}
                                    >
                                        {expandedSeasons.has(season.season_number) && episodes[season.season_number] && (
                                            <div className="mt-4 md:mt-6 space-y-3 md:space-y-4 animate-fadeIn pl-2 md:pl-4 border-l-2 md:border-l-4 border-purple-300 dark:border-purple-500">
                                                {episodes[season.season_number].map((episode, index) => (
                                                    <div 
                                                        key={episode.id} 
                                                        className="flex flex-col md:flex-row gap-3 md:gap-5 p-3 md:p-5 bg-white dark:bg-gray-800 rounded-lg border-2 border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 hover:bg-gray-50 dark:hover:bg-gray-750 transition-all duration-300 ease-in-out transform hover:scale-[1.002] hover:shadow-lg ml-1 md:ml-2"
                                                        style={{
                                                            animationDelay: `${index * 50}ms`,
                                                            animation: expandedSeasons.has(season.season_number) ? 'slideInUp 0.4s ease-out forwards' : 'none'
                                                        }}
                                                    >
                                                        {episode.still_path && (
                                                            <div className="flex-shrink-0 w-full md:w-auto">
                                                                <img
                                                                    src={`https://image.tmdb.org/t/p/w300${episode.still_path}`}
                                                                    alt={episode.name}
                                                                    className="w-full md:w-44 h-32 md:h-26 object-cover rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 transition-transform duration-300 hover:scale-105"
                                                                />
                                                            </div>
                                                        )}
                                                        <div className="flex-1 min-w-0">
                                                            <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-3 mb-2 md:mb-3">
                                                                <span className="font-bold text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-900/30 px-2 md:px-3 py-1 rounded-full text-xs md:text-sm w-fit">
                                                                    📺 S{season.season_number}E{episode.episode_number}
                                                                </span>
                                                                <h4 className="font-semibold text-gray-800 dark:text-gray-100 text-base md:text-lg">{episode.name}</h4>
                                                                {episode.vote_average > 0 && (
                                                                    <div className="flex items-center gap-1 bg-yellow-100 dark:bg-yellow-900/30 px-2 py-1 rounded-full w-fit">
                                                                        <span className="text-yellow-500">⭐</span>
                                                                        <span className="text-yellow-600 dark:text-yellow-400 font-medium text-xs md:text-sm">
                                                                            {episode.vote_average.toFixed(1)}
                                                                        </span>
                                                                    </div>
                                                                )}
                                                            </div>
                                                            <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-2 md:mb-3">
                                                                {episode.overview}
                                                            </p>
                                                            {episode.air_date && (
                                                                <p className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-md inline-block">
                                                                    Aired: {new Date(episode.air_date).toLocaleDateString()}
                                                                </p>
                                                            )}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </section>
                    )}

                    <style jsx>{`
                        @keyframes fadeIn {
                            from {
                                opacity: 0;
                                transform: translateY(-10px);
                            }
                            to {
                                opacity: 1;
                                transform: translateY(0);
                            }
                        }

                        @keyframes slideInUp {
                            from {
                                opacity: 0;
                                transform: translateY(20px);
                            }
                            to {
                                opacity: 1;
                                transform: translateY(0);
                            }
                        }

                        .animate-fadeIn {
                            animation: fadeIn 0.5s ease-out;
                        }
                    `}</style>

                    {/* Recommendations */}
                    {recommendations.length > 0 && (
                        <section className="mb-8 md:mb-12">
                            <h2 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6">You May Also Like</h2>
                            <div className="flex gap-3 md:gap-4 overflow-x-auto pb-4">
                                {recommendations.slice(0, 12).map(item => (
                                    <div key={item.id} className="flex-shrink-0 w-36 md:w-48">
                                        <Card seriesmovies={item} />
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Additional Images */}
                    {images?.backdrops && images.backdrops.length > 0 && (
                        <section className="mb-8 md:mb-12">
                            <h2 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6">Gallery</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
                                {images.backdrops.slice(0, 6).map((image, index) => (
                                    <img
                                        key={index}
                                        src={`https://image.tmdb.org/t/p/w780${image.file_path}`}
                                        alt={`${title} backdrop ${index + 1}`}
                                        className="w-full h-32 md:h-48 object-cover rounded-lg"
                                    />
                                ))}
                            </div>
                        </section>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Details;