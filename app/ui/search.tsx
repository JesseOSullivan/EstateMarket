'use client';

// Import necessary modules and types
import React, { useState, useEffect } from 'react';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Chip from '@mui/material/Chip';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search'; // You'll need to import the appropriate search icon from Material-UI

// Define the props type for the Search component
type SearchProps = {
  placeholder: string;
};



// Define the Search component with TypeScript
export default function Search({ placeholder }: SearchProps) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  // Update the inputValue when the searchParams change
  useEffect(() => {
    const query = searchParams.get('query');
    if (query) {
      setSelectedOptions(query.split(','));
    }
  }, [searchParams]);



  // Function to handle search execution
  const executeSearch = (values: string[]) => {
    console.log(`Searching... ${values.join(', ')}`);
    const params = new URLSearchParams(searchParams);
    params.set('page', '1');
    if (values.length > 0) {
      params.set('query', values.join(','));
    } else {
      params.delete('query');
    }
    router.replace(`${pathname}?${params.toString()}`);
  };

  // Handle changes in the Autocomplete component
  const handleAutocompleteChange = (event: React.SyntheticEvent, newValues: string[]) => {
    setSelectedOptions(newValues);
    executeSearch(newValues);
  };

  // Handle changes in the input value
  const handleInputChange = (
    event: React.SyntheticEvent<Element, Event>,
    newInputValue: string
  ) => {
    //setInputValue(newInputValue);
  };

  // Render tags as chips in the Autocomplete
  const renderTags = (value: string[], getTagProps: (value: any) => any) =>
    value.map((option: string, index: number) => (
      <Chip key={index} label={option} {...getTagProps({ index })} />
    ));
    
  return (
    <div className="relative flex items-center justify-center w-full md:max-w-3xl bg-white shadow-lg " 
    style={{borderRadius: '30px'}}
    >
      <Autocomplete
        multiple
        id="field1"
        
        autoComplete={false}
        freeSolo
        disableClearable
        options={searchOptions}
        value={selectedOptions}
        onChange={handleAutocompleteChange}
        renderTags={renderTags}
        classes={{
          root: 'w-full',
          inputRoot: 'input-root bg-transparent',
          input: 'input-input',
          popupIndicator: 'hidden',
          clearIndicator: 'hidden',
        }}
        renderInput={(params) => (
          
          <TextField
          autoComplete='off'
            {...params}
            placeholder={placeholder}
            InputProps={{
              autoComplete: 'new-password',
              ...params.InputProps,
              style: {     borderRadius: '30px'},
          
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
