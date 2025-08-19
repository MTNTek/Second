/**
 * PostgreSQL Database Setup Script for Perry Eden Group
 * Provides multiple setup options for PostgreSQL installation and configuration
 */

const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const { promisify } = require('util');

const execAsync = promisify(exec);

class PostgreSQLSetup {
  constructor() {
    this.projectRoot = process.cwd();
    this.envFile = path.join(this.projectRoot, '.env.local');
  }

  /**
   * Check system requirements and installed software
   */
  async checkSystemRequirements() {
    console.log('🔍 Checking system requirements...\n');
    
    const checks = {
      node: false,
      npm: false,
      git: false,
      postgresql: false,
      docker: false,
      psql: false
    };

    // Check Node.js
    try {
      const { stdout } = await execAsync('node --version');
      checks.node = true;
      console.log(`✅ Node.js: ${stdout.trim()}`);
    } catch (error) {
      console.log('❌ Node.js: Not found');
    }

    // Check npm
    try {
      const { stdout } = await execAsync('npm --version');
      checks.npm = true;
      console.log(`✅ npm: ${stdout.trim()}`);
    } catch (error) {
      console.log('❌ npm: Not found');
    }

    // Check Git
    try {
      const { stdout } = await execAsync('git --version');
      checks.git = true;
      console.log(`✅ Git: ${stdout.trim()}`);
    } catch (error) {
      console.log('❌ Git: Not found');
    }

    // Check PostgreSQL
    try {
      const { stdout } = await execAsync('pg_config --version');
      checks.postgresql = true;
      console.log(`✅ PostgreSQL: ${stdout.trim()}`);
    } catch (error) {
      console.log('❌ PostgreSQL: Not installed');
    }

    // Check psql client
    try {
      const { stdout } = await execAsync('psql --version');
      checks.psql = true;
      console.log(`✅ psql client: ${stdout.trim()}`);
    } catch (error) {
      console.log('❌ psql client: Not found');
    }

    // Check Docker
    try {
      const { stdout } = await execAsync('docker --version');
      checks.docker = true;
      console.log(`✅ Docker: ${stdout.trim()}`);
    } catch (error) {
      console.log('❌ Docker: Not installed');
    }

    console.log('\n');
    return checks;
  }

  /**
   * Display installation options
   */
  displayInstallationOptions() {
    console.log('🚀 PostgreSQL Setup Options for Perry Eden Group\n');
    console.log('Choose one of the following options:\n');
    
    console.log('📋 OPTION 1: Local PostgreSQL Installation (Recommended for Development)');
    console.log('   • Install PostgreSQL directly on Windows');
    console.log('   • Full control and best performance');
    console.log('   • Download: https://www.postgresql.org/download/windows/\n');
    
    console.log('🐳 OPTION 2: Docker PostgreSQL (Recommended for Easy Setup)');
    console.log('   • Install Docker Desktop first');
    console.log('   • Run PostgreSQL in a container');
    console.log('   • Download Docker: https://www.docker.com/products/docker-desktop\n');
    
    console.log('☁️ OPTION 3: Cloud PostgreSQL (Recommended for Production)');
    console.log('   • Use managed PostgreSQL service');
    console.log('   • Examples: AWS RDS, Google Cloud SQL, Azure Database\n');
    
    console.log('🟢 OPTION 4: Free Cloud Databases (Good for Testing)');
    console.log('   • Supabase (Free tier with 500MB)');
    console.log('   • ElephantSQL (Free tier with 20MB)');
    console.log('   • Neon (Free tier with 3GB)\n');
  }

