/**
 * Created At: 2025.08.11:23:55:20
 * @author - @FL03
 * @file - use-turnstile.tsx
 */
"use client";
// imports
import { useCallback, useMemo, useState } from "react";

namespace UseTurnstile {
  export type Props = { onValueChange?(value?: string): void };

  export type Output = {
    captchaToken?: string;
    onTokenChange(token?: string): void;
    reset(): void;
  };

  export type Hook = (options?: Props) => Output;
}

export const useTurnstile: UseTurnstile.Hook = (
  { onValueChange } = {},
) => {
  // define the token state
  const [token, setToken] = useState<string | undefined>();
  // handle changes to the captcha token
  const onTokenChange = useCallback((token?: string) => (
    setToken((prev) => {
      if (prev === token) return prev;
      onValueChange?.();
      return prev;
    })
  ), [onValueChange]);
  // reset the captchaToken
  const reset = useCallback(() => {
    setToken(undefined);
  }, []);
  // memoize the output
  return useMemo(() => ({
    captchaToken: token ?? undefined,
    onTokenChange,
    reset,
  }), [token, onTokenChange, reset]);
};
