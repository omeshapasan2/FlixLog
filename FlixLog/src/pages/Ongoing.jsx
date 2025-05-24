import { React, useState, useEffect } from 'react';
import OngoingCard from '../components/OngoingCard';

export default function Ongoing() {

  return (
    <div>
      <h2 className='text-left text-xl font-mono'>Upcoming...</h2>
      <br/>
      <OngoingCard />
    </div>
  )
}
