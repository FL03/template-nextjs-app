/**
 * Created At: 2025.05.02:22:11:57
 * @author - @FL03
 * @file - num.ts
 */

type FieldStatOptions<TValue extends Object, TData extends Array<TValue>> = {
  key: keyof TValue;
  values: TData;
};

/** Compute the sum of a collection of objects using a particular field. */
export function sumBy<TValue extends Object, TData extends Array<TValue>>(
  { key, values }: FieldStatOptions<TValue, TData>,
): number {
  return values.reduce((acc, item) => acc + Number(item[key]), 0);
}

/**
 * Compute the average of a collection of objects using a particular field.
 *
 * @param {FieldStatOptions<TData>} options - The options object containing the key and values.
 * @param {TKey} options.key - The field, or key, to perform the calculation on.
 * @param {TData[]} options.values - Any uniform iterator of a particular object equipped with the specific field.
 * @returns {number} returns the average of a set of objects using a particular field.
 */
export function averageBy<TValue extends Object, TData extends Array<TValue>>(
  { key, values }: FieldStatOptions<TValue, TData>,
): number {
  if (values.length === 0) return 0;
  const total = sumBy({ key, values });
  return total / values.length;
}

export function varianceBy<
  TValue extends Object,
  TData extends Array<TValue>,
>(
  { key, values }: FieldStatOptions<TValue, TData>,
): number {
  const avg = averageBy({ key, values });
  const variance = values.reduce((acc, item) => {
    const value = Number(item[key] ?? 0);
    return acc + Math.pow(value - avg, 2);
  }, 0) / values.length;
  return variance;
}

export function standardDeviationBy<
  TValue extends Object,
  TData extends Array<TValue>,
>(
  { key, values }: FieldStatOptions<TValue, TData>,
): number {
  return Math.sqrt(varianceBy({ key, values }));
}

/** Returns the number of unique entries of a field within a collection of data. */
export const uniqueBy = <TData>(key: keyof TData, values: TData[]): number => (
  Array.from(new Set(values.map((item) => item[key])).values()).length
);

/** Returns a map containing the count of each entry within a column.*/
export function countBy(
  key: string,
  values: any[],
): Array<{ name: string; value: number }> {
  const result = values.reduce((acc, item) => {
    const value = item[key];
    if (!acc[value]) {
      acc[value] = 1;
    }
    acc[value]++;
    return acc;
  }, {});
  return Object.keys(result).map((key) => ({
    name: key,
    value: result[key],
  }));
}

export const groupBy = (
  key: string,
  values: any[],
): any[] => (
  values.reduce((acc, item) => {
    const value = item[key];
    if (!acc[value]) {
      acc[value] = [];
    }
    acc[value].push(item);
    return acc;
  }, {})
);
