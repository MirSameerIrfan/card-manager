import * as Sentry from "@sentry/tanstackstart-react";
import { createRouter } from "@tanstack/react-router";

// Import the generated route tree
import { routeTree } from "./routeTree.gen";

const stripQueryString = (url: string) => url.split("?")[0];

// Create a new router instance
export const getRouter = () => {
  const router = createRouter({
    routeTree,
    context: {},

    scrollRestoration: true,
    // Start loading a route's code and beforeLoad check when a link is
    // hovered or focused, so the page is ready by the time it is clicked.
    defaultPreload: "intent",
  });
  if (!router.isServer) {
    Sentry.init({
      dsn: import.meta.env.VITE_SENTRY_DSN,

      // Keep request headers and user IPs out of Sentry, for more info visit:
      // https://docs.sentry.io/platforms/javascript/guides/tanstackstart-react/configuration/options/#sendDefaultPii
      sendDefaultPii: false,

      // Query strings can carry password reset and verification tokens
      // (/auth/reset-password?token=…), so strip them from the page URL,
      // referrer and breadcrumbs before anything is sent.
      beforeSend(event) {
        if (event.request?.url) {
          event.request.url = stripQueryString(event.request.url);
        }
        const headers = event.request?.headers;
        if (headers?.Referer) {
          headers.Referer = stripQueryString(headers.Referer);
        }
        return event;
      },
      beforeBreadcrumb(breadcrumb) {
        const data = breadcrumb.data;
        if (data) {
          for (const key of ["url", "from", "to"]) {
            if (typeof data[key] === "string") {
              data[key] = stripQueryString(data[key]);
            }
          }
        }
        return breadcrumb;
      },
    });
  }

  return router;
};
