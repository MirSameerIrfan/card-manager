import * as Sentry from "@sentry/tanstackstart-react";

Sentry.init({
  dsn: process.env.SENTRY_DSN,

  // Keep default PII (IP addresses, cookies, request headers) out of Sentry:
  // this app handles sessions and financial data.
  sendDefaultPii: false,
});
