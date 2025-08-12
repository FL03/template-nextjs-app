/**
 * Created At: 2025.08.09:13:41:16
 * @author - @FL03
 * @file - auth/config.ts
 */

type WithAllowEmail = {
  allowEmail?: boolean;
};

type WithAllowPassword = {
  allowPassword?: boolean;
};

type AllowEmailPassword = WithAllowEmail & WithAllowPassword;

export const getViewTypes = (options?: AllowEmailPassword) => {
  // destructure the options and set defaults
  const { allowEmail = true, allowPassword = true } = options || {};
  // Define the valid view types
  let viewTypes: string[] = [];
  if (allowEmail) {
    viewTypes = [...viewTypes, "email_signin"];
  }
  if (allowPassword) {
    viewTypes = [
      ...viewTypes,
      "login",
      "email_password",
      "password_signin",
      "forgot_password",
      "update_password",
      "reset_password",
      "sign-in",
      "signup",
    ];
  }

  return viewTypes;
};

export const getDefaultSignInView = (
  preferredSignInView?: string | null,
  options?: WithAllowPassword,
) => {
  // destructure the options and set defaults
  const { allowPassword = true } = options || {};
  // Define the default sign in view
  let defaultView = allowPassword ? "login" : "passwordless";

  if (preferredSignInView && getViewTypes().includes(preferredSignInView)) {
    defaultView = preferredSignInView;
  }

  return defaultView;
};
