import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { auth } from "@/lib/auth";
import { z } from "zod";

// Auth actions that check a password or send an email (sign in/up, resend
// verification, change email/password, password reset) are called from the
// browser through authClient instead of from here. better-auth only rate
// limits requests to /api/auth/*, not auth.api.* calls, and a server function
// is reachable by anyone: its id is a hash of this file's path and the export
// name, so it can be computed from the source.

const UpdateProfileNameSchema = z.object({
  name: z.string().trim().min(3),
});

function getRequestHeaders() {
  const req = getRequest();
  return Object.fromEntries(req.headers.entries());
}

// Get User Session
export const getSessionFn = createServerFn({ method: "GET" }).handler(
  async () => {
    return auth.api.getSession({
      headers: getRequestHeaders(),
    });
  },
);

// Sign Out User
export const signOutFn = createServerFn({ method: "POST" }).handler(
  async () => {
    await auth.api.signOut({
      headers: getRequestHeaders(),
    });
    return { success: true };
  },
);

export const updateProfileNameFn = createServerFn({ method: "POST" })
  .inputValidator(UpdateProfileNameSchema)
  .handler(async ({ data }) => {
    try {
      const result = await auth.api.updateUser({
        headers: getRequestHeaders(),
        body: { name: data.name.trim() },
      });

      if (!result?.status) {
        return { success: false, error: "Unable to update your name." };
      }

      return { success: true, error: null };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Unable to update your name.",
      };
    }
  });

export const updatePaymentRemindersFn = createServerFn({ method: "POST" })
  .inputValidator(z.object({ enabled: z.boolean() }))
  .handler(async ({ data }) => {
    try {
      await auth.api.updateUser({
        headers: getRequestHeaders(),
        body: { paymentReminders: data.enabled },
      });
      return { success: true, error: null };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Unable to update your reminders.",
      };
    }
  });
