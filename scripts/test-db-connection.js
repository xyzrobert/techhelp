
const mariadb = require('mariadb');
require('dotenv').config();

async function testConnection() {
  console.log("Testing database connection with settings:");
  console.log(`Host: ${process.env.MARIADB_HOST}`);
  console.log(`Port: ${process.env.MARIADB_PORT}`);
  console.log(`User: ${process.env.MARIADB_USER}`);
  console.log(`Database: ${process.env.MARIADB_DATABASE}`);
  
  // Create a connection with increased timeout
  let conn;
  try {
    console.log("Attempting to connect...");
    conn = await mariadb.createConnection({
      host: process.env.MARIADB_HOST,
      port: parseInt(process.env.MARIADB_PORT || '3306'),
      user: process.env.MARIADB_USER,
      password: process.env.MARIADB_PASSWORD,
      database: process.env.MARIADB_DATABASE,
      connectTimeout: 30000 // 30 seconds timeout
    });
    console.log("Connected successfully!");
    const rows = await conn.query("SELECT 1 as val");
    console.log("Query result:", rows);
    console.log("Database connection is working!");
  } catch (err) {
    console.error("Connection error:", err);
  } finally {
    if (conn) conn.release();
    process.exit(0);
  }
}

testConnection();
