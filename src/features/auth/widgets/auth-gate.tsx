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
import { resolveAuthView } from "../utils";
// components
import { CloudflareTurnstile } from "@/components/common/captcha";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";

const authGateVariants = cva("", {
  defaultVariants: {
    position: "center",
  },
  variants: {
    position: {
      center: "justify-center",
      right: "justify-end",
    },
  },
});

export const AuthGate: React.FC<
  Omit<React.ComponentPropsWithRef<"div">, "children"> & {
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

  // memoize the gate mode based on the view prop
  const gateMode = React.useMemo(() => resolveAuthView(currentView), [
    currentView,
  ]);
  // render the form based on the gate mode
  const renderForm = () => {
    switch (gateMode) {
      case "register":
        return (
          <RegistrationForm
            showLegend
            key="register"
            captchaToken={captchaToken}
            onSuccess={() => router.push("/verify?email=true")}
          />
        );
      case "passwordless":
        return (
          <PasswordlessLoginForm
            showLegend
            key="passwordless"
            captchaToken={captchaToken}
            onSuccess={() => router.push("/")}
          />
        );
      case "forgot-password":
        return (
          <ForgotPasswordForm
            showLegend
            key="forgot-password"
            captchaToken={captchaToken}
          />
        );
      default:
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
      className={cn(
        authGateVariants({ position }),
        "flex flex-1 h-screen w-full items-center relative z-auto",
        className,
      )}
    >
      <Card
        className={cn(
          "relative z-10 flex flex-col max-w-md",
          className,
        )}
      >
        <CardContent>
          <CardHeader>
            {renderForm()}
          </CardHeader>
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
