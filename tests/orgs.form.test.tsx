/**
 * Created At: 2025.10.23:15:38:34
 * @author - @FL03
 * @directory - tests
 * @file - orgs.form.test.tsx
 */
import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";

import { OrganizationForm } from "../src/features/orgs/widgets/org-form";

describe("OrganizationForm", () => {
  let useActionStateSpy: jest.SpyInstance;

  beforeEach(() => {
    // @ts-ignore - React.useActionState is provided by Next runtime in the app;
    // in tests we stub it to control isPending/state.
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

  it("renders the fields and actions of the organization form using the given defaults", () => {
    render(
      <OrganizationForm
        defaultValues={{
          name: "Acme Co",
          description: "Acme description",
          id: "org-1",
        }}
      />,
    );

    const name = screen.getByPlaceholderText(
      "Organization Name",
    ) as HTMLInputElement;
    const description = screen.getByPlaceholderText(
      "A brief description of the organization",
    ) as HTMLInputElement;
    const hidden = document.querySelector(
      'input[name="id"]',
    ) as HTMLInputElement;

    expect(name).toBeInTheDocument();
    expect(name).toHaveValue("Acme Co");

    expect(description).toBeInTheDocument();
    expect(description).toHaveValue("Acme description");

    expect(hidden).toBeInTheDocument();
    expect(hidden.value).toBe("org-1");
  });

  it("calls onCancel when Escape is pressed on the form", () => {
    const onCancel = jest.fn();
    render(<OrganizationForm onCancel={onCancel} />);

    const form = document.getElementById(
      "organization-form",
    ) as HTMLFormElement;
    expect(form).toBeInTheDocument();

    fireEvent.keyDown(form, { key: "Escape", code: "Escape" });

    expect(onCancel).toHaveBeenCalledTimes(1);
  });
});
