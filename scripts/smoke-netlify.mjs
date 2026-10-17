// Runs after the Netlify build (netlify.toml) and fails it if the bundled
// server cannot serve a page, or cannot load pg once Sentry is running (see
// traceDeps in vite.config.ts). A failed build keeps the previous deploy live.
import { randomBytes } from "node:crypto";
import { createRequire } from "node:module";
import path from "node:path";
import { pathToFileURL } from "node:url";

const main = path.resolve(".netlify/functions-internal/server/main.mjs");

// Sentry installs its module hooks only with a DSN; nothing listens on port 9.
process.env.SENTRY_DSN = "http://smoke@127.0.0.1:9/1";
// Keep the build away from the real database; the bundle runs in production
// mode, which requires the auth settings.
process.env.DATABASE_URL = "postgres://smoke:smoke@127.0.0.1:9/smoke";
process.env.BETTER_AUTH_URL = "http://localhost";
process.env.BETTER_AUTH_SECRET = randomBytes(32).toString("hex");

const { default: handler } = await import(pathToFileURL(main).href);
const res = await handler(new Request("http://localhost/"), {});
if (res.status !== 200) {
  throw new Error(`Smoke test: GET / returned ${res.status}`);
}
// The request above loaded the app and ran Sentry.init; pg must still load.
createRequire(main)("pg");

console.log("Smoke test passed: the server bundle serves / and loads pg.");
process.exit(0);
