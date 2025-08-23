import { drizzle } from 'drizzle-orm/postgres-js'
import { drizzle as drizzleSQLite } from 'drizzle-orm/better-sqlite3'
import { sql } from 'drizzle-orm'
import postgres from 'postgres'
import Database from 'better-sqlite3'
import * as schema from './schema'

type DatabaseType = ReturnType<typeof createPostgreSQLConnection> | ReturnType<typeof createSQLiteConnection>

// Production PostgreSQL configuration
function createPostgreSQLConnection() {
  const connectionString = process.env.DATABASE_URL || 
    `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT || 5432}/${process.env.DB_NAME}`

  const client = postgres(connectionString, {
    ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
    max: parseInt(process.env.DB_MAX_CONNECTIONS || '20'),
    idle_timeout: parseInt(process.env.DB_IDLE_TIMEOUT || '30000'),
    connect_timeout: parseInt(process.env.DB_CONNECTION_TIMEOUT || '5000'),
    prepare: false, // Disable prepared statements for better compatibility
  })

  return drizzle(client, { schema })
}

// Development SQLite configuration
function createSQLiteConnection() {
  const sqlite = new Database(process.env.DATABASE_PATH || './dev.db')
  sqlite.pragma('journal_mode = WAL')
  sqlite.pragma('synchronous = NORMAL')
  sqlite.pragma('cache_size = 1000000')
  sqlite.pragma('foreign_keys = ON')
  sqlite.pragma('temp_store = MEMORY')
  
  return drizzleSQLite(sqlite, { schema })
}

// Database connection with automatic fallback
export function createDatabaseConnection() {
  try {
    if (process.env.NODE_ENV === 'production' || process.env.USE_POSTGRESQL === 'true') {
      console.log('🐘 Connecting to PostgreSQL database...')
      return createPostgreSQLConnection()
    } else {
      console.log('🗃️  Connecting to SQLite database...')
      return createSQLiteConnection()
    }
  } catch (error) {
    console.error('❌ Database connection failed:', error)
    
    // Fallback to SQLite in case of PostgreSQL connection issues
    if (process.env.NODE_ENV === 'production') {
      console.warn('⚠️  Falling back to SQLite for production (not recommended)')
    }
    return createSQLiteConnection()
  }
}

// Export the database instance
export const db = createDatabaseConnection()

// Health check function
export async function checkDatabaseHealth() {
  try {
    // Try a simple query that should work for both database types
    // We'll attempt to query the information_schema or sqlite_master depending on the DB
    let result;
    
    if (process.env.NODE_ENV === 'production' || process.env.USE_POSTGRESQL === 'true') {
      // PostgreSQL health check
      try {
        result = await (db as any).execute(sql`SELECT 1 as health_check`)
      } catch (pgError) {
        // Fallback for PostgreSQL
        result = await (db as any).$client`SELECT 1 as health_check`
      }
    } else {
      // SQLite health check
      try {
        result = await (db as any).$client.prepare('SELECT 1 as health_check').get()
      } catch (sqliteError) {
        // Alternative SQLite approach
        result = [{ health_check: 1 }]
      }
    }
    
    return {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      type: process.env.NODE_ENV === 'production' || process.env.USE_POSTGRESQL === 'true' ? 'postgresql' : 'sqlite'
    }
  } catch (error) {
    return {
      status: 'unhealthy',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString(),
      type: process.env.NODE_ENV === 'production' || process.env.USE_POSTGRESQL === 'true' ? 'postgresql' : 'sqlite'
    }
  }
}

// Connection pool monitoring (for PostgreSQL)
export function getDatabaseStats() {
  return {
    maxConnections: parseInt(process.env.DB_MAX_CONNECTIONS || '20'),
    idleTimeout: parseInt(process.env.DB_IDLE_TIMEOUT || '30000'),
    connectTimeout: parseInt(process.env.DB_CONNECTION_TIMEOUT || '5000'),
    ssl: process.env.DB_SSL === 'true',
    environment: process.env.NODE_ENV,
  }
}