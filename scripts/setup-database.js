#!/usr/bin/env node

/**
 * Database Setup Script
 * Helps set up PostgreSQL database for development
 */

const fs = require('fs');
const path = require('path');

console.log('🗄️  Perry Eden Group - Database Setup');
console.log('=====================================\n');

// Check if .env.local exists
const envPath = path.join(process.cwd(), '.env.local');
if (!fs.existsSync(envPath)) {
  console.log('❌ .env.local file not found!');
  console.log('📝 Creating .env.local from template...\n');
  
  const envExample = fs.readFileSync(path.join(process.cwd(), '.env.example'), 'utf8');
  fs.writeFileSync(envPath, envExample);
  console.log('✅ .env.local created successfully!');
}

console.log('🔧 Database Setup Options:');
console.log('==========================\n');

console.log('Option 1: Local PostgreSQL');
console.log('- Install PostgreSQL locally');
console.log('- Create database: createdb perry_eden_db');
console.log('- Update DATABASE_URL in .env.local\n');

console.log('Option 2: Docker PostgreSQL');
console.log('- Run: docker run --name perry-eden-db -e POSTGRES_PASSWORD=password -e POSTGRES_DB=perry_eden_db -p 5432:5432 -d postgres:14');
console.log('- DATABASE_URL: postgresql://postgres:password@localhost:5432/perry_eden_db\n');

console.log('Option 3: Cloud Database (Recommended)');
console.log('- Supabase: https://supabase.com (free tier)');
console.log('- Railway: https://railway.app (PostgreSQL plugin)');
console.log('- Neon: https://neon.tech (serverless PostgreSQL)\n');

console.log('Option 4: SQLite (Development Only)');
console.log('- Quick setup for development');
console.log('- No external dependencies');
console.log('- DATABASE_URL: file:./dev.db\n');

console.log('📋 Next Steps:');
console.log('1. Choose a database option above');
console.log('2. Update DATABASE_URL in .env.local');
console.log('3. Run: npm run db:generate');
console.log('4. Run: npm run db:migrate');
console.log('5. Run: npm run db:studio (to view database)\n');

console.log('🧪 Testing Commands:');
console.log('- npm run test:api (test all endpoints)');
console.log('- npm run test:auth (test authentication)');
console.log('- npm run test:db (test database connection)\n');

// Check current DATABASE_URL
const envContent = fs.readFileSync(envPath, 'utf8');
const dbUrlMatch = envContent.match(/DATABASE_URL="([^"]+)"/);
if (dbUrlMatch) {
  const currentUrl = dbUrlMatch[1];
  console.log('📍 Current DATABASE_URL:', currentUrl);
  
  if (currentUrl.includes('username:password@localhost')) {
    console.log('⚠️  Please update DATABASE_URL with real credentials');
  }
}
