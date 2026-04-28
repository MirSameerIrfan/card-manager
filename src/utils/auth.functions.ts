import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { auth } from "@/utils/auth";
import { z } from "zod";

const UserSchema = z.object({
  name: z.string().min(3),
  email: z.string().email(),
  password: z.string().min(8),
});

const UpdateProfileNameSchema = z.object({
  name: z.string().trim().min(3),
});

const ChangeEmailSchema = z.object({
  newEmail: z.string().email(),
});

const ChangePasswordSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(8),
});

const ResendVerificationEmailSchema = z.object({
  email: z.string().email(),
});

function getRequestHeaders() {
  const req = getRequest();
  return Object.fromEntries(req.headers.entries());
}

function normalizeAuthError(error: unknown, fallback: string) {
  if (!(error instanceof Error)) {
    return fallback;
  }

  const message = error.message.toLowerCase();

  if (
    message.includes("already exists") ||
    message.includes("use another email") ||
    message.includes("user already exists")
  ) {
    return "That email address is already in use.";
  }

  if (
    message.includes("invalid password") ||
    message.includes("invalid credentials") ||
    message.includes("incorrect")
  ) {
    return "Current password is incorrect.";
  }

  if (message.includes("password is too short")) {
    return "New password must be at least 8 characters.";
  }

  if (message.includes("email is the same")) {
    return "Please enter a different email address.";
  }

  if (message.includes("email not verified")) {
    return "Please verify your email before signing in.";
  }

  return error.message;
}

// Sign Up User
export const signUpUser = createServerFn({ method: "POST" })
  .inputValidator(UserSchema)
  .handler(async ({ data }) => {
    try {
      const response = await auth.api.signUpEmail({
        headers: getRequestHeaders(),
        body: {
          email: data.email,
          password: data.password,
          name: data.name,
          callbackURL: "/auth/login",
        },
      });
      return {
        success: true,
        error: null,
        requiresVerification: response?.token === null,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Sign up failed",
        requiresVerification: false,
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
    try {
      const user = await auth.api.signInEmail({
        headers: getRequestHeaders(),
        body: { email: data.email, password: data.password, callbackURL: "/auth/login" },
      });

      if (!user) {
        return {
          success: false,
          user: null,
          error: "Invalid email or password",
          requiresVerification: false,
        };
      }

      return { success: true, user, error: null, requiresVerification: false };
    } catch (error) {
      const normalizedMessage = normalizeAuthError(error, "Sign in failed");
      return {
        success: false,
        user: null,
        error: normalizedMessage,
        requiresVerification: normalizedMessage.includes("verify your email"),
      };
    }
  });

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
        error: normalizeAuthError(error, "Unable to update your name."),
      };
    }
  });

export const changeEmailFn = createServerFn({ method: "POST" })
  .inputValidator(ChangeEmailSchema)
  .handler(async ({ data }) => {
    try {
      const session = await auth.api.getSession({
        headers: getRequestHeaders(),
      });

      if (!session?.user) {
        return { success: false, error: "You must be signed in to change your email." };
      }

      if (session.user.emailVerified !== true) {
        return {
          success: false,
          error: "Verify your current email address before changing it.",
        };
      }

      const result = await auth.api.changeEmail({
        headers: getRequestHeaders(),
        body: {
          newEmail: data.newEmail.toLowerCase(),
          callbackURL: "/settings/profile",
        },
      });

      if (!result?.status) {
        return { success: false, error: "Unable to update your email." };
      }

      return {
        success: true,
        error: null,
        verificationRequired: true,
      };
    } catch (error) {
      return {
        success: false,
        error: normalizeAuthError(error, "Unable to update your email."),
        verificationRequired: false,
      };
    }
  });

export const changePasswordFn = createServerFn({ method: "POST" })
  .inputValidator(ChangePasswordSchema)
  .handler(async ({ data }) => {
    try {
      await auth.api.changePassword({
        headers: getRequestHeaders(),
        body: {
          currentPassword: data.currentPassword,
          newPassword: data.newPassword,
          revokeOtherSessions: false,
        },
      });

      return { success: true, error: null };
    } catch (error) {
      return {
        success: false,
        error: normalizeAuthError(error, "Unable to update your password."),
      };
    }
  });

export const resendVerificationEmailFn = createServerFn({ method: "POST" })
  .inputValidator(ResendVerificationEmailSchema)
  .handler(async ({ data }) => {
    try {
      const result = await auth.api.sendVerificationEmail({
        headers: getRequestHeaders(),
        body: {
          email: data.email.toLowerCase(),
          callbackURL: "/dashboard",
        },
      });

      if (!result?.status) {
        return { success: false, error: "Unable to send verification email." };
      }

      return { success: true, error: null };
    } catch (error) {
      return {
        success: false,
        error: normalizeAuthError(error, "Unable to send verification email."),
      };
    }
  });
