/**
 * Created At: 2025.08.09:12:18:15
 * @author - @FL03
 * @file - turnstile/server.ts
 */
"use server";
// project
import { logger } from "@/lib/logger";


type VerifyTurnstilOptions = {
  captchaToken: string;
  remoteIp?: string;
  secretKey?: string;
};

/** A callback for validating a captchaToken  */
export async function verifyTurnstileToken(
  { captchaToken, remoteIp, secretKey = process.env.CF_TURNSTILE_SECRET_KEY }:
    VerifyTurnstilOptions,
): Promise<boolean> {
  // if no secret key is provided, throw an error
  if (!captchaToken) {
    logger.error("No captcha token provided");
    return false;
  }
  // log a warning if remoteIp is not provided
  if (!remoteIp) {
    logger.warn("No remote IP provided, this may affect the validation");
  }
  // ensure the secret key is set
  if (!secretKey) {
    logger.error(
      "Unable to verify the captcha token without a valid secret key for the Cloudflare Turnstile",
    );
    return false;
  }
  // define the form data to submit to the Turnstile API
  const formData = new FormData();
  formData.append("secret", secretKey);
  formData.append("response", captchaToken);
  if (remoteIp) {
    formData.append("remoteip", remoteIp);
  }
  // initialize a URL object configured for the Turnstile API
  const url = new URL(
    "/turnstile/v0/siteverify",
    "https://challenges.cloudflare.com",
  );
  // use the fetch API to post the form data to the Turnstile API
  const result = await fetch(url, {
    body: formData,
    method: "POST",
  });
  // await the response and determine if the validation was successful
  return await result.json().then((data) => {
    if (data.success) return true;
    else {
      logger.error(data, "Turnstile validation failed");
      return false;
    }
  });
}
