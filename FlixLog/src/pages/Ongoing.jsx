import { React, useState, useEffect } from 'react';
import OngoingCard from '../components/OngoingCard';

export default function Ongoing() {

  return (
    <div>
      <h2 className='text-left text-xl font-mono'>Upcoming...</h2>
      <hr className="border-t-2 border-gray-300 dark:border-gray-600 my-4" />
      <br/>
      <OngoingCard />
    </div>
  )
}
