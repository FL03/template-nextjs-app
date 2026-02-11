/**
 * Created At: 2025.09.11:19:57:44
 * @author - @FL03
 * @file - helpers.ts
 */
// project
import { logger } from '@/lib/logger';

type TurnstilePayload = {
  secret: string;
  response: string;
  remoteip?: string;
  idempotency_key?: string;
};

const API_URL = new URL(
  '/turnstile/v0/siteverify',
  'https://challenges.cloudflare.com',
);

/** Validate a given `captchaToken` using the Cloudflare Turnstile API.  */
export async function verifyTurnstileToken({
  captchaToken,
  remoteIp,
  secretKey = process.env.CF_TURNSTILE_SECRET_KEY,
}: {
  captchaToken?: string;
  secretKey?: string;
  remoteIp?: string;
  idempotency_key?: string;
}): Promise<boolean> {
  // ensure a captcha token is provided
  if (!captchaToken) {
    logger.error('No captcha token provided for Turnstile validation');
    return false;
  }
  // ensure the secret key is set
  if (!secretKey) {
    logger.warn(
      'Unable to verify the captcha token without a valid secret key for the Cloudflare Turnstile',
    );
    return false;
  }
  // log a warning if remoteIp is not provided
  if (!remoteIp) {
    logger.warn('Validation may be less accurate without remote IP');
  }
  // define the form data to submit to the Turnstile API
  const payload: TurnstilePayload = {
    secret: secretKey,
    response: captchaToken,
    remoteip: remoteIp || '',
  };
  // use the fetch API to post the form data to the Turnstile API
  const res = await fetch(API_URL, {
    body: JSON.stringify(payload),
    method: 'POST',
    headers: {
      Accept: 'application/json',
    },
  });
  // await the response data
  const data = await res.json();
  if (data.success) return true;
  else {
    logger.error(data, 'Turnstile validation failed');
    return false;
  }
}
