import React, { useState } from 'react';
import AsyncSelect from 'react-select/async';

const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const ActorFilter = ({ onChange }) => {
  const [selectedActors, setSelectedActors] = useState([]);

  const loadOptions = async (inputValue) => {
    if (!inputValue) return [];

    const response = await fetch(
      `https://api.themoviedb.org/3/search/person?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(inputValue)}`
    );
    const data = await response.json();

    return data.results.map(actor => ({
      value: actor.id,
      label: (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <img
            src={
              actor.profile_path
                ? `https://image.tmdb.org/t/p/w45${actor.profile_path}`
                : 'https://via.placeholder.com/45x45?text=No+Image'
            }
            alt={actor.name}
            style={{ width: 30, height: 30, borderRadius: '50%', marginRight: 10 }}
          />
          {actor.name}
        </div>
      ),
      rawName: actor.name // we'll pass this to the parent
    }));
  };

  const handleChange = (selectedOptions) => {
    setSelectedActors(selectedOptions);
    const actorNames = selectedOptions.map(option => option.rawName);
    onChange(actorNames);
  };

  return (
    <div className="mb-4">
      <label className="block mb-2 font-bold">Search by Actor(s)</label>
      <AsyncSelect
        isMulti
        cacheOptions
        loadOptions={loadOptions}
        onChange={handleChange}
        value={selectedActors}
        placeholder="Search actors..."
      />
    </div>
  );
};

export default ActorFilter;
