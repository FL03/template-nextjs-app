/**
 * Created At: 2025.08.09:12:15:55
 * @author - @FL03
 * @file - client.ts
 */
"use client";
// imports
import { AuthTokenResponsePassword } from "@supabase/supabase-js";
// project
import { logger } from "@/lib/logger";
import { resolveOrigin } from "@/lib/endpoint";

interface EmailPasswordSchema {
  email: string;
  password: string;
}

export const handleEmailPasswordLoginWithTurnstile = async ({
  formData,
  turnstileToken,
}: {
  formData: EmailPasswordSchema;
  turnstileToken: string;
}): Promise<AuthTokenResponsePassword["data"]> => {
  const url = new URL("/auth/captcha", resolveOrigin());
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      data: formData,
      options: { captchaToken: turnstileToken },
    }),
  });
  const data = await res.json();
  if (!data.success) {
    logger.error({ data }, "Error validating Turnstile token");
  }
  return data;
};
