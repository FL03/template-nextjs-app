/**
 * Created At: 2025.09.28:09:33:20
 * @author - @FL03
 * @endpoint - /api/auth/login
 * @file - route.ts
 */
"use server";
// imports
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";
// project
import { logger } from "@/lib/logger";
import { createServerClient } from "@/lib/supabase";

type LoginFormData = {
  email?: string;
  phone?: string;
  password?: string;
  captchaToken?: string;
};

export async function POST(
  req: NextRequest,
): Promise<NextResponse> {
  // handle the request URL
  const { searchParams } = new URL(req.url);
  // parse the search params
  const captcha = searchParams.get("captchaToken")?.toString();
  // initialize the supabase client
  const supabase = await createServerClient();
  const cookieStore = await cookies();
  // load the form data
  // const payload = await req.json();
  const formData = await req.formData();
  const payload = Object.fromEntries(
    formData.entries(),
  ) as LoginFormData;
  // deconstruct the payload
  const {
    email,
    phone,
    password,
    captchaToken = captcha,
  } = payload;

  const creds = email ? { email } : phone ? { phone } : undefined;

  if (!creds) {
    logger.error(
      "A valid email address or phone number is required to login with a password.",
    );
    return NextResponse.json(
      {
        data: null,
        error:
          "A valid email address or phone number is required to login with a password.",
      },
      { status: 400 },
    );
  }

  if (!password) {
    return NextResponse.json(
      { data: null, error: "Password is required." },
      { status: 400 },
    );
  }
  const { data: { user }, error } = await supabase.auth.signInWithPassword({
    ...creds,
    password,
    options: { captchaToken },
  });
  // handle any errors
  if (error) {
    logger.error(error, "Unable to authenticate user: " + error.message);
    return NextResponse.json({ data: null, error: error.message }, {
      status: 500,
    });
  }
  // manage some cookies
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
  const redirectTo = username ? `/${username}` : "/";
  logger.info("Successfully authenticated user:", username);
  // revalidate & redirect on success
  revalidatePath(redirectTo);
  return redirect(redirectTo);
}
