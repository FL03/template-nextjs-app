/**
 * Created At: 2025.10.22:22:44:33
 * @author - @FL03
 * @directory - tests
 * @file - auth.forgot-password.test.tsx
 */
import * as React from "react";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";

// Prevent server-side middleware from executing during import
jest.mock("@/lib/supabase/middleware", () => ({
  supabaseCreds: () => ({ url: "http://localhost", anonKey: "anon" }),
  NextResponse: { next: ({ request }: any) => ({ request }) },
}));

// Stub the UI Button to make assertions simple
jest.mock("@/components/ui/button", () => ({
  Button: ({ disabled, children, ...rest }: any) => (
    // eslint-disable-next-line react/button-has-type
    <button data-testid="submit-btn" disabled={!!disabled} {...rest}>
      {children}
    </button>
  ),
}));

// Prevent the real server action from running at module-eval
jest.mock("@/features/auth/utils/actions", () => ({
  resetPasswordAction: jest.fn(),
}));

import { ForgotPasswordForm } from "../src/features/auth";

describe("ForgotPasswordForm", () => {
  let useActionStateSpy: jest.SpyInstance;

  beforeEach(() => {
    useActionStateSpy = jest.spyOn(React as any, "useActionState")
      .mockReturnValue([
        {},
        jest.fn(),
        false,
      ]);
  });

  afterEach(() => {
    useActionStateSpy.mockRestore();
    jest.clearAllMocks();
  });

  it("renders the fields and actions for the forgot password form", () => {
    render(<ForgotPasswordForm captchaToken="tok" redirectTo="/ok" />);

    const email = screen.getByPlaceholderText(
      "Account email",
    ) as HTMLInputElement;
    expect(email).toBeInTheDocument();

    const captcha = document.querySelector(
      'input[name="captchaToken"]',
    ) as HTMLInputElement;
    expect(captcha).toBeInTheDocument();
    expect(captcha.value).toBe("tok");

    const redirect = document.querySelector(
      'input[name="redirectTo"]',
    ) as HTMLInputElement;
    expect(redirect).toBeInTheDocument();
    expect(redirect.value).toBe("/ok");

    const submit = screen.getByTestId("forgot-password-submit");
    expect(submit).toBeInTheDocument();
    expect(submit).not.toBeDisabled();
  });
});
