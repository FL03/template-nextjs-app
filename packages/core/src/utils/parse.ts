/**
 * 2025-04-02
 * @author: @FL03
 * @description:  common coercion routines for the platform
 * @file: coerce.ts
 */

/** A method for parsing JSON data into a particular _type_. */
export const parseJson = <TData = string>(values: any): TData => {
  // handle the case where values are null or undefined
  if (!values) return {} as TData;
  // lexify the values
  const lex = JSON.stringify(values as any);
  // return the content as a json object parsed from the lexical string
  return JSON.parse(lex) as TData;
};

