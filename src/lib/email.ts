import { CONTACT_EMAIL } from "@/lib/contact";

// No user name in emails: anyone can sign up with someone else's address and
// a "name" like "Your account is locked, call …", which we would then deliver.
type EmailRecipient = { email: string };

type AuthEmailPayload = {
  user: EmailRecipient;
  url: string;
};

type EmailContent = {
  user: EmailRecipient;
  subject: string;
  intro: string;
  /** Shown as a bulleted list after the intro. */
  items?: string[];
  linkLabel: string;
  url: string;
  footer: string;
  /** Label for the console fallback used when no email provider is configured. */
  devLabel: string;
};

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** The Resend request body for one email. */
function buildEmail({
  user,
  subject,
  intro,
  items = [],
  linkLabel,
  url,
  footer,
}: EmailContent) {
  const greeting = "Hi there,";
  const list = items.length
    ? `<ul>${items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>`
    : "";

  return {
    from: process.env.RESEND_FROM_EMAIL || "MoneyScope <onboarding@resend.dev>",
    reply_to: CONTACT_EMAIL,
    to: [user.email],
    subject,
    html: `<p>${escapeHtml(greeting)}</p><p>${escapeHtml(intro)}</p>${list}<p><a href="${escapeHtml(url)}">${escapeHtml(linkLabel)}</a></p><p>${escapeHtml(footer)}</p>`,
    text: [
      greeting,
      "",
      intro,
      ...items.map((item) => `- ${item}`),
      "",
      `${linkLabel}: ${url}`,
      "",
      footer,
    ].join("\n"),
  };
}

async function postToResend(path: string, body: unknown, apiKey: string) {
  const response = await fetch(`https://api.resend.com${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Failed to send email: ${response.status} ${text}`);
  }
}

async function sendAuthEmail(content: EmailContent) {
  const resendApiKey = process.env.RESEND_API_KEY;
  if (!resendApiKey) {
    console.info(`[Auth] ${content.devLabel} for ${content.user.email}: ${content.url}`);
    return;
  }
  await postToResend("/emails", buildEmail(content), resendApiKey);
}

export async function sendVerificationEmail({ user, url }: AuthEmailPayload) {
  await sendAuthEmail({
    user,
    url,
    subject: "Verify your email for MoneyScope",
    intro: "Please verify your email to activate your MoneyScope account.",
    linkLabel: "Verify email",
    footer: "If you did not create this account, you can ignore this message.",
    devLabel: "Verification link",
  });
}

export async function sendPasswordResetEmail({ user, url }: AuthEmailPayload) {
  await sendAuthEmail({
    user,
    url,
    subject: "Reset your MoneyScope password",
    intro:
      "We received a request to reset your MoneyScope password. This link expires in 1 hour.",
    linkLabel: "Reset password",
    footer:
      "If you did not request a password reset, you can ignore this message and your password will stay the same.",
    devLabel: "Password reset link",
  });
}

export type PaymentReminder = { email: string; items: string[] };

/**
 * One reminder email per user. Sent through Resend's batch endpoint (100
 * emails per request), since single sends would hit its 2-requests-per-second
 * limit with more than a few users.
 */
export async function sendPaymentReminderEmails(reminders: PaymentReminder[]) {
  const url = `${process.env.BETTER_AUTH_URL || "http://localhost:3000"}/dashboard`;
  const emails = reminders.map(({ email, items }) =>
    buildEmail({
      user: { email },
      subject: "Payments due soon on MoneyScope",
      intro: "These payments are due in the next few days:",
      items,
      linkLabel: "Open your dashboard",
      url,
      footer: "You can turn these reminders off in your MoneyScope profile settings.",
      devLabel: "Payment reminder",
    }),
  );

  const resendApiKey = process.env.RESEND_API_KEY;
  if (!resendApiKey) {
    for (const email of emails) {
      console.info(`[Reminders] Payment reminder for ${email.to[0]}:\n${email.text}`);
    }
    return;
  }
  for (let i = 0; i < emails.length; i += 100) {
    await postToResend("/emails/batch", emails.slice(i, i + 100), resendApiKey);
  }
}
