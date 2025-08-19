/**
 * Simple Database Initialization Script
 * Direct import version to avoid ESM issues
 */

import { runDevMigrations, seedDevData } from '../src/lib/dev-db';

async function initializeDatabase() {
  try {
    console.log('🗄️  Initializing Perry Eden Group Database');
    console.log('==========================================\n');

    console.log('📁 Setting up SQLite development database...');
    
    // Run migrations
    await runDevMigrations();
    
    // Seed development data
    await seedDevData();
    
    console.log('\n✅ Development database setup complete!');
    console.log('📍 Database file: ./data/development.db');
    console.log('👤 Test credentials:');
    console.log('   Admin: admin@perryedengroup.com / admin123');
    console.log('   User:  test@example.com / test123');

    console.log('\n🚀 Next steps:');
    console.log('1. npm run dev (start development server)');
    console.log('2. npm run test:api (test all endpoints)');
    console.log('3. npm run db:studio (view database)');
    
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    process.exit(1);
  }
}

initializeDatabase();
