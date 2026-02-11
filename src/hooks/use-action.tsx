/**
 * Created At: 2025.10.21:00:19:02
 * @author - @FL03
 * @directory - src/hooks
 * @file - use-action.tsx
 */
'use client';
// imports
import React, { useCallback, useMemo, useState, useTransition } from 'react';

namespace UseAction {
  export type ActionCallback<T> = React.Dispatch<React.SetStateAction<T>>;
  export type Status = 'init' | 'idle' | 'success' | 'error' | 'cancelled';

  export interface Props<TOut = unknown> {
    action(): TOut;
    onError?: (error: unknown) => void;
    onSuccess?(): void;
  }

  export interface State {
    isPending: boolean;
    isSuccess: boolean;
    isError: boolean;
  }

  export interface Context {
    message?: string;
    state: State;
    status: Status;
    transition: React.TransitionStartFunction;
  }

  export type Callback = (options?: Props) => Context;
}

export function useAction<T>({
  action,
  onError,
  onSuccess,
}: UseAction.Props<T>): UseAction.Context {
  const [isPending, startTransition] = useTransition();

  const [error, setError] = useState<Error | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [status, setStatus] = useState<UseAction.Status>('init');
  // setup stateful signals
  const isSuccess = useMemo(() => status === 'success', [status]);

  const handleError = useCallback(
    (err: unknown) =>
      setError((prev) => {
        if (prev === err) return prev;
        const error = err instanceof Error ? err : new Error(String(err));
        onError?.(error);
        setMessage(error.message);
        setStatus('error');
        return error;
      }),
    [onError],
  );

  const invoke = useCallback<React.TransitionStartFunction>(
    () =>
      startTransition(async () => {
        try {
          await action();
          setStatus('success');
          onSuccess?.();
        } catch (err) {
          handleError(err);
        }
      }),
    [action, handleError, onSuccess],
  );

  const state = useMemo<UseAction.State>(
    () => ({
      isPending,
      isSuccess,
      isError: Boolean(error),
    }),
    [error, isPending, isSuccess],
  );

  return useMemo(
    () => ({
      message: message ?? undefined,
      state,
      status,
      transition: invoke,
    }),
    [error, message, state, status, invoke],
  );
}
