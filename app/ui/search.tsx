'use client';

// Import necessary modules and types
import React, { useState, useEffect } from 'react';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Chip from '@mui/material/Chip';
import SearchIcon from '@mui/icons-material/Search'; // You'll need to import the appropriate search icon from Material-UI
import IconButton from '@mui/material/IconButton'; // Import IconButton for clickable icon
import TuneIcon from '@mui/icons-material/Tune';// Define the props type for the Search component
import Box from '@mui/material/Box'; // Import Box from MUI for layout purposes
import Grid from '@mui/material/Grid'; // Import Box from MUI for layout purposes
import Tune from '@mui/icons-material/Tune';

type SearchProps = {
  placeholder: string;
};



// Define the Search component with TypeScript
export default function Search({ placeholder }: SearchProps) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);

  useEffect(() => {
    const query = searchParams.get('query');
    if (query) {
      setSelectedOptions(query.split(','));
    }
  }, [searchParams]);

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

  const handleAutocompleteChange = (event: React.SyntheticEvent, newValues: string[]) => {
    setSelectedOptions(newValues);
    executeSearch(newValues);
  };
  
  const handleSearchButtonClick = () => {
    const params = new URLSearchParams(searchParams);
    // Ensure 'estates' is only appended if not already in pathname
    const newPath = pathname.endsWith('/estates') ? pathname : `${pathname}estates`;
    router.replace(`${newPath}?${params.toString()}`);
  }
  

  const renderTags = (value: string[], getTagProps: (value: any) => any) =>
    value.map((option: string, index: number) => (
      <Chip key={index} label={option} {...getTagProps({ index })} />
    ));



  return (
    <Box className="relative flex   items-center justify-center w-full md:max-w-3xl bg-white shadow-lg"
      style={{ borderRadius: '30px' }}>
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
          <Box display="flex" alignItems="center" style={{ borderRadius: '30px', background: '#fff' }}>
            <TextField
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  // Prevent the default action to avoid form submission if this is inside a form
                  event.preventDefault();
                  // Trigger the search with the currently selected options
                  handleSearchButtonClick();
                }
              }}
            
              {...params}
              fullWidth
              placeholder={placeholder}
              variant="outlined"
              InputProps={{
                ...params.InputProps,
                endAdornment: null, // Remove the default endAdornment to manage it outside the TextField
                style: { borderRadius: '30px' },
              }}
              style={{ flexGrow: 1 }} // Allow the TextField to grow as needed
            />
            <Box className="flex items-center"> {/* This box contains the icons and positions them at the end */}
              <IconButton className="p-2" onClick={() => {/* Handler for filter action */ }}>
                <TuneIcon />
              </IconButton>
              <IconButton className="p-2" onClick={handleSearchButtonClick}>
                <SearchIcon />
              </IconButton>
            </Box>
          </Box>
        )}

      />
    </Box>
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
