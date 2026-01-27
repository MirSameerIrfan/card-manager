import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
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
        name: data.name,
      },
    });

    return { success: true };
  });

export const signInEmailFn = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => {
    const parsed = z
      .object({
        email: z.string().email(),
        password: z.string().min(6),
      })
      .parse(data);
    return parsed;
  })
  .handler(async ({ data }) => {
    const req = getRequest();

    await auth.api.signInEmail({
      headers: Object.fromEntries(req.headers.entries()),
      body: { email: data.email, password: data.password },
    });

    return { success: true };
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
    return { success: true };
  },
);
