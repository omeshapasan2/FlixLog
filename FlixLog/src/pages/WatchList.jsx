import React from 'react'
import { useMoviesSeriesContext } from '../context/MoviesSeriesContext'
import Card from '../components/Card'
import { Link } from 'react-router-dom'

function WatchList() {
  const { watchlist } = useMoviesSeriesContext()

  // Check if watchlist exists AND has items
  if (watchlist && watchlist.length > 0) {
    return (
      <>
        <div>
          <h2 className='text-3xl font-bold text-center mt-10 mb-8 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent'>
            Watch List
          </h2>
          <div className='grid justify-start grid-cols-[repeat(auto-fill,_minmax(200px,_1fr))] gap-6 p-4 w-full box-border'>
            {watchlist.map((item) => (
              <Card seriesmovies={item} key={item.id} />
            ))}
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <div>
        <h2 className='text-3xl font-bold text-center mt-10 mb-8 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent'>
          Watch List
        </h2>
        
        {/* Empty State */}
        <div className="watchlist-empty flex flex-col items-center justify-center min-h-[50vh] px-6 py-12 text-center">
          {/* Film Icon */}
          <div className="mb-8 p-6 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20 rounded-full shadow-lg transform hover:scale-105 transition-transform duration-300">
            <svg 
              className="w-16 h-16 text-blue-500 dark:text-blue-400" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={1.5} 
                d="M7 4v16l11-8L7 4z M15 8h.01" 
              />
              <rect x="2" y="3" width="20" height="14" rx="2" ry="2" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} />
            </svg>
          </div>

          {/* Main Heading */}
          <h3 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6 bg-gradient-to-r from-gray-800 to-gray-600 dark:from-gray-100 dark:to-gray-300 bg-clip-text text-transparent">
            No Movies or Series Added Yet...
          </h3>

          {/* Description */}
          <div className="max-w-md space-y-4">
            <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
              Click on the{' '}
              <span className="inline-flex items-center mx-1 px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full text-sm font-medium">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 20 20">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4v12l9-6-9-6z" />
                </svg>
                film
              </span>{' '}
              icon to add a movie or series to your watch list.
            </p>
            
            <p className="text-base text-gray-500 dark:text-gray-400 leading-relaxed">
              Make sure you are logged in before adding to your watch list...
            </p>
          </div>

          {/* Call to Action Button */}
          <div className="mt-8">
            <Link to="/" className="inline-block">
              <button className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-medium rounded-full shadow-lg transform hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-200 dark:focus:ring-blue-800">
                Discover Movies & TV Shows
              </button>
            </Link>
          </div>

          {/* Decorative Elements */}
          <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
            <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-blue-200/20 dark:bg-blue-800/10 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-1/3 right-1/4 w-24 h-24 bg-purple-200/20 dark:bg-purple-800/10 rounded-full blur-2xl animate-pulse" style={{animationDelay: '1s'}}></div>
          </div>
        </div>
      </div>
    </>
  )
}

export default WatchList