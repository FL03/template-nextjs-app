/**
 * Created At: 2025.08.17:14:09:47
 * @author - @FL03
 * @file - core.ts
 */
/** A string enumeration of common crud actions, namely: create, read, update, and delete */
export type CrudLiteral = "create" | "read" | "update" | "delete";
/** A generic type for making a type _nullish_; i.e. may be undefined or null. */
export type Nullish<T = unknown> = T | null | undefined;

export type SetAction<T> = T | ((prev: T) => T);

export type ChangeHandler<T> = (value: SetAction<T>) => void;



/** A composable type for extending the inner type with an optional `asChild` boolean field. */
export type PropsAsChild<TInner = {}> = TInner & { asChild?: boolean };

/** A type representing the keys of an object as string, number, or symbol */
export type ObjectKey<T> = keyof T & (string | number | symbol);