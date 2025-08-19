CREATE TYPE "public"."application_status" AS ENUM('pending', 'in_progress', 'approved', 'rejected', 'completed');--> statement-breakpoint
CREATE TYPE "public"."payment_status" AS ENUM('pending', 'processing', 'completed', 'failed', 'refunded');--> statement-breakpoint
CREATE TYPE "public"."service_type" AS ENUM('travel', 'visa', 'work_permit', 'document', 'uae_job');--> statement-breakpoint
CREATE TYPE "public"."user_role" AS ENUM('admin', 'user', 'agent');--> statement-breakpoint
CREATE TABLE "contact_submissions" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"phone" text,
	"subject" text NOT NULL,
	"message" text NOT NULL,
	"service" varchar(50),
	"is_replied" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "document_services" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text,
	"service_type" varchar(50) NOT NULL,
	"document_type" text NOT NULL,
	"language" varchar(20),
	"urgency" varchar(20),
	"quantity" integer DEFAULT 1,
	"total_amount" numeric(10, 2),
	"currency" varchar(3) DEFAULT 'AED',
	"status" "application_status" DEFAULT 'pending' NOT NULL,
	"delivery_method" varchar(20),
	"special_instructions" text,
	"contact_name" text NOT NULL,
	"contact_email" text NOT NULL,
	"contact_phone" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "file_uploads" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text,
	"application_id" text NOT NULL,
	"application_type" "service_type" NOT NULL,
	"file_name" text NOT NULL,
	"original_name" text NOT NULL,
	"file_size" integer NOT NULL,
	"mime_type" text NOT NULL,
	"file_url" text NOT NULL,
	"document_type" varchar(50),
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "notifications" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text,
	"title" text NOT NULL,
	"message" text NOT NULL,
	"type" varchar(20) NOT NULL,
	"application_id" text,
	"is_read" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "payments" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text,
	"application_id" text NOT NULL,
	"application_type" "service_type" NOT NULL,
	"amount" numeric(10, 2) NOT NULL,
	"currency" varchar(3) NOT NULL,
	"payment_method" varchar(20) NOT NULL,
	"payment_gateway_id" text,
	"status" "payment_status" DEFAULT 'pending' NOT NULL,
	"paid_at" timestamp,
	"refunded_at" timestamp,
	"refund_amount" numeric(10, 2),
	"metadata" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "travel_bookings" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text,
	"booking_type" varchar(50) NOT NULL,
	"departure" text,
	"destination" text,
	"departure_date" timestamp,
	"return_date" timestamp,
	"passengers" integer DEFAULT 1,
	"rooms" integer DEFAULT 1,
	"class_type" varchar(20),
	"total_amount" numeric(10, 2),
	"currency" varchar(3) DEFAULT 'AED',
	"status" "application_status" DEFAULT 'pending' NOT NULL,
	"special_requests" text,
	"contact_name" text NOT NULL,
	"contact_email" text NOT NULL,
	"contact_phone" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "uae_job_applications" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text,
	"industry" varchar(50) NOT NULL,
	"job_title" text NOT NULL,
	"experience" varchar(20),
	"expected_salary" numeric(10, 2),
	"currency" varchar(3) DEFAULT 'AED',
	"availability" timestamp,
	"visa_status" varchar(50),
	"resume_url" text,
	"status" "application_status" DEFAULT 'pending' NOT NULL,
	"contact_name" text NOT NULL,
	"contact_email" text NOT NULL,
	"contact_phone" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" text PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"password" text,
	"name" text NOT NULL,
	"phone" text,
	"role" "user_role" DEFAULT 'user' NOT NULL,
	"is_verified" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "visa_applications" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text,
	"visa_type" varchar(50) NOT NULL,
	"nationality" text NOT NULL,
	"passport_number" text NOT NULL,
	"passport_expiry" timestamp NOT NULL,
	"purpose_of_visit" varchar(50) NOT NULL,
	"intended_arrival" timestamp,
	"duration" integer,
	"total_amount" numeric(10, 2),
	"currency" varchar(3) DEFAULT 'AED',
	"status" "application_status" DEFAULT 'pending' NOT NULL,
	"processing_days" integer,
	"additional_notes" text,
	"contact_name" text NOT NULL,
	"contact_email" text NOT NULL,
	"contact_phone" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "work_permit_applications" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text,
	"country" varchar(50) NOT NULL,
	"job_title" text NOT NULL,
	"company" text,
	"salary" numeric(10, 2),
	"currency" varchar(3) DEFAULT 'EUR',
	"location" text,
	"work_experience" text,
	"education" text,
	"language_skills" text,
	"status" "application_status" DEFAULT 'pending' NOT NULL,
	"processing_weeks" integer,
	"accommodation_included" boolean DEFAULT false,
	"transport_included" boolean DEFAULT false,
	"contact_name" text NOT NULL,
	"contact_email" text NOT NULL,
	"contact_phone" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "document_services" ADD CONSTRAINT "document_services_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "file_uploads" ADD CONSTRAINT "file_uploads_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payments" ADD CONSTRAINT "payments_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "travel_bookings" ADD CONSTRAINT "travel_bookings_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "uae_job_applications" ADD CONSTRAINT "uae_job_applications_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "visa_applications" ADD CONSTRAINT "visa_applications_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "work_permit_applications" ADD CONSTRAINT "work_permit_applications_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;