"use server";

import { redirect } from "next/navigation";
import { signIn, signOut } from "@/auth";
import { signInFormSchema } from "../validator";

// Sign in the user with credentials
export async function signInWithCredentials(
  prevState: unknown,
  formData: FormData
) {
  try {
    // Set user from form and validate it with Zod schema
    const user = signInFormSchema.parse({
      email: formData.get("email"),
      password: formData.get("password"),
    });

    await signIn("credentials", user);

    return { success: true, message: "Signed in successfully" };
  } catch (error) {
    // Use the redirect utility directly when needed
    // The redirect function will throw a NEXT_REDIRECT error which gets handled by Next.js

    // If it's a redirect error from Next.js, we want to let it propagate
    if (error instanceof Error && error.message.includes("NEXT_REDIRECT")) {
      throw error;
    }

    return { success: false, message: "Invalid email or password" };
  }
}

// Sign the user out
export async function signOutUser() {
  await signOut();
}
