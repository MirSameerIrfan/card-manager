import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  /** Base URL defaults to the current origin in the browser, which is correct
   *  for both dev (`http://localhost:3000`) and production. */
  basePath: "/api/auth",
});

export const { useSession, signIn, signUp, signOut } = authClient;
