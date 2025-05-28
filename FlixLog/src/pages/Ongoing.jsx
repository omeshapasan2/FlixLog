import { React, useState, useEffect } from 'react';
import OngoingCard from '../components/OngoingCard';

export default function Ongoing() {

  return (
    <div>
      <div className="block sm:hidden h-10" />
      <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Upcoming...
              </h1>
      <div className="h-1 my-4 bg-gradient-to-r from-blue-600 to-purple-600" />
      <p className="text-gray-600 dark:text-gray-400 mb-6">
        Here you can find all the movies and series that are currently ongoing or upcoming.
        Stay tuned for the latest updates!
      </p>
      <OngoingCard />
    </div>
  )
}
