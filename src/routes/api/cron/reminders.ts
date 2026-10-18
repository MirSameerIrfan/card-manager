import { createFileRoute } from "@tanstack/react-router";
import { prisma } from "@/lib/prisma";
import { isCronRequest, sendPaymentReminders } from "@/lib/reminders";

// Called once a day by netlify/functions/daily.mjs with a token only it has.
export const Route = createFileRoute("/api/cron/reminders")({
  server: {
    handlers: {
      POST: async ({ request }: { request: Request }) => {
        if (!isCronRequest(request)) {
          return new Response(null, { status: 401 });
        }
        return Response.json(await sendPaymentReminders(prisma));
      },
    },
  },
});
