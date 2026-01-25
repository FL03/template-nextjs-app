/**
 * Created At: 2025.08.09:13:31:48
 * @author - @FL03
 * @file - auth/helpers.ts
 */

/** Use regex to validate a given email address */
export const verifyEmailFormat = (email: string) => (
  new RegExp(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/).test(email)
);
