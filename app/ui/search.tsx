'use client';

// Import necessary modules and types
import React, { SyntheticEvent, useState, useEffect } from 'react';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Chip from '@mui/material/Chip';
import SearchIcon from '@mui/icons-material/Search'; // You'll need to import the appropriate search icon from Material-UI
import IconButton from '@mui/material/IconButton'; // Import IconButton for clickable icon
import TuneIcon from '@mui/icons-material/Tune';// Define the props type for the Search component
import Box from '@mui/material/Box'; // Import Box from MUI for layout purposes
import { Filter } from './Filter';
import { useSpring, animated } from '@react-spring/web';
import { fetchSearchTerms } from '@/app/lib/actions';
import { useDebouncedCallback } from 'use-debounce';
import CircularProgress from '@mui/material/CircularProgress'; // Import MUI CircularProgress for loading indicator
import { Typography } from '@mui/material';

type SearchProps = {
  placeholder: string;
};



// Define the Search component with TypeScript
export default function Search({ placeholder }: SearchProps ) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const closeFilter = () => setIsFilterVisible(false);
  
  const [inputValue, setInputValue] = useState('');
  const [options, setOptions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false); // New loading state

  const debounceFetch = useDebouncedCallback(async (value: string) => {
    setLoading(true); // Set loading to true before fetching data
    if (value) {
      const locationData = await fetchSearchTerms(value);
      const formattedOptions = locationData.map((location: any) => location.result);
      setOptions(formattedOptions);
      setLoading(false); // Set loading to false after fetching data
    } else {
      setOptions([]);
      setLoading(false); // Ensure loading is false if there's no value
    }
  }, 500);
  
  const handleInputChange = (
    event: SyntheticEvent, 
    newInputValue: string
  ) => {
    setInputValue(newInputValue); // Update the inputValue state
    debounceFetch(newInputValue);
  };
  



  
  const filterCategories = ["Category 1", "Category 2", "Category 3"]; // Example categories
  const applyFilters = (selectedCategories: string[]) => {
    console.log("Applying filters: ", selectedCategories);
    // Close the filter modal/panel
    setIsFilterVisible(false);
    // Here, you can integrate the logic to apply these filters to your search query
  };
  const toggleFilterVisibility = () => setIsFilterVisible(!isFilterVisible);

  const handleSearchBarClick = () => {
    // Reset selected options to an empty array

    // if map area is in selected options, remove it
    if (selectedOptions.includes("Map Area")) {
      const newSelectedOptions = selectedOptions.filter(option => option !== "Map Area");
      setSelectedOptions(newSelectedOptions);
      executeSearch(newSelectedOptions);
    }
  };

  useEffect(() => {
    const query = searchParams.get('query');
    if (searchParams.get('swLat')) {
      setSelectedOptions(["Map Area"]);
    }
    // if map area is in selected options, remove it
    if (query) {
      setSelectedOptions(query.split(','));
    }

    if (query) {
      setSelectedOptions(query.split(','));
    }
  }, [searchParams]);

  const executeSearch = (values: string[]) => {
    console.log(`Searching... ${values.join(', ')}`);
    const params = new URLSearchParams(searchParams);
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
      onInputChange={handleInputChange}
        multiple
        id="async-autocomplete"
        autoComplete={false}
        freeSolo
        loading={loading}
        loadingText={<>
        
        <Box display="flex" alignItems="center">
  <CircularProgress className='mt-1 mb-1' size={30} thickness={5} style={{ color:"#007bff",  fontSize: '30px'  }} /> 
  <Typography  style={{ marginLeft: '15px', color: 'black' }}>
  Searching: <strong >{inputValue}</strong>
</Typography>
</Box>

        </>
      }
        disableClearable
        options={options}
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
            onMouseDown={handleSearchBarClick}
              onKeyDown={(event: React.KeyboardEvent) => {
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
              <IconButton className="p-2" onClick={toggleFilterVisibility}>
                <TuneIcon />
              </IconButton>
              <IconButton className="p-2" onClick={handleSearchButtonClick}>
                <SearchIcon />
              </IconButton>
            </Box>
          </Box>
        )}

      />
      {/* Conditional rendering for backdrop */}
      {isFilterVisible && (
        <animated.div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)', // Ensure this is the only source of opacity
          }}
          onClick={() => setIsFilterVisible(false)} // Optionally close filter on backdrop click
        ></animated.div>
      )}

      {/* Filter Component */}
      {isFilterVisible && <Filter categories={filterCategories} applyFilters={applyFilters} closeFilter={closeFilter} />}

    </Box>
  );
}

