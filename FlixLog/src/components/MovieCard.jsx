import { Link } from "react-router-dom";
import Home from "../pages/Home";

function MovieCard({movie}) {
    return <div className="movie-card">
        <div className="movie-poster">
            {/* Movie/Series Poster */}
            <img src="https://media.istockphoto.com/id/1147544807/vector/thumbnail-image-vector-graphic.jpg?s=612x612&w=0&k=20&c=rnCKVbdxqkjlcs3xH87-9gocETqpspHFXu5dIGB4wuM=" alt="movie.title"/>
            {/* Add/Remove Favorite Button */}
            {/* <button className={`favorite-btn ${favorite ? "active" : ""}`} onClick={onFavoriteClick}>
                ♥
            </button> */}
        </div>
        <div className="movie-info">
            <h3>{movie.title}</h3>
            <p>{movie.release_date}</p>
        </div>
    </div>
}

export default MovieCard