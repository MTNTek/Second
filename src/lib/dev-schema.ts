/**
 * SQLite Development Schema
 * Compatible with SQLite database for development
 */

import { text, integer, sqliteTable, real } from 'drizzle-orm/sqlite-core';
import { createId } from '@paralleldrive/cuid2';

// Users table
export const users = sqliteTable('users', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  email: text('email').unique().notNull(),
  password: text('password'),
  name: text('name').notNull(),
  phone: text('phone'),
  role: text('role', { enum: ['admin', 'user', 'agent'] }).default('user').notNull(),
  isVerified: integer('is_verified', { mode: 'boolean' }).default(false),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
});

// Travel bookings
export const travelBookings = sqliteTable('travel_bookings', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  userId: text('user_id').references(() => users.id),
  bookingType: text('booking_type').notNull(), // 'flight', 'hotel', 'package'
  departure: text('departure'),
  destination: text('destination'),
  departureDate: integer('departure_date', { mode: 'timestamp' }),
  returnDate: integer('return_date', { mode: 'timestamp' }),
  passengers: integer('passengers').default(1),
  classType: text('class_type'), // 'economy', 'business', 'first'
  specialRequests: text('special_requests'),
  contactName: text('contact_name').notNull(),
  contactEmail: text('contact_email').notNull(),
  contactPhone: text('contact_phone').notNull(),
  status: text('status', { enum: ['pending', 'in_progress', 'approved', 'rejected', 'completed'] }).default('pending'),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
});

// Visa applications
export const visaApplications = sqliteTable('visa_applications', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  userId: text('user_id').references(() => users.id),
  visaType: text('visa_type').notNull(),
  nationality: text('nationality').notNull(),
  passportNumber: text('passport_number').notNull(),
  passportExpiry: integer('passport_expiry', { mode: 'timestamp' }).notNull(),
  purposeOfVisit: text('purpose_of_visit').notNull(),
  travelDate: integer('travel_date', { mode: 'timestamp' }),
  contactName: text('contact_name').notNull(),
  contactEmail: text('contact_email').notNull(),
  contactPhone: text('contact_phone').notNull(),
  status: text('status', { enum: ['pending', 'in_progress', 'approved', 'rejected', 'completed'] }).default('pending'),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
});

// Work permit applications
export const workPermitApplications = sqliteTable('work_permit_applications', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  userId: text('user_id').references(() => users.id),
  country: text('country').notNull(),
  jobTitle: text('job_title').notNull(),
  company: text('company').notNull(),
  salary: real('salary'),
  location: text('location'),
  experience: text('experience'),
  education: text('education'),
  contactName: text('contact_name').notNull(),
  contactEmail: text('contact_email').notNull(),
  contactPhone: text('contact_phone').notNull(),
  status: text('status', { enum: ['pending', 'in_progress', 'approved', 'rejected', 'completed'] }).default('pending'),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
});

// UAE job applications
export const uaeJobApplications = sqliteTable('uae_job_applications', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  userId: text('user_id').references(() => users.id),
  industry: text('industry').notNull(),
  jobTitle: text('job_title').notNull(),
  experience: text('experience', { enum: ['entry', 'mid', 'senior', 'executive'] }).notNull(),
  expectedSalary: real('expected_salary'),
  currentLocation: text('current_location'),
  visaStatus: text('visa_status', { enum: ['valid', 'expired', 'need_visa', 'under_process'] }).notNull(),
  availability: text('availability'),
  contactName: text('contact_name').notNull(),
  contactEmail: text('contact_email').notNull(),
  contactPhone: text('contact_phone').notNull(),
  status: text('status', { enum: ['pending', 'in_progress', 'approved', 'rejected', 'completed'] }).default('pending'),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
});

// Document services
export const documentServices = sqliteTable('document_services', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  userId: text('user_id').references(() => users.id),
  serviceType: text('service_type').notNull(), // 'translation', 'attestation', 'notarization'
  documentType: text('document_type').notNull(),
  language: text('language'),
  urgency: text('urgency', { enum: ['normal', 'urgent', 'express'] }).default('normal'),
  quantity: integer('quantity').default(1),
  specialInstructions: text('special_instructions'),
  contactName: text('contact_name').notNull(),
  contactEmail: text('contact_email').notNull(),
  contactPhone: text('contact_phone').notNull(),
  status: text('status', { enum: ['pending', 'in_progress', 'approved', 'rejected', 'completed'] }).default('pending'),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
});

// Contact submissions
export const contactSubmissions = sqliteTable('contact_submissions', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  name: text('name').notNull(),
  email: text('email').notNull(),
  phone: text('phone'),
  subject: text('subject').notNull(),
  message: text('message').notNull(),
  service: text('service', { enum: ['travel', 'visa', 'work_permit', 'document', 'uae_job', 'other'] }),
  status: text('status', { enum: ['new', 'in_progress', 'responded', 'closed'] }).default('new'),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
});

// File uploads
export const fileUploads = sqliteTable('file_uploads', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  userId: text('user_id').references(() => users.id),
  applicationId: text('application_id').notNull(),
  applicationType: text('application_type', { enum: ['travel', 'visa', 'work_permit', 'document', 'uae_job'] }).notNull(),
  filename: text('filename').notNull(),
  originalFilename: text('original_filename').notNull(),
  mimeType: text('mime_type').notNull(),
  size: integer('size').notNull(),
  documentType: text('document_type'),
  uploadPath: text('upload_path').notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
});

// Payments
export const payments = sqliteTable('payments', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  userId: text('user_id').references(() => users.id),
  applicationId: text('application_id').notNull(),
  applicationType: text('application_type', { enum: ['travel', 'visa', 'work_permit', 'document', 'uae_job'] }).notNull(),
  amount: real('amount').notNull(),
  currency: text('currency').default('AED').notNull(),
  status: text('status', { enum: ['pending', 'processing', 'completed', 'failed', 'refunded'] }).default('pending'),
  paymentMethod: text('payment_method'),
  transactionId: text('transaction_id'),
  paymentGateway: text('payment_gateway'),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
});

// Status tracking
export const statusTracking = sqliteTable('status_tracking', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  applicationId: text('application_id').notNull(),
  applicationType: text('application_type', { enum: ['travel', 'visa', 'work_permit', 'document', 'uae_job'] }).notNull(),
  status: text('status', { enum: ['pending', 'in_progress', 'approved', 'rejected', 'completed'] }).notNull(),
  message: text('message'),
  updatedBy: text('updated_by').references(() => users.id),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
});
