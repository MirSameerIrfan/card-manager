// Server-only implementation of the dashboard server functions. The
// createServerFn wrappers in dashboard.functions.ts look up the session and
// pass it here together with the Prisma client, so this logic can be unit
// tested without a request or a database. Import this file only from server
// function handlers: TanStack Start refuses to bundle `*.server.*` files for
// the client.
import { z } from "zod";
import type { prisma } from "@/lib/prisma";
import { parseDueDate } from "./dashboard-utils";

/** The payment tables these functions read and write. */
export type PaymentDb = Pick<
  typeof prisma,
  "credit_card" | "loan" | "recurring_bill"
>;

/** The parts of a better-auth session these functions rely on. */
export type DashboardSession =
  | {
      user?: {
        id: string;
        emailVerified: boolean;
        name?: string | null;
        email?: string | null;
      } | null;
    }
  | null
  | undefined;

const requireVerifiedUser = (session: DashboardSession) => {
  if (!session?.user || session.user.emailVerified !== true) {
    throw new Error("Unauthorized");
  }
  return session.user;
};

export async function getDashboardData(
  db: PaymentDb,
  session: DashboardSession,
) {
  // 1. Require a verified user
  const user = requireVerifiedUser(session);
  const userId = user.id;

  // 2. Fetch data in parallel
  const [creditCards, loans, recurringBills] = await Promise.all([
    db.credit_card.findMany({
      where: { userId },
      orderBy: { dueDate: "asc" },
    }),
    db.loan.findMany({
      where: { userId },
      orderBy: { nextPayment: "asc" },
    }),
    db.recurring_bill.findMany({
      where: { userId },
      orderBy: { dueDate: "asc" },
    }),
  ]);

  return {
    user: {
      name: user.name ?? null,
      email: user.email ?? null,
    },
    creditCards,
    loans,
    recurringBills,
  };
}

// Capped so one account can't fill the database with megabyte-long strings.
const shortText = z.string().max(100);

// Add Payment Mutation
export const AddPaymentSchema = z.object({
  type: z.enum(["credit_card", "loan", "recurring_bill"]),
  name: shortText.min(1),
  provider: shortText.min(1),
  amount: z.number().min(0),
  date: z.string().refine((value) => parseDueDate(value) !== null), // YYYY-MM-DD
  // Type specific fields
  minimumPayment: z.number().min(0).optional(),
  remainingBalance: z.number().min(0).optional(),
  status: shortText.optional(),
  category: shortText.optional(),
  autoPay: z.boolean().optional(),
  frequency: z.enum(["monthly", "biweekly"]).optional(),
});

export async function addPayment(
  db: PaymentDb,
  session: DashboardSession,
  data: z.infer<typeof AddPaymentSchema>,
) {
  const userId = requireVerifiedUser(session).id;
  // Due dates are stored as UTC midnight; the schema guarantees this parses.
  const date = parseDueDate(data.date) ?? new Date(data.date);

  try {
    if (data.type === "credit_card") {
      await db.credit_card.create({
        data: {
          userId,
          name: data.name,
          provider: data.provider,
          amountDue: data.amount,
          dueDate: date,
          minimumPayment: data.minimumPayment || 0,
          status: data.status || "Due Soon",
          updatedAt: new Date(),
        },
      });
    } else if (data.type === "loan") {
      await db.loan.create({
        data: {
          userId,
          name: data.name,
          provider: data.provider,
          monthlyPayment: data.amount,
          nextPayment: date,
          remainingBalance: data.remainingBalance ?? 0,
          autoPay: data.autoPay || false,
          updatedAt: new Date(),
        },
      });
    } else if (data.type === "recurring_bill") {
      await db.recurring_bill.create({
        data: {
          userId,
          name: data.name,
          provider: data.provider,
          amount: data.amount,
          dueDate: date,
          category: data.category || "Utilities",
          autoPay: data.autoPay || false,
          frequency: data.frequency || "monthly",
          updatedAt: new Date(),
        },
      });
    }
    return { success: true };
  } catch (e) {
    console.error("Failed to add payment", e);
    return { success: false, error: "Failed to add payment" };
  }
}

export const UpdatePaymentSchema = AddPaymentSchema.extend({
  id: z.string(),
});

export async function updatePayment(
  db: PaymentDb,
  session: DashboardSession,
  data: z.infer<typeof UpdatePaymentSchema>,
) {
  const userId = requireVerifiedUser(session).id;
  // Due dates are stored as UTC midnight; the schema guarantees this parses.
  const date = parseDueDate(data.date) ?? new Date(data.date);

  try {
    if (data.type === "credit_card") {
      // Verify ownership before updating — Prisma update() only accepts unique fields in where
      const existing = await db.credit_card.findUnique({ where: { id: data.id } });
      if (!existing || existing.userId !== userId) {
        return { success: false, error: "Payment not found" };
      }
      await db.credit_card.update({
        where: { id: data.id },
        data: {
          name: data.name,
          provider: data.provider,
          amountDue: data.amount,
          dueDate: date,
          minimumPayment: data.minimumPayment ?? 0,
          status: data.status || "Due Soon",
          updatedAt: new Date(),
        },
      });
    } else if (data.type === "loan") {
      const existing = await db.loan.findUnique({ where: { id: data.id } });
      if (!existing || existing.userId !== userId) {
        return { success: false, error: "Payment not found" };
      }
      await db.loan.update({
        where: { id: data.id },
        data: {
          name: data.name,
          provider: data.provider,
          monthlyPayment: data.amount,
          nextPayment: date,
          remainingBalance: data.remainingBalance ?? 0,
          autoPay: data.autoPay ?? false,
          updatedAt: new Date(),
        },
      });
    } else if (data.type === "recurring_bill") {
      const existing = await db.recurring_bill.findUnique({ where: { id: data.id } });
      if (!existing || existing.userId !== userId) {
        return { success: false, error: "Payment not found" };
      }
      await db.recurring_bill.update({
        where: { id: data.id },
        data: {
          name: data.name,
          provider: data.provider,
          amount: data.amount,
          dueDate: date,
          category: data.category || "Utilities",
          autoPay: data.autoPay ?? false,
          frequency: data.frequency || "monthly",
          updatedAt: new Date(),
        },
      });
    }

    return { success: true };
  } catch (e) {
    console.error("Failed to update payment", e);
    return { success: false, error: "Failed to update payment" };
  }
}

export const DeletePaymentSchema = z.object({
  id: z.string(),
  type: z.enum(["credit_card", "loan", "recurring_bill"]),
});

export async function deletePayment(
  db: PaymentDb,
  session: DashboardSession,
  data: z.infer<typeof DeletePaymentSchema>,
) {
  const userId = requireVerifiedUser(session).id;

  try {
    if (data.type === "credit_card") {
      await db.credit_card.delete({
        where: { id: data.id, userId },
      });
    } else if (data.type === "loan") {
      await db.loan.delete({
        where: { id: data.id, userId },
      });
    } else if (data.type === "recurring_bill") {
      await db.recurring_bill.delete({
        where: { id: data.id, userId },
      });
    }
    return { success: true };
  } catch (e) {
    console.error("Failed to delete payment", e);
    return { success: false, error: "Failed to delete payment" };
  }
}
