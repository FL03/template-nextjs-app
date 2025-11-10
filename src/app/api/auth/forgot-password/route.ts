/**
 * Created At: 2025.10.06:20:21:30
 * @author - @FL03
 * @directory - src/app/api/auth/forgot-password
 * @file - route.ts
 */
"use server";
// imports
import { NextRequest, NextResponse } from "next/server";
// project
import { createServerClient } from "@/lib/supabase";

export async function POST(req: NextRequest): Promise<NextResponse> {
  // initialize the supabase client
  const supabase = await createServerClient();
  // handle the request
  const { origin } = new URL(req.url);
  const formData = await req.formData();
  // parse the formData
  const email = formData.get("email")?.toString();
  const captchaToken = formData.get("captchaToken")?.toString();
  const redirectTo = formData.get("redirectTo")?.toString() ?? origin;
  // validate the formData
  if (!email) {
    return NextResponse.json({
      error: "Unable to reset your password with a valid email address.",
      data: null,
    }, {
      status: 400,
    });
  }
  // send the reset password email
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    captchaToken,
    redirectTo,
  });
  // handle the response
  if (error) {
    return NextResponse.json({ error: error.message, data: null }, {
      status: 400,
    });
  }
  return NextResponse.json({
    error: null,
    data: { message: "Reset password email sent" },
  }, { status: 200 });
}
