import { drizzle } from 'drizzle-orm/postgres-js';
import { drizzle as drizzleSQLite } from 'drizzle-orm/better-sqlite3';
import postgres from 'postgres';
import Database from 'better-sqlite3';
import * as schema from './schema';
import path from 'path';
import fs from 'fs';

// Check if we have a valid PostgreSQL connection string
const connectionString = process.env.DATABASE_URL;

let db: any;

// Check for placeholder values and invalid configurations
const isValidPostgresUrl = connectionString && 
  connectionString !== 'postgresql://username:password@localhost:5432/perry_eden_db' &&
  !connectionString.includes('[PASSWORD]') &&
  !connectionString.includes('[PROJECT-REF]') &&
  connectionString.startsWith('postgresql://');

if (isValidPostgresUrl) {
  // Use PostgreSQL for production/staging
  console.log('🐘 Using PostgreSQL database');
  const client = postgres(connectionString, { prepare: false });
  db = drizzle(client, { schema });
} else {
  // Use SQLite for development
  console.log('📁 Using SQLite development database');
  
  // Check if development database exists
  const dataDir = path.join(process.cwd(), 'data');
  const dbPath = path.join(dataDir, 'development.db');
  
  if (!fs.existsSync(dbPath)) {
    console.warn('⚠️ Development database not found. Please run: npm run db:init');
    // Create a fallback database for now
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
  }
  
  const sqlite = new Database(dbPath);
  db = drizzleSQLite(sqlite);
}

export { db };
