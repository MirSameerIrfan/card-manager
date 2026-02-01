# Database Setup Documentation

This document describes the database integration for the payment tracker dashboard.

## Overview

The dashboard has been successfully connected to a PostgreSQL database using Prisma ORM. The mock data has been replaced with real database queries while maintaining the exact same design and UI.

## Changes Made

### 1. Extended Prisma Schema

Added three new models to track financial data:

- **CreditCard**: Stores credit card information with fields for name, provider, amount due, due date, minimum payment, and status
- **Loan**: Stores loan information with fields for name, provider, monthly payment, next payment date, remaining balance, and auto-pay status
- **RecurringBill**: Stores recurring bills with fields for name, provider, amount, due date, category, and auto-pay status

All models are related to the User model for proper data isolation.

### 2. Database Infrastructure

Created the following files:

- `src/data/db.ts` - Database client singleton using Prisma
- `src/data/dashboard.functions.ts` - Server functions for fetching dashboard data using TanStack Start's `createServerFn`

### 3. Updated Dashboard Component

Modified `src/components/dashboard/Dashboard.tsx` to:

- Import and use server functions instead of mock data arrays
- Utilize React 19's `use()` hook for promise-based data fetching
- Implement proper Suspense boundaries with loading states
- Add empty state handling when no data exists
- Format dates and currency values properly
- Map database status values to UI-friendly labels

**Key Design Preservation**: All Tailwind classes, component structure, and visual design remain identical to the original.

### 4. Seed Script

Created `prisma/seed.ts` to populate the database with realistic test data that matches the original mock data.

### 5. Package.json Scripts

Added convenience scripts:
- `npm run db:migrate` - Run database migrations
- `npm run db:generate` - Generate Prisma Client
- `npm run db:seed` - Seed the database with test data

## Database Schema

```prisma
model CreditCard {
  id             String   @id @default(cuid())
  userId         String
  name           String
  provider       String
  amountDue      Float
  dueDate        DateTime
  minimumPayment Float
  status         String // "due_soon", "paid", "overdue"
  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt
  user           User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId])
  @@map("credit_card")
}

model Loan {
  id               String   @id @default(cuid())
  userId           String
  name             String
  provider         String
  monthlyPayment   Float
  nextPayment      DateTime
  remainingBalance Float
  autoPay          Boolean  @default(false)
  createdAt        DateTime @default(now())
  updatedAt        DateTime @updatedAt
  user             User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId])
  @@map("loan")
}

model RecurringBill {
  id        String   @id @default(cuid())
  userId    String
  name      String
  provider  String
  amount    Float
  dueDate   DateTime
  category  String
  autoPay   Boolean  @default(false)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId])
  @@map("recurring_bill")
}
```

## Server Functions

The dashboard uses four server functions:

1. **getCreditCardsFn()** - Fetches all credit cards for the logged-in user
2. **getLoansFn()** - Fetches all loans for the logged-in user
3. **getRecurringBillsFn()** - Fetches all recurring bills for the logged-in user
4. **getDashboardStatsFn()** - Calculates aggregate statistics:
   - Total amount due this month
   - Number of upcoming payments (within 7 days)
   - Number of items with auto-pay enabled

All server functions:
- Use `createServerFn` from TanStack Start
- Verify user authentication before querying
- Filter data by the authenticated user's ID
- Return properly typed data

## Setup Instructions

### Prerequisites

1. PostgreSQL database running locally or remotely
2. Node.js installed (version compatible with the project)
3. Environment variables configured

### Step 1: Configure Environment

Create a `.env` file in the project root:

```bash
DATABASE_URL="postgresql://user:password@localhost:5432/cardmanager"
```

Replace `user`, `password`, and database name with your actual credentials.

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Generate Prisma Client

```bash
npm run db:generate
```

### Step 4: Run Migrations

```bash
npm run db:migrate
```

This will create all the necessary database tables.

### Step 5: Seed the Database

```bash
npm run db:seed
```

This will populate the database with test data for the user `test@example.com`.

### Step 6: Start the Development Server

```bash
npm run dev
```

The dashboard will now display data from the database!

## How It Works

### Data Fetching Flow

1. User navigates to `/dashboard`
2. Route's `beforeLoad` function verifies authentication
3. Dashboard component initiates all data fetches in parallel
4. Each section uses `Suspense` boundaries for independent loading
5. The `use()` hook suspends rendering until data arrives
6. Data is formatted and displayed using the same UI components

### React 19 Features Used

- **`use()` hook**: Unwraps promises for async data fetching
- **Suspense boundaries**: Independent loading states for each dashboard section
- **No React import**: New JSX transform doesn't require React in scope
- **Ref as prop**: Modern ref handling without `forwardRef`

### Authentication & Security

- All server functions verify the user is authenticated
- Database queries filter by `userId` to ensure data isolation
- Prisma's type safety prevents SQL injection
- CASCADE delete ensures data cleanup when users are removed

## Testing

### Build Verification

```bash
npm run build
```

Should complete without TypeScript errors.

### Manual Testing

1. Sign up or log in with a test account
2. Navigate to the dashboard
3. Verify all sections display data correctly:
   - Statistics cards show calculated values
   - Credit cards section displays cards with status badges
   - Loans section shows loan information
   - Recurring bills section lists all bills
4. Check loading states by throttling network
5. Test empty states by logging in as a new user

## Future Enhancements

Potential improvements:

1. **CRUD Operations**: Add ability to create, update, and delete items
2. **Real-time Updates**: Use subscriptions or polling for live data
3. **Filtering & Sorting**: Allow users to filter by status, sort by date, etc.
4. **Search**: Add search functionality across all payment types
5. **Analytics**: Add charts and graphs for spending insights
6. **Notifications**: Email/push notifications for upcoming payments
7. **Payment History**: Track payment history and trends
8. **Budget Management**: Set budgets and track spending
9. **Export**: Allow exporting data to CSV/PDF

## Troubleshooting

### Cannot connect to database

- Verify PostgreSQL is running
- Check DATABASE_URL in .env file
- Ensure database exists and credentials are correct

### Prisma Client not found

Run: `npm run db:generate`

### Migration errors

- Check if database is accessible
- Ensure DATABASE_URL is correct
- Try resetting the database (WARNING: destroys data):
  ```bash
  npx prisma migrate reset
  ```

### Loading states never resolve

- Check if server functions are properly exported
- Verify authentication is working
- Check browser console for errors
- Ensure database has data (run seed script)

## Architecture Decisions

### Why Prisma?

- Type-safe database queries
- Excellent TypeScript integration
- Built-in migrations
- Works well with PostgreSQL
- Easy to use and maintain

### Why TanStack Start Server Functions?

- Seamless client-server data flow
- Type-safe end-to-end
- Automatic serialization
- Built-in error handling
- Perfect for React Server Components

### Why use() Hook?

- Modern React 19 pattern for async data
- Works seamlessly with Suspense
- Cleaner than useEffect + useState
- Better error handling
- Supports concurrent rendering

### Design Preservation

The original dashboard design was carefully preserved:
- All Tailwind classes remain identical
- Component hierarchy unchanged
- Icons and colors match exactly
- Animations and hover effects intact
- Responsive breakpoints preserved

## Performance Considerations

- All dashboard data fetches happen in parallel
- Each section has independent Suspense boundaries
- Database queries use indexes for efficiency
- Prisma generates optimized SQL
- Client-side data is automatically cached by TanStack

## Conclusion

The dashboard has been successfully connected to a PostgreSQL database while maintaining the exact same beautiful design. The implementation uses modern React 19 patterns, type-safe server functions, and follows best practices for security and performance.
