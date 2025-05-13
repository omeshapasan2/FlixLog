import MovieCard from "../components/MovieCard";

function Home() {
    const movies = [
        {id: 1, title: "John Wick", release_date:"2020"},
        {id: 2, title: "Terminator", release_date:"1999"},
        {id: 3, title: "Titanic", release_date:"1998"},
    ]

    return(
        <>
            <div className="movies-grid">
                {movies.map((movie) => (
                    <MovieCard movie={movie} key={movie.id} />
                ))}
            </div>
        </>
    )
}

export default Home