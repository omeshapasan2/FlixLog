import { React, useState, useEffect } from 'react';
import OngoingCard from '../components/OngoingCard';

const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const url = `https://api.themoviedb.org/3/tv/272059?api_key=${TMDB_API_KEY}`;

export default function Ongoing() {
  const [ongoing, setOngoing] = useState(null);
  const [last_air_date, setLast_air_date] = useState(false)

  useEffect(() => {
    const fetchOngoing = async () => {
      const result = await fetch(url)
      // Return the result (Raw API response)
      // console.log(result)
      // Convert that result into a JS object
      // console.log(result.json())

      // Get Access to the data
      result.json().then(json => {
        console.log(json)
        // setOngoing(json)
        setLast_air_date(json.last_air_date)
      })
    }
    fetchOngoing()
  }, [])

  return (
    <div>
      <h2>Upcoming Episodes</h2>
      <br/>
      <OngoingCard />
      <OngoingCard />
    </div>
  )
}
