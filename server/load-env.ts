import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// ES Module path resolution
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// Load environment variables
const result = dotenv.config({ path: path.join(rootDir, '.env') });

if (result.error) {
  console.error('Error loading .env file:', result.error);
  process.exit(1);
}

// Verify required environment variables
const requiredEnvVars = ['DATABASE_URL'];
const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

if (missingEnvVars.length > 0) {
  console.error('Missing required environment variables:', missingEnvVars.join(', '));
  console.error('Current environment variables:', Object.keys(process.env).join(', '));
  process.exit(1);
}

// Debug logging
console.log('Environment variables loaded:', {
  DATABASE_URL: process.env.DATABASE_URL ? '[Set]' : '[Not set]',
  NODE_ENV: process.env.NODE_ENV || 'development'
}); 