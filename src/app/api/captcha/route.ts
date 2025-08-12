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

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { captchaToken } = body;

  // Get client IP from Next.js request
  const remoteIp = request.headers.get("x-forwarded-for") || "127.0.0.1";
  // use the method
  const isValid = await verifyTurnstileToken({
    remoteIp,
    captchaToken,
  });

  return NextResponse.json(
    { success: isValid },
    {
      status: isValid ? 200 : 400,
    },
  );
}
