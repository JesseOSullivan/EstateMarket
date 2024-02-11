'use server';

import { z } from 'zod';
import { sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { SearchResult } from './definitions';
const FormSchema = z.object({
    id: z.string(),
    customerId: z.string(),
    amount: z.coerce.number(),
    status: z.enum(['pending', 'paid']),
    date: z.string(),
});

const CreateInvoice = FormSchema.omit({ id: true, date: true });
const UpdateInvoice = FormSchema.omit({ id: true, date: true });

export async function createInvoice(formData: FormData) {

    const { customerId, amount, status } = CreateInvoice.parse({
        customerId: formData.get('customerId'),
        amount: formData.get('amount'),
        status: formData.get('status'),
    });
    const amountInCents = amount * 100;
    const date = new Date().toISOString().split('T')[0];

    try {
        await sql`
    INSERT INTO invoices (customer_id, amount, status, date)
    VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
  `;
    }


    catch (error) {
        return {
            message: 'Something went wrong'
        }
    }
    revalidatePath('/dashboard/invoices');
    redirect('/dashboard/invoices');

}

export async function updateInvoice(id: string, formData: FormData) {
    const { customerId, amount, status } = UpdateInvoice.parse({
        customerId: formData.get('customerId'),
        amount: formData.get('amount'),
        status: formData.get('status'),
    });

    const amountInCents = amount * 100;
    try {
        await sql`
      UPDATE invoices
      SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status}
      WHERE id = ${id}
    `;
    }
    catch {
        return {
            message: 'Something went wrong'
        }
    }
    revalidatePath('/dashboard/invoices');
    redirect('/dashboard/invoices');
}
export async function deleteInvoice(id: string) {

    try {
      await sql`DELETE FROM invoices WHERE id = ${id}`;
      revalidatePath('/dashboard/invoices');
      return { message: 'Deleted Invoice.' };
    } catch (error) {
      return { message: 'Database Error: Failed to Delete Invoice.' };
    }
  }

  const locationCache = new Map<string, {data: any, box: Coordinates}>();
  interface Coordinates {
    swLat: number;
    swLng: number;
    neLat: number;
    neLng: number;
  }
  
  function generateCacheKey(box: Coordinates, precision = 1): string {
    // Consider broadening the scope here if needed
    const round = (num: number) => Math.round(num * Math.pow(10, precision)) / Math.pow(10, precision);
    return `locations-${round(box.swLat)}-${round(box.swLng)}-${round(box.neLat)}-${round(box.neLng)}`;
  }
  function isWithinCachedBox(requested: Coordinates, cachedBox: Coordinates): boolean {
    return requested.swLat >= cachedBox.swLat && requested.swLng >= cachedBox.swLng &&
           requested.neLat <= cachedBox.neLat && requested.neLng <= cachedBox.neLng;
  }
  function resetCache() {
    locationCache.clear();
    console.log('Cache has been reset.');
  }
  
  export async function fetchLocationByCoordAction(swLat: number, swLng: number, neLat: number, neLng: number, ) {
    let cacheHit = false;
    let cachedResult;
    //resetCache()
    locationCache.forEach((value, key) => {
      if (isWithinCachedBox({swLat, swLng, neLat, neLng}, value.box)) {
        console.log(`Cache hit for box: ${key}`);
        cacheHit = true;
        cachedResult = value.data;
        // Early exit from loop if a cache hit is found
        return;
      }
    });

    if (cacheHit) {
        return cachedResult;
    }   
    
else {
    console.log('Cache miss. Querying database...');
    const result = await sql<SearchResult>`
      SELECT
        e.estateid,
        e.estatename,
        e.status,
        e.developerid,
        d.name AS developername, 
        e.locationid,
        e.pricerange,
        e.totalnewhomes,
        l.addressid,
        l.citycouncil,
        l.areasize,
        l.growthregion,
        l.latitude,
        l.longitude,
        a.fulladdress,
        a.streetnumber,
        a.streetname,
        a.suburb,
        a.state,
        a.postcode,
        a.country
      FROM
        estate e
      INNER JOIN
        location l ON e.locationid = l.locationid
      INNER JOIN
        developer d ON e.developerid = d.developerid 
      INNER JOIN
        address a ON l.addressid = a.addressid
      WHERE 
        l.latitude BETWEEN ${swLat} AND ${neLat} AND
        l.longitude BETWEEN ${swLng} AND ${neLng};
    `;
    const box: Coordinates = {swLat, swLng, neLat, neLng};
    const cacheKey = generateCacheKey(box);
    locationCache.set(cacheKey, {data: result, box});
    return result;
  }
}
  