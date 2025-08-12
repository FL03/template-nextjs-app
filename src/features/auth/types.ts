/**
 * Created At: 2025.08.10:16:14:28
 * @author - @FL03
 * @file - auth/types.ts
 */

export type RegistrationView = "register" | "registration";
export type LoginView = "login" | "email-password" | "sign-in";
export type PasswordlessView = "magic" | "passkey";
export type ResetPasswordView = "reset-password" | "forgot-password";



export type AuthPages =
  | "login"
  | "register"
  | "passwordless"
  | "reset-password"
  | "forgot-password";

export type AuthView =
  | RegistrationView
  | LoginView
  | PasswordlessView
  | ResetPasswordView;

export enum AuthGateStage {
  Login = "login",
  Register = "register",
  ForgotPassword = "forgot-password",
  ResetPassword = "reset-password",
  Confirm = "confirm",
}

export class AuthGateMode {
  private value: string;

  constructor(value: string) {
    if (!Object.values(AuthGateStage).includes(value as AuthGateStage)) {
      throw new Error(`Invalid auth gate mode: ${value}`);
    }
    this.value = value;
  }

  set view(value: string) {
    if (!Object.values(AuthGateStage).includes(value as AuthGateStage)) {
      throw new Error(`Invalid auth gate mode: ${value}`);
    }
    this.value = value;
  }

  get view(): AuthPages {
    switch (this.value) {
      case AuthGateStage.Login:
        return "login";
      case AuthGateStage.Register:
        return "register";
      case AuthGateStage.ForgotPassword:
        return "forgot-password";
      case AuthGateStage.ResetPassword:
        return "reset-password";
      default:
        throw new Error(`Unknown auth gate mode: ${this.value}`);
    }
  }

  /** Converts the current mode into an enum */
  asEnum(): AuthGateMode {
    switch (this.value) {
      case AuthGateStage.Login:
        return new AuthGateMode(AuthGateStage.Login);
      case AuthGateStage.Register:
        return new AuthGateMode(AuthGateStage.Register);
      case AuthGateStage.ForgotPassword:
        return new AuthGateMode(AuthGateStage.ForgotPassword);
      case AuthGateStage.ResetPassword:
        return new AuthGateMode(AuthGateStage.ResetPassword);
      default:
        throw new Error(`Unknown auth gate mode: ${this.value}`);
    }
  }

  toView(): AuthView {
    switch (this.value) {
      case AuthGateStage.Login:
        return "login";
      case AuthGateStage.Register:
        return "register";
      case AuthGateStage.ForgotPassword:
        return "forgot-password";
      case AuthGateStage.ResetPassword:
        return "reset-password";
      default:
        throw new Error(`Unknown auth gate mode: ${this.value}`);
    }
  }
}
