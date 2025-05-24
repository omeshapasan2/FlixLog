import React from 'react'
import { useMoviesSeriesContext } from '../context/MoviesSeriesContext'
import Card from '../components/Card'

function WatchList() {
  const { watchlist } = useMoviesSeriesContext()

  if (watchlist) {
    return (
      <>
        <div>
          <h2 className='text-3xl font-bold text-center mt-10'>Watch List</h2>
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
    <div>
      <h2 className='text-3xl font-bold text-center mt-10'>Watch List</h2>
      <div className='text-center mt-10'>
        <h3>No Movies or Series Added Yet...</h3>
        <p>Click on the film icon to add a movie or series to your watch list.</p>
        <p>Make sure you are logged in before adding to your watch list...</p>
      </div>
    </div>
  )
}

export default WatchList