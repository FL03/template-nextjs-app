/**
 * Created At: 2025.04.19:20:29:45
 * @author - @FL03
 * @file - email-password-form.tsx
 */
"use client";
// imports
import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { SignInWithPasswordCredentials } from "@supabase/supabase-js";
import { Loader2Icon, LogInIcon } from "lucide-react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
// project
import { logger } from "@/lib/logger";
import { loginWithEmailPassword } from "@/lib/supabase";
import { cn } from "@/lib/utils";
// components
import { LabeledSeparator } from "@/components/common/labeled-separator";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { Separator } from "@/components/ui/separator";
// feature-specific
import { authEndpoint } from "@/features/auth/constants";
import { AuthProviderButtons } from "@/features/auth/widgets/auth-provider-buttons";

export const emailPasswordSchema = z
  .object({
    email: z
      .email({
        message: "A valid email address is required.",
      })
      .refine((arg: string) => arg.trim().length > 0),
    password: z.string({ error: "Password is required..." }).min(6, {
      message: "Password must be at least 6 characters long.",
    }),
  })
  .loose();

const parseEmailPasswordSchema = (values: unknown) => {
  return emailPasswordSchema.parse(values, {
    error: (issue) => {
      logger.error(issue, "Error parsing email-password schema...");
      // initialize the message
      let message = issue.message;
      // handle specific error codes
      if (issue.code === "invalid_type") {
        message = "Invalid input type provided.";
      } else {
        // update the message if none was passed
        message = "An error occurred while parsing the form data.";
      }
      // return the data
      return {
        message,
      };
    },
  });
};

export type EmailPasswordSchema = z.infer<typeof emailPasswordSchema>;

type FormProps = {
  defaultValues?: Partial<EmailPasswordSchema>;
  values?: EmailPasswordSchema;
  options?: SignInWithPasswordCredentials["options"];
  onCancel?: () => void;
  beforeSubmit?: () => void;
  onSubmitSuccess?: (values: EmailPasswordSchema) => void;
};

export const EmailPasswordForm: React.FC<
  FormProps & Omit<React.ComponentProps<"form">, "onSubmit" | "defaultValue">
