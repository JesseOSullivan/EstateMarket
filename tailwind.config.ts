// tailwind.config.js

import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      boxShadow: {
        'none': 'none !important',
      },
      borderColor: {
        'transparent': 'transparent !important',
      },
      outline: {
        'none': 'none !important',
      },
      screens: {
        'sm': '600px',
        'md': '900px', // Change to 900px for the md breakpoint
        'lg': '1024px',
        'xl': '1280px',
      },
      gridTemplateColumns: {
        '13': 'repeat(13, minmax(0, 1fr))',
      },
      colors: {
        blue: {
          400: '#2589FE',
          500: '#0070F3',
          600: '#2F6FEB',
        },
        primary: {
          main: '#007bff', // Dark Blue
          light: '#66b3ff', // Light Blue
        },
        secondary: {
          main: '#adb5bd', // Gray Dark
        },
        background: {
          default: '#f8f9fa', // Gray Light
        },
        text: {
          primary: '#333333', // Light Black
          secondary: '#ffffff', // White
        },
      },
      keyframes: {
        shimmer: {
          '100%': {
            transform: 'translateX(100%)',
          },
        },
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
};

export default config;
