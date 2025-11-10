/**
 * Created At: 2025.10.22:22:26:10
 * @author - @FL03
 * @directory - tests
 * @file - auth.register.test.tsx
 */
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

// Prevent server-side middleware from executing during import
jest.mock("@/lib/supabase/middleware", () => ({
  supabaseCreds: () => ({ url: "http://localhost", anonKey: "anon" }),
  NextResponse: { next: ({ request }: any) => ({ request }) },
}));

import { RegistrationForm } from "../src/features/auth";

describe("RegistrationForm", () => {
  it("renders the fields and actions for the registration form", () => {
    render(
      <RegistrationForm
        defaultValues={{
          username: "bob",
          email: "bob@example.com",
          password: "hunter2",
          passwordConfirm: "hunter2",
        }}
      />,
    );

    const username = screen.getByPlaceholderText("Username") as HTMLInputElement;
    expect(username).toBeInTheDocument();
    expect(username).toHaveValue("bob");

    const email = screen.getByPlaceholderText("Enter your email") as HTMLInputElement;
    expect(email).toBeInTheDocument();
    expect(email).toHaveValue("bob@example.com");

    const registerBtn = screen.getByTestId("register-form-submit");
    expect(registerBtn).toBeInTheDocument();
  });
});