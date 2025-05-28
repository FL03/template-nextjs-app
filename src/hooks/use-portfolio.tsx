import * as React from 'react';
import { any } from 'zod';

export type PortfolioHookState = {
  isError: boolean;
  isLoading: boolean;
};

type PortfolioHookReturn<TData = any> = {
  data: TData;
  error?: Error | null;
  state: PortfolioHookState;
};

type PortfolioHookOpts<TData = any> = {
  onDataChange?: (data: TData) => void;
};

export const usePortfolio = ({
  onDataChange,
}: PortfolioHookOpts = {}): PortfolioHookReturn => {
  const [_data, _setData] = React.useState<any>(() => {
    const data = localStorage.getItem('portfolio');
    if (data) {
      return JSON.parse(data);
    }
    return null;
  });

  const [_error, _setError] = React.useState<Error | null>(null);

  const [_isLoading, _setIsLoading] = React.useState<boolean>(true);

  const _cleanUp = React.useCallback(() => {
    _setData(null);
    _setError(null);
    _setIsLoading(true);
  }, [_setData, _setError, _setIsLoading]);

  const _loader = React.useCallback(async () => {}, []);

  const _state = React.useMemo<PortfolioHookState>(
    () => ({
      isError: !!_error,
      isLoading: _isLoading,
    }),
    [_error, _isLoading]
  );

  React.useEffect(() => {
    if (_isLoading) _loader().finally(() => _setIsLoading(false));

    // cleanup on unmount
    return () => {
      _cleanUp();
    };
  }, [_isLoading, _cleanUp, _setIsLoading]);
  // redeclare public variables and methods
  const data = _data;
  const error = _error;
  const state = _state;
  // returns a memoized object containing the breakpoints
  return React.useMemo(
    () => ({
      data,
      error,
      state,
    }),
    [data, error, state]
  );
};
