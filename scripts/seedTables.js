const bcrypt = require('bcrypt');
const { db } = require('@vercel/postgres');

// Function to drop all tables
async function dropAllTables() {
  const client = await db.connect();
  try {
    // Drop tables in reverse order to avoid issues with foreign key constraints
    await client.query(`
      DROP TABLE IF EXISTS userinterests, form, account, analytics, userleads, userinteractions, userfavorites, personal_details, "user", property, estatetags, tags, estate, location, address, developer CASCADE;
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
    // Creating tables
    await client.query(`
      CREATE TABLE IF NOT EXISTS developer (
        developerid SERIAL PRIMARY KEY,
        name VARCHAR(255) UNIQUE,
        email VARCHAR(255),
        phone VARCHAR(255),
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS address (
        addressid SERIAL PRIMARY KEY,
        fulladdress VARCHAR(255),
        streetnumber VARCHAR(255),
        streetname VARCHAR(255),
        suburb VARCHAR(255),
        state VARCHAR(255),
        postcode VARCHAR(255),
        country VARCHAR(255)
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS location (
        locationid SERIAL PRIMARY KEY,
        addressid INT REFERENCES address(addressid),
        citycouncil VARCHAR(255),
        areasize DECIMAL,
        growthregion VARCHAR(255),
        latitude DECIMAL,
        longitude DECIMAL
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS estate (
        estateid SERIAL PRIMARY KEY,
        estatename VARCHAR(255),
        status VARCHAR(255),
        developerid INT REFERENCES developer(developerid),
        locationid INT REFERENCES location(locationid),
        pricerange int,
        totalnewhomes int,
        starting_landsizes int,
        starting_land_price int,
        starting_house_price int
      );
    `);


    await client.query(`
      CREATE TABLE IF NOT EXISTS tags (
        tagid SERIAL PRIMARY KEY,
        tagname VARCHAR(255)
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS estatetags (
        estateid INT REFERENCES estate(estateid),
        tagid INT REFERENCES tags(tagid),
        PRIMARY KEY (estateid, tagid)
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS property (
        propertyid SERIAL PRIMARY KEY,
        estateid INT REFERENCES estate(estateid),
        name VARCHAR(255),
        frontage DECIMAL,
        price DECIMAL,
        depth DECIMAL
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS land (
        propertyid INT REFERENCES property(propertyid),
        landsize INT,
        PRIMARY KEY (propertyid)
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS townhouse (
        propertyid INT REFERENCES property(propertyid),
        landsize VARCHAR(255),
        buildingsize INT,
        bedrooms INT,
        bathrooms DECIMAL,
        carspaces DECIMAL,
        floors INT,
        builder VARCHAR(255),
        PRIMARY KEY (propertyid)
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS housenland (
        propertyid INT REFERENCES property(propertyid),
        landsize VARCHAR(255),
        buildingsize INT,
        bedrooms INT,
        bathrooms DECIMAL,
        carspaces DECIMAL,
        floors INT,
        builder VARCHAR(255),
        PRIMARY KEY (propertyid)
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS "user" (
        userid SERIAL PRIMARY KEY,
        username VARCHAR(255) UNIQUE,
        email VARCHAR(255) UNIQUE
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS personal_details (
        userid INT PRIMARY KEY REFERENCES "user"(userid),
        first_name VARCHAR(255),
        last_name VARCHAR(255),
        phonenumber VARCHAR(20)
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS account (
        accountid SERIAL PRIMARY KEY,
        userid INT REFERENCES "user"(userid),
        account_type VARCHAR(255),
        registrationdate TIMESTAMP
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS userfavorites (
        userfavoriteid SERIAL PRIMARY KEY,
        accountid INT REFERENCES account(accountid),
        estateid INT REFERENCES estate(estateid)
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS userleads (
        userleadid SERIAL PRIMARY KEY,
        userid INT REFERENCES "user"(userid),
        interactiontype VARCHAR(255),
        leaddate TIMESTAMP
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS estateinteractions (
        estateinteractionid SERIAL PRIMARY KEY,
        userleadid INT REFERENCES userleads(userleadid),
        estateid INT REFERENCES estate(estateid),
        specificinteractiontype VARCHAR(255)
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS propertyinteractions (
        propertyinteractionid SERIAL PRIMARY KEY,
        userleadid INT REFERENCES userleads(userleadid),
        propertyid INT REFERENCES property(propertyid),
        specificinteractiontype VARCHAR(255)
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS analytics (
        analyticsid SERIAL PRIMARY KEY,
        userid INT REFERENCES "user"(userid),
        pagevisited VARCHAR(255),
        action_taken VARCHAR(255),
        timestamp TIMESTAMP
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS page_visited (
        page_id SERIAL PRIMARY KEY,
        analyticsid INT REFERENCES analytics(analyticsid),
        page_name VARCHAR(255),
        timestamp TIMESTAMP
      );
    `);

    await client.query(`
    CREATE TABLE IF NOT EXISTS userforms (
      userformid SERIAL PRIMARY KEY,
      formtype VARCHAR(255),
      formdata JSON,
      submissiondate TIMESTAMP
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
