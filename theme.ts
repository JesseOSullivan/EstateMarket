'use client';
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#007bff', // Dark Blue
      light: '#66b3ff', // Light Blue
    },
    secondary: {
      main: '#adb5bd', // gray dark
    },
    background: {
      default: '#f8f9fa', // gray light
      
    },
    text: {
      primary: '#333333', // light black 
      secondary: '#ffffff', // white
    },
  },
  // You can also add other theme customizations here
});

export default theme;
