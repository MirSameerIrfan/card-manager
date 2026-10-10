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
        user: { email: user.email, name: user.name },
        url,
      });
    },
  },

  emailVerification: {
    sendVerificationEmail: async ({ user, url }) => {
      await sendVerificationEmail({
        user: { email: user.email, name: user.name },
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
  },

  // better-auth rate limits /api/auth/* in production (sign-in and the
  // email-sending endpoints have stricter built-in rules). Counters live in the
  // database because in-memory counters reset per serverless instance.
  rateLimit: {
    storage: "database",
  },

  // IMPORTANT: must be invoked + last
  plugins: [tanstackStartCookies()],
});
