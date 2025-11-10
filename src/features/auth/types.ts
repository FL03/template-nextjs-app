/**
 * Created At: 2025.08.10:16:14:28
 * @author - @FL03
 * @file - auth/types.ts
 */

export type RegistrationView = "register" | "registration";
export type LoginView = "login" | "email-password" | "sign-in";
export type PasswordlessView = "magic" | "passkey" | "passwordless";
export type ResetPasswordView = "reset-password" | "forgot-password";

export type AuthGateMode =
  | "login"
  | "register"
  | "forgot-password"
  | "reset-password"
  | "passwordless";

export class AuthMode extends String {
  constructor(value: string) {
    super(value);
  }

  static login(): AuthMode {
    return new AuthMode("login");
  }

  static register(): AuthMode {
    return new AuthMode("register");
  }

  static forgotPassword(): AuthMode {
    return new AuthMode("forgot_password");
  }

  get isLogin(): boolean {
    return new RegExp(/^(?:(?:login|signin|sign-in))$/).test(this.valueOf());
  }

  get isRegister(): boolean {
    return new RegExp(/^(?:(?:register|signup|sign-up))$/).test(this.valueOf());
  }

  get isPasswordless(): boolean {
    return new RegExp(/^(?:(?:magic|passkey|passwordless))$/).test(
      this.valueOf(),
    );
  }

  /** Resolves the object into a `AuthView` type */
  toView(): AuthGateMode {
    if (this.isRegister) return "register";
    if (this.isPasswordless) return "passwordless";
    return "login";
  }
}
