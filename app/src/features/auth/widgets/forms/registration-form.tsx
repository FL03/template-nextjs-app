/**
 * Created At: 2025.04.17:07:31:26
 * @author - @FL03
 * @file - registration-form.tsx
 */
"use client";
// imports
import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2Icon } from "lucide-react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
// project
import { logger } from "@/lib/logger";
import { cn } from "@/lib/utils";
// local
import { handleRegistration } from "../../utils";
// components
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";

export const registrationFormSchema = z
  .object({
    captchaToken: z.string().optional(),
    email: z
      .email({
        error: "Email is required...",
      }),
    password: z
      .string({
        error: "Password is required...",
      })
      .min(8, {
        message: "Password must be at least 8 characters.",
      }),
    passwordConfirm: z
      .string({ error: "Password confirm is required..." }),
    username: z
      .string({
        error: "Username is required...",
      })
      .min(3, { message: "Username must be at least 3 characters." })
      .max(60, { message: "Username must be at most 60 characters." }),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: "Passwords must match.",
  });

export type RegistrationFormValues = z.infer<typeof registrationFormSchema>;

/** The primary form for creating new user accounts. */
export const RegistrationForm: React.FC<
  Omit<
    React.ComponentPropsWithRef<"form">,
    "children" | "defaultValue" | "id" | "onSubmit"
  > & {
    captchaToken?: string;
    emailRedirectTo?: string;
    defaultValues?: Partial<RegistrationFormValues>;
    values?: RegistrationFormValues;

    showLegend?: boolean;
    beforeSubmit?(): void;
    onCancel?(): void;
    onSuccess?(): void;
  }
> = ({
  ref,
  className,
  captchaToken,
  emailRedirectTo,
  defaultValues,
  values,
  showLegend,
  beforeSubmit,
  onCancel,
  onSuccess,
  ...props
}) => {
  // call the 'useForm' hook and pass your form schema to the 'resolver' property.
  const form = useForm<RegistrationFormValues>({
    resolver: zodResolver(registrationFormSchema),
    defaultValues,
    values,
  });
  // render the registration form
  return (
    <form
      {...props}
      ref={ref}
      id="registration-form"
      className={cn("relative z-auto flex flex-col w-full", className)}
      onKeyDown={(event) => {
        if (event.key === "Enter" && (event.ctrlKey || event.metaKey)) {
          event.currentTarget.requestSubmit();
        }
        if (event.key === "Escape") {
          onCancel?.();
        }
      }}
      onSubmit={async (event) => {
        // prevent the default action
        event.preventDefault();
        // stop the event from bubbling up the parent elements
        event.stopPropagation();

        return await form.handleSubmit((formData) => {
          logger.trace(event, "Submitting the registration form...");
          if (beforeSubmit) beforeSubmit();

          toast.promise(
            handleRegistration(formData, { captchaToken, emailRedirectTo }),
            {
              loading: "Registering...",
              success: () => {
                logger.info(
                  "Successfully registered the user and created a session...",
                );
                onSuccess?.();
                // reset the form
                form.reset();
                return "Successfully registered the user...";
              },
              error: "Error registering the user...",
            },
          );
        })(event);
      }}
    >
      <FieldSet form="registration-form">
        <FieldLegend
          className={cn("text-xl", showLegend ? "not-sr-only" : "sr-only")}
        >
          Register
        </FieldLegend>
        <FieldDescription
          className={cn(showLegend ? "not-sr-only" : "sr-only")}
        >
          Create a new account!
        </FieldDescription>
        <FieldGroup>
          {/* Username */}
          <Field orientation="responsive">
            <FieldContent>
              <FieldLabel htmlFor="username">
                Username
              </FieldLabel>
              <FieldDescription>
                Choose a unique username for your account
              </FieldDescription>
            </FieldContent>
            <Input
              {...form.register("username")}
              id="username"
              name="username"
              placeholder="Username"
              type="text"
            />
          </Field>
          {/* Email */}
          <Field orientation="responsive">
            <FieldContent>
              <FieldLabel htmlFor="email">
                Email
              </FieldLabel>
              <FieldDescription>
                Provide a valid email address to associate with your account
              </FieldDescription>
            </FieldContent>
            <Input
              {...form.register("email")}
              id="email"
              name="email"
              placeholder="Enter your email"
              type="email"
            />
          </Field>
          {/* Password */}
          <Field orientation="responsive">
            <FieldContent>
              <FieldLabel htmlFor="password">
                Password
              </FieldLabel>
              <FieldDescription>
                Choose a strong password to protect your account
              </FieldDescription>
            </FieldContent>
            <Input
              {...form.register("password")}
              id="password"
              name="password"
              placeholder="password"
              type="password"
            />
          </Field>
          {/* Confirm Password */}
          <Field orientation="responsive">
            <FieldContent>
              <FieldLabel htmlFor="password_confirm">
                Confirm Password
              </FieldLabel>
              <FieldDescription>
                Confirm your account password
              </FieldDescription>
            </FieldContent>
            <Input
              {...form.register("passwordConfirm")}
              id="password_confirm"
              name="passwordConfirm"
              placeholder="password"
              type="password"
            />
          </Field>
          {/* Hidden Fields */}
          <>
            <Field>
              <Input
                {...form.register("captchaToken")}
                name="captchaToken"
                type="hidden"
                id="captchaToken"
              />
            </Field>
          </>
          {/* Actions */}
          <>
            <Field orientation="horizontal">
              <Button
                id="register-form-submit"
                data-testid="register-form-submit"
                form="registration-form"
                type="submit"
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting
                  ? (
                    <>
                      <Loader2Icon className="animate-spin h-4 w-4" />
                      <span className="animate-pulse">Registering...</span>
                    </>
                  )
                  : <span>Register</span>}
              </Button>
            </Field>
            <Field orientation="horizontal" className="justify-center">
              <Button
                asChild
                size="default"
                variant="link"
              >
                <Link href="/auth/login">Already have an account?</Link>
              </Button>
            </Field>
          </>
        </FieldGroup>
      </FieldSet>
    </form>
  );
};
RegistrationForm.displayName = "RegistrationForm";

export default RegistrationForm;
