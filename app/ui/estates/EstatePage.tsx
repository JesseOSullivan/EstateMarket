// estates.tsx
'use client';

import React, { use, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import Search from '@/app/ui/search'; // Assuming the Search component is saved in components folder
import { Box, Card, CardContent, CardMedia, Typography, Grid, Button, useMediaQuery, useTheme } from '@mui/material';
import "mapbox-gl/dist/mapbox-gl.css";
import {
  SearchResult
} from '@/app/lib/definitions';
import { useDebouncedCallback } from 'use-debounce';
import { fetchLocationByCoordAction } from '@/app/lib/actions';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import CustomPopup from './CustomPopup';
import { createRoot } from 'react-dom/client'; // Import createRoot from React 18


mapboxgl.accessToken = 'pk.eyJ1IjoiamVzc2Utb3N1bGxpdmFuIiwiYSI6ImNsczV6YTF3ODFjdGIya2w4MWozYW14YmcifQ.zO0G8xIzWO9RH367as02Dg';


const EstatesPage = ({ locationData }: { locationData: SearchResult[] }) => {
  const [Locations, setLocations] = useState<SearchResult[]>([]);
  const theme = useTheme();
  const [isMobile, setIsMobile] = useState(false);
  const [view, setView] = useState<'map' | 'list'>('map'); // New state for managing view
  //const params = useSearchParams();
  const [test, setTest] = useState(1)
  const [markers, setMarkers] = useState<mapboxgl.Marker[]>([]);
  const pathname = usePathname();
  const [map, setMap] = useState<mapboxgl.Map>()
  const searchParams = useSearchParams();
  const router = useRouter();
  const params = new URLSearchParams(searchParams.toString())


  // use affect to reload when the coord params change 

  useEffect(() => {
    console.log("params.toString()")
    console.log(params.toString())

    console.log(Locations)
  }
    , [Locations]);



  useEffect(() => {
    setLocations(locationData);
  }, [locationData]);


  // only on first load
  useEffect(() => {

    //const params = new URLSearchParams(window.location.search);
    const centerLat = params.get('centerLat');
    const centerLng = params.get('centerLng');
    const zoom = params.get('zoom');
    if (view != 'map') return;


    if (centerLat && centerLng && zoom) {
      const map = new mapboxgl.Map({
        container: 'map', // The container ID
        style: 'mapbox://styles/mapbox/streets-v11', // The map style URL
        center: [parseFloat(centerLng), parseFloat(centerLat)], // Coordinates of Cairns: [longitude, latitude]
        zoom: parseInt(zoom), // Initial map zoom
      });
      setMap(map)



    } else {

      const map = new mapboxgl.Map({
        container: 'map', // The container ID
        style: 'mapbox://styles/mapbox/streets-v11', // The map style URL
        center: Locations[0] ? [Locations[0].longitude, Locations[0].latitude] : [133.7751, -30], // coord of center australia 
        zoom: Locations[0] ? 8 : 4, // Initial map zoom
      });
      setMap(map)

    }
    map?.addControl(new mapboxgl.NavigationControl());
    if (Locations.length > 0) {
      // Ensure map is fully loaded before adding markers and popups
      map?.on('load', () => {
        addMarkers(map);
      });
    }


  }, []); // Add locationData as a dependency


  const addMarkers = (map: mapboxgl.Map) => {

    markers.forEach(marker => marker.remove());

    const newMarkers = Locations.map((location) => {
      const placeholder = document.createElement('div');
      document.body.appendChild(placeholder);
      //const root = createRoot(placeholder);
     /* root.render(
        <CustomPopup
          title={location.estatename}
          price={`${location.pricerange || 'Price not available'}`}
          address={location.fulladdress}
          bedrooms={4}
          bathrooms={2}
          parking={2}
          imageSrc='https://via.placeholder.com/150'
          logoSrc='https://via.placeholder.com/50'
        />
      );*/
      const popup = new mapboxgl.Popup({ offset: 25 })//.setDOMContent(placeholder)

        // Create a new HTML element to use as a custom marker
        const el = document.createElement('div');
        // Apply Tailwind CSS classes for styling the custom marker
      el.className = 'w-7 h-7 shadow border-4   border-white rounded-full bg-primary-main';

      el.addEventListener('mouseenter', () => {
        el.classList.remove('bg-primary-main');
        el.classList.add('bg-blue-700');
        el.classList.add('w-8');
        el.classList.add('h-8');

      });

      el.addEventListener('mouseleave', () => {
        el.classList.remove('bg-blue-700');
        el.classList.remove('w-8');
        el.classList.remove('h-8');
        el.classList.add('bg-primary-main');
      });

      const marker = new mapboxgl.Marker(el) // Consider using 'center' as the anchor
        .setLngLat([location.longitude, location.latitude])
        .setPopup(popup)
        .addTo(map);
        marker.setPopup(new mapboxgl.Popup({ offset: 25 }).setDOMContent(placeholder));
        addPopup(<h1>Losers of 1966 World Cup</h1>, 52.5, 13.4);

      return marker;
    });
    // Update the markers state with the new markers
    setMarkers(newMarkers);
  }

  // add markers seperate 
  useEffect(() => {


    if (map) {
      addMarkers(map);

      map.on('moveend', () => fetchEstatesInViewport(map));

      return () => {
        // Clean up event listeners
        map.off('moveend', () => fetchEstatesInViewport(map));
      };

    }
  }, [Locations]);


  const fetchEstatesInViewport = useDebouncedCallback((map: mapboxgl.Map) => {

    const bounds = map.getBounds();
    const sw = bounds.getSouthWest();
    const ne = bounds.getNorthEast();

    if (params.has('query')) {
      params.delete('query');

    }

    const centerLat = (sw.lat + ne.lat) / 2;
    const centerLng = (sw.lng + ne.lng) / 2;

    // Get zoom level
    const zoom = map.getZoom();

    // Update URL parameters with viewport bounds, zoom level, and center coordinates
    params.set('swLat', sw.lat.toFixed(6));
    params.set('swLng', sw.lng.toFixed(6));
    params.set('neLat', ne.lat.toFixed(6));
    params.set('neLng', ne.lng.toFixed(6));
    params.set('centerLat', centerLat.toFixed(6));
    params.set('centerLng', centerLng.toFixed(6));
    params.set('zoom', zoom.toFixed(2));

    router.replace(`${pathname}?${params.toString()}`);


    const swLat = parseFloat(sw.lat.toFixed(6));
    const swLng = parseFloat(sw.lng.toFixed(6));
    const neLat = parseFloat(ne.lat.toFixed(6));
    const neLng = parseFloat(ne.lng.toFixed(6));


    const updateData = async () => {
      const t = await fetchLocationByCoordAction(swLat, swLng, neLat, neLng)
      if (t) {
        setLocations(t.rows);

      }
    }
    if (swLat && swLng && neLat && neLng) {
      updateData()

    }


  }, 400);

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
                <div id="map" style={{ width: '100%', height: '100%' }}></div>
              </Grid>
            </Grid>
          ) : (
            <>
              <div className='px-2' style={{ position: 'sticky', top: '90px', zIndex: 10 }}> {/* Make search bar stick just below the navbar */}
                <Search placeholder="Search Estates" />
              </div>
              <Grid container spacing={2} style={{ padding: '20px' }}>
                {Locations.map((locaiton, index) => (
                  <Grid item xs={12} key={index}>
                    <Card>
                      <CardMedia
                        component="img"
                        height="140"
                        image='https://via.placeholder.com/150'
                        alt={String(locaiton.citycouncil)} // Ensure addressid is converted to a string
                      />
                      <CardContent>
                        <Typography gutterBottom variant="h5" component="div">
                          {locaiton.estatename}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {locaiton.growthregion}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </>
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
              {Locations.map((location, index) => (
                <Grid item xs={12} sm={12} md={12} lg={6} key={index}>
                  <Card>
                    <CardMedia
                      component="img"
                      height="140"
                      image='https://via.placeholder.com/150'
                      alt={String(location.citycouncil)} // Ensure addressid is converted to a string
                    />
                    <CardContent>
                      <Typography gutterBottom variant="h5" component="div">
                        {location.estatename}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {location.growthregion}
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
