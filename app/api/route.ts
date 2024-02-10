

import { NextResponse } from "next/server"
import { fetchLocationByCoord } from "../lib/data"
export async function GET() {
    
  
  return Response.json({ message: 'Hello from Next.js!' })
}

/*import { Pool } from 'pg';
import { Request, Response } from 'express'; // Import the Request and Response types from 'express'

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

export default async function handler(req: Request, res: Response) {
    try {
        const client = await pool.connect();
        const result = await client.query('SELECT * FROM location');
        const data = result.rows;
        client.release();
        console.log(data)
        res.status(200).send(data); // Use the 'send' method instead of 'json' to send the JSON response
    } catch (err) {
        res.status(500).json({ message: 'Internal server error' });
    }
}
*/