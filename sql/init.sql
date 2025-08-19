-- Perry Eden Group Database Initialization
-- Create database and user if they don't exist

-- Create extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Set timezone
SET timezone = 'UTC';

-- Create additional schemas if needed
CREATE SCHEMA IF NOT EXISTS public;

-- Grant permissions
GRANT ALL PRIVILEGES ON DATABASE perry_eden_group TO perry_user;
GRANT ALL PRIVILEGES ON SCHEMA public TO perry_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO perry_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO perry_user;

-- Success message
SELECT 'Perry Eden Group database initialized successfully!' AS status;
