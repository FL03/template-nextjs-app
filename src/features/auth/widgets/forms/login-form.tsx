/**
 * Created At: 2025.08.09:15:11:26
 * @author - @FL03
 * @file - login-form.tsx
 */
"use client";
// globals
import * as React from "react";
import { SignInWithPasswordCredentials } from "@supabase/supabase-js";
// components
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EmailPasswordForm } from "./email-password-form";
import { Card, CardContent } from "@/components/ui/card";

type WithCaptchaToken = {
  captchaToken?: string;
} | undefined;

type FormModes = "email-password" | "passwordless";

type FormProps<
  TFormData,
  TFormOptions extends WithCaptchaToken =
    SignInWithPasswordCredentials["options"],
> = {
  className?: string;
  defaultMode?: FormModes;
  defaultValues?: Partial<TFormData>;
  values?: TFormData;
  options?: TFormOptions;
  onCancel?: () => void;
  beforeSubmit?: () => void;
  onSubmitSuccess?: (values: TFormData) => void;
  onTabChange?: (value: string) => void;
};

export function LoginForm<TFormData>({
  className,
  defaultValues,
  values,
  defaultMode = "email-password",
  options,
  beforeSubmit,
  onCancel,
  onSubmitSuccess,
  onTabChange,
  ...props
}: FormProps<TFormData>) {
  // define the tab state
  const [tab, setTab] = React.useState<string>(
    defaultMode,
  );
  // a callback for handling tab changes
  const handleTabChange = React.useCallback((value: string): void => {
    // set the local state
    setTab(value);
    // invoke the external callback if provided
    if (onTabChange) onTabChange(value);
    // return
    return;
  }, [onTabChange]);

  // render the form
  return (
    <Tabs onValueChange={handleTabChange} value={tab}>
      <TabsList className="grid w-full grid-cols-auto">
        <TabsTrigger value="email-password">Email & Password</TabsTrigger>
      </TabsList>
      <TabsContent value="email-password">
        <Card>
          <CardContent>
            <EmailPasswordForm {...props} />
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
LoginForm.displayName = "LoginForm";

export default LoginForm;