  /**
   * Generate Docker Compose file for PostgreSQL
   */
  createDockerCompose() {
    const dockerCompose = `version: '3.8'

services:
  postgres:
    image: postgres:15-alpine
    container_name: perry_eden_postgres
    restart: always
    environment:
      POSTGRES_DB: perry_eden_group
      POSTGRES_USER: perry_user
      POSTGRES_PASSWORD: perry_secure_password_2025
      POSTGRES_HOST_AUTH_METHOD: md5
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./sql/init.sql:/docker-entrypoint-initdb.d/init.sql
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U perry_user -d perry_eden_group"]
      interval: 10s
      timeout: 5s
      retries: 5

  # Optional: pgAdmin for database management
  pgadmin:
    image: dpage/pgadmin4:latest
    container_name: perry_eden_pgadmin
    restart: always
    environment:
      PGADMIN_DEFAULT_EMAIL: admin@perryedengroup.com
      PGADMIN_DEFAULT_PASSWORD: admin123
    ports:
      - "8080:80"
    volumes:
      - pgadmin_data:/var/lib/pgadmin
    depends_on:
      - postgres

volumes:
  postgres_data:
  pgadmin_data:
`;

    const dockerPath = path.join(this.projectRoot, 'docker-compose.postgres.yml');
    fs.writeFileSync(dockerPath, dockerCompose);
    console.log(`✅ Created Docker Compose file: ${dockerPath}`);
    return dockerPath;
  }

  /**
   * Create SQL initialization script
   */
  createInitSQL() {
    const initSQL = `-- Perry Eden Group Database Initialization
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
`;

    const sqlDir = path.join(this.projectRoot, 'sql');
    if (!fs.existsSync(sqlDir)) {
      fs.mkdirSync(sqlDir, { recursive: true });
    }

    const initSQLPath = path.join(sqlDir, 'init.sql');
    fs.writeFileSync(initSQLPath, initSQL);
    console.log(`✅ Created SQL initialization script: ${initSQLPath}`);
    return initSQLPath;
  }

  /**
   * Update environment variables for PostgreSQL
   */
  updateEnvironmentConfig(option = 'local') {
    let databaseURL;
    
    switch (option) {
      case 'docker':
        databaseURL = 'postgresql://perry_user:perry_secure_password_2025@localhost:5432/perry_eden_group';
        break;
      case 'local':
        databaseURL = 'postgresql://postgres:your_password@localhost:5432/perry_eden_group';
        break;
      case 'cloud':
        databaseURL = 'postgresql://username:password@your-cloud-host:5432/perry_eden_group';
        break;
      default:
        databaseURL = 'postgresql://perry_user:perry_secure_password_2025@localhost:5432/perry_eden_group';
    }

    // Read current .env.local
    let envContent = '';
    if (fs.existsSync(this.envFile)) {
      envContent = fs.readFileSync(this.envFile, 'utf8');
    }

    // Update DATABASE_URL
    if (envContent.includes('DATABASE_URL=')) {
      envContent = envContent.replace(
        /DATABASE_URL=.*/,
        `DATABASE_URL="${databaseURL}"`
      );
    } else {
      envContent += `\n# PostgreSQL Database Configuration\nDATABASE_URL="${databaseURL}"\n`;
    }

    // Add additional PostgreSQL environment variables
    const additionalVars = `
# PostgreSQL Configuration Details
DB_HOST=localhost
DB_PORT=5432
DB_NAME=perry_eden_group
DB_USER=${option === 'docker' ? 'perry_user' : 'postgres'}
DB_PASSWORD=${option === 'docker' ? 'perry_secure_password_2025' : 'your_password'}
DB_SSL=false
DB_MAX_CONNECTIONS=20
`;

    if (!envContent.includes('DB_HOST=')) {
      envContent += additionalVars;
    }

    fs.writeFileSync(this.envFile, envContent);
    console.log(`✅ Updated environment configuration: ${this.envFile}`);
  }

