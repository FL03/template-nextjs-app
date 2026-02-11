/**
 * Created At: 2025.07.26:13:57:45
 * @author - @FL03
 * @file - auth-gate.tsx
 */
"use client";
// imports
import * as React from "react";
import { cva, VariantProps } from "class-variance-authority";
import { useRouter } from "next/navigation";
// project
import { cn } from "@/lib/utils";
import { useTurnstile } from "@/hooks/use-turnstile";
// local
import {
  EmailPasswordForm,
  ForgotPasswordForm,
  PasswordlessLoginForm,
  RegistrationForm,
} from "./forms";
// components
import { CloudflareTurnstile } from "@/components/common/captcha";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";

const authGateVariants = cva(
  "flex flex-1 flex-col items-center relative z-auto",
  {
    defaultVariants: {
      position: "center",
    },
    variants: {
      position: {
        center: "justify-center h-fit min-h-xs max-h-screen",
        right: "justify-end ml-auto h-screen w-fit px-8 border-l rounded-none",
      },
    },
  },
);

export const AuthGate: React.FC<
  Omit<React.ComponentPropsWithRef<"div">, "children" | "title"> & {
    defaultView?: string;
    view?: string;
    withTurnstile?: boolean;
  } & VariantProps<typeof authGateVariants>
> = ({
  ref,
  className,
  withTurnstile,
  view,
  defaultView = "login",
  position = "center",
  ...props
}) => {
  // get a reference to the isMobile hook
  const router = useRouter();
  // declare a captcha state
  const { captchaToken, onTokenChange, ...captcha } = useTurnstile();

  const [currentView, setCurrentView] = React.useState<string>(defaultView);

  React.useEffect(() => {
    if (view && view !== currentView) {
      setCurrentView(view);
    }
  }, [currentView, view]);
  // render the form based on the gate mode
  const renderForm = () => {
    if (
      currentView.match(/^(forgot-password|reset-password|update-password)$/gi)
    ) {
      return (
        <ForgotPasswordForm
          showLegend
          key="forgot-password"
          captchaToken={captchaToken}
        />
      );
    } else if (
      currentView.match(/^(register|signup|sign-up|create-account)$/gi)
    ) {
      return (
        <RegistrationForm
          showLegend
          key="register"
          captchaToken={captchaToken}
          onSuccess={() => router.push("/")}
        />
      );
    } else if (currentView.match(/^(magic|passwordless)$/gi)) {
      return (
        <PasswordlessLoginForm
          showLegend
          key="passwordless"
          captchaToken={captchaToken}
          onSuccess={() => router.push("/")}
        />
      );
    } else {
      return (
        <EmailPasswordForm
          showLegend
          key="email-password"
          captchaToken={captchaToken}
        />
      );
    }
  };
  // render the component
  return (
    <div
      {...props}
      ref={ref}
      className={cn(authGateVariants({ position }), className)}
    >
      <Card className="w-full min-w-sm max-w-md">
        <CardContent className="flex-1 h-full w-full">
          <CardHeader>{renderForm()}</CardHeader>
          {withTurnstile && (
            <CardFooter className="w-full">
              <CloudflareTurnstile
                className="m-auto"
                onSuccess={onTokenChange}
                onError={captcha.reset}
                onExpire={captcha.reset}
                onValueChange={onTokenChange}
              />
            </CardFooter>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
AuthGate.displayName = "AuthGate";

export default AuthGate;
