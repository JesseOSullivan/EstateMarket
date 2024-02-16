// estates.tsx
'use client';

import React, { use, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import Search from '@/app/ui/search'; // Assuming the Search component is saved in components folder
import { Box, Grid, Button, useTheme } from '@mui/material';
import "mapbox-gl/dist/mapbox-gl.css";
import {
  SearchResult
} from '@/app/lib/definitions';
import { useDebouncedCallback } from 'use-debounce';
import { fetchLocationByCoordAction } from '@/app/lib/actions';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import CustomPopup from './CustomPopup';
import { createRoot } from 'react-dom/client'; // Import createRoot from React 18
import { TotalDevelopments } from './TotalDevelopments';
import { FetchResult } from '@/app/lib/definitions';
import EstateCard from './Card';
mapboxgl.accessToken = 'pk.eyJ1IjoiamVzc2Utb3N1bGxpdmFuIiwiYSI6ImNsczV6YTF3ODFjdGIya2w4MWozYW14YmcifQ.zO0G8xIzWO9RH367as02Dg';


const EstatesPage = ({ locationData }: { locationData: SearchResult[] }) => {
  const [Locations, setLocations] = useState<SearchResult[]>([]);
  const theme = useTheme();
  const [isMobile, setIsMobile] = useState(false);
  const [view, setView] = useState<'map' | 'list'>('map'); // New state for managing view
  const [markers, setMarkers] = useState<mapboxgl.Marker[]>([]);
  const pathname = usePathname();
  const [map, setMap] = useState<mapboxgl.Map>()
  const searchParams = useSearchParams();
  const router = useRouter();
  const params = new URLSearchParams(searchParams.toString())
  const [mapMoved, setMapMoved] = useState(false);
  const [searchQuery, setSearchQuery] = useState<string | null>(null);
  const [fetchResult, setFetchResult] = useState<FetchResult>({ data: [], loading: true });

  const totalDevelopments = Locations.length;



  useEffect(() => {
    const query = searchParams.get('query');
    setSearchQuery(query); // Update the state with the current query
  }, [searchParams]);


  useEffect(() => {
    setLocations(locationData);
    fetchResult.loading = false;
  }, [locationData]);

  useEffect(() => {
    if (map) {
      map.on('move', () => {
        console.log('map is moving')
        addMarkers(map);
        console.log('add markers')

        fetchEstatesInViewport(map)
        console.log('fetch')
      }

      );
    }

  }, []);

  // only on first load
  useEffect(() => {

    console.log('view', view)
    //const params = new URLSearchParams(window.location.search);
    const centerLat = params.get('centerLat');
    const centerLng = params.get('centerLng');
    const zoom = params.get('zoom');
    // 
    if (view != 'map') return;


    if (centerLat && centerLng && zoom) {
      console.log("map loaded with params")
      const map = new mapboxgl.Map({
        trackResize: true,

        container: 'map', // The container ID
        style: 'mapbox://styles/mapbox/streets-v11', // The map style URL
        center: [parseFloat(centerLng), parseFloat(centerLat)], // Coordinates of Cairns: [longitude, latitude]
        zoom: parseInt(zoom), // Initial map zoom
      });
      setMap(map)



    } else {
      console.log("map loaded without params")
      const map = new mapboxgl.Map({
        trackResize: true,

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

  }, [view]); // Add locationData as a dependency

  const addMarkers = (map: mapboxgl.Map) => {
    // Remove existing markers
    markers.forEach(marker => marker.remove());

    const newMarkers = Locations.map((location) => {
      const popupElement = document.createElement('div');
      document.body.appendChild(popupElement); // Append to DOM
      const root = createRoot(popupElement); // Create React root
      root.render(
        <CustomPopup
          title={location.estatename}
          price={`${location.pricerange || 'Price not available'}`}
          address={location.fulladdress}
          bedrooms={4}
          bathrooms={2}
          parking={2}
          imageSrc='https://via.placeholder.com/150' // Use actual image URL
          logoSrc='https://via.placeholder.com/50' // Use actual logo URL
        />
      );

      const popup = new mapboxgl.Popup({ offset: 25 }).setDOMContent(popupElement)

      // Create a new HTML element to use as a custom marker
      const el = document.createElement('div');
      // Apply Tailwind CSS classes for styling the custom marker
      el.className = 'w-6 h-6 shadow border-4   border-white rounded-full bg-primary-main';


      el.addEventListener('mouseenter', () => {
        el.classList.remove('bg-primary-main');
        el.classList.add('bg-blue-800');
        el.classList.add('w-7');
        el.classList.add('h-7');

      });

      el.addEventListener('mouseleave', () => {
        if (!popup.isOpen()) { // Only remove hover effect if popup is closed
          el.classList.remove('bg-blue-800');
          el.classList.remove('w-7');
          el.classList.remove('h-7');
          el.classList.add('bg-primary-main');
        }
      });


      const marker = new mapboxgl.Marker(el) // Consider using 'center' as the anchor
        .setLngLat([location.longitude, location.latitude])
        .setPopup(popup)
        .addTo(map);

      popup.on('open', () => {
        el.classList.add('bg-blue-800');
        el.classList.add('w-7');
        el.classList.add('h-7');
      });

      popup.on('close', () => {

        el.classList.remove('bg-blue-800');
        el.classList.remove('w-7');
        el.classList.remove('h-7');
        el.classList.add('bg-primary-main');

      });

      return marker;
    });
    // Update the markers state with the new markers
    setMarkers(newMarkers);
  }

  // add markers seperate 
  useEffect(() => {


    if (map) {
      addMarkers(map);

      map.on('wheel', () => fetchEstatesInViewport(map));
      map.on('dblclick', () => fetchEstatesInViewport(map));

      // Fetch estates in viewport after user-initiated drag ends
      map.on('dragend', () => {
        fetchEstatesInViewport(map);
      });

      return () => {
        // Clean up event listeners
        map.off('wheel', () => fetchEstatesInViewport(map));
        map.off('dblclick', () => fetchEstatesInViewport(map));

        // Handle map zoom change, including scroll wheel zooming
        map.off('dragend', () => fetchEstatesInViewport(map));
      };

    }
  }, [Locations, map, searchQuery, searchParams]);


  const fetchEstatesInViewport = useDebouncedCallback((map: mapboxgl.Map) => {

    if (mapMoved) {
      // Indicate that the map has been moved by the user
      setMapMoved(false); // Reset flag
      return;
    }

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
      setFetchResult(prevState => ({ ...prevState, loading: true })); // Set loading to true before fetching data

      try {
        const { data, loading } = await fetchLocationByCoordAction(swLat, swLng, neLat, neLng);
        setFetchResult({ data, loading });
        setLocations(data);
        setFetchResult(prevState => ({ ...prevState, loading: true })); // Set loading to true before fetching data
      } catch (error) {
        console.error('Error fetching location data:', error);
      }
    }
    if (swLat && swLng && neLat && neLng) {
      updateData()

    }


  }, 400);


  // useEffect to handle map view adjustment on search
  useEffect(() => {
    //setMapMoved(true);
    if (searchQuery && Locations.length > 0) {
      const bounds = new mapboxgl.LngLatBounds();
      Locations.forEach(location => {
        bounds.extend([location.longitude, location.latitude]);
      });

      if (map) {
        map.fitBounds(bounds, {
          padding: 50,
          maxZoom: 10,
          // Adjust these for a smoother transition similar to 'flyTo'
        });

        // Reset mapMoved after a delay to allow for user movements again
        //setTimeout(() => setMapMoved(false), 1000);
      }
    }

  }, [searchQuery, Locations, map]);


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
  }, [view]);


  const toggleView = () => {
    // Toggle the view state
    setView(prevView => prevView === 'map' ? 'list' : 'map');

    // Show or hide the map div based on the new view state
    const mapElement = document.getElementById('map');
    if (mapElement) {
      mapElement.style.display = view === 'map' ? 'block' : 'none';
    }
  };

  useEffect(() => {
    if (view === 'list') {
      // remove params which also ensure map area is not in search bar on switch
      params.delete('swLat');
      params.delete('swLng');
      params.delete('neLat');
      params.delete('neLng');
      params.delete('centerLat');
      params.delete('centerLng');
      params.delete('zoom');
      //router.replace(`${pathname}?${params.toString()}`);
    }
    if (map && view === 'map') { // Assuming 'view' controls visibility
      

      map.resize(); // Resize map to fit new container dimensions
    }

  }
    , [view, map]);



  return (
    <Box sx={{ }}>

      {isMobile ? (
        <>

          {view === 'map' ? (
            <Grid container>
              <Grid item xs={12} md={8} lg={8} style={{ position: 'relative' }}>
                <div id="map" style={{ width: 'auto', height: '100vh' }}>
                  {/* New: TotalDevelopments component */}
                  <Box sx={{ position: 'fixed', left: 0, right: 0, }}>

                    <TotalDevelopments total={totalDevelopments} loading={fetchResult.loading} />
                  </Box>

                </div>

              </Grid>
            </Grid>
          ) : (
            <>
              <div className='px-2' style={{ position: 'sticky', top: '90px', zIndex: 1 }}> {/* Make search bar stick just below the navbar */}
                <Search placeholder="Search Estates" />
              </div>
              <Grid container spacing={2} style={{ padding: '20px' }}>
                {Locations.map((location, index) => (
                  <Grid item xs={12} key={index}>
                    <EstateCard estate={location} loading={fetchResult.loading} /> {/* Pass loading state as a prop */}
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
          <Grid item xs={12} md={8} lg={8} style={{ position: 'relative' }}>
            <div id="map" style={{ width: '100%', height: '100%' }}>
              {/* New: TotalDevelopments component */}
              <TotalDevelopments total={totalDevelopments} loading={fetchResult.loading} />
            </div>
          </Grid>
          <Grid item xs={12} sm={4} md={4} lg={4} style={{ overflowY: 'auto', height: '100vh', padding: '20px' }}>
            <Search placeholder="Search Estates" />
            <Grid className='pt-10' container spacing={2}>
              {Locations.map((location, index) => (
                <Grid item xs={12} sm={12} md={12} lg={6} key={index}>
                  <EstateCard estate={location} loading={fetchResult.loading} /> {/* Pass loading state as a prop */}
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
