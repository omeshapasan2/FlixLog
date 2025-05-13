import { Link } from "react-router-dom";

function MovieCard() {
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
            <h3>Titanic</h3>
            <p>1999</p>
        </div>
    </div>
}

export default MovieCard