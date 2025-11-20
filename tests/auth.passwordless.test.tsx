/**
 * Created At: 2025.10.22:23:23:27
 * @author - @FL03
 * @directory - tests
 * @file - auth.passwordless.test.tsx
 */
import { fireEvent, render, screen, waitFor } from "@testing-library/react";

// Mock the browser supabase client so no network/server code runs
const mockSignInWithOtp = jest.fn();

jest.mock("../src/lib/supabase", () => ({
  createBrowserClient: () => ({ auth: { signInWithOtp: mockSignInWithOtp } }),
}));

// Import after mocks
import { PasswordlessLoginForm } from "../src/features/auth/widgets/forms/passwordless-form";

describe("PasswordlessLoginForm", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the fields and actions for the passwordless login form", () => {
    render(<PasswordlessLoginForm />);

    const email = screen.getByPlaceholderText(
      "Email address",
    ) as HTMLInputElement;
    expect(email).toBeInTheDocument();

    const submit = screen.getByTestId("passwordless-form-submit");
    expect(submit).toBeInTheDocument();
    expect(submit).not.toBeDisabled();
  });

  it("calls signInWithOtp and onSuccess when sign-in succeeds", async () => {
    mockSignInWithOtp.mockResolvedValueOnce({
      data: { user: { id: "u1" } },
      error: null,
    });

    const onSuccess = jest.fn();
    render(
      <PasswordlessLoginForm
        defaultValues={{ email: "test@example.com" }}
        onSuccess={onSuccess}
      />,
    );

    const email = screen.getByPlaceholderText(
      "Email address",
    ) as HTMLInputElement;
    fireEvent.change(email, { target: { value: "test@example.com" } });

    const form = email.closest("form") as HTMLFormElement;
    fireEvent.submit(form);

    await waitFor(() => {
      expect(mockSignInWithOtp).toHaveBeenCalledTimes(1);
      // ensure email was passed
      expect(mockSignInWithOtp.mock.calls[0][0]).toMatchObject({
        email: "test@example.com",
        options: expect.any(Object),
      });
    });
  });
});
