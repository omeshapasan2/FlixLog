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
          <span className="text-gray-800 dark:text-gray-200">{actor.name}</span>
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

  // Custom styles for react-select to match Tailwind theme
  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      backgroundColor: 'rgb(249 250 251)', // bg-gray-50
      borderColor: state.isFocused ? 'rgb(59 130 246)' : 'rgb(209 213 219)', // focus:border-blue-500 : border-gray-300
      borderRadius: '0.5rem', // rounded-lg
      borderWidth: '1px',
      boxShadow: state.isFocused ? '0 0 0 2px rgba(59, 130, 246, 0.5)' : 'none', // focus:ring-2 focus:ring-blue-500
      padding: '0.125rem', // py-0.5
      minHeight: '42px',
      '&:hover': {
        borderColor: state.isFocused ? 'rgb(59 130 246)' : 'rgb(156 163 175)', // hover:border-gray-400
      },
      '@media (prefers-color-scheme: dark)': {
        backgroundColor: 'rgb(31 41 55)', // dark:bg-gray-800
        borderColor: state.isFocused ? 'rgb(59 130 246)' : 'rgb(75 85 99)', // dark:border-gray-600
        '&:hover': {
          borderColor: state.isFocused ? 'rgb(59 130 246)' : 'rgb(107 114 128)', // dark:hover:border-gray-500
        }
      }
    }),
    menu: (provided) => ({
      ...provided,
      backgroundColor: 'white',
      borderRadius: '0.5rem', // rounded-lg
      border: '1px solid rgb(209 213 219)', // border-gray-300
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)', // shadow-lg
      zIndex: 50,
      '@media (prefers-color-scheme: dark)': {
        backgroundColor: 'rgb(31 41 55)', // dark:bg-gray-800
        borderColor: 'rgb(75 85 99)', // dark:border-gray-600
      }
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected 
        ? 'rgb(59 130 246)' // bg-blue-500
        : state.isFocused 
          ? 'rgb(243 244 246)' // bg-gray-100
          : 'transparent',
      color: state.isSelected 
        ? 'white' 
        : 'rgb(31 41 55)', // text-gray-800
      padding: '0.5rem 0.75rem', // py-2 px-3
      cursor: 'pointer',
      '&:hover': {
        backgroundColor: state.isSelected ? 'rgb(37 99 235)' : 'rgb(243 244 246)', // hover:bg-blue-600 : hover:bg-gray-100
      },
      '@media (prefers-color-scheme: dark)': {
        color: state.isSelected ? 'white' : 'rgb(243 244 246)', // dark:text-gray-100
        '&:hover': {
          backgroundColor: state.isSelected ? 'rgb(37 99 235)' : 'rgb(55 65 81)', // dark:hover:bg-gray-700
        }
      }
    }),
    multiValue: (provided) => ({
      ...provided,
      backgroundColor: 'rgb(219 234 254)', // bg-blue-100
      borderRadius: '0.375rem', // rounded-md
      '@media (prefers-color-scheme: dark)': {
        backgroundColor: 'rgb(30 58 138)', // dark:bg-blue-900
      }
    }),
    multiValueLabel: (provided) => ({
      ...provided,
      color: 'rgb(30 64 175)', // text-blue-800
      fontSize: '0.875rem', // text-sm
      '@media (prefers-color-scheme: dark)': {
        color: 'rgb(191 219 254)', // dark:text-blue-200
      }
    }),
    multiValueRemove: (provided) => ({
      ...provided,
      color: 'rgb(30 64 175)', // text-blue-800
      borderRadius: '0 0.375rem 0.375rem 0', // rounded-r-md
      '&:hover': {
        backgroundColor: 'rgb(185 28 28)', // hover:bg-red-700
        color: 'white',
      },
      '@media (prefers-color-scheme: dark)': {
        color: 'rgb(191 219 254)', // dark:text-blue-200
      }
    }),
    placeholder: (provided) => ({
      ...provided,
      color: 'rgb(156 163 175)', // text-gray-400
      fontSize: '0.875rem', // text-sm
      '@media (prefers-color-scheme: dark)': {
        color: 'rgb(107 114 128)', // dark:text-gray-500
      }
    }),
    input: (provided) => ({
      ...provided,
      color: 'rgb(31 41 55)', // text-gray-800
      '@media (prefers-color-scheme: dark)': {
        color: 'rgb(243 244 246)', // dark:text-gray-100
      }
    }),
    singleValue: (provided) => ({
      ...provided,
      color: 'rgb(31 41 55)', // text-gray-800
      '@media (prefers-color-scheme: dark)': {
        color: 'rgb(243 244 246)', // dark:text-gray-100
      }
    }),
    indicatorSeparator: (provided) => ({
      ...provided,
      backgroundColor: 'rgb(209 213 219)', // border-gray-300
      '@media (prefers-color-scheme: dark)': {
        backgroundColor: 'rgb(75 85 99)', // dark:border-gray-600
      }
    }),
    dropdownIndicator: (provided) => ({
      ...provided,
      color: 'rgb(107 114 128)', // text-gray-500
      '&:hover': {
        color: 'rgb(75 85 99)', // hover:text-gray-600
      },
      '@media (prefers-color-scheme: dark)': {
        color: 'rgb(156 163 175)', // dark:text-gray-400
        '&:hover': {
          color: 'rgb(209 213 219)', // dark:hover:text-gray-300
        }
      }
    }),
    clearIndicator: (provided) => ({
      ...provided,
      color: 'rgb(107 114 128)', // text-gray-500
      '&:hover': {
        color: 'rgb(185 28 28)', // hover:text-red-700
      },
      '@media (prefers-color-scheme: dark)': {
        color: 'rgb(156 163 175)', // dark:text-gray-400
        '&:hover': {
          color: 'rgb(248 113 113)', // dark:hover:text-red-400
        }
      }
    })
  };

  return (
    <div className="space-y-3">
      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
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