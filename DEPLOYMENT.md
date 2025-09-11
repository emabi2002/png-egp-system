# PNG e-Government Procurement System - Deployment Guide

## 🚀 Netlify Deployment Instructions

### Step 1: Repository Setup
Your repository is ready at: `https://github.com/npipng393-web/egp.git`

### Step 2: Netlify Configuration

1. **Connect to Netlify:**
   - Go to [netlify.com](https://netlify.com)
   - Click "New site from Git"
   - Connect your GitHub account
   - Select `npipng393-web/egp` repository

2. **Build Settings:**
   ```
   Base directory: (leave empty)
   Build command: npm run build
   Publish directory: .next
   Node version: 18.x
   ```

3. **Environment Variables:**
   Add these in Netlify Dashboard > Site Settings > Environment Variables:

   ```env
   # Production URL
   NEXTAUTH_URL=https://your-site-name.netlify.app

   # Security Keys (generate new ones for production)
   NEXTAUTH_SECRET=generate-a-long-random-string-here
   ENCRYPTION_KEY=generate-another-long-random-string
   JWT_SECRET=generate-third-random-string

   # Database (for production, use PostgreSQL)
   DATABASE_URL=file:./dev.db

   # Email Configuration (replace with your SMTP settings)
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your-email@domain.com
   SMTP_PASS=your-app-password
   FROM_EMAIL=PNG e-GP <noreply@png-egp.gov.pg>

   # Application
   NODE_ENV=production
   APP_NAME=PNG e-Government Procurement (e-GP)

   # Security Features
   ENABLE_2FA=true
   ENABLE_FILE_ENCRYPTION=true
   ENABLE_AUDIT_LOGS=true
   ```

### Step 3: Database Setup for Production

**Option A: Continue with SQLite (Simple)**
- Keep `DATABASE_URL=file:./dev.db`
- Data will reset on each deployment (suitable for demo)

**Option B: Upgrade to PostgreSQL (Recommended)**
- Use Supabase, Railway, or Planetscale
- Update `DATABASE_URL` to PostgreSQL connection string
- Run `npx prisma db push` to create tables

### Step 4: Post-Deployment Setup

1. **Seed Initial Data:**
   ```bash
   curl -X POST https://your-site.netlify.app/api/seed
   ```

2. **Test Admin Login:**
   - Email: `admin@npc.gov.pg`
   - Password: `TestAdmin123!`

3. **Test Registration:**
   - Try registering a new supplier account
   - Test agency user registration

### Step 5: Custom Domain (Optional)

1. In Netlify Dashboard: Domain Management > Add Custom Domain
2. Follow DNS configuration instructions
3. Update `NEXTAUTH_URL` environment variable

## 🛡️ Security Checklist

- [ ] Generate unique `NEXTAUTH_SECRET` for production
- [ ] Set up production email SMTP credentials
- [ ] Configure custom domain with SSL
- [ ] Enable Netlify's security headers
- [ ] Test all user flows in production

## 📊 Features Available After Deployment

✅ **Government Agency Portal**
- Tender creation and management
- Bid evaluation (coming soon)
- Contract management (coming soon)

✅ **Supplier Portal**
- Registration and KYC verification
- Bid submission and tracking
- Profile management

✅ **Public Portal**
- Tender browsing and search
- Transparency and reporting
- Public procurement data

✅ **Administration**
- User management
- System monitoring
- Audit logs and compliance

## 🔧 Troubleshooting

**Build Fails:**
- Check Node.js version is 18+
- Verify all environment variables are set
- Check build logs for specific errors

**Database Issues:**
- For SQLite: Ensure write permissions
- For PostgreSQL: Verify connection string
- Run `npx prisma db push` if needed

**Authentication Problems:**
- Verify `NEXTAUTH_URL` matches your domain
- Check `NEXTAUTH_SECRET` is set
- Ensure email configuration is correct

## 📞 Support

For deployment issues:
- Email: support@npc.gov.pg
- Repository: https://github.com/npipng393-web/egp

---

**Ready for Papua New Guinea's digital procurement transformation! 🇵🇬**
