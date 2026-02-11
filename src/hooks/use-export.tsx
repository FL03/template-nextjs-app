/**
 * Created At: 2025.10.25:14:14:10
 * @author - @FL03
 * @directory - src/hooks
 * @file - use-export.tsx
 */

import { useCallback, useEffect, useState } from 'react';

namespace UseExport {
  export type Props<TData extends string> = {
    defaultValue?: TData;
    value?: TData;
    onValueChange?(data: TData): void;
  };

  export type Context<TData extends string> = {};

  export type Callback = <TData extends string = string>(
    options?: Props<TData>,
  ) => Context<TData>;
}

export function useExport<TData extends string>({
  defaultValue,
  value,
  onValueChange,
}: UseExport.Props<TData> = {}): UseExport.Context<TData> {
  const [_data, _setData] = useState<TData | null>(defaultValue ?? null);

  useEffect(() => {
    if (value && value !== _data) {
      _setData(value);
    }
  }, [value]);

  const handleChange = useCallback(
    (next: TData | null) => {
      _setData((prev) => {
        if (prev === next) return prev;
        if (next) onValueChange?.(next);
        return next;
      });
    },
    [onValueChange],
  );

  const handleDownload = useCallback((data: Blob, filename: string) => {
    if (typeof window === 'undefined') return;
    // create the download link
    const url = window.URL.createObjectURL(data);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    link.parentNode?.removeChild(link);
    window.URL.revokeObjectURL(url);
  }, []);

  const exportData = useCallback(() => {
    return _data;
  }, []);

  return {};
}
