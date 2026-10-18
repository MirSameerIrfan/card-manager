// Netlify runs this once a day on the published deploy (not on previews).
// The health check's query keeps the Supabase free-plan database from being
// paused for inactivity, and a failing check is reported to Sentry by
// /api/health itself.
export default async () => {
  const res = await fetch(new URL("/api/health", process.env.URL));
  if (!res.ok) {
    throw new Error(`Health check failed: ${res.status} ${await res.text()}`);
  }
};

export const config = { schedule: "@daily" };
