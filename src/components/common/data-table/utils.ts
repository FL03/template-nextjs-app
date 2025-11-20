/**
 * Created At: 2025.11.01:14:49:43
 * @author - @FL03
 * @directory - src/components/common/data-table
 * @file - utils.ts
 */
import ReactTable, { Row, RowData } from "@tanstack/react-table";

export const countByAgg: ReactTable.AggregationFn<any> = (
  id,
  leafRows,
  childRows,
) => {
  const count = leafRows.reduce((acc, row) => {
    if (row.original[id]) {
      acc++;
    }
    return acc;
  }, 0);
  return childRows.reduce((acc, row) => {
    if (row.original[id]) {
      acc++;
    }
    return acc;
  }, count);
};

export function formatNumberAs(
  data?: number | null,
  options?: Intl.NumberFormatOptions,
): string {
  const value = data ? Number(data) : 0;
  return new Intl.NumberFormat("en-US", options).format(value);
}

type SummaryFnCallback = <
  TValue extends RowData,
  TRows extends Array<Row<TValue>>,
>(
  id: keyof TValue,
  values: TRows,
) => number;

export function countOccurrencesInColumn<
  TValue extends RowData,
  TRows extends Array<Row<TValue>>,
>(
  id: keyof TValue,
  values: TRows,
): number {
  return values.reduce((acc, row) => acc + (row.original[id] ? 1 : 0), 0);
}

export function countUniqueInColumn<
  TValue extends RowData,
  TRows extends Array<Row<TValue>>,
>(
  id: keyof TValue,
  data: TRows,
): number {
  return data.filter(
    (row, index, self) =>
      self.findIndex(
        (r) => r.original[id] === row.original[id],
      ) === index,
  ).length;
}

export function getColumnSum<
  TValue extends RowData,
  TRows extends Array<Row<TValue>>,
>(
  id: keyof TValue,
  data: TRows,
): number {
  return data.reduce((acc, row) => acc + Number(row.original[id] ?? 0), 0);
}

export function getColumnAverage<
  TValue extends RowData,
  TRows extends Array<Row<TValue>>,
>(
  id: keyof TValue,
  data: TRows,
): number {
  return getColumnSum(id, data) / data.length;
}

export function getColumnVariance<
  TValue extends RowData,
  TRows extends Array<Row<TValue>>,
>(
  id: keyof TValue,
  data: TRows,
): number {
  const mean = getColumnAverage(id, data);
  const sum = data.reduce((acc, row) => {
    return acc + Math.pow(Number(row.original[id]) - mean, 2);
  }, 0);
  return sum / data.length;
}

export function getColumnStd<
  TValue extends RowData,
  TRows extends Array<Row<TValue>>,
>(
  id: keyof TValue,
  data: TRows,
): number {
  return Math.sqrt(getColumnVariance(id, data));
}

export function getColMax<
  TValue extends RowData,
  TRows extends Array<Row<TValue>>,
>(
  id: keyof TValue,
  data: TRows,
): number {
  return (
    data.reduce(
      (acc, row) => Math.max(acc, Number(row.original[id])),
      -Infinity,
    )
  );
}

export function getColMin<
  TValue extends RowData,
  TRows extends Array<Row<TValue>>,
>(
  id: keyof TValue,
  data: TRows,
): number {
  return (
    data.reduce(
      (acc, row) => Math.min(acc, Number(row.original[id])),
      Infinity,
    )
  );
}

const columnSummaryMap: Record<string, SummaryFnCallback> = {
  avg: getColumnAverage,
  count: countOccurrencesInColumn,
  min: getColMin,
  max: getColMax,
  std: getColumnStd,
  sum: getColumnSum,
  unique: countUniqueInColumn,
};

export function summaryFn<Key extends string>(
  key: Key,
): SummaryFnCallback {
  return columnSummaryMap[key];
}
