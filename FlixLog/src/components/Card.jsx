import { useState } from "react";
import { Link } from "react-router-dom";
import { useMoviesSeriesContext } from "../context/MoviesSeriesContext";
import { Heart, Bookmark } from "lucide-react";

function Card({ seriesmovies }) {
    const title = seriesmovies.title || seriesmovies.name;
    const year = (seriesmovies.release_date || seriesmovies.first_air_date || "").split("-")[0];
    
    // Determine media type - prioritize explicit media_type, then check for movie/TV specific fields
    const mediaType = seriesmovies.media_type || 
                     (seriesmovies.title ? 'movie' : 'tv') || 
                     (seriesmovies.release_date ? 'movie' : 'tv');

    const { addToFavorites, removeFromFavorites, isFavorite, addToWatchList, removeFromWatchList, isWatchList } = useMoviesSeriesContext();
    const favorite = isFavorite(seriesmovies.id);
    const watchlist = isWatchList(seriesmovies.id);

    // Handle adding to favorites
    function onFavoriteClick(e) {
        e.preventDefault();
        if (favorite) {
            removeFromFavorites(seriesmovies.id);
        } else {
            addToFavorites({ ...seriesmovies, media_type: mediaType });
        }
    }

    // Handle adding to watchlist
    function onWatchListClick(e) {
        e.preventDefault();
        if (watchlist) {
            removeFromWatchList(seriesmovies.id);
        } else {
            addToWatchList({ ...seriesmovies, media_type: mediaType });
        }
    }

    return (
        <Link to={`/details/${seriesmovies.id}/${mediaType}`} className="no-underline text-black dark:text-white">
            <div className="relative rounded-lg overflow-hidden bg-gray-200 dark:bg-[#1a1a1a] transition-transform duration-200 h-full flex flex-col hover:-translate-y-1">
                <div className="relative aspect-[2/3] w-full">

                    {/* Image */}
                    <img
                        src={`https://image.tmdb.org/t/p/w500${seriesmovies.poster_path}`}
                        alt={title}
                        className="w-full h-full object-cover"
                    />

                    {/* Favorite Button */}
                    <button
                    onClick={onFavoriteClick}
                    className={`absolute top-4 right-4 p-2 rounded-full w-10 h-10 flex items-center justify-center transition duration-200
                        ${favorite ? "bg-red-500 text-white" : "bg-white/50 text-black dark:bg-black/50 dark:text-white"}
                        hover:bg-red-600 hover:text-white`}
                    >
                    <Heart size={20} className={favorite ? "fill-white" : ""} />
                    </button>

                    <button
                    onClick={onWatchListClick}
                    className={`absolute top-16 right-4 p-2 rounded-full w-10 h-10 flex items-center justify-center transition duration-200
                        ${watchlist ? "bg-blue-500 text-white" : "bg-white/50 text-black dark:bg-black/50 dark:text-white"}
                        hover:bg-blue-600 hover:text-white`}
                    >
                    <Bookmark size={20} className={watchlist ? "fill-white" : ""} />
                    </button>
                </div>

                {/* Rating */}
                <div className="absolute top-2 left-2 px-2 py-1 bg-black text-white text-sm rounded">
                    ⭐{seriesmovies.vote_average ? seriesmovies.vote_average.toFixed(1) : 'N/A'}
                </div>

                {/* Title and Year */}
                <div className="p-4 flex-1 flex flex-col gap-2">
                    <h3 className="text-black dark:text-white text-base font-semibold">{title}</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">{year}</p>
                </div>
            </div>
        </Link>
    );
}

export default Card;