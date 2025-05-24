import SMCard from "../components/Card";
import { getTrendingAll } from "../api/api";
import { useState, useEffect } from "react";
import Card from "../components/Card";
import SearchBar from "../components/SearchBar";
import { useMoviesSeriesContext } from "../context/MoviesSeriesContext";

function Home() {
    // *
    const { 
        seriesMovies, 
        setSeriesMovies, 
        loading, 
        setLoading, 
        error, 
        setError 
    } = useMoviesSeriesContext();

    useEffect(() => {
        const loadPopularSeriesMovies = async () => {
            setLoading(true);
            try {
                const popularSeriesMovies = await getTrendingAll();
                setSeriesMovies(popularSeriesMovies);
            } catch (err) {
                setError(err.message || "Failed to load popular series and movies");
                console.error("Error loading popular:", err);
            } finally {
                setLoading(false);
            }
        };
        
        loadPopularSeriesMovies();
    }, [setSeriesMovies, setLoading, setError]);

    return (
        <div className="home">
            <SearchBar />
            <div className="grid justify-start grid-cols-[repeat(auto-fill,_minmax(200px,_1fr))] gap-6 p-4 w-full box-border">
                {seriesMovies && seriesMovies.map((item) => (
                    <Card seriesmovies={item} key={item.id}/>
                ))}
            </div>
        </div>
    );
}

export default Home;