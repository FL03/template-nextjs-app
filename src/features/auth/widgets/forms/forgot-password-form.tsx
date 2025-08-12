/**
 * Created At: 2025-04-02:20:54:00
 * @author - @FL03
 * @file - forgot-password-form.tsx
 */
"use client";
// imports
import * as React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
// project
import { resolveOrigin } from "@/lib/endpoint";
import { createBrowserClient } from "@/lib/supabase";
import { cn } from "@/lib/utils";
// components
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const forgotPasswordSchema = z.object({
  email: z
    .email({
      error: "Please provide the email associated with the account",
    })
    .default(""),
});

type ForgotPasswordSchema = z.infer<typeof forgotPasswordSchema>;

interface FormProps {
  defaultValues?: Partial<ForgotPasswordSchema>;
  values?: ForgotPasswordSchema;
  options?: { captchaToken?: string };
  onCancel?: () => void;
  beforeSubmit?: () => void;
  onSubmit?: (data: ForgotPasswordSchema) => void;
  onSubmitSuccess?: (data: ForgotPasswordSchema) => void;
}

// Forgot Credentials Form
export const ForgotPasswordForm: React.FC<
  & Omit<React.ComponentProps<"form">, "children" | "onSubmit" | "title">
  & FormProps
> = (
  {
    ref,
    className,
    defaultValues,
    values,
    options,
    beforeSubmit,
    onSubmitSuccess,
    ...props
  },
) => {
  // initialize the supabase client
  const supabase = createBrowserClient();
  // define the redirect path
  const redirectUrl = new URL("/auth/reset-password", resolveOrigin())
    .toString();
  // setup the form
  const form = useForm({
    resolver: zodResolver(forgotPasswordSchema),
    mode: "onSubmit",
    defaultValues,
    values,
  });

  function onSubmit(data: ForgotPasswordSchema) {
    // call the before submit callback if provided
    if (beforeSubmit) beforeSubmit();

    toast.promise(
      supabase.auth.resetPasswordForEmail(data.email, {
        redirectTo: redirectUrl.toString(),
      }),
      {
        loading: "Sending reset password email...",
        success: "Reset password email sent successfully!",
        error: (err) => `Failed to send reset password email: ${err.message}`,
      },
    );
    // if the onSubmitSuccess prop is provided, call it with the form data
    if (onSubmitSuccess) onSubmitSuccess(data);
  }
  // render the component
  return (
    <Form {...form}>
      <form
        {...props}
        ref={ref}
        className={cn("flex flex-col flex-1 w-full gap-2", className)}
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FormField
          name="email"
          render={({ fieldState, ...field }) => {
            return (
              <FormItem itemType="email" datatype="email">
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    className="input"
                    datatype="email"
                    itemType="email"
                    type="email"
                    placeholder="Email"
                  />
                  <FormMessage />
                  <FormDescription>
                    The email address associated with the account you want to
                    reset the password for.
                  </FormDescription>
                </FormControl>
              </FormItem>
            );
          }}
        />
      </form>
    </Form>
  );
};
ForgotPasswordForm.displayName = "ForgotCredentialsForm";
