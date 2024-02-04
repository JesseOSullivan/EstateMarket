// estates.tsx
'use client';

import React, { useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import Search from '@/app/ui/search'; // Assuming the Search component is saved in components folder
import { Box, Card, CardContent, CardMedia, Typography, Grid, Button, useMediaQuery, useTheme } from '@mui/material';
import "mapbox-gl/dist/mapbox-gl.css";

mapboxgl.accessToken = 'pk.eyJ1IjoiamVzc2Utb3N1bGxpdmFuIiwiYSI6ImNsczV6YTF3ODFjdGIya2w4MWozYW14YmcifQ.zO0G8xIzWO9RH367as02Dg';

type Estate = {
  id: number;
  name: string;
  location: string;
  image: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
};


const EstatesPage = () => {
  const [estates, setEstates] = useState<Estate[]>([]);
  const theme = useTheme();
  const isLargeScreen = useMediaQuery(theme.breakpoints.up('lg'));
  const isMediumScreen = useMediaQuery(theme.breakpoints.only('md'));
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const [isMobile, setIsMobile] = useState(false);
  const [view, setView] = useState<'map' | 'list'>('map'); // New state for managing view



  
  useEffect(() => {
    if (view != 'map') return;
    const map = new mapboxgl.Map({
      container: 'map', // The container ID
      style: 'mapbox://styles/mapbox/streets-v11', // The map style URL
      center: [-74.5, 40], // Initial map center in [lng, lat]
      zoom: 9, // Initial map zoom
    });

    map.addControl(new mapboxgl.NavigationControl());

    const mockEstates = simulateFetchEstates();
    setEstates(mockEstates);

    // Ensure map is fully loaded before adding markers and popups
    map.on('load', () => {
      mockEstates.forEach((estate) => {

        // Create a popup
        const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(
          `<h3>${estate.name}</h3><p>${estate.location}</p>`
        );

        // Create and add the marker
        new mapboxgl.Marker()
          .setLngLat([estate.coordinates.longitude, estate.coordinates.latitude])
          .setPopup(popup) // sets a popup on this marker
          .addTo(map);
      });
    });

    

  }, [view]);

  const simulateFetchEstates = (): Estate[] => {
    // Simulate fetching data with coordinates
    return [
      { id: 1, name: "Estate 1", location: "Location 1", image: "https://via.placeholder.com/150", coordinates: { latitude: 39.833851, longitude: -74.871826 } },
      { id: 2, name: "Estate 2", location: "Location 2", image: "https://via.placeholder.com/150", coordinates: { latitude: 40.71427, longitude: -74.00597 } },
      // Add more mock estate objects with coordinates
    ];
  };
  useEffect(() => {
    // Check the viewport width when the component mounts
    const handleResize = () => {
      if (window.innerWidth <= 600) {
        setIsMobile(true);
      } else {
        setIsMobile(false);
      }
    };

    // Add an event listener for window resize
    window.addEventListener('resize', handleResize);

    // Initial check when the component mounts
    handleResize();

    // Clean up the event listener when the component unmounts
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);


  const toggleView = () => {
    setView(prevView => prevView === 'map' ? 'list' : 'map');
  };
  

  return (
    <Box sx={{ position: 'relative', height: '100vh' }}>
      {isMobile ? (
        <>
          {view === 'map' ? (
                <Grid container>
            <Grid item xs={12} md={8} lg={8} style={{ height: '100vh' }}>
              <div  id="map" style={{ width: '100%', height: '100%' }}></div>
            </Grid>
            </Grid>

          ) : (
            <Grid container spacing={2} style={{ padding: '20px' }}>
              {estates.map((estate, index) => (
                <Grid item xs={12} key={index}>
                  <Card>
                    <CardMedia
                      component="img"
                      height="140"
                      image={estate.image}
                      alt={estate.name}
                    />
                    <CardContent>
                      <Typography gutterBottom variant="h5" component="div">
                        {estate.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {estate.location}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
          <Box sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, p: 1, display: 'flex', justifyContent: 'center', }}>
            <Button style={{ color: '#fff', backgroundColor: theme.palette.primary.main, }} variant="contained" onClick={toggleView}>
              Switch to {view === 'map' ? 'List' : 'Map'}
            </Button>
          </Box>
        </>
      ) : (
        // Non-mobile view
        <Grid container >
          <Grid item xs={12} sm={8} md={8} lg={8} style={{ height: '100vh' }}>
          <div id="map" style={{ width: '100%', height: '100%' }}></div>
          </Grid>
          <Grid item xs={12} sm={4} md={4} lg={4} style={{ overflowY: 'auto', height: '100vh', padding: '20px' }}>
            <Search placeholder="Search Estates" />
            <Grid className='pt-10' container spacing={2}>
              {estates.map((estate, index) => (
                <Grid item xs={12} sm={12} md={12} lg={6} key={index}>
                  <Card>
                    <CardMedia
                      component="img"
                      height="140"
                      image={estate.image}
                      alt={estate.name}
                    />
                    <CardContent>
                      <Typography gutterBottom variant="h5" component="div">
                        {estate.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {estate.location}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Grid>
      )}
    </Box>
  );
};

export default EstatesPage;
