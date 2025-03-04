// This script initializes the database and creates required tables
require('dotenv').config();
const mariadb = require('mariadb');

// Create a direct connection with increased timeout
async function initializeDatabase() {
  console.log("🔄 Initializing database...");

  const config = {
    host: process.env.MARIADB_HOST || 'db.tz-gaming.com',
    port: parseInt(process.env.MARIADB_PORT || '3306'),
    user: process.env.MARIADB_USER || 'u161_aKh5jybBkZ',
    password: process.env.MARIADB_PASSWORD || 'm4f!C0Vx^d7zkltPi^m^oD3r',
    database: process.env.MARIADB_DATABASE || 'u161_klarfix',
    connectTimeout: 90000,  // 90 seconds timeout
    trace: true
  };

  console.log(`Connecting to: ${config.host}:${config.port} as ${config.user}`);
  console.log(`Database: ${config.database}`);

  let conn;
  try {
    console.log("Attempting to connect...");
    conn = await mariadb.createConnection(config);
    console.log("✅ Connected successfully!");

    // First test if we have CREATE TABLE privileges
    try {
      console.log('Testing permissions...');
      await conn.query(`
        SELECT 1 FROM INFORMATION_SCHEMA.USER_PRIVILEGES 
        WHERE PRIVILEGE_TYPE = 'CREATE' 
        AND GRANTEE = CONCAT("'", REPLACE(CURRENT_USER(), '@', "'@'"), "'")
      `);
      console.log('Create permissions confirmed.');
    } catch (permErr) {
      console.error('❌ Permission check failed:', permErr);
      console.log('Continuing with limited functionality...');
    }

    // Create tables
    console.log('Creating users table...');
    await conn.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(100) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        name VARCHAR(100) NOT NULL,
        role ENUM('helper', 'client') NOT NULL,
        bio TEXT,
        skills JSON,
        is_online BOOLEAN DEFAULT FALSE,
        show_phone BOOLEAN DEFAULT FALSE,
        phone_number VARCHAR(20),
        rating INT DEFAULT 0,
        verified BOOLEAN DEFAULT FALSE
      )
    `);

    console.log('✅ Database tables created successfully!');
    return true;
  } catch (err) {
    console.error('❌ Error setting up database:', err);

    // If access denied, try to connect with just SELECT privileges
    if (err.code === 'ER_DBACCESS_DENIED_ERROR' || err.errno === 1044) {
      console.log('Attempting read-only connection...');
      try {
        // Try to at least connect without CREATE privileges
        const testConn = await mariadb.createConnection({
          ...config,
          database: 'information_schema'  // Connect to system database first
        });
        console.log('✅ Connected with limited permissions. Your app might work in read-only mode.');
        await testConn.end();
        return true;
      } catch (testErr) {
        console.error('❌ Even limited connection failed:', testErr);
        return false;
      }
    }

    return false;
  } finally {
    if (conn) {
      console.log("Closing connection...");
      await conn.end();
    }
  }
}

// Run the initialization
initializeDatabase()
  .then(success => {
    if (success) {
      console.log('✅ Database initialization completed successfully!');
    } else {
      console.error('❌ Database initialization failed!');
    }
    process.exit(success ? 0 : 1);
  })
  .catch(err => {
    console.error('❌ Unhandled error during database initialization:', err);
    process.exit(1);
  });