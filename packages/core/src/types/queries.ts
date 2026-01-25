/**
 * Created At: 2025.10.26:13:17:32
 * @author - @FL03
 * @directory - packages/core/src/types
 * @file - queries.ts
 */

export type QueryOp =
  | "eq"
  | "neq"
  | "gt"
  | "lt"
  | "gte"
  | "lte"
  | "like"
  | "ilike"
  | "in"
  | "is"
  | "fts"
  | "plfts"
  | "phfts"
  | "wfts";

export type FilterKey<TData> = string & keyof TData;
/** The `DatabaseQuery` object defines the various parameters used in constructing a valid query string. */
export type QueryParameter<TData> = {
  key: string & keyof TData;
  value: string;
  operator?: QueryOp;
};
/** A string type defining the composition of a valid query string. */
export type DatabaseFilterString<TData> = `${FilterKey<
  TData
>}=${QueryOp}.${string}`;

/**
 * The `DatabaseFilter` class combines the structured and string representations of a query string into a single entity.
 */
export class DatabaseFilter<TData> extends Object
  implements QueryParameter<TData> {
  private _key: FilterKey<TData>;
  private _operator: QueryOp;
  private _value: string;

  constructor({ key, value, operator = "eq" }: QueryParameter<TData>) {
    super();
    this._key = key;
    this._value = value;
    this._operator = operator;
  }

  // getters

  /** */
  get key(): string & keyof TData {
    return String(this._key) as string & keyof TData;
  }

  get operator() {
    return this._operator;
  }

  get value() {
    return this._value;
  }
  // methods
  /** Convert the filter into a string */
  toString() {
    return this.valueOf();
  }

  toJSON(): QueryParameter<TData> {
    return {
      key: this.key,
      operator: this.operator,
      value: this.value,
    };
  }
  /** Get a string representation of the filter to use for realtime channels, etc. */
  valueOf(): DatabaseFilterString<TData> {
    return `${this.key}=${this.operator}.${this.value}`;
  }
}
