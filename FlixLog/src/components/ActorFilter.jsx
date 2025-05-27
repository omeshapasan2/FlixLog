import React, { useState } from 'react';
import AsyncSelect from 'react-select/async';

const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY;

// Attempt to use ThemeContext, with fallback
let useTheme;
try {
  useTheme = require('./context/ThemeContext').useTheme; // Adjusted path
} catch (e) {
  console.warn('ThemeContext not found, defaulting to light mode. Please set up ThemeProvider.');
  useTheme = () => ({ theme: 'light' }); // Fallback to light mode
}

const ActorFilter = ({ onChange }) => {
  const [selectedActors, setSelectedActors] = useState([]);
  const { theme } = useTheme(); // Will use fallback if context is missing

  const loadOptions = async (inputValue) => {
    if (!inputValue) return [];

    const response = await fetch(
      `https://api.themoviedb.org/3/search/person?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(inputValue)}`
    );
    const data = await response.json();

    return data.results.map(actor => ({
      value: actor.id,
      label: (
        <div className="flex items-center">
          <img
            src={
              actor.profile_path
                ? `https://image.tmdb.org/t/p/w45${actor.profile_path}`
                : 'https://via.placeholder.com/45x45?text=No+Image'
            }
            alt={actor.name}
            className="w-7 h-7 rounded-full mr-3 object-cover"
          />
          <span className={`text-gray-800 ${theme === 'dark' ? 'text-white' : ''}`}>{actor.name}</span>
        </div>
      ),
      id: actor.id
    }));
  };

  const handleChange = (selectedOptions) => {
    setSelectedActors(selectedOptions);
    const actorIds = selectedOptions.map(option => option.id);
    onChange(actorIds);
  };

  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      backgroundColor: theme === 'dark' ? 'rgb(55 65 81)' : 'rgb(249 250 251)', // dark:bg-gray-700, light:bg-gray-50
      borderColor: state.isFocused
        ? 'rgb(59 130 246)' // border-blue-500
        : theme === 'dark' ? 'rgb(75 85 99)' : 'rgb(209 213 219)', // dark:border-gray-600, light:border-gray-300
      borderRadius: '0.5rem', // rounded-lg
      borderWidth: '1px',
      boxShadow: state.isFocused ? '0 0 0 2px rgba(59, 130, 246, 0.5)' : 'none', // focus:ring-2 focus:ring-blue-500
      padding: '0.125rem', // slight padding
      minHeight: '42px',
      transition: 'all 0.2s', // transition-all duration-200
      '&:hover': {
        borderColor: state.isFocused
          ? 'rgb(59 130 246)'
          : theme === 'dark' ? 'rgb(107 114 128)' : 'rgb(156 163 175)', // dark:hover:border-gray-500, light:hover:border-gray-400
      },
    }),
    menu: (provided) => ({
      ...provided,
      backgroundColor: theme === 'dark' ? 'rgb(55 65 81)' : 'rgb(255 255 255)', // dark:bg-gray-700, light:bg-white
      borderRadius: '0.5rem', // rounded-lg
      border: `1px solid ${theme === 'dark' ? 'rgb(75 85 99)' : 'rgb(209 213 219)'}`, // dark:border-gray-600, light:border-gray-300
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)', // shadow-lg
      zIndex: 50,
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected
        ? 'rgb(59 130 246)' // bg-blue-500
        : state.isFocused
          ? theme === 'dark' ? 'rgb(75 85 99)' : 'rgb(243 244 246)' // dark:bg-gray-600, light:bg-gray-100
          : 'transparent',
      color: state.isSelected
        ? 'rgb(255 255 255)' // text-white
        : theme === 'dark' ? 'rgb(255 255 255)' : 'rgb(31 41 55)', // dark:text-white, light:text-gray-900
      padding: '0.5rem 0.75rem',
      cursor: 'pointer',
      transition: 'background-color 0.2s', // transition-colors duration-200
      '&:hover': {
        backgroundColor: state.isSelected
          ? 'rgb(37 99 235)' // hover:bg-blue-600
          : theme === 'dark' ? 'rgb(75 85 99)' : 'rgb(243 244 246)', // dark:hover:bg-gray-600, light:hover:bg-gray-100
      },
    }),
    multiValue: (provided) => ({
      ...provided,
      backgroundColor: theme === 'dark' ? 'rgb(30 58 138)' : 'rgb(219 234 254)', // dark:bg-blue-900, light:bg-blue-100
      borderRadius: '0.375rem', // rounded-md
    }),
    multiValueLabel: (provided) => ({
      ...provided,
      color: theme === 'dark' ? 'rgb(255 255 255)' : 'rgb(30 64 175)', // dark:text-white, light:text-blue-800
      fontSize: '0.875rem', // text-sm
    }),
    multiValueRemove: (provided) => ({
      ...provided,
      color: theme === 'dark' ? 'rgb(255 255 255)' : 'rgb(30 64 175)', // dark:text-white, light:text-blue-800
      borderRadius: '0 0.375rem 0.375rem 0', // rounded-r-md
      cursor: 'pointer',
      '&:hover': {
        backgroundColor: 'rgb(185 28 28)', // hover:bg-red-700
        color: 'rgb(255 255 255)', // hover:text-white
      },
    }),
    placeholder: (provided) => ({
      ...provided,
      color: theme === 'dark' ? 'rgb(209 213 219)' : 'rgb(156 163 175)', // dark:text-gray-300, light:text-gray-400
      fontSize: '0.875rem', // text-sm
    }),
    input: (provided) => ({
      ...provided,
      color: theme === 'dark' ? 'rgb(255 255 255)' : 'rgb(31 41 55)', // dark:text-white, light:text-gray-900
    }),
    singleValue: (provided) => ({
      ...provided,
      color: theme === 'dark' ? 'rgb(255 255 255)' : 'rgb(31 41 55)', // dark:text-white, light:text-gray-900
    }),
    indicatorSeparator: (provided) => ({
      ...provided,
      backgroundColor: theme === 'dark' ? 'rgb(75 85 99)' : 'rgb(209 213 219)', // dark:bg-gray-600, light:bg-gray-300
    }),
    dropdownIndicator: (provided) => ({
      ...provided,
      color: theme === 'dark' ? 'rgb(209 213 219)' : 'rgb(107 114 128)', // dark:text-gray-300, light:text-gray-500
      '&:hover': {
        color: theme === 'dark' ? 'rgb(255 255 255)' : 'rgb(75 85 99)', // dark:hover:text-white, light:hover:text-gray-600
      },
    }),
    clearIndicator: (provided) => ({
      ...provided,
      color: theme === 'dark' ? 'rgb(209 213 219)' : 'rgb(107 114 128)', // dark:text-gray-300, light:text-gray-500
      '&:hover': {
        color: 'rgb(248 113 113)', // hover:text-red-400
      },
    }),
  };

  return (
    <div className="space-y-3">
      <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
        Search by Actor(s)
      </label>
      <AsyncSelect
        isMulti
        cacheOptions
        loadOptions={loadOptions}
        onChange={handleChange}
        value={selectedActors}
        placeholder="Search actors..."
        styles={customStyles}
        className="react-select-container"
        classNamePrefix="react-select"
        noOptionsMessage={({ inputValue }) =>
          inputValue ? `No actors found for "${inputValue}"` : "Start typing to search actors..."
        }
        loadingMessage={() => "Searching actors..."}
      />
    </div>
  );
};

export default ActorFilter;