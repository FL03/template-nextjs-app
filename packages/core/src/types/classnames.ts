/**
 * Created At: 2025.10.24:16:14:44
 * @author - @FL03
 * @directory - src/types
 * @file - classnames.ts
 */
/** A type defining a string that ends with a suffix of: `ClassName` */
type ClassNameWithPrefix<Key extends string> = `${Key}ClassName`;

/**
 * The `ClassNames` object defines a mapping of optional entries whose keys are defined by the generic parameter `Keys`.
 * This is useful for defining a set of classnames for a component in a type-safe manner.
 */
export type ClassNames<Keys extends string> = {
  [K in ClassNameWithPrefix<Keys>]?: string;
};
/** A type wrapper for injecting component props with an optional `className` field. */
export type PropsWithClassName<T = {}> = T & {
  className?: string;
};

export type PropsWithClassNames<TParent, TClassNames extends string> =
  & TParent
  & {
    classNames?: ClassNames<TClassNames>;
  };

// Extract existing classNames keys from a props type (if present)
type ClassNameKeyExtractor<P> = P extends { classNames?: infer C }
  ? C extends ClassNames<infer K> ? K & string
  : never
  : never;

/**
 * Extend a props type by adding new className keys while preserving any existing keys.
 * Example:
 *   type A = PropsWithClassNames<{}, 'root'>;
 *   type B = ExtendPropsWithClassNames<A, 'title'>; // classNames?: { root?: string; title?: string }
 */
export type ExtendedClassNames<Keys extends string, X = never> =
  & Omit<X, "classNames">
  & {
    classNames?: ClassNames<ClassNameKeyExtractor<X> | Keys>;
  };

// Runtime helper to merge two classNames objects (preserves typings for keys)
export function mergeClassNames<A extends string, B extends string>(
  a?: Record<A, string | undefined>,
  b?: Record<B, string | undefined>,
): Record<A | B, string | undefined> {
  return {
    ...(a as Record<string, string | undefined>),
    ...(b as Record<string, string | undefined>),
  } as Record<
    A | B,
    string | undefined
  >;
}
