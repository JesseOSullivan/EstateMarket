const { db } = require('@vercel/postgres');
const fs = require('fs');
const csv = require('csv-parser');

// Function to insert data into developer table
async function insertDevelopers(client, data) {
  for (const item of data) {
    const developerName = item['Developer'];
    try {
      // Insert data into the developer table
      await client.query(
        'INSERT INTO developer (name) VALUES ($1) ON CONFLICT (name) DO NOTHING',
        [developerName]
      );
    } catch (error) {
      console.error('Error inserting developer:', error);
    }
  }
}

async function insertEstates(client, data) {
    for (const item of data) {
      const estateName = item['Estate Name'];
      const status = item['Status'];
      const description = item['description'];
      const developerName = item['Developer'];
      const address = item['Address']; // Assuming you have an address field or similar identifier

      try {
        // Get the developer id based on developer name
        const developerResult = await client.query(
            'SELECT developerid FROM developer WHERE name = $1',
            [developerName]
        );

        let developerId = null;
        if (developerResult.rows.length > 0) {
            developerId = developerResult.rows[0].developerid;
        }

        // Get the location id based on address or other unique location identifier
        const locationResult = await client.query(
            'SELECT locationid FROM location JOIN address ON location.addressid = address.addressid WHERE address.fulladdress = $1',
            [address]
        );

        let locationId = null;
        if (locationResult.rows.length > 0) {
            locationId = locationResult.rows[0].locationid;
        }

        // Insert data into the estate table, including locationid
        if (developerId && locationId) { // Ensure both IDs are found
            await client.query(
                'INSERT INTO estate (estatename, status, description, developerid, locationid) VALUES ($1, $2, $3, $4, $5)',
                [estateName, status, description, developerId, locationId]
            );
        }
    } catch (error) {
        console.error('Error inserting estate:', error);
    }
}
}


// Function to insert data into the location table
async function insertLocations(client, data) {
    for (const item of data) {
      const {
        Address,
        'Street Number': StreetNumber,
        'Street Name': StreetName,
        "Growth Region": GrowthRegion, // Added "Growth Region"
        'Distance To': DistanceTo,
        Latitude,
        Longitude,
        "Area size": AreaSize,
      } = item;
      try {
        // Get the address id based on full address
        const addressResult = await client.query(
          'SELECT addressid FROM address WHERE fulladdress = $1',
          [Address]
        );
  
        if (addressResult.rows.length > 0) {
          const addressId = addressResult.rows[0].addressid;
  
          // Insert data into the location table
          await client.query(
            'INSERT INTO location (addressid, growthregion, areasize, distanceto, latitude, longitude) VALUES ($1, $2, $3, $4, $5, $6)',
            [addressId, GrowthRegion, AreaSize, DistanceTo, Latitude, Longitude]
          );
        }
      } catch (error) {
        console.error('Error inserting location:', error);
      }
    }
  }
  
  async function insertAddresses(client, data) {
    for (const item of data) {
      const {
        Address,
        'Street Number': fallbackStreetNumber,
        'Street Name': fallbackStreetName,
        Suburb: fallbackSuburb,
        City,
        State: fallbackState,
        Postcode: fallbackPostcode,
        Country,
      } = item;
  
      let streetNumber = fallbackStreetNumber;
      let streetName = fallbackStreetName;
      let suburb = fallbackSuburb;
      let state = fallbackState;
      let postcode = fallbackPostcode;
  
      // Try to parse address if not N/A
      if (Address !== "N/A") {
        const parts = Address.split(", ");
        streetName = parts[0];
  
        // Regex for state and postcode (e.g., "QLD 4870")
        const statePostcodeRegex = /(\b[A-Z]{2,3}\b) (\d{4})$/;
        const match = Address.match(statePostcodeRegex);
        
        const suburbRegex = /, (.*?)(?: QLD| NSW| VIC| TAS| SA| WA| NT| ACT) \d{4}/;
        const  suburbmatch = Address.match(suburbRegex);
        const suburb = suburbmatch ? suburbmatch[1].trim() : fallbackSuburb; // Extracted suburb or fallback
        console.log("test " + suburb)
        if (match) {
          state = match[1];
          postcode = match[2];
        }
  
        // Handle street number and name
        // This is simplistic and may need refinement for complex addresses
        const numberNameRegex = /^(\d+[\-\d\/]*\s)?(.+?),/;
        const numberNameMatch = Address.match(numberNameRegex);
        if (numberNameMatch) {
          streetNumber = numberNameMatch[1] ? numberNameMatch[1].trim() : fallbackStreetNumber;
          streetName = numberNameMatch[2] ? numberNameMatch[2] : fallbackStreetName;
        }
      }
  
      try {
        // Insert data into the address table
        await client.query(
          'INSERT INTO address (fulladdress, streetnumber, streetname, suburb, city, state, postcode, country) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) ON CONFLICT (fulladdress) DO NOTHING',
          [Address, streetNumber, streetName, suburb, City, state, postcode, Country]
        );
      } catch (error) {
        console.error('Error inserting address:', error);
      }
    }
  }
    
async function main() {
  const client = await db.connect();

  try {
    // Read data from the CSV file
    const data = [];
    fs.createReadStream('scripts/scraped_data.csv')
      .pipe(csv())
      .on('data', (row) => {
        data.push(row);
      })
      .on('end', async () => {
        // Insert data into developer table
        //await insertDevelopers(client, data);
        // Insert data into address table
        //await insertAddresses(client, data);
        await insertLocations(client, data)

        // Continue with inserting data into other tables (location, estate, tags, estatetags, property, user, etc.)
        // You can create similar functions for each table and call them here
        //await insertEstates(client, data);

        console.log('Data insertion completed.');
        client.end();
      });
  } catch (error) {
    console.error('An error occurred:', error);
  }
}

main().catch((err) => {
  console.error('An error occurred:', err);
});
