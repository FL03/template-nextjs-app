/**
 * Created At: 2025.09.11:13:03:37
 * @author - @FL03
 * @file - auth-provider-buttons.tsx
 */
"use client";
// globals
import * as React from "react";
// imports
import { Provider } from "@supabase/supabase-js";
import { toast } from "sonner";
// project
import { logger } from "@/lib/logger";
import { createBrowserClient } from "@/lib/supabase";
import { cn } from "@/lib/utils";
// components
import { IconButton } from "@/components/common/button";
import {
  GithubIcon,
  GoogleIcon,
  XPlatformLogo,
} from "@/components/common/icons";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";

type ProviderButtonMode = "sign-in" | "link" | "sign-up";

type AuthProviderButtonsProps = {
  mode?: ProviderButtonMode;
  buttonSize?: React.ComponentProps<typeof Button>["size"];
  buttonVariant?: React.ComponentProps<typeof Button>["variant"];
};
/** A set of buttons for signing in or linking with OAuth providers. */
export const AuthProviderButtons: React.FC<
  & Omit<React.ComponentPropsWithoutRef<typeof ButtonGroup>, "children">
  & AuthProviderButtonsProps
> = (
  {
    className,
    mode = "sign-in",
    buttonSize = "default",
    buttonVariant = "outline",
    ...props
  },
) => {
  // initialize the supabase client
  const supabase = createBrowserClient();
  // define the scope state
  const [scope, setScope] = React.useState<Provider | null>(null);
  // declare the redirect URL
  const redirectUrl = new URL("/auth/callback", window.location.origin);
  const redirectTo = redirectUrl.toString();
  // handle the OAuth sign-in or link
  function handleOnClick(
    provider: Provider,
  ): React.MouseEventHandler<HTMLButtonElement> {
    const onLink: React.MouseEventHandler<HTMLButtonElement> = () => {
      toast.promise(
        async () => {
          // sign in with the selected provider
          const { error } = await supabase.auth.linkIdentity({
            provider,
            options: {
              redirectTo,
            },
          });
          // handle any errors that occur during sign-in
          if (error) {
            throw new Error(error.message);
          }
        },
        {
          loading: `Linking with ${provider}...`,
          success: () => {
            setScope(null);
            return `Successfully linked the account with ${provider}`;
          },
          error: (err) => {
            const error = err instanceof Error ? err : new Error(String(err));
            return `Error linking with ${provider}: ${error.message}`;
          },
        },
      );
    };
    // handle the sign-in process
    const onSignIn: React.MouseEventHandler<HTMLButtonElement> = () => {
      toast.promise(
        async () => {
          // sign in with the selected provider
          const { error } = await supabase.auth.signInWithOAuth({
            provider,
            options: {
              redirectTo,
            },
          });
          // handle any errors that occur during sign-in
          if (error) {
            logger.error(
              error,
              "An error occurred when signing in with provider",
            );
          }
        },
        {
          loading: `Signing in with ${provider}`,
          success: () => {
            setScope(null);
            return `Signed in with ${provider}`;
          },
          error: `Error authenticating with ${provider}`,
        },
      );
    };

    return (event) => {
      // cleanup the event
      event.preventDefault();
      event.stopPropagation();
      // ensure the current scope matches the passed provider
      if (provider !== scope) setScope(provider);
      // call the appropriate handler based on the mode
      if (mode === "link") onLink(event);
      else onSignIn(event);
    };
  }

  return (
    <ButtonGroup className={cn("w-full", className)} {...props}>
      <IconButton
        size={buttonSize}
        variant={buttonVariant}
        onClick={handleOnClick("github")}
        disabled={scope === "github"}
        label="GitHub"
      >
        <GithubIcon className="size-4" />
      </IconButton>
      <IconButton
        size={buttonSize}
        variant={buttonVariant}
        onClick={handleOnClick("google")}
        disabled={scope === "google"}
        label="Google"
      >
        <GoogleIcon />
      </IconButton>
      <IconButton
        label="Twitter"
        size={buttonSize}
        variant={buttonVariant}
        onClick={handleOnClick("twitter")}
        disabled={scope === "twitter"}
      >
        <XPlatformLogo />
      </IconButton>
    </ButtonGroup>
  );
};
AuthProviderButtons.displayName = "AuthProviderButtons";
