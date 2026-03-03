# Database Seeding Guide

## Overview

This seed script creates initial roles and a super admin account for the CMS.

## Setup Instructions

### 1. Configure Environment Variables

```bash
# Copy example env file
cp .env.example .env

# Edit .env and set admin credentials
ADMIN_NAME="Your Name"
ADMIN_EMAIL=youremail@example.com
ADMIN_PASSWORD=YourSecurePassword123!
```

### 2. Run Database Migrations

```bash
npm run prisma:migrate
```

### 3. Seed Database

```bash
npm run seed
```

## What Gets Created

### Roles

- **SUPER_ADMIN** - Full system access
- **ADMIN** - Manage users, all content
- **EDITOR** - Edit all posts, manage categories
- **AUTHOR** - Create/edit own posts
- **SUBSCRIBER** - Read-only access

### Super Admin Account

- Creates one super admin user with credentials from `.env`
- Email: Uses `ADMIN_EMAIL` (default: admin@example.com)
- Password: Uses `ADMIN_PASSWORD` (default: Admin@123456)
- Role: SUPER_ADMIN

## Usage

### First Time Setup

```bash
# Complete setup
npm run prisma:migrate
npm run seed

# Start server
npm run dev
```

### Re-running Seed

The seed script is **idempotent** - safe to run multiple times:

- Roles will be upserted (updated or created)
- Admin account only created if email doesn't exist
- Existing data is preserved

### After Seeding

1. Login with the seeded admin credentials
2. **Immediately change the password** via the update user endpoint
3. Create additional admin/editor accounts as needed

## Troubleshooting

### Error: "SUPER_ADMIN role not found"

Run migrations first: `npm run prisma:migrate`

### Error: "Email already exists"

An account with that email already exists. Use a different email or login with existing account.

### Wrong Password Set

If you need to reset the admin password:

1. Delete the user from database or
2. Change `ADMIN_EMAIL` in `.env` to create a new admin or
3. Manually update password in database

## Production Deployment

```bash
# 1. Set production environment variables
export DATABASE_URL="your-production-db-url"
export ADMIN_EMAIL="admin@yourdomain.com"
export ADMIN_PASSWORD="SecureProductionPassword"

# 2. Run migrations
npm run prisma:migrate

# 3. Seed initial data
npm run seed

# 4. Start application
npm start
```

## Security Notes

- ⚠️ Change default password immediately after first login
- ⚠️ Never commit `.env` file with real credentials
- ⚠️ Use strong passwords in production
- ⚠️ Consider removing seed admin after creating your own admin accounts
