import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';

/**
 * Production Database Migration and Setup for Perry Eden Group
 * Handles PostgreSQL connection, migration, and environment setup
 */

interface DatabaseConfig {
  host: string;
  port: number;
  database: string;
  username: string;
  password: string;
  ssl?: boolean;
  maxConnections?: number;
  idleTimeoutMs?: number;
  connectionTimeoutMs?: number;
}

interface MigrationResult {
  success: boolean;
  migrationsRun: number;
  errors: string[];
  duration: number;
}

export class ProductionDatabase {
  private pool: Pool | null = null;
  private config: DatabaseConfig;
  
  constructor(config?: Partial<DatabaseConfig>) {
    this.config = {
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432'),
      database: process.env.DB_NAME || 'perry_eden_group',
      username: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || '',
      ssl: process.env.NODE_ENV === 'production',
      maxConnections: parseInt(process.env.DB_MAX_CONNECTIONS || '20'),
      idleTimeoutMs: parseInt(process.env.DB_IDLE_TIMEOUT || '30000'),
      connectionTimeoutMs: parseInt(process.env.DB_CONNECTION_TIMEOUT || '5000'),
      ...config
    };
  }
  
  /**
   * Initialize PostgreSQL connection pool
   */
  async initialize(): Promise<void> {
    try {
      this.pool = new Pool({
        host: this.config.host,
        port: this.config.port,
        database: this.config.database,
        user: this.config.username,
        password: this.config.password,
        ssl: this.config.ssl ? { rejectUnauthorized: false } : false,
        max: this.config.maxConnections,
        idleTimeoutMillis: this.config.idleTimeoutMs,
        connectionTimeoutMillis: this.config.connectionTimeoutMs,
      });
      
      // Test connection
      const client = await this.pool.connect();
      await client.query('SELECT NOW()');
      client.release();
      
      console.log('✅ PostgreSQL connection pool initialized successfully');
    } catch (error) {
      console.error('❌ Failed to initialize PostgreSQL connection:', error);
      throw error;
    }
  }
  
  /**
   * Run database migrations
   */
  async runMigrations(): Promise<MigrationResult> {
    const startTime = Date.now();
    const result: MigrationResult = {
      success: false,
      migrationsRun: 0,
      errors: [],
      duration: 0
    };
    
    try {
      if (!this.pool) {
        throw new Error('Database not initialized. Call initialize() first.');
      }
      
      // Create connection for migrations
      const connectionString = `postgresql://${this.config.username}:${this.config.password}@${this.config.host}:${this.config.port}/${this.config.database}`;
      const migrationClient = postgres(connectionString, { max: 1 });
      const db = drizzle(migrationClient);
      
      console.log('🔄 Running database migrations...');
      
      // Run migrations from drizzle folder
      await migrate(db, { migrationsFolder: './drizzle' });
      
      await migrationClient.end();
      
      result.success = true;
      result.migrationsRun = 1; // Drizzle doesn't return count, so we assume success means at least 1
      result.duration = Date.now() - startTime;
      
      console.log(`✅ Migrations completed successfully in ${result.duration}ms`);
      
    } catch (error) {
      result.errors.push(error instanceof Error ? error.message : 'Unknown migration error');
      result.duration = Date.now() - startTime;
      
      console.error('❌ Migration failed:', error);
    }
    
    return result;
  }
  
  /**
   * Create database schema and initial data
   */
  async setupSchema(): Promise<void> {
    if (!this.pool) {
      throw new Error('Database not initialized');
    }
    
    const client = await this.pool.connect();
    
    try {
      console.log('🔄 Setting up database schema...');
      
      // Create extensions
      await client.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');
      await client.query('CREATE EXTENSION IF NOT EXISTS "pgcrypto"');
      
      // Create application-specific schemas
      await client.query('CREATE SCHEMA IF NOT EXISTS application');
      await client.query('CREATE SCHEMA IF NOT EXISTS audit');
      
      console.log('✅ Database schema setup completed');
      
    } catch (error) {
      console.error('❌ Schema setup failed:', error);
      throw error;
    } finally {
      client.release();
    }
  }
  
