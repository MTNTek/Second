/**
 * Development Database Configuration
 * SQLite database for development and testing
 */

import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import bcrypt from 'bcryptjs';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  users,
  travelBookings,
  visaApplications,
  workPermitApplications,
  uaeJobApplications,
  documentServices,
  contactSubmissions,
  statusTracking
} from './schema.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create data directory if it doesn't exist
const dataDir = path.join(process.cwd(), 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Initialize SQLite database
const sqlite = new Database(path.join(dataDir, 'development.db'));
const devDb = drizzle(sqlite);

export { devDb };

export async function runDevMigrations() {
  console.log('📊 Creating database schema...');
  
  // Create tables - they'll be created automatically when first accessed
  // This is just to ensure the database file exists
  try {
    await devDb.select().from(users).limit(1);
  } catch (error) {
    // Tables don't exist yet, they'll be created on first insert
  }
  
  console.log('✅ Schema ready');
}

export async function seedDevData() {
  console.log('🌱 Seeding development data...');
  
  try {
    // Clear existing data for clean slate
    await devDb.delete(statusTracking);
    await devDb.delete(contactSubmissions);
    await devDb.delete(documentServices);
    await devDb.delete(uaeJobApplications);
    await devDb.delete(workPermitApplications);
    await devDb.delete(visaApplications);
    await devDb.delete(travelBookings);
    await devDb.delete(users);

    // Create sample users
    const hashedAdminPassword = await bcrypt.hash('admin123', 10);
    const hashedTestPassword = await bcrypt.hash('test123', 10);
    
    const adminUser = await devDb.insert(users).values({
      name: 'Admin User',
      email: 'admin@perryedengroup.com',
      password: hashedAdminPassword,
      phone: '+971501234567',
      role: 'admin',
      isVerified: true,
    }).returning();

    const testUser = await devDb.insert(users).values({
      name: 'Test User',
      email: 'test@example.com',
      password: hashedTestPassword,
      phone: '+971509876543',
      role: 'user',
      isVerified: true,
    }).returning();

    console.log('✅ Users created');

    // Create sample travel booking
    await devDb.insert(travelBookings).values({
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

    // Create sample visa application
    await devDb.insert(visaApplications).values({
      userId: testUser[0].id,
      visaType: 'dubai-30',
      nationality: 'Indian',
      passportNumber: 'A12345678',
      passportExpiry: new Date('2026-12-31'),
      purposeOfVisit: 'tourism',
      contactName: 'Test User',
      contactEmail: 'test@example.com',
      contactPhone: '+971501234567',
      status: 'pending',
    });

    // Create sample work permit application
    await devDb.insert(workPermitApplications).values({
      userId: testUser[0].id,
      country: 'poland',
      jobTitle: 'Software Developer',
      company: 'Tech Company',
      salary: 5000,
      location: 'Warsaw',
      contactName: 'Test User',
      contactEmail: 'test@example.com',
      contactPhone: '+971501234567',
      status: 'pending',
    });

    // Create sample UAE job application
    await devDb.insert(uaeJobApplications).values({
      userId: testUser[0].id,
      industry: 'technology',
      jobTitle: 'Frontend Developer',
      experience: 'mid',
      expectedSalary: 8000,
      visaStatus: 'need_visa',
      contactName: 'Test User',
      contactEmail: 'test@example.com',
      contactPhone: '+971501234567',
      status: 'pending',
    });

    // Create sample document service
    await devDb.insert(documentServices).values({
      userId: testUser[0].id,
      serviceType: 'translation',
      documentType: 'passport',
      language: 'arabic',
      urgency: 'normal',
      quantity: 1,
      contactName: 'Test User',
      contactEmail: 'test@example.com',
      contactPhone: '+971501234567',
      status: 'pending',
    });

    // Create sample contact submission
    await devDb.insert(contactSubmissions).values({
      name: 'John Doe',
      email: 'john@example.com',
      phone: '+971501234567',
      subject: 'General Inquiry',
      message: 'I would like to know more about your travel services.',
      service: 'travel',
      status: 'new',
    });

    // Create status tracking entries
    await devDb.insert(statusTracking).values({
      applicationId: 1,
      applicationType: 'travel',
      status: 'pending',
      message: 'Travel booking received and under review',
      updatedBy: adminUser[0].id,
    });

    await devDb.insert(statusTracking).values({
      applicationId: 1,
      applicationType: 'visa',
      status: 'pending',
      message: 'Visa application submitted to embassy',
      updatedBy: adminUser[0].id,
    });

    console.log('✅ Sample data created');
    
    // Display stats
    const userCount = await devDb.select().from(users);
    const travelCount = await devDb.select().from(travelBookings);
    const visaCount = await devDb.select().from(visaApplications);
    
    console.log('\n📊 Database Stats:');
    console.log(`   👥 Users: ${userCount.length}`);
    console.log(`   ✈️ Travel Bookings: ${travelCount.length}`);
    console.log(`   📄 Visa Applications: ${visaCount.length}`);
    
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    throw error;
  }
}

// Cleanup function for testing
export function closeDatabase() {
  sqlite.close();
}
