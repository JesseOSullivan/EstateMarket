import { fetchLocation } from '@/app/lib/data';
import EstatesPage from '@/app/ui/estates/EstatePage';
import { fetchLocationByCoord, fetchSearchLocation } from '@/app/lib/data';
import { SearchResult } from '../lib/definitions';


export default async function Page({
  searchParams,
}: {
  searchParams?: {
    query?: string;
    page?: string;
    swLat?: string;
    swLng?: string;
    neLat?: string;
    neLng?: string;
    
  };
}){
  let locationData: SearchResult[] = [];

  if (searchParams?.query) {
    // Handle search by query
    const searchTerms = searchParams?.query.split(',');
    locationData = await fetchSearchLocation(searchTerms) ?? [];
    //const searchDataArray = await Promise.all(searchDataPromises);
    //locationData = searchDataArray.flat();
  } else if (searchParams?.swLat &&	 searchParams?.neLat &&	 searchParams?.swLng && searchParams?.neLng) {
    // Handle search by map coordinates

    const { swLat, swLng, neLat, neLng } = searchParams;
    
    locationData = await fetchLocationByCoord(parseFloat(swLat), parseFloat(swLng), parseFloat(neLat), parseFloat(neLng));
  }

  
  return (
    <main>
      <div >
        
        {locationData ? (
          <EstatesPage locationData={locationData}
          
          />
        ) : (
          <EstatesPage locationData={[]} />
        )}
      </div>

    </main>
  );
}
