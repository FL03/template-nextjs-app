/**
 * Created At: 2025.10.23:11:12:45
 * @author - @FL03
 * @directory - tests
 * @file - auth.password-login.test.tsx
 */
import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

// Prevent the real server action from running at module-eval
jest.mock("@/features/auth/utils", () => ({
  loginWithPasswordAction: jest.fn(),
}));

import { EmailPasswordForm } from "../src/features/auth";

describe("EmailPasswordForm", () => {
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

  it("renders login form input fields and actions", () => {
    render(<EmailPasswordForm />);

    const email = screen.getByPlaceholderText(
      "Email address",
    ) as HTMLInputElement;
    expect(email).toBeInTheDocument();

    const password = screen.getByPlaceholderText(
      "password",
    ) as HTMLInputElement;
    expect(password).toBeInTheDocument();

    const btn = screen.getByTestId("login-form-submit");
    expect(btn).toBeInTheDocument();
    expect(btn).not.toBeDisabled();
  });
});
