import type { PoolConfig } from "pg";

export const POOL_DEFAULTS = {
  max: 5,
  idleTimeoutMillis: 10_000,
  connectionTimeoutMillis: 5_000,
};

function readPositiveInt(value: string | undefined, fallback: number) {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
}

/**
 * Build the pg pool settings from the environment.
 *
 * `max` is per server instance. On serverless every instance has its own pool,
 * so keep it small and point DATABASE_URL at a connection pooler.
 */
export function getPoolConfig(
  env: Record<string, string | undefined> = process.env,
): PoolConfig {
  return {
    connectionString: env.DATABASE_URL,
    max: readPositiveInt(env.DATABASE_POOL_MAX, POOL_DEFAULTS.max),
    idleTimeoutMillis: readPositiveInt(
      env.DATABASE_POOL_IDLE_TIMEOUT_MS,
      POOL_DEFAULTS.idleTimeoutMillis,
    ),
    connectionTimeoutMillis: readPositiveInt(
      env.DATABASE_POOL_CONNECTION_TIMEOUT_MS,
      POOL_DEFAULTS.connectionTimeoutMillis,
    ),
  };
}
