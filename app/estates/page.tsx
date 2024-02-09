import { fetchLocation } from '@/app/lib/data';
import EstatesPage from '@/app/ui/estates/EstatePage';
import { fetchSearchLocation } from '@/app/lib/data';
import Pagination from '@/app/ui/invoices/pagination';
import Search from '@/app/ui/search';
import Table from '@/app/ui/invoices/table';
import { CreateInvoice } from '@/app/ui/invoices/buttons';
import { lusitana } from '@/app/ui/fonts';
import { InvoicesTableSkeleton } from '@/app/ui/skeletons';
import { Suspense } from 'react';
import { Metadata } from 'next';


export default async function Page({
  searchParams,
}: {
  searchParams?: {
    query?: string;
    page?: string;
  };
}){


  const test  = await fetchLocation(); 
  const query = searchParams?.query || '';
  const currentPage = Number(searchParams?.page) || 1;
  const data = await fetchSearchLocation(query);

  return (
    <main>
      <div >
        
        {data ? (
          <EstatesPage locationData={data} />
        ) : (
          <EstatesPage locationData={[]} />
        )}
      </div>

    </main>
  );
}
