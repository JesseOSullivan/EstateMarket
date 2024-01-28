'use client';
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#007bff', // Dark Blue
      light: '#66b3ff', // Light Blue
    },
    secondary: {
      main: '#adb5bd', // gray
    },
    background: {
      default: '#f8f9fa', // gray
      
    },
    text: {
      primary: '#333333', // or any color for primary text
      secondary: '#ffffff', // or any color for secondary text
    },
  },
  // You can also add other theme customizations here
});

export default theme;
