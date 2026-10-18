// Must stay the first import so Sentry.init runs before the rest of the server
// loads. Netlify can't start Node with --import, so the server entry loads it.
import "../instrument.server.mjs";
import { wrapFetchWithSentry } from "@sentry/tanstackstart-react";
import handler, { createServerEntry } from "@tanstack/react-start/server-entry";

export default createServerEntry(
  wrapFetchWithSentry({
    async fetch(request: Request) {
      const original = await handler.fetch(request);
      // Copied because some responses (Response.redirect) have read-only headers.
      const response = new Response(original.body, original);
      // No framing by other sites, so they can't overlay the app to steal clicks.
      response.headers.set("X-Frame-Options", "DENY");
      response.headers.set("Content-Security-Policy", "frame-ancestors 'none'");
      return response;
    },
  }),
);