  /**
   * Health check for database connection
   */
  async healthCheck(): Promise<{ healthy: boolean; latency: number; error?: string }> {
    if (!this.pool) {
      return { healthy: false, latency: 0, error: 'Database not initialized' };
    }
    
    const startTime = Date.now();
    
    try {
      const client = await this.pool.connect();
      await client.query('SELECT 1');
      client.release();
      
      const latency = Date.now() - startTime;
      return { healthy: true, latency };
      
    } catch (error) {
      const latency = Date.now() - startTime;
      return { 
        healthy: false, 
        latency, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }
  
  /**
   * Get database statistics
   */
  async getStats(): Promise<{
    activeConnections: number;
    idleConnections: number;
    totalConnections: number;
    databaseSize: string;
  }> {
    if (!this.pool) {
      throw new Error('Database not initialized');
    }
    
    const client = await this.pool.connect();
    
    try {
      // Get connection stats
      const connectionStats = await client.query(`
        SELECT 
          count(*) filter (where state = 'active') as active_connections,
          count(*) filter (where state = 'idle') as idle_connections,
          count(*) as total_connections
        FROM pg_stat_activity 
        WHERE datname = $1
      `, [this.config.database]);
      
      // Get database size
      const sizeResult = await client.query(`
        SELECT pg_size_pretty(pg_database_size($1)) as database_size
      `, [this.config.database]);
      
      return {
        activeConnections: parseInt(connectionStats.rows[0].active_connections) || 0,
        idleConnections: parseInt(connectionStats.rows[0].idle_connections) || 0,
        totalConnections: parseInt(connectionStats.rows[0].total_connections) || 0,
        databaseSize: sizeResult.rows[0].database_size || '0 bytes'
      };
      
    } finally {
      client.release();
    }
  }
  
  /**
   * Close database connections
   */
  async close(): Promise<void> {
    if (this.pool) {
      await this.pool.end();
      this.pool = null;
      console.log('✅ Database connections closed');
    }
  }
  
  /**
   * Get the connection pool for use in application
   */
  getPool(): Pool {
    if (!this.pool) {
      throw new Error('Database not initialized. Call initialize() first.');
    }
    return this.pool;
  }
}

/**
 * Database Migration CLI utilities
 */
export class MigrationCLI {
  private db: ProductionDatabase;
  
  constructor(config?: Partial<DatabaseConfig>) {
    this.db = new ProductionDatabase(config);
  }
  
  async migrate(): Promise<void> {
    try {
      console.log('🚀 Starting database migration process...');
      
      await this.db.initialize();
      await this.db.setupSchema();
      
      const result = await this.db.runMigrations();
      
      if (result.success) {
        console.log(`✅ Migration completed: ${result.migrationsRun} migrations run in ${result.duration}ms`);
      } else {
        console.error('❌ Migration failed:', result.errors);
        process.exit(1);
      }
      
    } catch (error) {
      console.error('💥 Migration process failed:', error);
      process.exit(1);
    } finally {
      await this.db.close();
    }
  }
  
  async status(): Promise<void> {
    try {
      await this.db.initialize();
      
      const health = await this.db.healthCheck();
      const stats = await this.db.getStats();
      
      console.log('\n📊 Database Status:');
      console.log('==================');
      console.log(`Health: ${health.healthy ? '✅ Healthy' : '❌ Unhealthy'}`);
      console.log(`Latency: ${health.latency}ms`);
      console.log(`Active Connections: ${stats.activeConnections}`);
      console.log(`Idle Connections: ${stats.idleConnections}`);
      console.log(`Total Connections: ${stats.totalConnections}`);
      console.log(`Database Size: ${stats.databaseSize}`);
      
      if (!health.healthy && health.error) {
        console.log(`Error: ${health.error}`);
      }
      
    } catch (error) {
      console.error('💥 Status check failed:', error);
      process.exit(1);
    } finally {
      await this.db.close();
    }
  }
}

/**
 * Environment-specific database configurations
 */
export const databaseConfigs = {
  development: {
    host: 'localhost',
    port: 5432,
    database: 'perry_eden_group_dev',
    maxConnections: 5,
    ssl: false
  },
  
  staging: {
    host: process.env.STAGING_DB_HOST,
    port: parseInt(process.env.STAGING_DB_PORT || '5432'),
    database: process.env.STAGING_DB_NAME,
    maxConnections: 10,
    ssl: true
  },
  
  production: {
    host: process.env.PROD_DB_HOST,
    port: parseInt(process.env.PROD_DB_PORT || '5432'),
    database: process.env.PROD_DB_NAME,
    maxConnections: 20,
    ssl: true
  }
};

// Export singleton instance for application use
export const productionDB = new ProductionDatabase();

// Export CLI runner for package.json scripts
export async function runMigrationCLI() {
  const command = process.argv[2];
  const cli = new MigrationCLI();
  
  switch (command) {
    case 'migrate':
      await cli.migrate();
      break;
    case 'status':
      await cli.status();
      break;
    default:
      console.log('Usage: node migration-cli.js [migrate|status]');
      process.exit(1);
  }
}
