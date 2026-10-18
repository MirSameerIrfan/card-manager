/**
 * Seeds a demo account with sample credit cards, loans and recurring bills.
 *
 *   npm run seed            (runs `prisma db seed`, configured in prisma.config.ts)
 *
 * Log in with demo@example.com / password1234. The user is created with its
 * email already verified, so no verification link is needed.
 *
 * Safe to re-run: the demo user is deleted (cascading to its sessions, accounts
 * and payments) and recreated. Due dates are relative to today, so re-running
 * also refreshes the dashboard's mix of overdue / due soon / auto-pay payments.
 *
 * It only runs against a database on this machine (see assertLocalDatabase).
 */
import "dotenv/config";
import { auth } from "@/lib/auth";
import { pool, prisma } from "@/lib/prisma";

/** The seed deletes users, so refuse anything but a local database. */
function assertLocalDatabase() {
  const { hostname } = new URL(process.env.DATABASE_URL ?? "");
  if (!["localhost", "127.0.0.1", "[::1]"].includes(hostname)) {
    throw new Error(
      `Refusing to seed ${hostname}: the seed only runs against a local database.`,
    );
  }
}

const DEMO_USER = {
  email: "demo@example.com",
  password: "password1234",
  name: "Demo User",
};

/**
 * Due date `offset` days from today, stored as UTC midnight of that calendar
 * day (the format the app writes; see parseDueDate in dashboard-utils.ts).
 */
function dueInDays(offset: number) {
  const today = new Date();
  return new Date(
    Date.UTC(today.getFullYear(), today.getMonth(), today.getDate() + offset),
  );
}

/**
 * Create the user and its email/password account the same way better-auth's
 * sign-up does, but already verified and without sending a verification email.
 */
async function createDemoUser() {
  const ctx = await auth.$context;
  const passwordHash = await ctx.password.hash(DEMO_USER.password);

  const user = await ctx.internalAdapter.createUser({
    email: DEMO_USER.email,
    name: DEMO_USER.name,
    emailVerified: true,
  }, { method: "email-password" });

  await ctx.internalAdapter.linkAccount({
    userId: user.id,
    providerId: "credential",
    accountId: user.id,
    password: passwordHash,
  });

  return user;
}

async function main() {
  assertLocalDatabase();
  console.log("Seeding demo data...");

  const { count } = await prisma.user.deleteMany({
    where: { email: DEMO_USER.email },
  });
  if (count > 0) {
    console.log(`Removed existing ${DEMO_USER.email} and its data.`);
  }

  const user = await createDemoUser();
  const userId = user.id;
  // The payment tables have no @updatedAt, so it must be set explicitly.
  const updatedAt = new Date();

  // Display status is derived from the due date and autoPay at render time
  // (getPaymentStatus): past dates are Overdue, otherwise Auto-Pay or Due Soon.
  // Credit cards have no autoPay, so they are always Due Soon until overdue.
  const [creditCards, loans, recurringBills] = await prisma.$transaction([
    prisma.credit_card.createMany({
      data: [
        {
          userId,
          name: "Discover It",
          provider: "••••3421",
          amountDue: 456.75,
          dueDate: dueInDays(-3), // Overdue
          minimumPayment: 25,
          status: "Due Soon",
          updatedAt,
        },
        {
          userId,
          name: "Chase Sapphire Reserve",
          provider: "••••4589",
          amountDue: 1247.5,
          dueDate: dueInDays(2),
          minimumPayment: 35,
          status: "Due Soon",
          updatedAt,
        },
        {
          userId,
          name: "American Express Gold",
          provider: "••••8765",
          amountDue: 892.3,
          dueDate: dueInDays(16),
          minimumPayment: 25,
          status: "Due Soon",
          updatedAt,
        },
      ],
    }),
    prisma.loan.createMany({
      data: [
        {
          userId,
          name: "Student Loan",
          provider: "Sallie Mae",
          monthlyPayment: 325,
          nextPayment: dueInDays(5),
          remainingBalance: 28500,
          autoPay: false,
          updatedAt,
        },
        {
          userId,
          name: "Auto Loan",
          provider: "Honda Finance",
          monthlyPayment: 485,
          nextPayment: dueInDays(9),
          remainingBalance: 18250,
          autoPay: true,
          updatedAt,
        },
        {
          userId,
          name: "Mortgage",
          provider: "Wells Fargo",
          monthlyPayment: 2150,
          nextPayment: dueInDays(21),
          remainingBalance: 325000,
          autoPay: true,
          updatedAt,
        },
      ],
    }),
    prisma.recurring_bill.createMany({
      data: [
        {
          userId,
          name: "Netflix Premium",
          provider: "Netflix",
          amount: 19.99,
          dueDate: dueInDays(0), // Due today
          category: "Subscription",
          frequency: "monthly",
          autoPay: true,
          updatedAt,
        },
        {
          userId,
          name: "House Cleaning",
          provider: "Sparkle Home Services",
          amount: 120,
          dueDate: dueInDays(3),
          category: "Household",
          frequency: "biweekly",
          autoPay: false,
          updatedAt,
        },
        {
          userId,
          name: "Electric",
          provider: "Pacific Gas & Electric",
          amount: 145.3,
          dueDate: dueInDays(6),
          category: "Utilities",
          frequency: "monthly",
          autoPay: false,
          updatedAt,
        },
        {
          userId,
          name: "Internet",
          provider: "Comcast Xfinity",
          amount: 89.99,
          dueDate: dueInDays(11),
          category: "Utilities",
          frequency: "monthly",
          autoPay: true,
          updatedAt,
        },
        {
          userId,
          name: "Phone Plan",
          provider: "T-Mobile",
          amount: 75,
          dueDate: dueInDays(13),
          category: "Utilities",
          frequency: "monthly",
          autoPay: true,
          updatedAt,
        },
        {
          userId,
          name: "Home Insurance",
          provider: "State Farm",
          amount: 125,
          dueDate: dueInDays(26),
          category: "Insurance",
          frequency: "monthly",
          autoPay: false,
          updatedAt,
        },
      ],
    }),
  ]);

  console.log(
    `Created ${user.email} (${user.id}) with ${creditCards.count} credit cards, ` +
      `${loans.count} loans and ${recurringBills.count} recurring bills.`,
  );
  console.log(`Log in with ${DEMO_USER.email} / ${DEMO_USER.password}`);
}

try {
  await main();
} catch (error) {
  console.error("Seeding failed:", error);
  process.exitCode = 1;
} finally {
  // src/lib/prisma.ts hands its pool to the Prisma adapter, which does not
  // close it on disconnect; end it too so the process can exit.
  await prisma.$disconnect();
  await pool.end();
}
