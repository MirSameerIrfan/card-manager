type EmailRecipient = { email: string; name: string };

type AuthEmailPayload = {
  user: EmailRecipient;
  url: string;
};

type EmailContent = {
  user: EmailRecipient;
  subject: string;
  intro: string;
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

async function sendAuthEmail({
  user,
  subject,
  intro,
  linkLabel,
  url,
  footer,
  devLabel,
}: EmailContent) {
  const resendApiKey = process.env.RESEND_API_KEY;
  const from =
    process.env.RESEND_FROM_EMAIL || "MoneyScope <onboarding@resend.dev>";
  const greeting = `Hi ${user.name || "there"},`;

  const text = [greeting, "", intro, "", `${linkLabel}: ${url}`, "", footer].join(
    "\n",
  );

  if (!resendApiKey) {
    console.info(`[Auth] ${devLabel} for ${user.email}: ${url}`);
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
      subject,
      html: `<p>${escapeHtml(greeting)}</p><p>${escapeHtml(intro)}</p><p><a href="${escapeHtml(url)}">${escapeHtml(linkLabel)}</a></p><p>${escapeHtml(footer)}</p>`,
      text,
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Failed to send email: ${response.status} ${body}`);
  }
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
