/**
 * Created At: 2025.05.12:23:35:24
 * @author - @FL03
 * @file - core.ts
 */
/** The `Merge` type combines the properties of the two given types into one object. */
export type Merge<T, U> = T & U;
/** A type alias for a _**nullish**_ type. More specifically, the type extends a generic object `T` to allow for undefined and null values. */
export type Nullish<T = unknown> = T | null | undefined;

/** A type defining the possible variants of CRUD, namely: create, read, update, and delete. */
export type CrudLiteral = "create" | "read" | "update" | "delete";

/** The `SetAction` defines a type for the various interfaces capable of being used as a _**setter**_. */
export type SetAction<T> = T | ((prev: T) => T);
/** A `ChangeHandler` defines an unary callback that accepts a `SetAction` object as its value. */
export type ChangeHandler<TValue extends any = unknown, TOut = void> = (
  value?: SetAction<TValue>,
) => TOut;

export type KeyValueEntry<K, V> = {
  key: K;
  value: V;
};