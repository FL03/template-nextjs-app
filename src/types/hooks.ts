/**
 * Created At: 2025.07.15:09:53:46
 * @author - @FL03
 * @file - hooks.ts
 */

/** This type establishes a set of allowable primitive types for building custom hook states. */
export type HookSignal = boolean | string | number;

export type HookSignalMap<TKeys extends string = string> = {
  [key in TKeys]: HookSignal;
};

export type DataField<TData = unknown, TValue = string | null> = {
  key: keyof TData;
  value: TValue;
};