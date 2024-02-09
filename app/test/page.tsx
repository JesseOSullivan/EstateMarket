import { fetchLocation } from '@/app/lib/data';
import EstatesPage from '../estates/page';
import {
    locationDataType
  } from '@/app/lib/definitions';
  
export default async function Page() {
  const test  = await fetchLocation(); 
      
  console.log(JSON.stringify(test))
  return (
    <main>
      <h1 className={`mb-4 text-xl md:text-2xl`}>
        
      <EstatesPage locationData={test} />
      </h1>

    </main>
  );
}
