/**
 * Created At: 2025.09.25:18:27:22
 * @author - @FL03
 * @directory - src/hooks
 * @file - use-product.tsx
 */
'use client';
// imports
import * as React from 'react';
import Stripe from 'stripe';
// features
import { fetchPrices, fetchProduct } from '@/features/billing';

namespace UseProduct {
  export type Callback = (options?: Props) => Return;

  export interface Props {
    lookupKeys?: string[];
    productId?: string;
    onDataChange?(data: Stripe.Product | null): void;
    onError?(error: unknown): void;
  }

  export interface State {
    isError: boolean;
    isLoading: boolean;
  }

  export interface Return {
    data?: Stripe.Product;
    prices: Stripe.Price[];
    error: Error | null;
    state: State;
  }
}

export const useStripeProduct: UseProduct.Callback = ({
  productId,
  onDataChange,
  onError,
} = {}) => {
  const [_error, _setError] = React.useState<Error | null>(null);
  const [_data, _setData] = React.useState<Stripe.Product | null>(null);
  const [_prices, _setPrices] = React.useState<Stripe.Price[]>([]);
  // signals
  const [loadingProduct, setLoadingProduct] = React.useState(true);
  const [loadingPrices, setLoadingPrices] = React.useState(false);
  // aggregate the signals into a single state object
  const state = React.useMemo<UseProduct.State>(
    () => ({
      isError: Boolean(_error),
      isLoading: loadingPrices || loadingProduct,
    }),
    [_error, loadingProduct, loadingPrices],
  );

  const handleChange = React.useCallback(
    (data: Stripe.Product | null) =>
      _setData((prev) => {
        if (prev?.id === data?.id) return prev;
        if (onDataChange) onDataChange(data);
        return data;
      }),
    [onDataChange],
  );

  const handleError = React.useCallback(
    (value: unknown) =>
      _setError((prev) => {
        const error = new Error(String(value));
        if (prev === error) return prev;
        if (onError) onError(value);
        return error;
      }),
    [onError],
  );

  const _getPrices = React.useCallback(
    async (params?: {
      lookup_keys?: string[];
      product?: string;
      limit?: number | `${number}`;
    }): Promise<void> => {
      await fetchPrices(params)
        .then((data) => _setPrices(data))
        .catch(handleError);
    },
    [handleError],
  );

  const _getProduct = React.useCallback(
    async (id: string) => {
      await fetchProduct({ productId: id })
        .then(handleChange)
        .catch(handleError);
    },
    [handleChange, handleError],
  );

  const _loader = React.useCallback(
    async (id: string) => {
      await _getProduct(id)
        .then(async () => {
          if (!loadingPrices) setLoadingPrices(true);
          await _getPrices({ product: id });
        })
        .finally(() => {
          setLoadingProduct(false);
          setLoadingPrices(false);
        });
      // load the prices
    },
    [_getPrices, _getProduct, loadingPrices],
  );

  React.useEffect(() => {
    if (loadingProduct && productId) {
      _loader(productId);
    }
  }, [loadingProduct, productId, _loader]);
  return React.useMemo(
    () => ({ error: _error, data: _data ?? undefined, prices: _prices, state }),
    [_error, _data, _prices, state],
  );
};
