/**
 * Created At: 2025.10.24:12:55:28
 * @author - @FL03
 * @directory - src/hooks
 * @file - use-form.tsx
 */
'use client';
// imports
import { useCallback, useEffect, useMemo, useState } from 'react';

namespace UseSignal {
  type Dict<Key extends string, Value> = {
    [K in Key]?: Value;
  };

  type OnSignal<TSig extends string> = (options?: {
    message?: string;
    signal?: TSig;
  }) => void;

  type StatusFuncs<TSig extends string> = Dict<TSig, OnSignal<TSig>>;

  export type Props<TSig extends string> = {
    messages?: Dict<TSig, string>;
    defaultValue?: TSig;
    value?: TSig;
    funcs?: StatusFuncs<TSig>;
    onValueChange?(value: TSig | null): void;
  };

  export interface Context<TSig extends string> {
    signal: TSig | null;
    onSignalChange(next: TSig | null): void;
  }

  export type Hook = <TSig extends string>(
    props?: Props<TSig>,
  ) => Context<TSig>;
}
/** The `useSignal` hook is a simple hook for handling a string value */
export function useSignal<TSig extends string>({
  messages,
  funcs,
  defaultValue,
  value,
  onValueChange,
}: UseSignal.Props<TSig> = {}): UseSignal.Context<TSig> {
  // state(s)
  const [_signal, _setSignal] = useState<TSig | null>(defaultValue ?? null);
  const message = useMemo<string | undefined>(
    () => (_signal ? messages?.[_signal] : undefined),
    [_signal, messages],
  );
  // sync the internal and external states
  useEffect(() => {
    if (value && value !== _signal) {
      _setSignal(value);
    }
  }, [_signal, value]);
  // handle any changes made to the signal
  const handleSignalChange = useCallback(
    (next: TSig | null) => {
      _setSignal((prev) => {
        if (prev === next) return prev;
        onValueChange?.(next);
        return next;
      });
    },
    [onValueChange],
  );

  // handle changes to the status
  useEffect(() => {
    if (!_signal || ['init', 'idle'].includes(_signal)) {
      return;
    } else {
      funcs?.[_signal]?.({ message });
      _setSignal(null);
    }
    return () => {
      if (_signal) _setSignal(null);
    };
  }, [message, _signal]);
  // output
  return {
    signal: _signal,
    onSignalChange: handleSignalChange,
  };
}
