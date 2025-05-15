import { useState } from "react";
import { useMoviesSeriesContext } from "../context/MoviesSeriesContext";

function Card({ seriesmovies }) {
    const title = seriesmovies.title || seriesmovies.name;
    const year = (seriesmovies.release_date || seriesmovies.first_air_date || "").split("-")[0];

    const { addToFavorites, removeFromFavorites, isFavorite } = useMoviesSeriesContext();
    const favorite = isFavorite(seriesmovies.id);

    function onFavoriteClick(e) {
        e.preventDefault();
        if (favorite) {
            removeFromFavorites(seriesmovies.id);
        } else {
            addToFavorites(seriesmovies);
        }
    }

    return (
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
                    className={`absolute top-4 right-4 text-xl p-2 rounded-full w-10 h-10 flex items-center justify-center transition duration-200
                        ${favorite ? "bg-red-500 text-white" : "bg-white/50 text-black dark:bg-black/50 dark:text-white"}
                        hover:bg-white/80 dark:hover:bg-black/80`}
                >
                    ♥
                </button>
            </div>

            {/* Rating */}
            <div className="absolute top-2 left-2 px-2 py-1 bg-black text-white text-sm rounded">⭐8.5</div>

            {/* Title and Year */}
            <div className="p-4 flex-1 flex flex-col gap-2">
                <h3 className="text-black dark:text-white text-base font-semibold">{title}</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">{year}</p>
            </div>
        </div>
    );
}

export default Card;
