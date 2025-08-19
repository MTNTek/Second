/**
 * Simple Database Initialization Script (JavaScript)
 */

const { drizzle } = require('drizzle-orm/better-sqlite3');
const Database = require('better-sqlite3');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');

// Define simple schema inline
const { text, integer, sqliteTable, real } = require('drizzle-orm/sqlite-core');
const { createId } = require('@paralleldrive/cuid2');

// Users table
const users = sqliteTable('users', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  email: text('email').unique().notNull(),
  password: text('password'),
  name: text('name').notNull(),
  phone: text('phone'),
  role: text('role').default('user').notNull(),
  isVerified: integer('is_verified', { mode: 'boolean' }).default(false),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
});

// Travel bookings
const travelBookings = sqliteTable('travel_bookings', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  userId: text('user_id').references(() => users.id),
  bookingType: text('booking_type').notNull(),
  departure: text('departure'),
  destination: text('destination'),
  departureDate: integer('departure_date', { mode: 'timestamp' }),
  returnDate: integer('return_date', { mode: 'timestamp' }),
  passengers: integer('passengers').default(1),
  classType: text('class_type'),
  contactName: text('contact_name').notNull(),
  contactEmail: text('contact_email').notNull(),
  contactPhone: text('contact_phone').notNull(),
  status: text('status').default('pending'),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
});

async function initializeDatabase() {
  try {
    console.log('🗄️  Initializing Perry Eden Group Database');
    console.log('==========================================\n');

    // Create data directory if it doesn't exist
    const dataDir = path.join(process.cwd(), 'data');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
      console.log('📁 Created data directory');
    }

    // Initialize SQLite database
    const sqlite = new Database(path.join(dataDir, 'development.db'));
    const db = drizzle(sqlite);

    console.log('✅ Database connection established');
    console.log('📊 Creating database schema...');

    // Create tables manually
    sqlite.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        password TEXT,
        name TEXT NOT NULL,
        phone TEXT,
        role TEXT DEFAULT 'user' NOT NULL,
        is_verified INTEGER DEFAULT 0,
        created_at INTEGER,
        updated_at INTEGER
      );
      
      CREATE TABLE IF NOT EXISTS travel_bookings (
        id TEXT PRIMARY KEY,
        user_id TEXT REFERENCES users(id),
        booking_type TEXT NOT NULL,
        departure TEXT,
        destination TEXT,
        departure_date INTEGER,
        return_date INTEGER,
        passengers INTEGER DEFAULT 1,
        class_type TEXT,
        contact_name TEXT NOT NULL,
        contact_email TEXT NOT NULL,
        contact_phone TEXT NOT NULL,
        status TEXT DEFAULT 'pending',
        created_at INTEGER,
        updated_at INTEGER
      );
    `);

    console.log('✅ Tables created');

    // Create sample users
    console.log('👤 Creating sample users...');
    
    const hashedAdminPassword = await bcrypt.hash('admin123', 10);
    const hashedTestPassword = await bcrypt.hash('test123', 10);
    
    // Clear existing users
    try {
      await db.delete(users);
    } catch (error) {
      // Table might not exist yet
    }
    
    const adminUser = await db.insert(users).values({
      name: 'Admin User',
      email: 'admin@perryedengroup.com',
      password: hashedAdminPassword,
      phone: '+971501234567',
      role: 'admin',
      isVerified: true,
    }).returning();

    const testUser = await db.insert(users).values({
      name: 'Test User',
      email: 'test@example.com',
      password: hashedTestPassword,
      phone: '+971509876543',
      role: 'user',
      isVerified: true,
    }).returning();

    console.log('✅ Users created');

    // Create sample travel booking
    console.log('✈️ Creating sample travel booking...');
    
    try {
      await db.delete(travelBookings);
    } catch (error) {
      // Table might not exist yet
    }

    await db.insert(travelBookings).values({
      userId: testUser[0].id,
      bookingType: 'flight',
      departure: 'Dubai',
      destination: 'London',
      departureDate: new Date('2025-09-15'),
      returnDate: new Date('2025-09-25'),
      passengers: 2,
      classType: 'economy',
      contactName: 'Test User',
      contactEmail: 'test@example.com',
      contactPhone: '+971501234567',
      status: 'pending',
    });

    console.log('✅ Sample data created');
    
    // Display stats
    const userCount = await db.select().from(users);
    const travelCount = await db.select().from(travelBookings);
    
    console.log('\n📊 Database Stats:');
    console.log(`   👥 Users: ${userCount.length}`);
    console.log(`   ✈️ Travel Bookings: ${travelCount.length}`);

    console.log('\n✅ Development database setup complete!');
    console.log('📍 Database file: ./data/development.db');
    console.log('👤 Test credentials:');
    console.log('   Admin: admin@perryedengroup.com / admin123');
    console.log('   User:  test@example.com / test123');

    console.log('\n🚀 Next steps:');
    console.log('1. npm run dev (start development server)');
    console.log('2. npm run test:api (test all endpoints)');
    
    sqlite.close();
    
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    process.exit(1);
  }
}

initializeDatabase();
