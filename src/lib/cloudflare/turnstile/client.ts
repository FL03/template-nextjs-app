/**
 * Created At: 2025.08.09:12:15:55
 * @author - @FL03
 * @file - turnstile/client.ts
 */
"use client";
// project
import { logger } from "@/lib/logger";
import { resolveOrigin } from "@/lib/endpoint";

/** A client-side function for validating the given captcha token with the Cloudflare API. */
export const validateTurnstileToken = async (captchaToken: string) => {
  const url = new URL("/api/captcha", resolveOrigin());
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      options: { captchaToken },
    }),
  });
  const data = await res.json();
  if (!data.success) {
    logger.error({ data }, "Error validating Turnstile token");
    return false;
  }
  return true;
};
