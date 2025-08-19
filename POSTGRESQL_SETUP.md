# PostgreSQL Setup Instructions for Perry Eden Group

## Quick Setup Options

### Option 1: Docker Setup (Recommended for Easy Start)

1. **Install Docker Desktop:**
   - Download: https://www.docker.com/products/docker-desktop
   - Install and start Docker Desktop

2. **Start PostgreSQL with Docker:**
   ```bash
   # Start PostgreSQL container
   docker-compose -f docker-compose.postgres.yml up -d
   
   # Check if running
   docker ps
   
   # View logs
   docker-compose -f docker-compose.postgres.yml logs postgres
   ```

3. **Access Database:**
   - **Database URL:** postgresql://perry_user:perry_secure_password_2025@localhost:5432/perry_eden_group
   - **pgAdmin:** http://localhost:8080 (admin@perryedengroup.com / admin123)

### Option 2: Local PostgreSQL Installation

1. **Download PostgreSQL:**
   - Visit: https://www.postgresql.org/download/windows/
   - Download PostgreSQL 15 or later
   - Install with default settings

2. **Create Database:**
   ```bash
   # Connect to PostgreSQL
   psql -U postgres
   
   # Create database
   CREATE DATABASE perry_eden_group;
   
   # Create user (optional)
   CREATE USER perry_user WITH PASSWORD 'your_secure_password';
   GRANT ALL PRIVILEGES ON DATABASE perry_eden_group TO perry_user;
   ```

3. **Update Environment:**
   - Update DATABASE_URL in .env.local with your credentials

### Option 3: Cloud Database (Production Ready)

**Supabase (Free tier):**
1. Visit: https://supabase.com
2. Create new project
3. Get connection string from Settings > Database
4. Update DATABASE_URL in .env.local

**Neon (Free tier):**
1. Visit: https://neon.tech
2. Create new project
3. Get connection string
4. Update DATABASE_URL in .env.local

## After Database Setup

1. **Install Dependencies:**
   ```bash
   npm install
   ```

2. **Generate Migration Files:**
   ```bash
   npm run db:generate
   ```

3. **Run Migrations:**
   ```bash
   npm run db:migrate
   ```

4. **Start Application:**
   ```bash
   npm run dev
   ```

5. **Verify Setup:**
   - Visit: http://localhost:3000
   - Check: http://localhost:3000/api/health

## Database Management

- **Drizzle Studio:** `npm run db:studio` (http://localhost:4983)
- **pgAdmin:** http://localhost:8080 (if using Docker)
- **Direct Connection:** Use any PostgreSQL client with connection string

## Troubleshooting

1. **Connection Issues:**
   - Check if PostgreSQL is running
   - Verify connection string in .env.local
   - Check firewall settings

2. **Docker Issues:**
   - Ensure Docker Desktop is running
   - Check container status: `docker ps`
   - View logs: `docker-compose logs`

3. **Migration Issues:**
   - Ensure database exists
   - Check connection permissions
   - Run: `npm run db:push` for schema sync

## Next Steps

After successful setup:
1. Run migrations: `npm run db:migrate`
2. Start application: `npm run dev`
3. Test all API endpoints
4. Deploy to production

## Support

For issues or questions:
- Check application health: http://localhost:3000/api/health
- Review logs in terminal
- Consult PostgreSQL documentation
