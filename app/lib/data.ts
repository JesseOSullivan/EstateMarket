import { sql } from '@vercel/postgres';
import {
  CustomerField,
  CustomersTableType,
  InvoiceForm,
  InvoicesTable,
  LatestInvoiceRaw,
  User,
  Revenue,
  locationDataType,
  SearchResult
} from './definitions';
import { formatCurrency } from './utils';
import { unstable_noStore as noStore } from 'next/cache';
import { createClient } from '@vercel/postgres';



export async function fetchSearchLocation(searchTerms: string[]) {
  try {
    console.log('Fetching search location data...');
    if (searchTerms && searchTerms.length > 0) {
      console.log(searchTerms);

      const client = createClient(); // Create a new client
      await client.connect(); // Connect to the database

      try {
        // Construct the WHERE clause dynamically based on the search terms
        const whereClause = searchTerms.map((term, index) => `e.estatename ILIKE '%' || $${index + 1} || '%' OR
          d.name ILIKE '%' || $${index + 1} || '%' OR
          a.fulladdress ILIKE '%' || $${index + 1} || '%' OR
          l.growthregion ILIKE '%' || $${index + 1} || '%'`).join(' OR ');

        // Construct the complete SQL query
        const query = `
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
            ${whereClause}
        `;

        // Execute the query
        const result = await client.query(query, searchTerms);
        return result.rows;
      } finally {
        await client.end(); // Disconnect from the database
      }
    } else {
      // If no search terms provided, return empty array or handle as appropriate
      return [];
    }
  } catch (error) {
    console.error('Error fetching search location data:', error);
    throw error;
  }
}



export async function fetchLocationByCoord(swLat: number, swLng: number, neLat: number, neLng: number) {
  try {
    console.log('Fetching location data by coordinates...');
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
    return result.rows;
  } catch (error) {
    console.error('Error fetching location data by coordinates:', error);
    throw error;
  }
}




export async function fetchLocation() {
  try {
    // We artificially delay a response for demo purposes.
    console.log('Fetching Location  data...');
 
    const data = await sql<locationDataType>`SELECT * FROM location`;
 
    return data.rows;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch Location data.');
  }
}



export async function fetchRevenue() {
  try {
    // We artificially delay a response for demo purposes.
    // Don't do this in production :)
    console.log('Fetching revenue data...');
    await new Promise((resolve) => setTimeout(resolve, 3000));
 
    const data = await sql<Revenue>`SELECT * FROM revenue`;
 
    console.log('Data fetch completed after 3 seconds.');
 
    return data.rows;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch revenue data.');
  }
}

export async function fetchLatestInvoices() {
  noStore();

  try {
    const data = await sql<LatestInvoiceRaw>`
      SELECT invoices.amount, customers.name, customers.image_url, customers.email, invoices.id
      FROM invoices
      JOIN customers ON invoices.customer_id = customers.id
      ORDER BY invoices.date DESC
      LIMIT 5`;

    const latestInvoices = data.rows.map((invoice) => ({
      ...invoice,
      amount: formatCurrency(invoice.amount),
    }));
    return latestInvoices;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch the latest invoices.');
  }
}

export async function fetchCardData() {
  noStore();

  try {
    // You can probably combine these into a single SQL query
    // However, we are intentionally splitting them to demonstrate
    // how to initialize multiple queries in parallel with JS.
    const invoiceCountPromise = sql`SELECT COUNT(*) FROM invoices`;
    const customerCountPromise = sql`SELECT COUNT(*) FROM customers`;
    const invoiceStatusPromise = sql`SELECT
         SUM(CASE WHEN status = 'paid' THEN amount ELSE 0 END) AS "paid",
         SUM(CASE WHEN status = 'pending' THEN amount ELSE 0 END) AS "pending"
         FROM invoices`;

    const data = await Promise.all([
      invoiceCountPromise,
      customerCountPromise,
      invoiceStatusPromise,
    ]);

    const numberOfInvoices = Number(data[0].rows[0].count ?? '0');
    const numberOfCustomers = Number(data[1].rows[0].count ?? '0');
    const totalPaidInvoices = formatCurrency(data[2].rows[0].paid ?? '0');
    const totalPendingInvoices = formatCurrency(data[2].rows[0].pending ?? '0');

    return {
      numberOfCustomers,
      numberOfInvoices,
      totalPaidInvoices,
      totalPendingInvoices,
    };
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch card data.');
  }
}

