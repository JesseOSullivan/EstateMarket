import React, { useState, useEffect } from 'react';
import { Box, Checkbox, FormGroup, FormControlLabel, Button, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useSpring, animated } from '@react-spring/web';
import theme from '@/theme';
type FilterProps = {
  categories: string[];
  applyFilters: (selectedCategories: string[]) => void;
  closeFilter: () => void;
};

export const Filter: React.FC<FilterProps> = ({ categories, applyFilters, closeFilter }) => {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [isVisible, setIsVisible] = useState(false);

  // Animation for the filter component
  const animation = useSpring({
    opacity: isVisible ? 1 : 0,
    transform: isVisible ? 'translateX(0%)' : 'translateX(100%)',
    from: { opacity: 0, transform: 'translateX(100%)' },
    config: { tension: 170, friction: 26 },
    top: 90, // Keeps the component below the navbar
    height: 'calc(100vh - 90px - 20px)', // Adjusts the height to introduce a gap at the bottom
  });
  
  useEffect(() => {
    setIsVisible(true); // Automatically show the filter upon component mounting
  }, []);

  const handleCategoryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.name;
    setSelectedCategories(prev =>
      prev.includes(value) ? prev.filter(category => category !== value) : [...prev, value]
    );
  };

  const handleSubmit = () => {
    applyFilters(selectedCategories);
    closeFilter(); // Optionally close the filter panel after applying filters
  };

  return (

    <animated.div style={animation} className="fixed  right-0 md:w-[600px] pb-10 w-full h-full bg-white p-4 shadow-md z-50 p-4 flex flex-col">
      <IconButton onClick={() => { setIsVisible(false); closeFilter(); }} className="self-end">
        <CloseIcon />
      </IconButton>
      <h2 className="text-lg font-semibold mb-4">Filters</h2>
      <FormGroup>
        {categories.map(category => (
          <FormControlLabel
            key={category}
            control={
              <Checkbox
                checked={selectedCategories.includes(category)}
                onChange={handleCategoryChange}
                name={category}
              />
            }
            label={category}
          />
        ))}
      </FormGroup>
      <Button onClick={handleSubmit}  style={{ color: '#fff', backgroundColor: theme.palette.primary.main, }} variant="contained" >

        Apply Filters
      </Button>
    </animated.div>
  );
};
