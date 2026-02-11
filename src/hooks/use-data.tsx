/**
 * Created At: 2025.10.24:12:55:28
 * @author - @FL03
 * @directory - src/hooks
 * @file - use-form.tsx
 */
'use client';
// imports
import { useCallback, useEffect, useState } from 'react';

namespace UseData {
  export interface Props<TValue extends string> {
    defaultValue?: TValue;
    value?: TValue;
    onValueChange?(value: TValue | null): void;
  }

  export interface Context<TValue extends string> {
    data: TValue | null;
    error: Error | null;
    onDataChange(next: TValue | null): void;
  }

  export type Hook = <TValue extends string>(
    props?: Props<TValue>,
  ) => Context<TValue>;
}
/** The `useData` hook is a simple hook for controlling some value */
export function useData<TValue extends string>({
  defaultValue,
  value,
  onValueChange,
}: UseData.Props<TValue> = {}): UseData.Context<TValue> {
  // states
  const [_data, _setData] = useState<TValue | null>(defaultValue ?? null);
  const [_error, _setError] = useState<Error | null>(null);
  // synchronize the internal & external values
  useEffect(() => {
    if (value && value !== _data) {
      _setData(value);
    }
  }, [_data, value]);

  const handleErr = useCallback((err: unknown) => {
    const error = err instanceof Error ? err : new Error(String(err));
    _setError((prev) => {
      if (prev?.message === error.message) return prev;
      return error;
    });
  }, []);
  // handle any changes made to the signal
  const onDataChange = useCallback(
    (next: TValue | null) => {
      _setData((prev) => {
        if (prev === next) return prev;
        onValueChange?.(next);
        return next;
      });
    },
    [onValueChange],
  );
  // memoize the output
  return {
    data: _data,
    error: _error,
    onDataChange,
  };
}
