# Perry Eden Group - Production Deployment Guide

## Prerequisites

### 1. Production Environment Setup
- Node.js 18+ 
- PostgreSQL 14+
- Domain name and SSL certificate
- SMTP email service
- Payment gateway accounts (PayTabs, Stripe)

### 2. Hosting Requirements
- **Recommended**: Vercel, Netlify, or AWS
- **Database**: PostgreSQL (Supabase, AWS RDS, or Railway)
- **File Storage**: AWS S3 or Cloudinary
- **Email**: SendGrid, AWS SES, or Gmail SMTP

## Deployment Steps

### Phase 1: Database Setup

1. **Create Production Database**
```bash
# Using Railway (recommended)
railway login
railway new
railway add postgresql

# Or using Supabase
# Create project at https://supabase.com
# Copy connection string
```

2. **Set Environment Variables**
```bash
# Create .env.production
DATABASE_URL=postgresql://user:pass@host:port/dbname
JWT_SECRET=your-production-jwt-secret-key
NEXTAUTH_SECRET=your-production-nextauth-secret
NEXTAUTH_URL=https://yourdomain.com

# Email Configuration
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=your-sendgrid-api-key

# Payment Gateways
PAYTABS_PROFILE_ID=your-paytabs-profile-id
PAYTABS_SERVER_KEY=your-paytabs-server-key
STRIPE_SECRET_KEY=sk_live_your-stripe-secret-key
STRIPE_PUBLISHABLE_KEY=pk_live_your-stripe-publishable-key

# File Upload (if using S3)
AWS_ACCESS_KEY_ID=your-aws-access-key
AWS_SECRET_ACCESS_KEY=your-aws-secret-key
AWS_S3_BUCKET=your-s3-bucket-name
AWS_REGION=us-east-1
```

3. **Run Database Migrations**
```bash
npm run db:generate
npm run db:migrate
```

### Phase 2: Application Deployment

#### Option A: Vercel Deployment (Recommended)

1. **Connect to GitHub**
```bash
# Push to GitHub repository
git add .
git commit -m "Production ready"
git push origin main
```

2. **Deploy on Vercel**
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables in Vercel dashboard
# https://vercel.com/dashboard
```

3. **Configure Domain**
- Add custom domain in Vercel dashboard
- Update DNS records
- SSL certificate will be automatic

#### Option B: Self-hosted Deployment

1. **Prepare Server**
```bash
# On Ubuntu/Debian server
sudo apt update
sudo apt install nodejs npm nginx postgresql

# Create application user
sudo useradd -m -s /bin/bash perry-eden
sudo su - perry-eden
```

2. **Deploy Application**
```bash
# Clone repository
git clone https://github.com/yourusername/perry-eden-group.git
cd perry-eden-group

# Install dependencies
npm install

# Build application
npm run build

# Set up PM2 for process management
npm install -g pm2
pm2 start npm --name "perry-eden" -- start
pm2 startup
pm2 save
```

3. **Configure Nginx**
```nginx
# /etc/nginx/sites-available/perry-eden
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

4. **SSL Certificate**
```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Get SSL certificate
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

### Phase 3: Production Configuration

1. **Security Hardening**
```bash
# Set secure environment variables
export NODE_ENV=production
export JWT_SECRET="$(openssl rand -base64 32)"
export NEXTAUTH_SECRET="$(openssl rand -base64 32)"

# Enable HTTPS only
# Add to next.config.js
const nextConfig = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains'
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          }
        ]
      }
    ]
  }
}
```

2. **Database Optimization**
```sql
-- Create database indexes for performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_travel_bookings_user_id ON travel_bookings(user_id);
CREATE INDEX idx_travel_bookings_status ON travel_bookings(status);
CREATE INDEX idx_visa_applications_user_id ON visa_applications(user_id);
CREATE INDEX idx_visa_applications_status ON visa_applications(status);
CREATE INDEX idx_work_permit_applications_user_id ON work_permit_applications(user_id);
CREATE INDEX idx_work_permit_applications_country ON work_permit_applications(country);
CREATE INDEX idx_payments_user_id ON payments(user_id);
CREATE INDEX idx_payments_status ON payments(status);

-- Set up automated backups
-- This depends on your database provider
```

3. **Monitoring Setup**
```bash
# Install monitoring tools
npm install @sentry/nextjs

# Add to next.config.js
const { withSentryConfig } = require('@sentry/nextjs');

# Set up health check endpoint
# Create app/api/health/route.ts
```

### Phase 4: Testing & Launch

1. **Pre-launch Checklist**
- [ ] All environment variables set
- [ ] Database migrations completed
- [ ] SSL certificate installed
- [ ] Email sending working
- [ ] Payment processing tested
- [ ] Admin access configured
- [ ] Backup system in place
- [ ] Monitoring alerts configured

2. **Smoke Tests**
```bash
# Test critical endpoints
curl https://yourdomain.com/api/health
curl -X POST https://yourdomain.com/api/contact \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@example.com","subject":"Test","message":"Test"}'
```

3. **Go Live**
- Update DNS to point to production server
- Monitor logs for errors
- Test all forms and payment flows
- Verify email notifications

## Post-Deployment Maintenance

### Daily Tasks
- Monitor application logs
- Check payment processing
- Review new applications

### Weekly Tasks
- Database performance review
- Security updates
- Backup verification

### Monthly Tasks
- SSL certificate renewal (if manual)
- Performance optimization
- Feature updates deployment

## Troubleshooting

### Common Issues

1. **Database Connection Errors**
```bash
# Check connection string
psql $DATABASE_URL

# Verify credentials
npm run db:studio
```

2. **Email Not Sending**
```bash
# Test SMTP settings
node -e "
const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransporter({...});
transporter.verify().then(console.log).catch(console.error);
"
```

3. **Payment Processing Issues**
```bash
# Check API keys and webhooks
# Verify test vs production endpoints
# Check payment gateway logs
```

### Monitoring Commands
```bash
# Check application status
pm2 status
pm2 logs perry-eden

# Monitor server resources
htop
df -h
free -m

# Database queries
psql $DATABASE_URL -c "SELECT COUNT(*) FROM users;"
psql $DATABASE_URL -c "SELECT status, COUNT(*) FROM travel_bookings GROUP BY status;"
```

## Scaling Considerations

### When to Scale
- Database queries > 100ms
- Memory usage > 80%
- CPU usage > 70%
- Response times > 2 seconds

### Scaling Options
1. **Vertical Scaling**: Increase server resources
2. **Horizontal Scaling**: Add more server instances
3. **Database Scaling**: Read replicas, connection pooling
4. **CDN**: Add Cloudflare or AWS CloudFront
5. **Caching**: Redis for session storage and caching

## Support & Maintenance

### Emergency Contacts
- Server Host Support
- Database Provider Support
- Payment Gateway Support
- Domain Registrar Support

### Backup Strategy
- Daily automated database backups
- Weekly file system backups
- Monthly disaster recovery tests
- Offsite backup storage

This deployment guide ensures a robust, secure, and scalable production environment for the Perry Eden Group platform.