  /**
   * Create setup instructions file
   */
  createSetupInstructions() {
    const instructions = `# PostgreSQL Setup Instructions for Perry Eden Group

## Quick Setup Options

### Option 1: Docker Setup (Recommended for Easy Start)

1. **Install Docker Desktop:**
   - Download: https://www.docker.com/products/docker-desktop
   - Install and start Docker Desktop

2. **Start PostgreSQL with Docker:**
   \`\`\`bash
   # Start PostgreSQL container
   docker-compose -f docker-compose.postgres.yml up -d
   
   # Check if running
   docker ps
   
   # View logs
   docker-compose -f docker-compose.postgres.yml logs postgres
   \`\`\`

3. **Access Database:**
   - **Database URL:** postgresql://perry_user:perry_secure_password_2025@localhost:5432/perry_eden_group
   - **pgAdmin:** http://localhost:8080 (admin@perryedengroup.com / admin123)

### Option 2: Local PostgreSQL Installation

1. **Download PostgreSQL:**
   - Visit: https://www.postgresql.org/download/windows/
   - Download PostgreSQL 15 or later
   - Install with default settings

2. **Create Database:**
   \`\`\`bash
   # Connect to PostgreSQL
   psql -U postgres
   
   # Create database
   CREATE DATABASE perry_eden_group;
   
   # Create user (optional)
   CREATE USER perry_user WITH PASSWORD 'your_secure_password';
   GRANT ALL PRIVILEGES ON DATABASE perry_eden_group TO perry_user;
   \`\`\`

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
   \`\`\`bash
   npm install
   \`\`\`

2. **Generate Migration Files:**
   \`\`\`bash
   npm run db:generate
   \`\`\`

3. **Run Migrations:**
   \`\`\`bash
   npm run db:migrate
   \`\`\`

4. **Start Application:**
   \`\`\`bash
   npm run dev
   \`\`\`

5. **Verify Setup:**
   - Visit: http://localhost:3000
   - Check: http://localhost:3000/api/health

## Database Management

- **Drizzle Studio:** \`npm run db:studio\` (http://localhost:4983)
- **pgAdmin:** http://localhost:8080 (if using Docker)
- **Direct Connection:** Use any PostgreSQL client with connection string

## Troubleshooting

1. **Connection Issues:**
   - Check if PostgreSQL is running
   - Verify connection string in .env.local
   - Check firewall settings

2. **Docker Issues:**
   - Ensure Docker Desktop is running
   - Check container status: \`docker ps\`
   - View logs: \`docker-compose logs\`

3. **Migration Issues:**
   - Ensure database exists
   - Check connection permissions
   - Run: \`npm run db:push\` for schema sync

## Next Steps

After successful setup:
1. Run migrations: \`npm run db:migrate\`
2. Start application: \`npm run dev\`
3. Test all API endpoints
4. Deploy to production

## Support

For issues or questions:
- Check application health: http://localhost:3000/api/health
- Review logs in terminal
- Consult PostgreSQL documentation
`;

    const instructionsPath = path.join(this.projectRoot, 'POSTGRESQL_SETUP.md');
    fs.writeFileSync(instructionsPath, instructions);
    console.log(`✅ Created setup instructions: ${instructionsPath}`);
    return instructionsPath;
  }

  /**
   * Main setup method
   */
  async setup() {
    console.log('🎯 Perry Eden Group - PostgreSQL Database Setup\n');
    
    // Check system requirements
    const checks = await this.checkSystemRequirements();
    
    // Display options
    this.displayInstallationOptions();
    
    // Create necessary files
    console.log('📝 Creating setup files...\n');
    
    this.createDockerCompose();
    this.createInitSQL();
    this.updateEnvironmentConfig('docker'); // Default to Docker setup
    this.createSetupInstructions();
    
    console.log('\n🎉 PostgreSQL setup files created successfully!\n');
    
    // Provide next steps based on available tools
    if (checks.docker) {
      console.log('🐳 Docker is available! You can start immediately:');
      console.log('   docker-compose -f docker-compose.postgres.yml up -d');
    } else if (checks.postgresql) {
      console.log('🐘 PostgreSQL is installed! Create the database:');
      console.log('   createdb perry_eden_group');
    } else {
      console.log('📋 Please install PostgreSQL or Docker, then follow the instructions in:');
      console.log('   POSTGRESQL_SETUP.md');
    }
    
    console.log('\n📖 Complete setup instructions: POSTGRESQL_SETUP.md');
    console.log('🔧 After database setup, run: npm run db:migrate');
    
    return {
      dockerAvailable: checks.docker,
      postgresqlAvailable: checks.postgresql,
      setupComplete: true
    };
  }
}

// Run setup if called directly
if (require.main === module) {
  const setup = new PostgreSQLSetup();
  setup.setup().catch(console.error);
}

module.exports = { PostgreSQLSetup };
