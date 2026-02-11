/**
 * Created At: 2025.09.12:19:18:05
 * @author - @FL03
 * @file - net.ts
 */
import type { NextResponse } from 'next/server';
// local
import type { QueryParams } from './net';

/** This object defines a standard set of parameters handled by api endpoints. */
export type DatabaseSearchParams<T = {}> = T & {
  filterBy?: string;
  limit?: string | number;
  sortBy?: string;
};

export type WithoutBody<TData extends RequestInit> = Omit<TData, 'body'>;

export type WithoutMethod<TData extends RequestInit> = Omit<TData, 'method'>;

export type FetcherOptions<TParams extends Object = {}> = {
  params?: TParams;
  init?: WithoutMethod<RequestInit>;
};

/** a standard type of callback used to handle an api request. */
type BaseApiQueryhandler<TQuery extends QueryParams = {}, TOut = any> = (
  query?: TQuery,
  init?: WithoutMethod<RequestInit>,
) => TOut;

export type StandardResponseBody<TData = unknown, TError = unknown> =
  | { data: null; error: TError }
  | { data: TData; error: null };
/**
 * A type alias for the `NextResponse` object configured to use the `StandardResponseBody` to standardizes
 * responses and to enable errors to be passed into the response itself in a manner akin to supabase.
 */
export type ApiResponse<TData = any> = NextResponse<
  StandardResponseBody<TData>
>;

export type FetchHandler<
  TParams = {},
  TOut = {},
  TProps extends RequestInit = WithoutMethod<RequestInit>,
> = (params?: TParams, init?: TProps) => Promise<TOut>;

/** A type defining an object that resolves into either some generic value or as an `Error` */
export type WithDataOrError<TData = unknown> =
  | { data: TData; error?: null }
  | {
      data: null;
      error: Error;
    };
