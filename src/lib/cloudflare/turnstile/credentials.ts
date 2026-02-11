/**
 * Created At: 2025.10.24:22:39:44
 * @author - @FL03
 * @directory - src/lib/cloudflare/turnstile
 * @file - credentials.ts
 */

/** A method for getting the cloudflare turnstile site key */
export const cloudflareTurnstileSiteKey = (key: string = "CF_TURNSTILE_SITE_KEY"): string => {
  const value = process.env[key];
  if (!value) {
    throw new Error(
      "No Cloudflare Turnstile site key provided. Please set the CF_TURNSTILE_SITE_KEY environment variable.",
    );
  }
  return value;
};
