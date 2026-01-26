// src/utils/auth.server.ts
import { auth } from "@/utils/auth";

export async function signUpUserServer(input: {
  email: string;
  password: string;
  name: string;
}) {
  return auth.api.signUpEmail(input);
}

export async function signInUserServer(input: {
  email: string;
  password: string;
}) {
  return auth.api.signInEmail(input);
}

export async function getCurrentUserServer() {
  const session = await auth.api.getSession();
  return session?.user || null;
}

export async function signOutUserServer() {
  await auth.api.signOut();
}
