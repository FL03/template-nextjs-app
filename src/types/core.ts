/**
 * Created At: 2025.05.12:23:35:24
 * @author - @FL03
 * @file - core.ts
 */
/** A type alias for a _**nullish**_ type. More specifically, the type extends a generic object `T` to allow for undefined and null values. */
export type Nullish<T = unknown> = T | null | undefined;

/** A type defining the possible variants of CRUD, namely: create, read, update, and delete. */
export type CRUD = "create" | "read" | "update" | "delete";

/** The `SetAction` defines a type for the various interfaces capable of being used as a _**setter**_. */
export type SetAction<T> = T | ((prev: T) => T);

export type ChangeHandler<TValue extends any = unknown, TOut = void> = (
  value?: SetAction<TValue>,
) => TOut;

/** a standard type of callback used to handle an api request. */
export type ApiQueryHandler<
  TQuery extends Record<string, string> = any,
  TOut = any,
> = (
  query: TQuery,
  init?: RequestInit,
) => Promise<TOut>;
