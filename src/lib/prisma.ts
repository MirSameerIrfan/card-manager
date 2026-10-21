import { Pool } from "pg";
import { PrismaClient } from "../../generated/prisma/client";
export type { Prisma } from "../../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { getPoolConfig } from "@/lib/db-pool";

// One pool and one client per server instance. Stored on globalThis because
// dev HMR re-evaluates this module and would otherwise leak a pool each time.
const globalForDb = globalThis as unknown as {
  __dbPool?: Pool;
  __prisma?: PrismaClient;
  __dbShutdownHook?: boolean;
};

function createPool() {
  if (!process.env.DATABASE_URL) {
    console.warn("[db] DATABASE_URL is not set; database queries will fail.");
  }

  const pool = new Pool(getPoolConfig());

  // Idle clients emit "error" when the server or pooler drops them. Without a
  // listener that is an unhandled error and takes the process down.
  pool.on("error", (error) => {
    console.error("[db] Idle connection error:", error.message);
  });

  return pool;
}

export const pool = (globalForDb.__dbPool ??= createPool());

export const prisma = (globalForDb.__prisma ??= new PrismaClient({
  adapter: new PrismaPg(pool),
}));

export function getPoolStats() {
  return {
    max: pool.options.max,
    total: pool.totalCount,
    idle: pool.idleCount,
    waiting: pool.waitingCount,
  };
}

// Long-running server (`npm run start`): release connections on shutdown.
// Nitro handles the signal and exits; pool.end() waits for checked-out clients,
// so in-flight queries finish first.
if (process.env.NODE_ENV === "production" && !globalForDb.__dbShutdownHook) {
  globalForDb.__dbShutdownHook = true;

  const closePool = () => {
    void pool.end().catch(() => undefined);
  };

  process.once("SIGTERM", closePool);
  process.once("SIGINT", closePool);
}
