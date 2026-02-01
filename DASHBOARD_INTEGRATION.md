# Dashboard Database Integration

This document explains how the dashboard has been connected to the database and how to use it.

## Overview

The dashboard has been transformed from displaying mock data to fetching real data from a PostgreSQL database. The design remains 100% identical while now showing user-specific payment information.

## Database Schema

### Models Added

1. **CreditCard**
   - `id`: Unique identifier
   - `userId`: Link to user
   - `name`: Card name (e.g., "Chase Sapphire Reserve")
   - `provider`: Card provider
   - `lastFourDigits`: Last 4 digits of card number
   - `amountDue`: Current amount due
   - `dueDate`: Payment due date
   - `minimumPayment`: Minimum payment amount
   - `status`: Payment status ('due_soon', 'paid', 'overdue')

2. **Loan**
   - `id`: Unique identifier
   - `userId`: Link to user
   - `name`: Loan name (e.g., "Auto Loan")
   - `provider`: Loan provider
   - `monthlyPayment`: Monthly payment amount
   - `nextPaymentDate`: Next payment due date
   - `remainingBalance`: Outstanding balance
   - `autoPayEnabled`: Whether auto-pay is active

3. **RecurringBill**
   - `id`: Unique identifier
   - `userId`: Link to user
   - `name`: Bill name (e.g., "Internet")
   - `provider`: Service provider
   - `amount`: Bill amount
   - `dueDate`: Payment due date
   - `category`: Bill category ('Utilities', 'Subscription', 'Insurance', etc.)
   - `autoPayEnabled`: Whether auto-pay is active

## Setup Instructions

### 1. Database Setup

Ensure you have a PostgreSQL database and set the `DATABASE_URL` environment variable:

```bash
# .env file
DATABASE_URL="postgresql://user:password@localhost:5432/card_manager"
```

### 2. Run Migrations

Generate and apply the Prisma schema to your database:

```bash
npx prisma generate
npx prisma db push
```

### 3. Seed Sample Data

To populate your database with sample data for testing:

```bash
npm run db:seed
```

This creates a test user and sample credit cards, loans, and bills.

### 4. Test User Credentials

The seed script creates a test user with these credentials:
- Email: `test@example.com`
- Password: Set during signup

## How It Works

### Authentication & Authorization

1. Users must be logged in to access the dashboard
2. Data is scoped to the authenticated user - users only see their own payments
3. Authentication is handled via Better Auth with session management

### Data Flow

1. **Route Loader** (`src/routes/dashboard.tsx`):
   - Checks authentication before loading
   - Fetches dashboard data via `getDashboardDataFn`
   - Data is cached by TanStack Router

2. **Server Function** (`src/data/dashboard.ts`):
   - Validates user session
   - Fetches user-specific data from database
   - Uses singleton PrismaClient to prevent connection pool issues
   - Returns credit cards, loans, and recurring bills

3. **Dashboard Component** (`src/components/dashboard/Dashboard.tsx`):
   - Uses `useLoaderData()` to access pre-fetched data
   - Transforms database models to UI format
   - Calculates dynamic statistics
   - Renders the same beautiful UI with real data

### Dynamic Statistics

The dashboard calculates these statistics from your actual data:

- **Total Due This Month**: Sum of all payments due before the end of the current month
- **Upcoming Payments**: Count of payments due within the next 7 days
- **Auto-Pay Active**: Count of loans and bills with auto-pay enabled

## Development

### Adding Payment Data

You can add payment data via the database directly or by implementing Create/Update forms (not yet built).

Example SQL to add a credit card:

```sql
INSERT INTO credit_card (id, user_id, name, provider, last_four_digits, amount_due, due_date, minimum_payment, status, created_at, updated_at)
VALUES (
  'card_1',
  'your_user_id',
  'My Credit Card',
  'Bank Name',
  '1234',
  500.00,
  '2026-02-15',
  25.00,
  'due_soon',
  NOW(),
  NOW()
);
```

### Testing

1. Build the project:
   ```bash
   npm run build
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Navigate to http://localhost:3000/dashboard

## Architecture Decisions

### Singleton PrismaClient
To avoid connection pool exhaustion in serverless environments, we use a singleton pattern for PrismaClient instantiation.

### Route Loader Pattern
Data is fetched in the route loader rather than in the component to:
- Prevent refetches on re-renders
- Leverage TanStack Router's caching
- Improve performance and user experience

### Server Functions
All database queries happen server-side through TanStack Start server functions, ensuring:
- Database credentials never expose to the client
- Type-safe data fetching with full TypeScript support
- Automatic request/response serialization

## Future Enhancements

Potential features to add:
- [ ] Add Payment form (Create)
- [ ] Edit Payment details
- [ ] Delete Payments
- [ ] Payment history tracking
- [ ] Notifications for upcoming due dates
- [ ] Export payment data
- [ ] Analytics and spending insights
