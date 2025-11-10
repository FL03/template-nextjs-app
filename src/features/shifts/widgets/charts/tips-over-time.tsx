/**
 * Created At: 2025.10.31:09:50:15
 * @author - @FL03
 * @directory - src/features/shifts/widgets/charts
 * @file - tips-over-time.tsx
 */
"use client";
// imports
import * as React from "react";
import { compareAsc } from "date-fns";
import {
  Bar,
  Brush,
  CartesianGrid,
  ComposedChart,
  Legend,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
// project
import { formatAsCurrency } from "@/lib/fmt";
import { cn } from "@/lib/utils";
// feature-specific
import { useWorkSchedule } from "../../providers";
import { ShiftData } from "../../types";
// components
import { ChartTooltip } from "@/components/common/chart-tooltip";

export const TipsOverTimeChart: React.FC<
  Omit<React.ComponentPropsWithoutRef<"div">, "children" | "title"> & {
    chartHeight?: number | string;
    chartWidth?: number | string;
  }
> = (
  { chartHeight, className, style },
) => {
  // use the schedule provider
  const { data: shifts } = useWorkSchedule();

  const handleData = (
    { date, tips_cash = 0, tips_credit = 0 }: ShiftData,
  ) => ({
    date,
    tips_cash,
    tips_credit,
    total_tips: tips_cash + tips_credit,
  });

  const chartData = shifts.map(handleData).sort((a, b) => (
    compareAsc(a.date, b.date)
  ));
  return (
    <div
      className={cn("h-[200px] lg:h-[400px] w-full", className)}
      style={{ height: chartHeight, ...style }}
    >
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart
          accessibilityLayer
          data={chartData}
          title="Earned Tips"
        >
          <CartesianGrid vertical={false} />
          <Bar
            stackId="tips"
            barSize={1}
            dataKey="tips_cash"
            name="Cash"
            radius={4}
            strokeWidth={1}
            type="monotone"
            fill="var(--color-chart-1)"
          />
          <Bar
            stackId="tips"
            barSize={1}
            dataKey="tips_credit"
            name="Credit"
            radius={4}
            strokeWidth={1}
            type="monotone"
            fill="var(--color-chart-2)"
          />
          <ReferenceLine y={0} stroke="--var(--color-primary)" />
          <Brush
            dataKey="date"
            height={30}
            stroke="var(--color-chart-1)"
            tickFormatter={(value) => (
              new Date(value).toLocaleDateString("en-us", { timeZone: "UTC" })
            )}
          />
          <XAxis
            dataKey="date"
            name="Date"
            textAnchor="middle"
            tickFormatter={(tick) => (
              new Date(tick).toLocaleDateString("en-us", { timeZone: "UTC" })
            )}
            tickMargin={2}
            type="category"
          />
          <YAxis
            allowDecimals
            name="Amount"
            tickFormatter={(tick) => (
              formatAsCurrency(Number(tick), { precision: 0 })
            )}
            tickMargin={2}
            type="number"
          />
          <Legend name="Legend" />
          <Tooltip
            content={({ active, payload }) => {
              if (!active || !payload || payload?.length === 0) {
                return null;
              }
              const date = new Date(payload[0].payload.date);
              return (
                <ChartTooltip
                  title={date.toLocaleDateString()}
                >
                  <ul className="flex flex-col w-full gap-2">
                    {payload.map((item, index) => (
                      <li
                        key={index}
                        className="flex flex-nowrap items-center gap-2"
                      >
                        <div className="flex shrink-0 justify-end items-center">
                          <span
                            className="font-semibold"
                            style={{ color: item.stroke }}
                          >
                            {item.name}:
                          </span>
                        </div>
                        <span className="inline-flex flex-1 items-center font-mono text-nowrap">
                          {formatAsCurrency(Number(item.value))}
                        </span>
                      </li>
                    ))}
                  </ul>
                </ChartTooltip>
              );
            }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};
TipsOverTimeChart.displayName = "TipsOverTimeChart";

export default TipsOverTimeChart;
