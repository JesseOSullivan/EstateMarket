import { fetchLocation } from '@/app/lib/data';
import EstatesPage from '@/app/ui/estates/EstatePage';
import {
    locationDataType
  } from '@/app/lib/definitions';
  
export default async function Page() {
  const test  = await fetchLocation(); 
      
  console.log(JSON.stringify(test))
  return (
    <main>
      <div >
        
      <EstatesPage locationData={test} />
      </div>

    </main>
  );
}
