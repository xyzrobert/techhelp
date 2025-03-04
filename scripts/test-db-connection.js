
import mariadb from 'mariadb';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Initialize dotenv
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

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
      host: process.env.MARIADB_HOST || 'db.tz-gaming.com',
      port: parseInt(process.env.MARIADB_PORT || '3306'),
      user: process.env.MARIADB_USER || 'u161_aKh5jybBkZ',
      password: process.env.MARIADB_PASSWORD || 'm4f!C0Vx^d7zkltPi^m^oD3r',
      database: process.env.MARIADB_DATABASE || 'u161_klarfix',
      connectTimeout: 60000 // 60 seconds timeout
    });
    console.log("Connected successfully!");
    const rows = await conn.query("SELECT 1 as val");
    console.log("Query result:", rows);
    console.log("Database connection is working!");
  } catch (err) {
    console.error("Connection error:", err);
  } finally {
    if (conn) await conn.end();
    process.exit(0);
  }
}

testConnection();
