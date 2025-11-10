/**
 * Created At: 2025.10.10:09:04:06
 * @author - @FL03
 * @directory - src/features/auth/utils
 * @file - actions.ts
 */
"use server";
// imports
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ActionStateData } from "@pzzld/actions";
// project
import { logger } from "@/lib/logger";
import { createServerClient } from "@/lib/supabase";

type LoginFormData = {
  email?: string;
  phone?: string;
  password: string;
  captchaToken?: string;
};

/** A server action for handling submissions for an email/password login form. */
export async function loginWithPasswordAction(
  formState: ActionStateData,
  formData: FormData,
): Promise<ActionStateData> {
  const cookieStore = await cookies();
  const supabase = await createServerClient();
  // parse the form data
  const payload = Object.fromEntries(
    formData.entries(),
  ) as LoginFormData;
  // deconstruct the payload
  const {
    email,
    phone,
    password,
    captchaToken,
  } = payload;
  // manage the given identifier(s)
  const contact = email ? { email } : phone ? { phone } : null;
  // validate the formData
  if (!contact) {
    return Object.assign(formState, {
      status: "error",
      error: "Either email or phone number is required.",
    });
  }
  if (!password) {
    return Object.assign(formState, {
      status: "error",
      error: "Password is required.",
    });
  }
  const { data: { user }, error } = await supabase.auth
    .signInWithPassword({
      ...contact,
      password,
      options: {
        captchaToken,
      },
    });
  // handle any errors
  if (error) {
    logger.error(error, error.message);
    return Object.assign(formState, {
      status: "error",
      message: error.message,
    });
  }
  const customerId = user?.user_metadata?.customer_id ?? null;
  const username = user?.user_metadata?.username ?? null;
  logger.info(
    `User logged in: ${username} (${user?.id})`,
  );
  if (customerId) cookieStore.set("x-pzzld-customer-id", customerId);
  if (username) cookieStore.set("x-pzzld-username", username);
  // set the preferred sign-in view cookie
  if (user) {
    cookieStore.set("preferredSignInView", "login");
    cookieStore.set("x-pzzld-user-id", user.id);
    if (user.email) cookieStore.set("x-pzzld-user-email", user.email);
    if (user.phone) cookieStore.set("x-pzzld-user-phone", user.phone);
  }
  // redirect on success
  const redirectTo = username ? `/${username}` : "/";
  revalidatePath(redirectTo);
  return redirect(redirectTo);
}

type RegistrationFormData = {
  email?: string;
  phone?: string;
  password: string;
  passwordConfirm: string;
  username: string;
  captchaToken?: string;
  redirectTo?: string;
};

export async function registerAction(
  formState: ActionStateData,
  formData: FormData,
): Promise<ActionStateData> {
  const supabase = await createServerClient();
  // parse the form data
  const payload = Object.fromEntries(
    formData.entries(),
  ) as RegistrationFormData;
  // deconstruct the payload
  const {
    email,
    password,
    passwordConfirm,
    username,
    phone,
    captchaToken,
    redirectTo = "/auth/verify",
  } = payload;
  // valdate the form data and register the user
  // validation
  const contact = email ? { email } : phone ? { phone } : null;

  if (!contact) {
    throw new Error("Either email or phone number is required.");
  }

  if (!password || !passwordConfirm) {
    throw new Error("Both password fields are required.");
  }
  if (password !== passwordConfirm) {
    throw new Error("Passwords do not match.");
  }
  if (!username) {
    throw new Error("A username is required to register.");
  }

  logger.trace({ email, phone, username }, "Registering a new user...");
  // register the user
  const { error } = await supabase.auth.signUp({
    ...contact,
    password,
    options: {
      data: { username: String(username) },
      captchaToken,
      emailRedirectTo: new URL("/auth/callback", window.location.origin)
        .toString(),
    },
  });

  if (error) {
    logger.error(error, "Error registering user: " + error.message);
    return { ...formState, status: "error", message: error.message };
  }
  // update the formState
  formState.status = "success";
  // redirect on success
  return redirect(redirectTo);
}

type ResetPasswordFormData = {
  email: string;
  captchaToken?: string;
  redirectTo?: string;
};

export const resetPasswordAction = async (
  formState: ActionStateData,
  formData: FormData,
): Promise<ActionStateData> => {
  const supabase = await createServerClient();
  // parse the form data
  const payload = Object.fromEntries(
    formData.entries(),
  ) as ResetPasswordFormData;
  // deconstruct the payload
  const {
    email,
    captchaToken,
    redirectTo = new URL("/auth/reset-password").toString(),
  } = payload;
  // validate the form data
  if (!email) {
    return { status: "error", message: "Email is required." };
  }
  // send the reset password email
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    captchaToken,
    redirectTo,
  });

  if (error) {
    logger.error(error, error.message);
    return Object.assign(formState, {
      status: "error",
      message: error.message,
    });
  }

  revalidatePath("/auth/reset-password");

  return Object.assign(formState, { status: "success" });
};
