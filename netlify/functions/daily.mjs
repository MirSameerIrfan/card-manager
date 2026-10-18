import { createHmac } from "node:crypto";

// Netlify runs this every day at 13:00 UTC on the published deploy (not on
// previews). The health check's query keeps the Supabase free-plan database
// from being paused for inactivity, and a failing check is reported to Sentry
// by /api/health itself. Then it has the app send the payment reminders.
export default async () => {
  const health = await fetch(new URL("/api/health", process.env.URL));
  if (!health.ok) {
    throw new Error(`Health check failed: ${health.status} ${await health.text()}`);
  }

  // Same token as getCronToken in src/lib/reminders.ts
  const token = createHmac("sha256", process.env.BETTER_AUTH_SECRET ?? "")
    .update("cron")
    .digest("hex");
  const reminders = await fetch(new URL("/api/cron/reminders", process.env.URL), {
    method: "POST",
    headers: { authorization: `Bearer ${token}` },
  });
  if (!reminders.ok) {
    throw new Error(`Payment reminders failed: ${reminders.status} ${await reminders.text()}`);
  }
  console.log("Payment reminders:", await reminders.text());
};

export const config = { schedule: "0 13 * * *" };
