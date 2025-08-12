/**
 * Created At: 2025.08.11:23:55:20
 * @author - @FL03
 * @file - use-turnstile.tsx
 */
"use client";
// imports
import { useCallback, useMemo, useState } from "react";

type HookOptions = { onValueChange?: (value?: string) => void };

type HookOutput = { captchaToken?: string, reset: () => void, onChange: (token?: string) => void };

export const useTurnstile = (options?: HookOptions) => {
  // deconstruct the options
  const { onValueChange } = options || {};
  // setup the core state
  const [token, setToken] = useState<string | undefined>();
  // handle changes to the captcha token
  const updateToken = useCallback((token?: string) => {
    return setToken((prev) => {
      if (prev === token) return prev;
      // if provided, invoke the onValueChange prop
      onValueChange?.();
      // finally return the new state
      return prev;
    });
  }, [onValueChange]);
  // reset the captchaToken
  const reset = useCallback(() => {
    // clear the token
    setToken(undefined);
  }, []);
  // memoize the output
  return useMemo<HookOutput>(() => ({
    captchaToken: token ?? undefined,
    reset,
    onChange: updateToken,
  }), [token, updateToken, reset]);
};
