import { createHmac, timingSafeEqual } from "node:crypto";
import type { prisma } from "@/lib/prisma";
import { sendPaymentReminderEmails } from "@/lib/email";
import { formatCurrency, formatDate } from "@/components/dashboard/dashboard-utils";

/** Payments due today through this many days ahead are in the reminder. */
export const REMINDER_DAYS = 3;

/**
 * The bearer token netlify/functions/daily.mjs sends to /api/cron/reminders.
 * Derived from the auth secret so the job needs no secret of its own; the
 * function computes it the same way.
 */
export const getCronToken = (secret: string) =>
  createHmac("sha256", secret).update("cron").digest("hex");

export function isCronRequest(
  request: Request,
  secret = process.env.BETTER_AUTH_SECRET,
) {
  if (!secret) return false;
  const expected = Buffer.from(`Bearer ${getCronToken(secret)}`);
  const actual = Buffer.from(request.headers.get("authorization") ?? "");
  return actual.length === expected.length && timingSafeEqual(actual, expected);
}

/**
 * Email every verified user who hasn't turned reminders off a list of their
 * payments due from today through REMINDER_DAYS ahead, skipping auto-pay.
 * "Today" is the UTC day: the job runs at 13:00 UTC, when that is the same
 * calendar day in the Americas, Europe and most of Asia.
 */
// shortcut: one query and one request handle every user, which fits Netlify's
// 10 s function limit for a few thousand users; page the query beyond that.
export async function sendPaymentReminders(
  db: Pick<typeof prisma, "user">,
  now = new Date(),
  send = sendPaymentReminderEmails,
) {
  const today = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()),
  );
  const last = new Date(today);
  last.setUTCDate(today.getUTCDate() + REMINDER_DAYS);
  const due = { gte: today, lte: last };

  const users = await db.user.findMany({
    where: {
      emailVerified: true,
      paymentReminders: true,
      OR: [
        { credit_card: { some: { dueDate: due } } },
        { loan: { some: { nextPayment: due, autoPay: false } } },
        { recurring_bill: { some: { dueDate: due, autoPay: false } } },
      ],
    },
    select: {
      email: true,
      credit_card: {
        where: { dueDate: due },
        select: { name: true, amountDue: true, dueDate: true },
      },
      loan: {
        where: { nextPayment: due, autoPay: false },
        select: { name: true, monthlyPayment: true, nextPayment: true },
      },
      recurring_bill: {
        where: { dueDate: due, autoPay: false },
        select: { name: true, amount: true, dueDate: true },
      },
    },
  });

  const reminders = users.map((user) => {
    const payments = [
      ...user.credit_card.map((c) => ({ name: c.name, amount: c.amountDue, date: c.dueDate })),
      ...user.loan.map((l) => ({ name: l.name, amount: l.monthlyPayment, date: l.nextPayment })),
      ...user.recurring_bill.map((b) => ({ name: b.name, amount: b.amount, date: b.dueDate })),
    ].sort((a, b) => a.date.getTime() - b.date.getTime());

    return {
      email: user.email,
      items: payments.map(
        (p) => `${p.name}: ${formatCurrency(p.amount)} due ${formatDate(p.date)}`,
      ),
    };
  });

  await send(reminders);
  return { sent: reminders.length };
}
