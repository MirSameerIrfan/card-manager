// Netlify runs this every day at 13:00 UTC on the published deploy (not on
// previews). The health check's query keeps the Supabase free-plan database
// from being paused for inactivity, and a failing check is reported to Sentry
// by /api/health itself.
export default async () => {
  const health = await fetch(new URL("/api/health", process.env.URL));
  if (!health.ok) {
    throw new Error(`Health check failed: ${health.status} ${await health.text()}`);
  }
};

export const config = { schedule: "0 13 * * *" };
