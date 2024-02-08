const bcrypt = require('bcrypt');
const { db } = require('@vercel/postgres');

// Function to drop all tables
async function dropAllTables() {
  const client = await db.connect();
  try {
    // Drop tables in reverse order to avoid issues with foreign key constraints
    await client.query(`
      DROP TABLE IF EXISTS userinterests, form, account, analytics, userleads, userinteractions, userfavorites, "user", property, estatetags, tags, estate, location, address, developer CASCADE;
    `);
    console.log('All tables dropped successfully.');
  } catch (err) {
    console.error('Error dropping tables:', err);
  } finally {
    await client.end();
  }
}

// Function to create tables
async function createTables() {
  const client = await db.connect();
  try {
    // Creating tables, ensuring to create them in the correct order to respect foreign key dependencies

    // Developer
    await client.query(`
      CREATE TABLE IF NOT EXISTS developer (
        developerid SERIAL PRIMARY KEY,
        name VARCHAR(255) UNIQUE
      );
    `);

    // Address
    await client.query(`
      CREATE TABLE IF NOT EXISTS address (
        addressid SERIAL PRIMARY KEY,
        fulladdress VARCHAR(255),
        streetnumber VARCHAR(255),
        streetname VARCHAR(255),
        suburb VARCHAR(255),
        city VARCHAR(255),
        state VARCHAR(255),
        postcode VARCHAR(255),
        country VARCHAR(255)
      );
    `);

    // Location
    await client.query(`
      CREATE TABLE IF NOT EXISTS location (
        locationid SERIAL PRIMARY KEY,
        addressid INTEGER REFERENCES address(addressid),
        citycouncil VARCHAR(255),
        areasize DECIMAL,
        growthregion VARCHAR(255),
        distanceto VARCHAR(255),
        latitude DECIMAL,
        longitude DECIMAL
      );
    `);

    // Estate
    await client.query(`
      CREATE TABLE IF NOT EXISTS estate (
        estateid SERIAL PRIMARY KEY,
        estatename VARCHAR(255),
        status VARCHAR(255),
        description TEXT,
        developerid INTEGER REFERENCES developer(developerid),
        locationid INTEGER REFERENCES location(locationid),
        pricerange DECIMAL,
        totalnewhomes INTEGER,
        url VARCHAR(255),
        othernames VARCHAR(255),
        landsizes VARCHAR(255)
      );
    `);

    // Tags
    await client.query(`
      CREATE TABLE IF NOT EXISTS tags (
        tagid SERIAL PRIMARY KEY,
        tagname VARCHAR(255)
      );
    `);

    // EstateTags
    await client.query(`
      CREATE TABLE IF NOT EXISTS estatetags (
        estateid INTEGER REFERENCES estate(estateid),
        tagid INTEGER REFERENCES tags(tagid),
        PRIMARY KEY (estateid, tagid)
      );
    `);

    // Property
    await client.query(`
      CREATE TABLE IF NOT EXISTS property (
        propertyid SERIAL PRIMARY KEY,
        estateid INTEGER REFERENCES estate(estateid),
        houseprice DECIMAL,
        bedrooms INT,
        bathrooms INT,
        carspaces INT,
        images TEXT
      );
    `);

    // User
    await client.query(`
      CREATE TABLE IF NOT EXISTS "user" (
        userid SERIAL PRIMARY KEY,
        username VARCHAR(255) UNIQUE,
        email VARCHAR(255) UNIQUE,
        password VARCHAR(255),
        first_name VARCHAR(255),
        lastname VARCHAR(255),
        phonenumber VARCHAR(20),
        registrationdate TIMESTAMP,
        locationid INTEGER REFERENCES location(locationid)
      );
    `);

    // UserFavorites
    await client.query(`
      CREATE TABLE IF NOT EXISTS userfavorites (
        userfavoriteid SERIAL PRIMARY KEY,
        userid INTEGER REFERENCES "user"(userid),
        estateid INTEGER REFERENCES estate(estateid)
      );
    `);

    // UserInteractions
    await client.query(`
      CREATE TABLE IF NOT EXISTS userinteractions (
        userinteractionid SERIAL PRIMARY KEY,
        userid INTEGER REFERENCES "user"(userid),
        estateid INTEGER REFERENCES estate(estateid),
        interaction_type VARCHAR(255),
        interaction_date TIMESTAMP
      );
    `);

    // UserLeads
    await client.query(`
      CREATE TABLE IF NOT EXISTS userleads (
        userleadid SERIAL PRIMARY KEY,
        userid INTEGER REFERENCES "user"(userid),
        estateid INTEGER REFERENCES estate(estateid),
        message TEXT,
        leadstatus VARCHAR(255),
        leaddate TIMESTAMP
      );
    `);

    // Analytics
    await client.query(`
      CREATE TABLE IF NOT EXISTS analytics (
        analyticsid SERIAL PRIMARY KEY,
        userid INTEGER REFERENCES "user"(userid),
        pagevisited VARCHAR(255),
        action_taken VARCHAR(255),
        timestamp TIMESTAMP
      );
    `);

    // Account

    await client.query(`
      CREATE TABLE IF NOT EXISTS account (
        accountid SERIAL PRIMARY KEY,
        userid INTEGER REFERENCES "user"(userid),
        account_type VARCHAR(255),
        expiration_date TIMESTAMP
      );
    `);

    // Form
    await client.query(`
      CREATE TABLE IF NOT EXISTS form (
        formid SERIAL PRIMARY KEY,
        userid INTEGER REFERENCES "user"(userid),
        formtype VARCHAR(255),
        formdata TEXT,
        submission_date TIMESTAMP
      );
    `);

    // UserInterests
    await client.query(`
      CREATE TABLE IF NOT EXISTS userinterests (
        user_interest_id SERIAL PRIMARY KEY,
        userid INTEGER REFERENCES "user"(userid),
        locationid INTEGER REFERENCES location(locationid),
        interest_type VARCHAR(255),
        property_type VARCHAR(255),
        minbudget DECIMAL,
        maxbudget DECIMAL,
        additionalpreferences TEXT
      );
    `);

    console.log('All tables created successfully.');
  } catch (err) {
    console.error('Error creating tables:', err);
  } finally {
    await client.end();
  }
}

async function resetDatabase() {
  await dropAllTables();
  await createTables();
  // Optionally, call seed functions here if needed
}

resetDatabase().catch(console.error);
