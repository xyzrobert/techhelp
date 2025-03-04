
require('dotenv').config();
const mariadb = require('mariadb');

async function testConnection() {
  // Sanitized for display
  console.log("Database credentials:");
  console.log(`Host: ${process.env.MARIADB_HOST}`);
  console.log(`Port: ${process.env.MARIADB_PORT}`);
  console.log(`User: ${process.env.MARIADB_USER}`);
  console.log(`Database: ${process.env.MARIADB_DATABASE}`);
  
  const config = {
    host: process.env.MARIADB_HOST || 'db.tz-gaming.com',
    port: parseInt(process.env.MARIADB_PORT || '3306'),
    user: process.env.MARIADB_USER || 'u161_aKh5jybBkZ',
    password: process.env.MARIADB_PASSWORD || 'm4f!C0Vx^d7zkltPi^m^oD3r',
    database: process.env.MARIADB_DATABASE || 'u161_klarfix',
    connectTimeout: 30000
  };

  let conn;
  try {
    console.log("Connecting to MySQL/MariaDB...");
    conn = await mariadb.createConnection(config);
    console.log("✅ Connection successful!");
    
    // Test a basic query
    try {
      const result = await conn.query("SELECT 'Connection test successful' as message");
      console.log("Query result:", result[0].message);
      
      // Test for table existence
      const tables = await conn.query("SHOW TABLES");
      console.log("Database tables:", tables.map(t => Object.values(t)[0]).join(', '));
    } catch (queryErr) {
      console.error("Query error:", queryErr);
    }
    
    return true;
  } catch (err) {
    console.error("❌ Connection error:", err);
    
    if (err.code === 'ER_DBACCESS_DENIED_ERROR') {
      console.log("This is a permission issue. Make sure your database user has appropriate permissions.");
    } else if (err.code === 'ETIMEDOUT' || err.code === 'ECONNREFUSED') {
      console.log("This appears to be a network connectivity issue. Check if:");
      console.log("- The database server is running and accessible");
      console.log("- Your firewall/network allows connections to the database port");
      console.log("- The hostname and port are correct");
    }
    
    return false;
  } finally {
    if (conn) {
      console.log("Closing connection...");
      await conn.end();
    }
  }
}

testConnection()
  .then(success => {
    if (success) {
      console.log("Database connection test passed!");
    } else {
      console.error("Database connection test failed!");
    }
    process.exit(success ? 0 : 1);
  });
