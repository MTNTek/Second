import { pgTable, text, timestamp, integer, boolean, decimal, varchar, uuid, pgEnum } from 'drizzle-orm/pg-core';
import { createId } from '@paralleldrive/cuid2';

// Enums
export const userRoleEnum = pgEnum('user_role', ['admin', 'user', 'agent']);
export const applicationStatusEnum = pgEnum('application_status', ['pending', 'in_progress', 'approved', 'rejected', 'completed']);
export const paymentStatusEnum = pgEnum('payment_status', ['pending', 'processing', 'completed', 'failed', 'refunded']);
export const serviceTypeEnum = pgEnum('service_type', ['travel', 'visa', 'work_permit', 'document', 'uae_job']);

// Users table
export const users = pgTable('users', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  email: text('email').unique().notNull(),
  password: text('password'),
  name: text('name').notNull(),
  phone: text('phone'),
  role: userRoleEnum('role').default('user').notNull(),
  isVerified: boolean('is_verified').default(false),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Travel bookings
export const travelBookings = pgTable('travel_bookings', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  userId: text('user_id').references(() => users.id),
  bookingType: varchar('booking_type', { length: 50 }).notNull(), // 'flight', 'hotel', 'package'
  departure: text('departure'),
  destination: text('destination'),
  departureDate: timestamp('departure_date'),
  returnDate: timestamp('return_date'),
  passengers: integer('passengers').default(1),
  rooms: integer('rooms').default(1),
  classType: varchar('class_type', { length: 20 }), // 'economy', 'business', 'first'
  totalAmount: decimal('total_amount', { precision: 10, scale: 2 }),
  currency: varchar('currency', { length: 3 }).default('AED'),
  status: applicationStatusEnum('status').default('pending').notNull(),
  specialRequests: text('special_requests'),
  contactName: text('contact_name').notNull(),
  contactEmail: text('contact_email').notNull(),
  contactPhone: text('contact_phone').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Visa applications
export const visaApplications = pgTable('visa_applications', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  userId: text('user_id').references(() => users.id),
  visaType: varchar('visa_type', { length: 50 }).notNull(), // 'dubai-30', 'dubai-60', 'visa-change', 'global'
  nationality: text('nationality').notNull(),
  passportNumber: text('passport_number').notNull(),
  passportExpiry: timestamp('passport_expiry').notNull(),
  purposeOfVisit: varchar('purpose_of_visit', { length: 50 }).notNull(),
  intendedArrival: timestamp('intended_arrival'),
  duration: integer('duration'), // days
  totalAmount: decimal('total_amount', { precision: 10, scale: 2 }),
  currency: varchar('currency', { length: 3 }).default('AED'),
  status: applicationStatusEnum('status').default('pending').notNull(),
  processingDays: integer('processing_days'),
  additionalNotes: text('additional_notes'),
  contactName: text('contact_name').notNull(),
  contactEmail: text('contact_email').notNull(),
  contactPhone: text('contact_phone').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Work permit applications
export const workPermitApplications = pgTable('work_permit_applications', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  userId: text('user_id').references(() => users.id),
  country: varchar('country', { length: 50 }).notNull(), // 'czech', 'poland', 'slovakia', etc.
  jobTitle: text('job_title').notNull(),
  company: text('company'),
  salary: decimal('salary', { precision: 10, scale: 2 }),
  currency: varchar('currency', { length: 3 }).default('EUR'),
  location: text('location'),
  workExperience: text('work_experience'),
  education: text('education'),
  languageSkills: text('language_skills'),
  status: applicationStatusEnum('status').default('pending').notNull(),
  processingWeeks: integer('processing_weeks'),
  accommodationIncluded: boolean('accommodation_included').default(false),
  transportIncluded: boolean('transport_included').default(false),
  contactName: text('contact_name').notNull(),
  contactEmail: text('contact_email').notNull(),
  contactPhone: text('contact_phone').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// UAE job applications
export const uaeJobApplications = pgTable('uae_job_applications', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  userId: text('user_id').references(() => users.id),
  industry: varchar('industry', { length: 50 }).notNull(), // 'hospitality', 'construction', 'admin', 'sales'
  jobTitle: text('job_title').notNull(),
  experience: varchar('experience', { length: 20 }), // 'entry', 'mid', 'senior'
  expectedSalary: decimal('expected_salary', { precision: 10, scale: 2 }),
  currency: varchar('currency', { length: 3 }).default('AED'),
  availability: timestamp('availability'),
  visaStatus: varchar('visa_status', { length: 50 }), // 'visit', 'residence', 'need_visa'
  resume: text('resume_url'),
  status: applicationStatusEnum('status').default('pending').notNull(),
  contactName: text('contact_name').notNull(),
  contactEmail: text('contact_email').notNull(),
  contactPhone: text('contact_phone').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Document services
export const documentServices = pgTable('document_services', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  userId: text('user_id').references(() => users.id),
  serviceType: varchar('service_type', { length: 50 }).notNull(), // 'translation', 'attestation', 'typing'
  documentType: text('document_type').notNull(),
  language: varchar('language', { length: 20 }),
  urgency: varchar('urgency', { length: 20 }), // 'normal', 'urgent', 'same_day'
  quantity: integer('quantity').default(1),
  totalAmount: decimal('total_amount', { precision: 10, scale: 2 }),
  currency: varchar('currency', { length: 3 }).default('AED'),
  status: applicationStatusEnum('status').default('pending').notNull(),
  deliveryMethod: varchar('delivery_method', { length: 20 }), // 'pickup', 'delivery', 'email'
  specialInstructions: text('special_instructions'),
  contactName: text('contact_name').notNull(),
  contactEmail: text('contact_email').notNull(),
  contactPhone: text('contact_phone').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Payments
export const payments = pgTable('payments', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  userId: text('user_id').references(() => users.id),
  applicationId: text('application_id').notNull(), // Reference to any application
  applicationType: serviceTypeEnum('application_type').notNull(),
  amount: decimal('amount', { precision: 10, scale: 2 }).notNull(),
  currency: varchar('currency', { length: 3 }).notNull(),
  paymentMethod: varchar('payment_method', { length: 20 }).notNull(), // 'paytabs', 'stripe', 'paypal'
  paymentGatewayId: text('payment_gateway_id'), // Transaction ID from payment gateway
  status: paymentStatusEnum('status').default('pending').notNull(),
  paidAt: timestamp('paid_at'),
  refundedAt: timestamp('refunded_at'),
  refundAmount: decimal('refund_amount', { precision: 10, scale: 2 }),
  metadata: text('metadata'), // JSON string for additional payment data
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// File uploads
export const fileUploads = pgTable('file_uploads', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  userId: text('user_id').references(() => users.id),
  applicationId: text('application_id').notNull(),
  applicationType: serviceTypeEnum('application_type').notNull(),
  fileName: text('file_name').notNull(),
  originalName: text('original_name').notNull(),
  fileSize: integer('file_size').notNull(),
  mimeType: text('mime_type').notNull(),
  fileUrl: text('file_url').notNull(),
  documentType: varchar('document_type', { length: 50 }), // 'passport', 'photo', 'resume', etc.
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Admin notifications
export const notifications = pgTable('notifications', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  userId: text('user_id').references(() => users.id),
  title: text('title').notNull(),
  message: text('message').notNull(),
  type: varchar('type', { length: 20 }).notNull(), // 'info', 'success', 'warning', 'error'
  applicationId: text('application_id'),
  isRead: boolean('is_read').default(false),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Contact form submissions
export const contactSubmissions = pgTable('contact_submissions', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  name: text('name').notNull(),
  email: text('email').notNull(),
  phone: text('phone'),
  subject: text('subject').notNull(),
  message: text('message').notNull(),
  service: varchar('service', { length: 50 }), // Which service they're interested in
  isReplied: boolean('is_replied').default(false),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
