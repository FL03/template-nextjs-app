/**
 * Created At: 2025.10.23:11:15:49
 * @author - @FL03
 * @directory - src/features/auth/forms
 * @file - login-form.tsx
 */
"use client";
// imports
import * as React from "react";
import { LogInIcon } from "lucide-react";
import Link from "next/link";
// project
import { cn } from "@/lib/utils";
import { FormProps } from "@/types";
// local
import { AuthProviderButtons } from "../widgets";
// components
import { SubmitButton } from "@/components/common/button";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";

export type LoginFormData = {
  email: string;
  password: string;
  captchaToken?: string;
};

export const EmailPasswordForm: React.FC<
  Omit<
    FormProps<LoginFormData, {
      captchaToken?: string;
      showDescription?: boolean;
      showLegend?: boolean;
    }>,
    "onSubmit"
  >
> = ({
  ref,
  className,
  captchaToken,
  defaultValues,
  values,
  showLegend,
  showDescription,
  onCancel,
  onError,
  onSuccess,
  ...props
}) => {
  // render the form
  return (
    <form
      {...props}
      ref={ref}
      id="login-form"
      className={cn(
        "flex flex-col flex-1 w-full gap-2 relative z-auto",
        className,
      )}
      action="/api/auth/login"
      method="post"
      onKeyDown={async (event) => {
        if (event.key === "Enter" && (event.ctrlKey || event.metaKey)) {
          event.preventDefault();
          // process the form submission
          event.currentTarget.requestSubmit();
        }
        // handle the cancel action
        if (event.key === "Escape") {
          event.preventDefault();
          // call the onCancel callback if provided
          onCancel?.();
        }
      }}
    >
      <FieldSet form="login-form">
        <FieldLegend
          className={cn("text-lg", showLegend ? "not-sr-only" : "sr-only")}
        >
          Login
        </FieldLegend>
        <FieldDescription
          className={cn(showDescription ? "not-sr-only" : "sr-only")}
        >
          Use your email address and password to sign in to your account!
        </FieldDescription>
        <FieldGroup>
          <Field orientation="responsive">
            <FieldContent>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <FieldDescription>
                The email address associated with your account
              </FieldDescription>
            </FieldContent>
            <Input
              autoFocus
              id="email"
              name="email"
              placeholder="Email address"
              type="email"
              defaultValue={defaultValues?.email}
              value={values?.email}
            />
          </Field>
          <Field orientation="responsive">
            <FieldContent>
              <FieldLabel htmlFor="password">Password</FieldLabel>
              <FieldDescription>
                Authenticate using your account password
              </FieldDescription>
            </FieldContent>
            <Input
              id="password"
              name="password"
              placeholder="password"
              type="password"
              defaultValue={defaultValues?.password}
              value={values?.password}
            />
          </Field>
          {/* Hidden Fields */}
          <>
            <Field>
              <Input
                readOnly
                type="hidden"
                id="captchaToken"
                name="captchaToken"
                defaultValue={defaultValues?.captchaToken}
                value={captchaToken ?? values?.captchaToken}
              />
            </Field>
          </>
          {/* Actions */}
          <Field orientation="horizontal">
            <SubmitButton
              className="w-full"
              form="login-form"
              type="submit"
              icon={<LogInIcon className="size-4" />}
              labels={{ default: "Log In", pending: "Logging In..." }}
              data-testid="login-form-submit"
              id="login-form-submit"
            />
          </Field>
          <FieldSeparator>
            or
          </FieldSeparator>
          <Field>
            <AuthProviderButtons orientation="vertical" />
          </Field>
          <Field
            className="order-last flex flex-nowrap items-center justify-center gap-6 w-full"
            orientation="horizontal"
          >
            <Button asChild variant="link" className="order-first">
              <Link href="/auth/register">
                <span className="hover:italic text-muted-foreground">
                  Create a new account
                </span>
              </Link>
            </Button>
            <Button asChild variant="link" className="order-last">
              <Link href="/auth/forgot-password">
                <span className="hover:italic text-muted-foreground">
                  Forgot your password?
                </span>
              </Link>
            </Button>
          </Field>
        </FieldGroup>
      </FieldSet>
    </form>
  );
};