> = ({
  className,
  defaultValues,
  values,
  options,
  beforeSubmit,
  onCancel,
  onSubmitSuccess,
  ...props
}) => {
  // ensure that both defaultValues and values are not provided at the same time
  if (defaultValues && values) {
    logger.warn(
      "Both defaultValues and values are provided; merging into defaults",
    );
    defaultValues = parseEmailPasswordSchema({ ...defaultValues, ...values });
    values = undefined;
  }

  // define the form with the useForm hook
  const form = useForm<EmailPasswordSchema>({
    resolver: zodResolver(emailPasswordSchema),
    defaultValues,
    values,
  });

  // handle any effects
  React.useEffect(() => {
    // handle successful form submission effects
    if (form.formState.isSubmitSuccessful) {
      // call the onSubmitSuccess callback
      if (onSubmitSuccess) onSubmitSuccess(form.getValues());
      // reset the form
      form.reset();
    }
  }, [form, onSubmitSuccess]);

  // handle any cancel invocations
  function handleOnCancel(event: React.BaseSyntheticEvent) {
    // prevent the default action
    event.preventDefault();
    // stop the event from bubbling up
    event.stopPropagation();
    // call the onCancel callback if provided
    if (onCancel) onCancel();
  }

  // handle form submissions
  function handleOnSubmit(event: React.BaseSyntheticEvent) {
    // prevent the default action
    event.preventDefault();
    // stop the event from bubbling up
    event.stopPropagation();
    // trace the event
    logger.trace(event, "Submitting the email-password login form...");
    // use the beforeSubmit callback if provided
    if (beforeSubmit) beforeSubmit();
    // process the submit action
    return form.handleSubmit(async (formData) => {
      // initialize the promise for handling the email-password login
      // use the toast hook to progress the login
      toast.promise(
        loginWithEmailPassword({
          ...formData,
          options,
        }),
        {
          loading: "Verifying credentials...",
          success: "Successfully logged in!",
          error: () => "Error signing in with email and password...",
        },
      );
    })(event);
  }

  // render the form
  return (
    <Form {...form}>
      <form
        {...props}
        className={cn(
          "flex flex-col gap-2 relative z-auto",
          className,
        )}
        onKeyDown={async (event) => {
          if (event.key === "Enter") {
            // process the form submission
            await handleOnSubmit(event);
          }
          // handle the cancel action
          if (event.key === "Escape") {
            // call the onCancel callback if provided
            handleOnCancel(event);
          }
        }}
        onSubmit={handleOnSubmit}
      >
        {/* email */}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => {
            return (
              <FormItem itemType="email" datatype="email">
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="sample@sample.com" />
                </FormControl>
                <FormDescription>
                  The email address associated with your account
                </FormDescription>
                <FormMessage {...field} />
              </FormItem>
            );
          }}
        />
        {/* password */}
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => {
            return (
              <FormItem itemType="password" datatype="password">
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="password" type="password" />
                </FormControl>
                <FormDescription className="sr-only">
                  Enter your password
                </FormDescription>
                <FormMessage {...field} />
              </FormItem>
            );
          }}
        />
        <Button
          className="w-full"
          type="submit"
          disabled={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting
            ? (
              <>
                <Loader2Icon className="h-4 w-4 animate-spin" />
                <span className="animate-pulse">Signing In...</span>
              </>
            )
            : (
              <>
                <LogInIcon />
                <span>Sign In</span>
              </>
            )}
        </Button>
        <Separator className="my-2" />
        <AuthProviderButtons />
        {/* footer */}
        <div className="order-last bottom-0 flex flex-nowrap items-center justify-between">
          <Button asChild variant="link">
            <Link
              href={authEndpoint({ params: { view: "register" } })}
              className="inline-flex flex-nowrap gap-2"
            >
              <span className="hover:italic text-muted-foreground">
                Create a new account
              </span>
            </Link>
          </Button>
          <Button asChild variant="link">
            <Link
              href={authEndpoint({ params: { view: "forgot-password" } })}
              className="inline-flex flex-nowrap gap-2"
            >
              <span className="hover:italic text-muted-foreground">
                Forgot your password?
              </span>
            </Link>
          </Button>
        </div>
      </form>
    </Form>
  );
};
EmailPasswordForm.displayName = "EmailPasswordForm";

export const EmailPasswordFormDialog: React.FC<
  FormProps & React.ComponentProps<typeof Dialog>
> = ({
  defaultOpen = false,
  defaultValues,
  values,
  onSubmitSuccess,
  onCancel,
  onOpenChange,
  ...props
}) => {
  const handleOpenChange = (open: boolean) => {
    // setOpen(open);
    onOpenChange?.(open);
  };

  function handleSubmitSuccess(values: EmailPasswordSchema) {
    onSubmitSuccess?.(values);
    handleOpenChange(false);
  }

  function handleCancel() {
    onCancel?.();
    handleOpenChange(false);
  }
  return (
    <Dialog
      defaultOpen={defaultOpen}
      onOpenChange={handleOpenChange}
      {...props}
    >
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader className="flex flex-col w-full gap-2">
          <DialogTitle>Login</DialogTitle>
          <DialogDescription>
            Login with your email and password
          </DialogDescription>
        </DialogHeader>
        <EmailPasswordForm
          defaultValues={defaultValues}
          values={values}
          onCancel={handleCancel}
          onSubmitSuccess={handleSubmitSuccess}
        />
      </DialogContent>
    </Dialog>
  );
};
EmailPasswordFormDialog.displayName = "EmailPasswordFormDialog";

export default EmailPasswordForm;
