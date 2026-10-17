import * as Sentry from "@sentry/tanstackstart-react";

Sentry.init({
  dsn: process.env.SENTRY_DSN,

  // sendDefaultPii: false only keeps IP addresses out. Sentry still attaches
  // cookies (the better-auth session token), request headers, request bodies
  // and query strings (password reset and verification tokens) to error events
  // unless they are switched off explicitly, as below.
  sendDefaultPii: false,
  integrations: [
    Sentry.requestDataIntegration({
      include: {
        cookies: false,
        headers: false,
        data: false,
        query_string: false,
      },
    }),
    Sentry.httpIntegration({ maxIncomingRequestBodySize: "none" }),
  ],
  beforeSend(event) {
    // The request URL is kept for debugging, but without its query string.
    if (event.request?.url) {
      event.request.url = event.request.url.split("?")[0];
    }
    return event;
  },
});
