/**
 * Created At: 2025.05.23:04:32:05
 * @author - @FL03
 * @file - handlers.ts
 */

/** a standard type of callback used to handle an api request. */
export type ClientHandler<TQuery = any, TOut = any> = (
  query: TQuery,
  init?: RequestInit
) => Promise<TOut>;

export type ClientOutput<TData = any> = {
  data?: TData;
  error?: Error;
  message?: string;
  status?: number;
  metadata?: ClientOutputMetadata;
}

export type ClientOutputMetadata = {
  count?: number;
  page?: number;
  pageSize?: number;
  totalPages?: number;
  totalCount?: number;
  [key: string]: any; // Allow additional metadata properties
}