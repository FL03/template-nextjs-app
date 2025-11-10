/**
 * Created At: 2025.10.22:22:45:06
 * @author - @FL03
 * @directory - tests
 * @file - profile-form.test.tsx
 */
import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

// Prevent the real server action from running at module-eval
jest.mock("../src/features/profiles/utils", () => ({
  updateProfileAction: jest.fn(),
}));

// Stub OrgSelect so tests can assert organization input behavior
jest.mock("../src/features/orgs", () => ({
  OrgSelect: ({ name, defaultValue, value }: any) => (
    <input
      data-testid="org-select"
      name={name}
      defaultValue={defaultValue}
      value={value}
    />
  ),
}));

// Import after mocks
import { ProfileForm } from "../src/features/profiles/widgets/profile-form";

describe("ProfileForm", () => {
  let useActionStateSpy: jest.SpyInstance;

  beforeEach(() => {
    // stub React.useActionState used by the form
    useActionStateSpy = jest.spyOn(React as any, "useActionState")
      .mockReturnValue([
        { status: "init" },
        jest.fn(),
        false,
      ]);
  });

  afterEach(() => {
    useActionStateSpy.mockRestore();
    jest.clearAllMocks();
  });

  it("renders inputs with provided default values and hidden id", () => {
    render(
      <ProfileForm
        defaultValues={{
          username: "alice",
          primary_organization: "org-xyz",
          display_name: "Alice Smith",
          first_name: "Alice",
          middle_name: "M",
          last_name: "Smith",
          bio: "I serve tables",
          id: "profile-123",
        }}
      />,
    );

    const username = screen.getByPlaceholderText(
      "Username...",
    ) as HTMLInputElement;
    expect(username).toBeInTheDocument();
    expect(username).toHaveValue("alice");

    const displayName = screen.getByPlaceholderText(
      "Display Name",
    ) as HTMLInputElement;
    expect(displayName).toBeInTheDocument();
    expect(displayName).toHaveValue("Alice Smith");

    const first = screen.getByPlaceholderText("First Name") as HTMLInputElement;
    expect(first).toBeInTheDocument();
    expect(first).toHaveValue("Alice");

    const middle = screen.getByPlaceholderText(
      "Middle Name",
    ) as HTMLInputElement;
    expect(middle).toBeInTheDocument();
    expect(middle).toHaveValue("M");

    const last = screen.getByPlaceholderText("Last Name") as HTMLInputElement;
    expect(last).toBeInTheDocument();
    expect(last).toHaveValue("Smith");

    const bio = screen.getByPlaceholderText("Bio") as HTMLTextAreaElement;
    expect(bio).toBeInTheDocument();
    expect(bio).toHaveValue("I serve tables");

    const hidden = document.querySelector(
      'input[name="id"]',
    ) as HTMLInputElement;
    expect(hidden).toBeInTheDocument();
    expect(hidden.value).toBe("profile-123");

    const org = screen.getByTestId("org-select") as HTMLInputElement;
    expect(org).toBeInTheDocument();
    expect(org.defaultValue).toBe("org-xyz");
  });

  it("enables save button when not pending and responds to Escape (calls onCancel)", () => {
    const onCancel = jest.fn();
    render(<ProfileForm onCancel={onCancel} />);

    const saveBtn = screen.getByTestId("profile-form-submit");
    expect(saveBtn).not.toBeDisabled();

    // pressing Escape should reset and call onCancel
    const form = document.getElementById("profile-form") as HTMLFormElement;
    expect(form).toBeInTheDocument();

    fireEvent.keyDown(form, { key: "Escape", code: "Escape" });
    expect(onCancel).toHaveBeenCalledTimes(1);
  });
});
