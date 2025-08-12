/**
 * Created At: 2025.07.26:13:57:45
 * @author - @FL03
 * @file - auth-gate.tsx
 */
"use client";
// imports
import * as React from "react";
import { useRouter } from "next/navigation";
// project
import { cn } from "@/lib/utils";
import { useTurnstile } from "@/hooks/use-turnstile";
// local
import {
  EmailPasswordForm,
  PasswordlessLoginForm,
  RegistrationForm,
} from "./forms";
// components
import { CloudflareTurnstile } from "@/components/common/captcha";
import {
  Header,
  HeaderContent,
  HeaderDescription,
  HeaderTitle,
} from "@/components/common/header";
import { Separator } from "@/components/ui/separator";

type GateMode = "login" | "register" | "passwordless";

export const AuthGate: React.FC<
  Omit<React.ComponentPropsWithRef<"div">, "children"> & {
    view?: string;
    withTurnstile?: boolean;
  }
> = ({
  ref,
  className,
  withTurnstile,
  view: viewProp = "login",
  ...props
}) => {
  // get a reference to the isMobile hook
  const router = useRouter();
  // declare a captcha state
  const { captchaToken, reset: resetCaptcha, onChange: onTokenChange } =
    useTurnstile();

  // memoize the gate mode based on the view prop
  const gateMode = React.useMemo<GateMode>(() => {
    if (
      ["sign-up", "signup", "register"].includes(viewProp) ||
      viewProp.startsWith("regist")
    ) {
      return "register";
    } else if (["magic", "passkey", "passwordless"].includes(viewProp)) {
      return "passwordless";
    } else {
      return "login";
    }
  }, [viewProp]);

  const gateHeader: Record<GateMode, { description: string; title: string }> = {
    login: {
      description: "Sign in to your account",
      title: "Login",
    },
    register: {
      description: "Create an account to get started.",
      title: "Register",
    },
    passwordless: {
      description: "Sign in with a magic link sent to your email.",
      title: "Passwordless Login",
    },
  };
  // handle the success of the form submission
  const onSuccess = () => {
    resetCaptcha();
    router.push("/");
  };
  // render the form based on the gate mode
  const renderForm = () => {
    switch (gateMode) {
      case "register":
        return (
          <RegistrationForm
            key="register"
            options={{ captchaToken }}
            onSubmitSuccess={onSuccess}
          />
        );
      case "passwordless":
        return (
          <PasswordlessLoginForm
            key="passwordless"
            options={{ captchaToken }}
            onSubmitSuccess={onSuccess}
          />
        );
      default:
        return (
          <EmailPasswordForm
            key="email-password"
            options={{ captchaToken }}
            onSubmitSuccess={onSuccess}
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
        "flex flex-col flex-1 max-w-sm relative z-auto px-4 py-2",
        "bg-accent/90 text-accent-foreground border-accent/10",
        "border rounded-xl drop-shadow-lg shadow-inner",
        className,
      )}
    >
      {/* header */}
      <Header className="order-first flex flex-col top-0 mb-2 w-full">
        <HeaderContent>
          <HeaderTitle className="font-semibold text-xl tracking-tight">
            {gateHeader[gateMode].title}
          </HeaderTitle>
          <HeaderDescription className="text-muted-foreground text-sm">
            {gateHeader[gateMode].description}
          </HeaderDescription>
        </HeaderContent>
      </Header>
      {renderForm()}
      <div className="bottom-0 order-last flex flex-nowrap w-full items-center justify-center gap-2">
        <Separator orientation="horizontal" />
        {withTurnstile && (
          <CloudflareTurnstile
            className="mx-auto"
            onSuccess={onTokenChange}
            onError={() => resetCaptcha()}
            onExpire={() => resetCaptcha()}
          />
        )}
      </div>
    </div>
  );
};
AuthGate.displayName = "AuthGate";

export default AuthGate;
