/**
 * Created At: 2025-04-04:19:43:34
 * @author - @FL03
 * @file - auth-button.tsx
 */
"use client";
// imports
import * as React from "react";
import { LogInIcon, LogOutIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
// hooks
import { useAuth } from "@/hooks/use-auth";
// project
import { logger } from "@/lib/logger";
import { cn } from "@/lib/utils";
// components
import { Button } from "@/components/ui/button";
// local
import { ENDPOINT_AUTH_LOGIN } from "../constants";

type BaseButtonProps<TProps extends { [key: string]: any } = {}> = TProps & {
  onError?: (error?: any) => void;
  onSignIn?: () => void;
  onSignOut?: () => void;
  onSuccess?: () => void;
};

type AuthButtonProps = BaseButtonProps<{
  signInIcon?: React.ReactNode;
  signOutIcon?: React.ReactNode;
}>;

/** A simple authentication button for managing the user state. */
export const AuthButton: React.FC<
  & Omit<
    React.ComponentPropsWithRef<typeof Button>,
    "children" | "onClick" | "variant"
  >
  & AuthButtonProps
> = ({
  ref,
  className,
  signInIcon,
  signOutIcon,
  size = "default",
  onError,
  onSignIn,
  onSignOut,
  onSuccess,
  ...props
}) => {
  // initialize the client-side supabase client
  const { state } = useAuth();
  // handle the case where the user is authenticated
  if (state.isAuthenticated) {
    // render the logout button
    return (
      <LogoutButton
        {...props}
        ref={ref}
        className={cn("transition-colors", className)}
        icon={signOutIcon}
        size={size}
        variant="destructive"
        onError={onError}
        onSignOut={onSignOut}
        onSuccess={onSuccess}
      />
    );
  }
  // if the user is not authenticated, render the login button
  return (
    <LoginButton
      {...props}
      ref={ref}
      className={cn("transition-colors", className)}
      icon={signInIcon}
      size={size}
      variant="outline"
      onError={onError}
      onSignIn={onSignIn}
      onSuccess={onSuccess}
    />
  );
};
AuthButton.displayName = "AuthButton";

// LoginButton
export const LoginButton: React.FC<
  & Omit<React.ComponentPropsWithRef<typeof Button>, "asChild" | "onClick">
  & BaseButtonProps<{ icon?: React.ReactNode }>
> = ({
  ref,
  icon = <LogInIcon className="h-4 w-4" />,
  className,
  size = "default",
  variant = "outline",
  onError,
  onSignIn,
  onSuccess,
  ...props
}) => {
  // define a signal to mark if the button is rendered as an icon
  const isIcon = React.useMemo(() => size === "icon", [size]);
  // use the router hook to navigate
  const router = useRouter();
  // a callback for handling the click event on the button
  const handleOnClick = (event: React.BaseSyntheticEvent) => {
    // prevent default action
    event.preventDefault();
    // prevent the event from propagating upward
    event.stopPropagation();
    // trace the event
    logger.trace("Handling the auth button click event...");
    try {
      // resolve the callback to use w.r.t. the current authentication state
      if (onSignIn) onSignIn();
      else router.push(ENDPOINT_AUTH_LOGIN);
      // use the onSuccess callback if provided
      if (onSuccess) onSuccess();
    } catch (error) {
      logger.error({ error }, "Error signing in...");
      toast.error("Error", {
        description: "An error occurred during the login",
      });
      if (onError) onError(error);
      throw error;
    }
  };

  // render the component
  return (
    <Button
      {...props}
      ref={ref}
      id="auth-button"
      className={cn("transition-colors", className)}
      size={size}
      variant={variant}
      onClick={handleOnClick}
    >
      {icon}
      <span className={isIcon ? "sr-only" : "not-sr-only"}>Login</span>
    </Button>
  );
};
LoginButton.displayName = "LoginButton";

export const LogoutButton: React.FC<
  Omit<
    React.ComponentPropsWithRef<typeof Button>,
    "asChild" | "children" | "onClick"
  > & BaseButtonProps<{ icon?: React.ReactNode }>
> = ({
  ref,
  className,
  icon = <LogOutIcon className="h-4 w-4" />,
  size = "default",
  variant = "destructive",
  onError,
  onSignOut,
  onSuccess,
  ...props
}) => {
  // define a signal to mark if the button is rendered as an icon
  const isIcon = React.useMemo(() => size === "icon", [size]);
  // call the useAuth hook
  const auth = useAuth();
  // use the router hook to navigate
  const router = useRouter();
  // a callback for handling the click event on the button
  const handleOnClick = async (event: React.BaseSyntheticEvent) => {
    // prevent default action
    event.preventDefault();
    // prevent the event from propagating upward
    event.stopPropagation();
    // trace the event
    logger.trace("Handling the auth button click event...");
    try {
      // resolve the callback to use w.r.t. the current authentication state
      if (onSignOut) onSignOut();
      else {
        await auth.signOut();
      }
      // log the event
      logger.info("User signed out successfully");
      // if provide, use the onSuccess callback; otherwise, redirect to the home page
      if (onSuccess) onSuccess();
      else router.push("/");
    } catch (error) {
      logger.error({ error }, "Error signing in...");
      toast.error("Error", {
        description: "An error occurred during the login",
      });
      if (onError) onError(error);
      throw error;
    }
  };

  // render the component
  return (
    <Button
      {...props}
      ref={ref}
      id="auth-button"
      className={cn("transition-colors", className)}
      size={size}
      variant={variant}
      onClick={handleOnClick}
    >
      {icon}
      <span className={isIcon ? "sr-only" : "not-sr-only"}>Logout</span>
    </Button>
  );
};
LogoutButton.displayName = "LogoutButton";

export default AuthButton;
