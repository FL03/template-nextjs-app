'use client';
// imports
import * as React from 'react';

type HookOpts<TData = unknown> = {
  data?: TData;
  defaultData?: TData;
  onDataChange?: (data: TData) => void;
};

/**
 * A custom hook used to manage the state and behavior of a content editor.
 */
export function useData<TData = unknown>({ data: dataProp, defaultData, onDataChange, }: HookOpts<TData> = {}) {
  // declare a state to hold and track the given data
  const [_data, _setData] = React.useState<TData | null>(defaultData ?? null);
  /// initialize indicators for the hook to monitor progress
  const [_isLoading, _setIsLoading] = React.useState<boolean>(false);
  const [_isSaving, _setIsSaving] = React.useState<boolean>(false);
  // memoize indicator states for the hook 
  const _state = React.useMemo(() => ({
    isLoading: _isLoading,
    isSaving: _isSaving,
  }), [_isLoading, _isSaving]);

  const _onDataChange = React.useCallback((value: TData) => {
    // reflect the change(s) internally
    _setData(value);
    // use the callback, if provided, to process the data change
    if (onDataChange) onDataChange(value);
  }, [onDataChange, _setData]);
  // sync internal state with the provided data prop
  React.useEffect(() => {
    // ensure any external changes to the data are reflected internally
    if (dataProp && _data !== dataProp) {
      _onDataChange(dataProp);
    }
  }, [dataProp, _data, _onDataChange]);
  // redeclare any public-facing methods or variables
  const data = _data
  const state = _state;

  return React.useMemo(() => ({ data, state }), [data, state]);
}