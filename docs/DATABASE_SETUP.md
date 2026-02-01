# Database Setup Guide

This document explains how to set up the database for the Card Manager application.

## Prerequisites

- PostgreSQL 12 or higher installed
- Node.js 20+ installed
- npm or yarn package manager

## Quick Start

### 1. Set up PostgreSQL Database

You can use a local PostgreSQL installation or a cloud provider like Supabase, Neon, or Railway.

#### Option A: Local PostgreSQL

```bash
# Create a new database
createdb card_manager

# Or using psql
psql -U postgres
CREATE DATABASE card_manager;
\q
```

#### Option B: Using Docker

```bash
# Run PostgreSQL in Docker
docker run --name card-manager-db \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=card_manager \
  -p 5432:5432 \
  -d postgres:15

# Check if it's running
docker ps
```

### 2. Configure Environment Variables

```bash
# Copy the example environment file
cp .env.example .env

# Edit .env and update DATABASE_URL with your connection string
# Example for local PostgreSQL:
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/card_manager?schema=public"
```

### 3. Run Database Migrations

```bash
# Generate Prisma Client
npx prisma generate

# Create and apply migrations
npx prisma migrate dev --name init

# Or if migrations already exist, just apply them
npx prisma migrate deploy
```

### 4. Seed the Database (Optional)

To populate your database with sample data for testing:

```bash
# Update the seed script with a valid user ID first
# Edit prisma/seed.ts and replace 'demo-user-id' with an actual user ID from your database

# Then run the seed script
npx tsx prisma/seed.ts
```

**Note**: You'll need to create a user account first through the application's signup flow, then use that user's ID in the seed script.

## Database Schema

The application uses the following models:

### CreditCard
- Tracks credit card information
- Fields: name, provider, lastFourDigits, amountDue, dueDate, minimumPayment, isPaid, isOverdue

### Loan
- Tracks loan information (auto, mortgage, student loans, etc.)
- Fields: name, provider, monthlyPayment, nextPaymentDate, remainingBalance, isAutoPayOn

### RecurringBill
- Tracks recurring bills and subscriptions
- Fields: name, provider, amount, dueDate, category, isAutoPayOn

All models are linked to users via the `userId` field.

## Useful Prisma Commands

```bash
# Open Prisma Studio to view/edit data in the browser
npx prisma studio

# Check database schema status
npx prisma migrate status

# Reset database (WARNING: deletes all data)
npx prisma migrate reset

# Format Prisma schema file
npx prisma format
```

## Troubleshooting

### Connection Issues

If you can't connect to the database:

1. Check that PostgreSQL is running:
   ```bash
   # For local installation
   sudo systemctl status postgresql
   
   # For Docker
   docker ps | grep card-manager-db
   ```

2. Verify your DATABASE_URL is correct in `.env`

3. Check PostgreSQL logs for errors:
   ```bash
   # Local installation
   sudo journalctl -u postgresql
   
   # Docker
   docker logs card-manager-db
   ```

### Migration Issues

If migrations fail:

```bash
# Check migration status
npx prisma migrate status

# Resolve migration conflicts
npx prisma migrate resolve --applied <migration-name>

# Or reset and start fresh (WARNING: deletes all data)
npx prisma migrate reset
```

### Prisma Client Issues

If you get "Prisma Client not generated" errors:

```bash
# Regenerate Prisma Client
npx prisma generate
```

## Production Deployment

For production deployments:

1. Use a managed PostgreSQL service (e.g., AWS RDS, Supabase, Railway)
2. Set `DATABASE_URL` in your hosting environment variables
3. Run migrations during deployment:
   ```bash
   npx prisma migrate deploy
   ```
4. Ensure connection pooling is enabled for better performance

## Security Notes

- Never commit `.env` file to version control (it's in `.gitignore`)
- Use strong passwords for database users
- Restrict database access to only the application server
- Enable SSL for production database connections
- Regularly backup your database

## Additional Resources

- [Prisma Documentation](https://www.prisma.io/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [TanStack Start Documentation](https://tanstack.com/start)
