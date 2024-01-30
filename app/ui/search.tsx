'use client';

// Import necessary modules and types
import React, { useState, useEffect } from 'react';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import Autocomplete, { AutocompleteChangeReason,  } from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import InputAdornment from '@mui/material/InputAdornment';

// Define the props type for the Search component
type SearchProps = {
  placeholder: string;
};

// Define the Search component with TypeScript
export default function Search({ placeholder }: SearchProps) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const [inputValue, setInputValue] = useState('');

  // Update the inputValue when the searchParams change
  useEffect(() => {
    const query = searchParams.get('query');
    if (query) {
      setInputValue(query);
    }
  }, [searchParams]);

  // Function to handle search execution
  const executeSearch = (value: string) => {
    console.log(`Searching... ${value}`);
    const params = new URLSearchParams(searchParams);
    params.set('page', '1');
    if (value) {
      params.set('query', value);
    } else {
      params.delete('query');
    }
    router.replace(`${pathname}?${params.toString()}`);
  };

  // Handle changes in the Autocomplete component
  const handleAutocompleteChange = (
    event: React.SyntheticEvent<Element, Event>,
    newValue: string | null,
    reason: AutocompleteChangeReason
  ) => {
    if (reason === 'selectOption' && newValue) {
      executeSearch(newValue);
    }
  };

  // Handle changes in the input value
  const handleInputChange = (
    event: React.SyntheticEvent<Element, Event>,
    newInputValue: string
  ) => {
    setInputValue(newInputValue);
  };

  // Define options for Autocomplete

  return (
<div className="relative flex items-center justify-center w-full md:max-w-3xl bg-white shadow-lg rounded-full"> {/* Adjust width, background, and shadow as needed */}
      <Autocomplete
        
        freeSolo
        disableClearable
        options={searchOptions}
        value={inputValue}
        onChange={handleAutocompleteChange}
        onInputChange={handleInputChange}
        classes={{
      root: 'w-full', // Set the width of the component
      inputRoot: 'input-root bg-transparent', // Ensure the background is transparent and apply custom class if needed
      input: 'input-input', // Apply custom class for input
              popupIndicator: 'hidden', // Hide the default dropdown indicator
          clearIndicator: 'hidden', // Hide the default clear indicator
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            placeholder={placeholder}
            fullWidth
            InputProps={{
              ...params.InputProps,
              startAdornment: (
                <InputAdornment position="start">
                </InputAdornment>

              ),
              className: "rounded-full py-4 pl-12 pr-4" // Tailwind classes for rounded edges and padding
            }}
          />
        )}
      />
    </div>
  );
}

const searchOptions: string[] = [
  "Option 1",
  "Option 2",
  "Option 3",
  "Option 4",
  "Option 5",
  "Option 6",
  "Option 7",
  "Option 8",
  "Option 9",
  "Option 10",
  "Option 11",
  "Option 12",
  "Option 13",
  "Option 14",
  "Option 15",
  "Option 16",
  "Option 17",
  "Option 18",
  "Option 19",
  "Option 20",
  "Option 21",
  "Option 22",
  "Option 23",
  "Option 24",
  "Option 25",
  "Option 26",
  "Option 27",
  "Option 28",
  "Option 29",
  "Option 30"
];
