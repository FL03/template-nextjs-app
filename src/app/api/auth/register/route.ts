/**
 * Created At: 2025.09.20:19:00:57
 * @author - @FL03
 * @endpoint - /api/auth/register
 * @file - route.ts
 */
"use server";
// imports
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";
// project
import { logger } from "@/lib/logger";
import { createServerClient } from "@/lib/supabase";

type RegistrationPayload = {
  email?: string;
  phone?: string;
  password: string;
  passwordConfirm: string;
  username: string;
  captchaToken?: string;
  redirectTo?: string;
};

export async function POST(req: NextRequest): Promise<NextResponse> {
  // handle the request origin
  const { origin } = new URL(req.url);
  // initialize a server-size supabase client
  const supabase = await createServerClient();
  // parse the request url
  const { searchParams } = new URL(req.url);
  // extract the url params
  const captcha = searchParams.get("captcha")?.toString();
  const redirectTo = searchParams.get("redirect")?.toString() ?? "/auth/verify";
  // load the form data
  const payload = await req.json();
  // deconstruct the payload
  const {
    email,
    phone,
    password,
    passwordConfirm,
    username,
    captchaToken = captcha,
  } = payload as RegistrationPayload;
  // validate the formData
  const contact = email ? { email } : phone ? { phone } : null;
  if (!contact) {
    return NextResponse.json(
      {
        data: null,
        error: { message: "Either email or phone number is required." },
      },
      { status: 400 },
    );
  }
  if (!username) {
    return NextResponse.json(
      { data: null, error: { message: "Username is required." } },
      { status: 400 },
    );
  }
  if (!password) {
    return NextResponse.json(
      { data: null, error: { message: "Password is required." } },
      { status: 400 },
    );
  }
  if (password !== passwordConfirm) {
    return NextResponse.json(
      {
        data: null,
        error: { message: "Passwords do not match." },
      },
      { status: 400 },
    );
  }

  logger.trace(
    { email, password, username },
    "Registering a new user...",
  );
  const { error } = await supabase.auth.signUp({
    ...contact,
    password,
    options: {
      data: { username: String(username) },
      captchaToken,
      emailRedirectTo: new URL("/auth/callback", origin).toString(),
    },
  });

  if (error) {
    logger.error(error, "Error registering user: " + error.message);
    return NextResponse.json({ data: null, error: error.message }, {
      status: 400,
    });
  }
  logger.info("Successfully registered a new user!");
  revalidatePath(redirectTo);
  return redirect(redirectTo);
}
