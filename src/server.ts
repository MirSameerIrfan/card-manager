// Must stay the first import so Sentry.init runs before the rest of the server
// loads. Netlify can't start Node with --import, so the server entry loads it.
import "../instrument.server.mjs";
import { wrapFetchWithSentry } from "@sentry/tanstackstart-react";
import handler, { createServerEntry } from "@tanstack/react-start/server-entry";

export default createServerEntry(
  wrapFetchWithSentry({
    fetch(request: Request) {
      return handler.fetch(request);
    },
  }),
);
