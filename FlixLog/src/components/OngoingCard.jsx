import {React, useState, useEffect } from 'react'
import { getOngoingSeries } from '../api/api';
import { useMoviesSeriesContext } from '../context/MoviesSeriesContext';

function OngoingCard() {
    // const [series, setSeries] = useState(null);

    const [ongoingData, setOngoingData] = useState([]);
    const { watchlist } = useMoviesSeriesContext();

    useEffect(() => {
        const fetchAllOngoing = async () => {
            const results = await Promise.all(
                watchlist.map(item => getOngoingSeries(item.id))
            );
            // Filter out nulls if any failed
            setOngoingData(results.filter(Boolean));
        };

        if (watchlist.length > 0) {
            fetchAllOngoing();
        }
    }, [watchlist]);

    if (ongoingData.length === 0) return <p>Loading...</p>;

  return (
    <>
        <div >
            {ongoingData.map((item) => (
            <div className='w-[90%] flex flex-col items-center bg-white border border-gray-200 rounded-lg shadow-sm md:flex-row hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700' key={item.id}>
                <img 
                    src={item.image}
                    alt={item.name}
                    className="object-cover w-full rounded-t-lg h-48 md:h-32 md:w-32 md:rounded-none md:rounded-l-lg" 
                />
                <div className="flex flex-col justify-between p-4 leading-normal w-full">
                    <h2 className="mb-2 text-xl font-bold tracking-tight text-gray-900 dark:text-white">{item.name}</h2>
                    <p className="text-sm text-gray-500 mb-1">S0{item.season} E0{item.episode}</p>
                    <p className="text-sm font-normal text-gray-700 dark:text-gray-400">{item.airdate}</p>
                </div>
            </div>
            ))}
        </div>
        <br/>
    </>
  )
}

export default OngoingCard