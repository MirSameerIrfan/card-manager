import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { redirect } from "@tanstack/react-router";
import { auth } from "@/utils/auth";
import { z } from "zod";

const UserSchema = z.object({
  name: z.string().min(3),
  email: z.string().email(),
  password: z.string().min(8),
});

export const signUpUser = createServerFn({ method: "POST" })
  .inputValidator(UserSchema)
  .handler(async ({ data }) => {
    const req = getRequest();

    await auth.api.signUpEmail({
      headers: Object.fromEntries(req.headers.entries()),
      body: {
        email: data.email,
        password: data.password,
        name: data.name || undefined,
      },
    });

    throw redirect({ to: "/dashboard" });
  });

export const signInEmailFn = createServerFn({ method: "POST" })
  .inputValidator((raw) => {
    if (!(raw instanceof FormData)) throw new Error("Expected FormData");
    const email = raw.get("email")?.toString() || "";
    const password = raw.get("password")?.toString() || "";
    const redirectTo = raw.get("redirectTo")?.toString() || "/dashboard";
    if (!email || !password) throw new Error("Missing login data");
    return { email, password, redirectTo };
  })
  .handler(async ({ data }) => {
    const req = getRequest();

    await auth.api.signInEmail({
      headers: Object.fromEntries(req.headers.entries()),
      body: { email: data.email, password: data.password },
    });

    throw redirect({ to: data.redirectTo });
  });

export const getSessionFn = createServerFn({ method: "GET" }).handler(
  async () => {
    const req = getRequest();
    return auth.api.getSession({
      headers: Object.fromEntries(req.headers.entries()),
    });
  },
);

export const signOutFn = createServerFn({ method: "POST" }).handler(
  async () => {
    const req = getRequest();
    await auth.api.signOut({
      headers: Object.fromEntries(req.headers.entries()),
    });
    throw redirect({ to: "/auth/login" });
  },
);
