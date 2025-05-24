import { useMoviesSeriesContext } from "../context/MoviesSeriesContext";
import Card from "../components/Card";


function Favorites(){
    const { favorites } = useMoviesSeriesContext();

    if(favorites){
        return(
            <>
                <div>
                    <h2 className='text-3xl font-bold text-center mt-10'>Favorites</h2>
                    <div className="grid grid-cols-[repeat(auto-fit,_minmax(300px,_1fr))] gap-6 p-4 w-full box-border">
                        {favorites.map((item) => (
                            <Card seriesmovies={item} key={item.id}/>
                        ))}
                    </div>
                </div>
            </>
        )
    }

    return(
        <>
            <div className="favorites-empty">
                <h3>No Favorites Added Yet...</h3>
                <p>Click on the heart icon to add a movie or series to your favorites.</p>
                <p>Make sure you are logged in before adding favorites...</p>
            </div>
        </>
    )
}

export default Favorites