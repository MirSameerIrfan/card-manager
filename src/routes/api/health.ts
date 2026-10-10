import { createFileRoute } from "@tanstack/react-router";
import { getPoolStats, prisma } from "@/lib/prisma";

export const Route = createFileRoute("/api/health")({
  server: {
    handlers: {
      GET: async () => {
        try {
          await prisma.$queryRaw`SELECT 1`;
          return Response.json({ status: "ok", pool: getPoolStats() });
        } catch (_error) {
          return Response.json(
            { status: "error", pool: getPoolStats() },
            { status: 503 },
          );
        }
      },
    },
  },
});
