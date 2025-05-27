import { useMoviesSeriesContext } from "../context/MoviesSeriesContext";
import Card from "../components/Card";
import { Link } from "react-router-dom";

function Favorites(){
    const { favorites } = useMoviesSeriesContext();

    // Check if favorites exists AND has items
    if(favorites && favorites.length > 0){
        return(
            <>
                <div>
                    <h2 className='text-3xl font-bold text-center mt-10'>Favorites</h2>
                    <div className="grid justify-start grid-cols-[repeat(auto-fill,_minmax(200px,_1fr))] gap-6 p-4 w-full box-border">
                        {favorites.map((item) => (
                            <Card seriesmovies={item} key={item.id}/>
                        ))}
                    </div>
                </div>
            </>
        )
    }

    // This will now show when favorites is null, undefined, or empty array
    return(
        <>
            <div className="favorites-empty flex flex-col items-center justify-center min-h-[60vh] px-6 py-12 text-center">
                {/* Heart Icon */}
                <div className="mb-8 p-6 bg-gradient-to-br from-red-100 to-pink-100 dark:from-red-900/20 dark:to-pink-900/20 rounded-full shadow-lg transform hover:scale-105 transition-transform duration-300">
                    <svg 
                        className="w-16 h-16 text-red-400 dark:text-red-300" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                    >
                        <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            strokeWidth={1.5} 
                            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" 
                        />
                    </svg>
                </div>

                {/* Main Heading */}
                <h3 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6 bg-gradient-to-r from-gray-800 to-gray-600 dark:from-gray-100 dark:to-gray-300 bg-clip-text text-transparent">
                    No Favorites Added Yet...
                </h3>

                {/* Description */}
                <div className="max-w-md space-y-4">
                    <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                        Click on the{' '}
                        <span className="inline-flex items-center mx-1 px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-full text-sm font-medium">
                            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                            </svg>
                            heart
                        </span>{' '}
                        icon to add a movie or series to your favorites.
                    </p>
                    
                    <p className="text-base text-gray-500 dark:text-gray-400 leading-relaxed">
                        Make sure you are logged in before adding favorites...
                    </p>
                </div>

                {/* Call to Action Button (Optional) */}
                <div className="mt-8">
                    <Link to="/" className="inline-block">
                        <button className="px-6 py-3 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white font-medium rounded-full shadow-lg transform hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-red-200 dark:focus:ring-red-800">
                            Browse Movies & TV Shows
                        </button>
                    </Link>
                </div>

                {/* Decorative Elements */}
                <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
                    <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-red-200/20 dark:bg-red-800/10 rounded-full blur-3xl animate-pulse"></div>
                    <div className="absolute bottom-1/3 right-1/4 w-24 h-24 bg-pink-200/20 dark:bg-pink-800/10 rounded-full blur-2xl animate-pulse" style={{animationDelay: '1s'}}></div>
                </div>
            </div>
        </>
    )
}

export default Favorites