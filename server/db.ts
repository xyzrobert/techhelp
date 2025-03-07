import { drizzle } from 'drizzle-orm/neon-serverless';
import { neon, neonConfig } from '@neondatabase/serverless';
import * as schema from '../shared/schema';
import ws from 'ws';

// Configure neon for Node.js environment
neonConfig.webSocketConstructor = ws;
neonConfig.fetchConnectionCache = true;

// Get database URL from environment
const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is required');
}

// Create the neon SQL client
const sql = neon(DATABASE_URL);

// Create the database client with schema
console.log('Creating database connection...');
export const db = drizzle(DATABASE_URL, { schema });

// Test the connection
export async function testConnection() {
  try {
    console.log('Testing database connection...');
    const result = await sql`SELECT version()`;
    console.log('✅ Database connection successful');
    console.log('Database connection verified');
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    return false;
  }
} 