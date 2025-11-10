/**
 * Created At: 2025.10.26:14:08:38
 * @author - @FL03
 * @directory - src/types
 * @file - filter.ts
 */

/** An enum defining the allowed operations within the filter string. */
type QueryOperator =
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
/** The type of _key_ expected by the filter. */
type FilterKey<TData> = string & keyof TData;
/** A string object defining the format of a valid database query string. */
type FilterString<TData> = `${FilterKey<TData>}=${QueryOperator}.${string}`;
/** A structured representation of the filter. */
export type QueryFilter<TData> = {
  key: FilterKey<TData>;
  value: string;
  operator?: QueryOperator;
};
/** The filter object combines the string and structured representations into a single entity. */
export class DatabaseFilter<TData> extends Object
  implements QueryFilter<TData> {
  private _key: FilterKey<TData>;
  private _operator: QueryOperator;
  private _value: string;

  constructor({ key, value, operator = "eq" }: QueryFilter<TData>) {
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

  toString() {
    return this.valueOf();
  }

  toJSON(): QueryFilter<TData> {
    return {
      key: this.key,
      operator: this.operator,
      value: this.value,
    };
  }
  /** Get a string representation of the filter to use for realtime channels, etc. */
  valueOf(): FilterString<TData> {
    return `${this.key}=${this.operator}.${this.value}`;
  }
}
