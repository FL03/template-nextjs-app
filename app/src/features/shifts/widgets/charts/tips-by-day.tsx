/**
 * Created At: 2025.11.18:00:32:48
 * @author - @FL03
 * @directory - src/features/shifts/widgets/charts
 * @file - tips-by-day.tsx
 */
"use client";
// imports
import * as React from "react";
import { formatAsCurrency } from "@pzzld/core";
import {
  Area,
  Bar,
  ComposedChart,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
// project
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
// local
import { useWorkSchedule } from "../../providers";
import { ShiftData } from "../../types";
import { computeDailyTipMetrics } from "../../utils";
// components
import { ChartDisplay, ChartTooltip } from "@/components/common/charts";
import { Item, ItemContent, ItemGroup, ItemTitle } from "@/components/ui/item";

/**
 * A chart focused on visualizing various statistics about tips received on
 * different days of the week.
 */
export const TipsByDayOfWeekChart: React.FC<
  Omit<
    React.ComponentPropsWithoutRef<typeof ResponsiveContainer>,
    "children" | "data" | "defaultValue" | "value"
  > & {
    data?: ShiftData[];
  }
> = ({
  data = [],
  aspect = 1.618,
  debounce = 1,
  maxHeight = 500,
  width = "100%",
  ...props
}) => {
  const isMobile = useIsMobile();
  return (
    <ResponsiveContainer
      aspect={aspect}
      debounce={debounce}
      maxHeight={maxHeight}
      width={width}
      {...props}
    >
      <ComposedChart
        accessibilityLayer
        data={Object.values(computeDailyTipMetrics(data))}
        title="Average Daily Tips"
      >
        {/* plots */}
        <Bar
          yAxisId="stats"
          stackId="avg"
          dataKey="average"
          name="Average"
          label={{
            className: cn(
              "font-mono font-semibold text-sm pb-2 sr-only md:not-sr-only",
            ),
            fill: "var(--color-primary-foreground)",
            opacity: 1,
            position: "insideBottom",
            formatter: (value) => formatAsCurrency(Number(value)),
          }}
          type="monotone"
          fill="var(--color-chart-2)"
          stroke="var(--color-chart-2)"
          activeBar={{ opacity: 0.8 }}
          radius={[8, 8, 0, 0]}
        />
        <Area
          dataKey="total"
          yAxisId="totals"
          name="Total"
          activeDot={{ r: 5 }}
          dot={{ r: 3 }}
          stroke="var(--color-chart-1)"
          strokeWidth={2}
        />
        <Line
          dataKey="count"
          yAxisId="count"
          name="Count"
          fill="var(--color-chart-3)"
          stroke="var(--color-chart-3)"
          activeDot={{ r: 6 }}
          shape={{ r: 4 }}
        />
        {/* chart */}
        <Legend name="Legend" />
        <XAxis
          dataKey="day"
          name="Day"
          padding="gap"
          type="category"
          tickFormatter={(value) => (
            String(value).trim().slice(0, 3)
          )}
        />
        <YAxis
          hide
          allowDecimals
          yAxisId="stats"
          name="Average"
          orientation="left"
          type="number"
        />
        <YAxis
          hide
          allowDecimals
          yAxisId="totals"
          name="Total"
          orientation="left"
          type="number"
        />
        <YAxis
          yAxisId="count"
          hide={isMobile}
          name="Count"
          orientation="right"
          type="number"
          tickCount={6}
          tickMargin={4}
          label={{
            angle: 90,
            className: "font-semibold text-sm",
            position: "insideRight",
            value: "Count",
          }}
        />
        <Tooltip
          content={({ active, payload }) => {
            if (!active || !payload || payload?.length === 0) {
              return null;
            }
            function formatValue(value: any, name: any): string {
              const matches = (v: any) => (
                String(v).match(
                  /^(amt|avg|average|amount|cash|credit|tips|total)$/gmi,
                )
              );
              return matches(name)
                ? formatAsCurrency(Number(value))
                : String(value);
            }
            return (
              <ChartTooltip
                description="Average tips received on this day of the week."
                title={payload[0].payload.day}
              >
                <ItemGroup className="w-full">
                  {payload.map((item, index) => (
                    <Item
                      key={index}
                      className="flex-nowrap w-full"
                      size="sm"
                    >
                      <ItemContent className="flex-1 w-full items-center justify-end text-right">
                        <ItemTitle className="text-nowrap font-semibold">
                          {item.name}
                        </ItemTitle>
                      </ItemContent>
                      <ItemContent>
                        <span className="font-mono">
                          {formatValue(item.value, item.name)}
                        </span>
                      </ItemContent>
                    </Item>
                  ))}
                </ItemGroup>
              </ChartTooltip>
            );
          }}
        />
      </ComposedChart>
    </ResponsiveContainer>
  );
};
TipsByDayOfWeekChart.displayName = "TipsByDayOfWeekChart";

export const TipsByDayOfWeek: React.FC<
  Omit<React.ComponentPropsWithRef<typeof ChartDisplay>, "children"> & {
    chartHeight?: number | `${number}%`;
    chartWidth?: number | `${number}%`;
    debounce?: number;
    maxHeight?: number;
    initialDimension?: { height: number; width: number };
  }
> = ({
  ref,
  classNames,
  chartHeight,
  chartWidth,
  debounce,
  initialDimension,
  maxHeight,
  description = "Visualize earned tips by day of the week.",
  title = "Average Daily Tips",
  showDescription = true,
  ...props
}) => {
  const { data } = useWorkSchedule();
  return (
    <ChartDisplay
      ref={ref}
      showDescription={showDescription}
      description={description}
      title={title}
      {...props}
    >
      <TipsByDayOfWeekChart
        data={data}
        className={classNames?.chartClassName}
        debounce={debounce}
        height={chartHeight}
        width={chartWidth}
        maxHeight={maxHeight}
        initialDimension={initialDimension}
      />
    </ChartDisplay>
  );
};
TipsByDayOfWeek.displayName = "TipsByDayOfWeek";

export default TipsByDayOfWeek;
