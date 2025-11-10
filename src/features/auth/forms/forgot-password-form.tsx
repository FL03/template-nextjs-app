/**
 * Created At: 2025-04-02:20:54:00
 * @author - @FL03
 * @file - forgot-password-form.tsx
 */
"use client";
// imports
import * as React from "react";
// project
import { cn } from "@/lib/utils";
// local
import { resetPasswordAction } from "../utils";
// components
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldContent,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";

interface FormProps extends
  Omit<
    React.ComponentProps<"form">,
    "action" | "children" | "onSubmit" | "title" | "method" | "id"
  > {
  captchaToken?: string;
  redirectTo?: string;
  showLegend?: boolean;
  onCancel?(): void;
  onError?(error: unknown): void;
  onSuccess?(): void;
}
// Forgot Credentials Form
export const ForgotPasswordForm: React.FC<FormProps> = (
  {
    ref,
    captchaToken,
    redirectTo,
    showLegend,
    onCancel,
    onError,
    onSuccess,
    ...props
  },
) => {
  const [formState, formAction, isPending] = React.useActionState(
    resetPasswordAction,
    {},
  );
  return (
    <form
      {...props}
      id="forgot-password-form"
      ref={ref}
      className="flex flex-nowrap items-center gap-2"
      action={formAction}
      onKeyDown={(event) => {
        if (event.key === "Enter" && (event.ctrlKey || event.metaKey)) {
          event.preventDefault();
          event.currentTarget.requestSubmit();
        }
        if (event.key === "Escape") {
          event.currentTarget.reset();
        }
      }}
    >
      <FieldSet form="forgot-password-form">
        <FieldLegend
          className={cn("text-xl", showLegend ? "not-sr-only" : "sr-only")}
        >
          Forgot Password?
        </FieldLegend>
        <FieldGroup className={cn(showLegend ? "not-sr-only" : "sr-only")}>
          <Field orientation="responsive">
            <FieldContent>
              <FieldLabel htmlFor="email">Email</FieldLabel>
            </FieldContent>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="Account email"
            />
          </Field>
          {/* Hidden Fields */}
          <>
            <Field>
              <Input
                id="captcha_token"
                name="captchaToken"
                type="hidden"
                value={captchaToken}
              />
            </Field>
            <Field>
              <Input
                id="redirect_to"
                name="redirectTo"
                type="hidden"
                value={redirectTo}
              />
            </Field>
          </>
          {/* Actions */}
          <Field orientation="horizontal">
            <Button
              disabled={isPending}
              form="forgot-password-form"
              id="forgot-password-submit"
              data-testid="forgot-password-submit"
              type="submit"
            >
              <span>Submit</span>
            </Button>
          </Field>
        </FieldGroup>
      </FieldSet>
    </form>
  );
};
ForgotPasswordForm.displayName = "ForgotCredentialsForm";
