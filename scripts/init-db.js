#!/usr/bin/env node

/**
 * Database Initialization Script
 * Sets up the database and runs initial migrations
 */

const fs = require('fs');
const path = require('path');

async function initializeDatabase() {
  try {
    console.log('🗄️  Initializing Perry Eden Group Database');
    console.log('==========================================\n');

    // Check if we're using development mode
    const envPath = path.join(process.cwd(), '.env.local');
    let useDevMode = true;
    
    if (fs.existsSync(envPath)) {
      const envContent = fs.readFileSync(envPath, 'utf8');
      const dbUrlMatch = envContent.match(/DATABASE_URL="([^"]+)"/);
      
      if (dbUrlMatch && dbUrlMatch[1] && !dbUrlMatch[1].includes('username:password@localhost')) {
        useDevMode = false;
        console.log('🐘 Production database detected');
      }
    }

    if (useDevMode) {
      console.log('📁 Setting up SQLite development database...');
      
      // Import and setup SQLite database
      const { devDb, runDevMigrations, seedDevData } = await import('../src/lib/dev-db.ts');
      
      // Run migrations
      await runDevMigrations();
      
      // Seed development data
      await seedDevData();
      
      console.log('\n✅ Development database setup complete!');
      console.log('📍 Database file: ./dev.db');
      console.log('👤 Test credentials:');
      console.log('   Admin: admin@perryedengroup.com / admin123');
      console.log('   User:  test@example.com / test123');
    } else {
      console.log('🐘 Production database detected');
      console.log('⚠️  Please run migrations manually:');
      console.log('   npm run db:generate');
      console.log('   npm run db:migrate');
    }

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