const ITEMS_PER_PAGE = 6;
export async function fetchFilteredInvoices(
  query: string,
  currentPage: number,
) {
  noStore();

  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    const invoices = await sql<InvoicesTable>`
      SELECT
        invoices.id,
        invoices.amount,
        invoices.date,
        invoices.status,
        customers.name,
        customers.email,
        customers.image_url
      FROM invoices
      JOIN customers ON invoices.customer_id = customers.id
      WHERE
        customers.name ILIKE ${`%${query}%`} OR
        customers.email ILIKE ${`%${query}%`} OR
        invoices.amount::text ILIKE ${`%${query}%`} OR
        invoices.date::text ILIKE ${`%${query}%`} OR
        invoices.status ILIKE ${`%${query}%`}
      ORDER BY invoices.date DESC
      LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
    `;

    return invoices.rows;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch invoices.');
  }
}

export async function fetchInvoicesPages(query: string) {
  noStore();

  try {
    const count = await sql`SELECT COUNT(*)
    FROM invoices
    JOIN customers ON invoices.customer_id = customers.id
    WHERE
      customers.name ILIKE ${`%${query}%`} OR
      customers.email ILIKE ${`%${query}%`} OR
      invoices.amount::text ILIKE ${`%${query}%`} OR
      invoices.date::text ILIKE ${`%${query}%`} OR
      invoices.status ILIKE ${`%${query}%`}
  `;

    const totalPages = Math.ceil(Number(count.rows[0].count) / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch total number of invoices.');
  }
}

export async function fetchInvoiceById(id: string) {
  noStore();

  try {
    const data = await sql<InvoiceForm>`
      SELECT
        invoices.id,
        invoices.customer_id,
        invoices.amount,
        invoices.status
      FROM invoices
      WHERE invoices.id = ${id};
    `;

    const invoice = data.rows.map((invoice) => ({
      ...invoice,
      // Convert amount from cents to dollars
      amount: invoice.amount / 100,
    }));

    console.log(invoice); // Invoice is an empty array []
    return invoice[0];
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch invoice.');
  }
}

export async function fetchCustomers() {
  
  try {
    const data = await sql<CustomerField>`
      SELECT
        id,
        name
      FROM customers
      ORDER BY name ASC
    `;

    const customers = data.rows;
    return customers;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch all customers.');
  }
}

export async function fetchFilteredCustomers(query: string) {
  try {
    const data = await sql<CustomersTableType>`
		SELECT
		  customers.id,
		  customers.name,
		  customers.email,
		  customers.image_url,
		  COUNT(invoices.id) AS total_invoices,
		  SUM(CASE WHEN invoices.status = 'pending' THEN invoices.amount ELSE 0 END) AS total_pending,
		  SUM(CASE WHEN invoices.status = 'paid' THEN invoices.amount ELSE 0 END) AS total_paid
		FROM customers
		LEFT JOIN invoices ON customers.id = invoices.customer_id
		WHERE
		  customers.name ILIKE ${`%${query}%`} OR
        customers.email ILIKE ${`%${query}%`}
		GROUP BY customers.id, customers.name, customers.email, customers.image_url
		ORDER BY customers.name ASC
	  `;

    const customers = data.rows.map((customer) => ({
      ...customer,
      total_pending: formatCurrency(customer.total_pending),
      total_paid: formatCurrency(customer.total_paid),
    }));

    return customers;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch customer table.');
  }
}

export async function getUser(email: string) {
  try {
    const user = await sql`SELECT * FROM users WHERE email=${email}`;
    return user.rows[0] as User;
  } catch (error) {
    console.error('Failed to fetch user:', error);
    throw new Error('Failed to fetch user.');
  }
}



