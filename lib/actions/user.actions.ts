"use server";

import { signInFormSchema, signUpFormSchema } from "../validator";
import { hashSync } from "bcrypt-ts-edge";
import { prisma } from "@/db/prisma";
import { signIn, signOut } from "@/auth";

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

// Register a new user
export async function signUp(prevState: unknown, formData: FormData) {
  try {
    const user = signUpFormSchema.parse({
      name: formData.get("name"),
      email: formData.get("email"),
      confirmPassword: formData.get("confirmPassword"),
      password: formData.get("password"),
    });

    const plainPassword = user.password;

    user.password = hashSync(user.password, 10);

    await prisma.user.create({
      data: {
        name: user.name,
        email: user.email,
        password: user.password,
      },
    });

    await signIn("credentials", {
      email: user.email,
      password: plainPassword,
    });

    return { success: true, message: "User created successfully" };
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
