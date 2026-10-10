import * as Sentry from "@sentry/tanstackstart-react";
import { createRouter } from "@tanstack/react-router";

// Import the generated route tree
import { routeTree } from "./routeTree.gen";

// Create a new router instance
export const getRouter = () => {
  const router = createRouter({
    routeTree,
    context: {},

    scrollRestoration: true,
    defaultPreloadStaleTime: 0,
  });
  if (!router.isServer) {
    Sentry.init({
      dsn: import.meta.env.VITE_SENTRY_DSN,

      // Keep request headers and user IPs out of Sentry, for more info visit:
      // https://docs.sentry.io/platforms/javascript/guides/tanstackstart-react/configuration/options/#sendDefaultPii
      sendDefaultPii: false,
    });
  }

  return router;
};
