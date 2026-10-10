import { describe, expect, it } from "vitest";
import { getPoolConfig, POOL_DEFAULTS } from "./db-pool";

describe("getPoolConfig", () => {
  it("uses the defaults when no pool variables are set", () => {
    expect(getPoolConfig({ DATABASE_URL: "postgres://localhost/app" })).toEqual({
      connectionString: "postgres://localhost/app",
      ...POOL_DEFAULTS,
    });
  });

  it("reads pool limits from the environment", () => {
    const config = getPoolConfig({
      DATABASE_URL: "postgres://localhost/app",
      DATABASE_POOL_MAX: "20",
      DATABASE_POOL_IDLE_TIMEOUT_MS: "30000",
      DATABASE_POOL_CONNECTION_TIMEOUT_MS: "2000",
    });

    expect(config.max).toBe(20);
    expect(config.idleTimeoutMillis).toBe(30000);
    expect(config.connectionTimeoutMillis).toBe(2000);
  });

  it.each(["0", "-3", "1.5", "abc", ""])(
    "falls back to the default for the invalid value %j",
    (value) => {
      const config = getPoolConfig({
        DATABASE_POOL_MAX: value,
        DATABASE_POOL_IDLE_TIMEOUT_MS: value,
        DATABASE_POOL_CONNECTION_TIMEOUT_MS: value,
      });

      expect(config.max).toBe(POOL_DEFAULTS.max);
      expect(config.idleTimeoutMillis).toBe(POOL_DEFAULTS.idleTimeoutMillis);
      expect(config.connectionTimeoutMillis).toBe(
        POOL_DEFAULTS.connectionTimeoutMillis,
      );
    },
  );
});
