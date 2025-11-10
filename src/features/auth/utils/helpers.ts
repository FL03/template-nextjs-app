/**
 * Created At: 2025.08.09:13:41:16
 * @author - @FL03
 * @file - auth/config.ts
 */

import { AuthGateMode } from "../types";

type WithAllowEmail<T = {}> = T & {
  allowEmail?: boolean;
};

type WithAllowPassword<T = {}> = T & {
  allowPassword?: boolean;
};

export const isRegistration = (value: string): boolean => (
  new RegExp(/^(?:(?:register|signup|sign-up))/).test(value)
);

export const isLoginView = (value: string): boolean => (
  new RegExp(/^(?:(?:login|signin|sign-in))/).test(value)
);

export const isPasswordlessView = (value: string): boolean => (
  new RegExp(/^(?:(?:magic|passkey|passwordless))/).test(value)
);

export const resolveAuthView = (value: string): AuthGateMode => {
  if (isRegistration(value)) return "register";
  if (isPasswordlessView(value)) return "passwordless";
  return "login";
};

export const getViewTypes = (
  { allowEmail = true, allowPassword = true }: WithAllowEmail<
    WithAllowPassword
  > = {},
) => {
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

