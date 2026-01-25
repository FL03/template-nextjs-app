/**
 * Created At: 2025.09.25:18:27:22
 * @author - @FL03
 * @directory - src/hooks
 * @file - use-product.tsx
 */
"use client";
// imports
import * as React from "react";
import Stripe from "stripe";
// project
import { fetchPrice, fetchPrices } from "@/features/billing";

namespace UsePrice {
  export interface Options {
    lookupKey?: string;
    priceId?: string;
    onDataChange?(data: Stripe.Price | null): void;
    onError?(error: unknown): void;
  }

  export interface State {
    isLoading: boolean;
  }

  export interface Context {
    data?: Stripe.Price;
    error?: Error | null;
    state: State;
  }

  export type Hook = (options?: Options) => Context;
}

export const usePrice: UsePrice.Hook = (
  { lookupKey, priceId, onDataChange, onError } = {},
) => {
  const [_id, _setId] = React.useState<string | null>(priceId ?? null);
  const [_data, _setData] = React.useState<Stripe.Price | null>(null);
  const [_error, _setError] = React.useState<Error | null>(null);
  // signals
  const [isLoading, setIsLoading] = React.useState<boolean>(Boolean(priceId));
  const [isLooking, setIsLooking] = React.useState<boolean>(!Boolean(priceId));
  // aggregate the signals into a single state object
  const state = React.useMemo<UsePrice.State>(() => ({ isLoading }), [
    isLoading,
  ]);

  const handleChange = React.useCallback((data: Stripe.Price | null) => (
    _setData((prev) => {
      if (prev?.id === data?.id) return prev;
      if (onDataChange) onDataChange(data);
      return data;
    })
  ), [onDataChange]);

  const handleError = React.useCallback((value: unknown) => (
    _setError((prev) => {
      const error = new Error(String(value));
      if (prev === error) return prev;
      if (onError) onError(value);
      return error;
    })
  ), [onError]);

  const getPrice = React.useCallback(async (id: string): Promise<void> => {
    return await fetchPrice({ priceId: id }).then(handleChange).catch(
      handleError,
    );
  }, [handleChange, handleError]);

  const lookupPrice = React.useCallback(
    async (key: string): Promise<void> => {
      return await fetchPrices({ lookup_keys: [key] }).then((data) => {
        if (data.length === 0) {
          handleError("No price found for the given lookup key: " + key);
          return;
        }
        const p = data[0];
        _setId(p.id);
        handleChange(p);
      }).catch(
        handleError,
      );
    },
    [handleChange, handleError],
  );

  React.useEffect(() => {
    if (isLooking && lookupKey && !_id) {
      lookupPrice(lookupKey).finally(() => {
        setIsLooking(false);
        setIsLoading(!Boolean(_data));
      });
    }
    return () => {
      setIsLooking(false);
    };
  }, [lookupPrice, isLooking, lookupKey, _data, _id]);

  React.useEffect(() => {
    if (isLoading && !isLooking && _id) {
      getPrice(_id).finally(() => setIsLoading(false));
    }
    (() => {
      setIsLoading(false);
    });
  }, [isLoading, isLooking, _id, getPrice]);
  return { data: _data ?? undefined, error: _error, state };
};
