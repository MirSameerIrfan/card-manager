import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { auth } from "@/utils/auth";
import { z } from "zod";

const UserSchema = z.object({
  name: z.string().min(3),
  email: z.string().email(),
  password: z.string().min(8),
});

// Sign Up User
export const signUpUser = createServerFn({ method: "POST" })
  .inputValidator(UserSchema)
  .handler(async ({ data }) => {
    const req = getRequest();

    try {
      await auth.api.signUpEmail({
        headers: Object.fromEntries(req.headers.entries()),
        body: {
          email: data.email,
          password: data.password,
          name: data.name,
        },
      });
      return { success: true, error: null };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Sign up failed",
      };
    }
  });

// SignIn with Email
export const signInEmailFn = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => {
    const parsed = z
      .object({
        email: z.email(),
        password: z.string().min(8),
      })
      .parse(data);
    return parsed;
  })
  .handler(async ({ data }) => {
    const req = getRequest();

    try {
      const user = await auth.api.signInEmail({
        headers: Object.fromEntries(req.headers.entries()),
        body: { email: data.email, password: data.password },
      });

      if (!user) {
        return {
          success: false,
          user: null,
          error: "Invalid email or password",
        };
      }

      return { success: true, user, error: null };
    } catch (error) {
      return {
        success: false,
        user: null,
        error: error instanceof Error ? error.message : "Sign in failed",
      };
    }
  });

// Get User Session
export const getSessionFn = createServerFn({ method: "GET" }).handler(
  async () => {
    const req = getRequest();
    return auth.api.getSession({
      headers: Object.fromEntries(req.headers.entries()),
    });
  },
);

// Sign Out User
export const signOutFn = createServerFn({ method: "POST" }).handler(
  async () => {
    const req = getRequest();
    await auth.api.signOut({
      headers: Object.fromEntries(req.headers.entries()),
    });
    return { success: true };
  },
);
