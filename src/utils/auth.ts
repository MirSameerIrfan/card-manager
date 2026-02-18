import "dotenv/config";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { tanstackStartCookies } from "better-auth/tanstack-start";

import { PrismaClient } from "../../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

export const prisma = new PrismaClient({ adapter });

type VerificationEmailPayload = {
  user: { email: string; name: string };
  url: string;
};

async function sendVerificationEmail({ user, url }: VerificationEmailPayload) {
  const resendApiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL || "MoneyScope <onboarding@resend.dev>";

  const text = [
    `Hi ${user.name || "there"},`,
    "",
    "Please verify your email to activate your MoneyScope account.",
    "",
    `Verify email: ${url}`,
    "",
    "If you did not create this account, you can ignore this message.",
  ].join("\n");

  if (!resendApiKey) {
    console.info(`[Auth] Verification link for ${user.email}: ${url}`);
    return;
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${resendApiKey}`,
    },
    body: JSON.stringify({
      from,
      to: [user.email],
      subject: "Verify your email for MoneyScope",
      html: `<p>Hi ${user.name || "there"},</p><p>Please verify your email to activate your MoneyScope account.</p><p><a href="${url}">Verify email</a></p><p>If you did not create this account, you can ignore this message.</p>`,
      text,
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Failed to send verification email: ${response.status} ${body}`);
  }
}

export const auth = betterAuth({
  // IMPORTANT: match your mounted handler route
  basePath: "/api/auth",

  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),

  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
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

  // IMPORTANT: must be invoked + last
  plugins: [tanstackStartCookies()],
});
