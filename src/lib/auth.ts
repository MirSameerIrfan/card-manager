import "dotenv/config";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { tanstackStartCookies } from "better-auth/tanstack-start";

import { prisma } from "@/lib/prisma";
import { sendPasswordResetEmail, sendVerificationEmail } from "@/lib/email";

const isProduction = process.env.NODE_ENV === "production";

if (isProduction && !process.env.BETTER_AUTH_URL) {
  throw new Error(
    "[auth] BETTER_AUTH_URL environment variable is required in production. " +
      "Set it to the full base URL of your application (e.g. https://yourdomain.com).",
  );
}

// better-auth has the same check, but it reads NODE_ENV at runtime, which
// Netlify doesn't set; without it, auth would run on better-auth's public
// default secret and anyone could sign email verification links.
if (isProduction && !process.env.BETTER_AUTH_SECRET) {
  throw new Error(
    "[auth] BETTER_AUTH_SECRET environment variable is required in production.",
  );
}

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",
  basePath: "/api/auth",

  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),

  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    resetPasswordTokenExpiresIn: 60 * 60,
    revokeSessionsOnPasswordReset: true,
    sendResetPassword: async ({ user, url }) => {
      await sendPasswordResetEmail({
        user: { email: user.email },
        url,
      });
    },
  },

  emailVerification: {
    sendVerificationEmail: async ({ user, url }) => {
      await sendVerificationEmail({
        user: { email: user.email },
        url,
      });
    },
    sendOnSignUp: true,
    sendOnSignIn: true,
    autoSignInAfterVerification: true,
  },

  user: {
    changeEmail: {
      enabled: true,
      updateEmailWithoutVerification: false,
    },
    // Exposed on session.user and settable through auth.api.updateUser.
    additionalFields: {
      paymentReminders: { type: "boolean", defaultValue: true, input: true },
    },
  },

  // better-auth rate limits /api/auth/* in production (sign-in and the
  // email-sending endpoints have stricter built-in rules). Counters live in the
  // database because in-memory counters reset per serverless instance.
  rateLimit: {
    // better-auth's default reads NODE_ENV at runtime, which Netlify doesn't
    // set, so it was off in production. isProduction is fixed at build time.
    enabled: isProduction,
    storage: "database",
  },

  advanced: {
    // Key rate limits on the IP Netlify saw. The default, X-Forwarded-For, is
    // set by the client, so a new fake IP per request escaped the limit.
    ipAddress: { ipAddressHeaders: ["x-nf-client-connection-ip"] },
    // Send auth emails after responding: awaiting them made the response for a
    // registered email slower, which told anyone which emails have accounts.
    // Netlify stops the function once it responds unless given the promise.
    backgroundTasks: {
      handler: (promise) =>
        (
          globalThis as {
            Netlify?: { context: { waitUntil(p: Promise<unknown>): void } | null };
          }
        ).Netlify?.context?.waitUntil(promise),
    },
  },

  // IMPORTANT: must be invoked + last
  plugins: [tanstackStartCookies()],
});
