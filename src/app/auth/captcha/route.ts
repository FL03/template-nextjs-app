/**
 * Created At: 2025-04-04:18:05:28
 * @author - @FL03
 * @file - route.ts
 */
"use server";
// imports
import { NextRequest, NextResponse } from "next/server";
// project
import { verifyTurnstileToken } from "@/lib/cloudflare";
import { logger } from "@/lib/logger";
import { createServerClient } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  // initialize a server-side supabase client
  const supabase = await createServerClient();
  try {
    const body = await request.json();
    const { data: { email, password }, options: { captchaToken } } = body;

    // Get client IP from Next.js request
    const remoteIp = request.headers.get("x-forwarded-for") || "127.0.0.1";
    // use the method
    const isValid = await verifyTurnstileToken({
      remoteIp,
      captchaToken,
    });
    // check if the response is valid
    if (!isValid) {
      logger.error("Turnstile token validation failed");
      throw new Error("Turnstile token validation failed");
    }
    logger.info(
      "Turnstile token validated successfully; authenticating user...",
    );
    const data = await supabase.auth.signInWithPassword({
      email,
      password,
      options: { captchaToken },
    }).then(({ data, error }) => {
      // handle any errors
      if (error) {
        throw new Error(error.message);
      }
      // log the success
      logger.info("Successfully authenticated the user!");
      // return the data
      return data;
    });
    logger.info({ data }, "User authenticated successfully");
    return NextResponse.json(data, {
      status: 200,
    });
  } catch (error) {
    logger.error(error, "Authentication failed; please try again...");
    return NextResponse.error();
  }
}
