import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

export const getDashboardDataFn = createServerFn({ method: "GET" }).handler(
  async () => {
    const req = getRequest();

    // 1. Get current user session
    const session = await auth.api.getSession({
      headers: Object.fromEntries(req.headers.entries()),
    });

    if (!session?.user || session.user.emailVerified !== true) {
      throw new Error("Unauthorized");
    }

    const userId = session.user.id;

    // 2. Fetch data in parallel
    const [creditCards, loans, recurringBills] = await Promise.all([
      prisma.credit_card.findMany({
        where: { userId },
        orderBy: { dueDate: "asc" },
      }),
      prisma.loan.findMany({
        where: { userId },
        orderBy: { nextPayment: "asc" },
      }),
      prisma.recurring_bill.findMany({
        where: { userId },
        orderBy: { dueDate: "asc" },
      }),
    ]);

    // 3. Calculate Stats
    // Extract UTC date parts to avoid timezone offset shifting the day.
    // e.g. "2026-05-12T00:00:00.000Z" must be treated as May 12, not May 11 in ET.
    const localNow = new Date();
    const today = new Date(localNow.getFullYear(), localNow.getMonth(), localNow.getDate());

    const normalizeToDay = (date: Date | string) => {
      const iso = new Date(date).toISOString();
      const [year, month, day] = iso.split('T')[0].split('-').map(Number);
      return new Date(year, month - 1, day);
    };

    const allPayments = [
      ...creditCards.map((c) => ({
        amount: c.amountDue,
        date: c.dueDate,
        status: c.status,
      })),
      ...loans.map((l) => ({
        amount: l.monthlyPayment,
        date: l.nextPayment,
        status: l.autoPay ? "Auto-pay on" : "Manual",
      })),
      ...recurringBills.map((b) => ({
        amount: b.amount,
        date: b.dueDate,
        status: b.autoPay ? "Auto-pay on" : "Manual",
      })),
    ];

    // Only count payments that are due today or in the future
    const upcomingPayments = allPayments.filter(
      (p) => normalizeToDay(p.date) >= today,
    );

    const totalDue = upcomingPayments.reduce((sum, p) => sum + p.amount, 0);

    // Re-calculate Auto-Pay strictly from DB flags (only upcoming)
    const loanAutoPay = loans.filter(
      (l) => l.autoPay && normalizeToDay(l.nextPayment) >= today,
    ).length;
    const billAutoPay = recurringBills.filter(
      (b) => b.autoPay && normalizeToDay(b.dueDate) >= today,
    ).length;
    const autoPayCount = loanAutoPay + billAutoPay;

    return {
      user: {
        name: session.user.name ?? null,
        email: session.user.email ?? null,
      },
      stats: {
        totalDue,
        upcomingPaymentsCount: upcomingPayments.length,
        autoPayCount,
      },
      creditCards,
      loans,
      recurringBills,
    };
  },
);
// Add Payment Mutation
const AddPaymentSchema = z.object({
  type: z.enum(["credit_card", "loan", "recurring_bill"]),
  name: z.string().min(1),
  provider: z.string().min(1),
  amount: z.number().min(0),
  date: z.string(), // ISO date string
  // Type specific fields
  minimumPayment: z.number().optional(),
  status: z.string().optional(),
  category: z.string().optional(),
  autoPay: z.boolean().optional(),
  frequency: z.enum(["monthly", "biweekly"]).optional(),
});

export const addPaymentFn = createServerFn({ method: "POST" })
  .inputValidator(AddPaymentSchema)
  .handler(async ({ data }) => {
    const req = getRequest();

    const session = await auth.api.getSession({
      headers: Object.fromEntries(req.headers.entries()),
    });

    if (!session?.user || session.user.emailVerified !== true) {
      throw new Error("Unauthorized");
    }

    const userId = session.user.id;
    const date = new Date(data.date);

    try {
      if (data.type === "credit_card") {
        await prisma.credit_card.create({
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
        await prisma.loan.create({
          data: {
            userId,
            name: data.name,
            provider: data.provider,
            monthlyPayment: data.amount,
            nextPayment: date,
            remainingBalance: 0, // Default or add field? Let's assume 0 for now or add to schema
            autoPay: data.autoPay || false,
            updatedAt: new Date(),
          },
        });
      } else if (data.type === "recurring_bill") {
        await prisma.recurring_bill.create({
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
  });

const UpdatePaymentSchema = AddPaymentSchema.extend({
  id: z.string(),
  remainingBalance: z.number().optional(),
});

export const updatePaymentFn = createServerFn({ method: "POST" })
  .inputValidator(UpdatePaymentSchema)
  .handler(async ({ data }) => {
    const req = getRequest();

    const session = await auth.api.getSession({
      headers: Object.fromEntries(req.headers.entries()),
    });

    if (!session?.user || session.user.emailVerified !== true) {
      throw new Error("Unauthorized");
    }

    const userId = session.user.id;
    const date = new Date(data.date);

    try {
      if (data.type === "credit_card") {
        // Verify ownership before updating — Prisma update() only accepts unique fields in where
        const existing = await prisma.credit_card.findUnique({ where: { id: data.id } });
        if (!existing || existing.userId !== userId) {
          return { success: false, error: "Payment not found" };
        }
        await prisma.credit_card.update({
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
        const existing = await prisma.loan.findUnique({ where: { id: data.id } });
        if (!existing || existing.userId !== userId) {
          return { success: false, error: "Payment not found" };
        }
        await prisma.loan.update({
          where: { id: data.id },
          data: {
            name: data.name,
            provider: data.provider,
            monthlyPayment: data.amount,
            nextPayment: date,
            remainingBalance: data.remainingBalance ?? existing.remainingBalance,
            autoPay: data.autoPay ?? false,
            updatedAt: new Date(),
          },
        });
      } else if (data.type === "recurring_bill") {
        const existing = await prisma.recurring_bill.findUnique({ where: { id: data.id } });
        if (!existing || existing.userId !== userId) {
          return { success: false, error: "Payment not found" };
        }
        await prisma.recurring_bill.update({
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
  });

const DeletePaymentSchema = z.object({
  id: z.string(),
  type: z.enum(["credit_card", "loan", "recurring_bill"]),
});

export const deletePaymentFn = createServerFn({ method: "POST" })
  .inputValidator(DeletePaymentSchema)
  .handler(async ({ data }) => {
    const req = getRequest();

    const session = await auth.api.getSession({
      headers: Object.fromEntries(req.headers.entries()),
    });

    if (!session?.user || session.user.emailVerified !== true) {
      throw new Error("Unauthorized");
    }

    const userId = session.user.id;

    try {
      if (data.type === "credit_card") {
        await prisma.credit_card.delete({
          where: { id: data.id, userId },
        });
      } else if (data.type === "loan") {
        await prisma.loan.delete({
          where: { id: data.id, userId },
        });
      } else if (data.type === "recurring_bill") {
        await prisma.recurring_bill.delete({
          where: { id: data.id, userId },
        });
      }
      return { success: true };
    } catch (e) {
      console.error("Failed to delete payment", e);
      return { success: false, error: "Failed to delete payment" };
    }
  });
