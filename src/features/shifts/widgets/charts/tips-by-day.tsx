/**
 * Created At: 2025.11.18:00:32:48
 * @author - @FL03
 * @directory - src/features/shifts/widgets/charts
 * @file - tips-by-day.tsx
 */
"use client";
// imports
import * as React from "react";
import { ClassNames, formatAsCurrency } from "@pzzld/core";
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
import { ChartTooltip } from "@/components/common/charts";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Item, ItemContent, ItemGroup, ItemTitle } from "@/components/ui/item";

/**
 * The `TipsByDayOfWeekChart` component renders a bar chart displaying the average tips received for each day of the week.
 * This chart is critical for visualizing tipping patterns and trends over the week, enabling users to make informed decisions based on their earnings.
 */
const TipsByDayOfWeekChart: React.FC<
  Omit<
    React.ComponentPropsWithRef<typeof ResponsiveContainer>,
    "children" | "value" | "defaultValue"
  > & {
    data?: ShiftData[];
  }
> = (
  {
    ref,
    initialDimension,
    maxHeight,
    data = [],
    debounce = 1,
    height = "100%",
    width = "100%",
    ...props
  },
) => {
  const isMobile = useIsMobile();
  // render the chart
  return (
    <ResponsiveContainer
      ref={ref}
      debounce={debounce}
      height={height}
      width={width}
      maxHeight={maxHeight}
      initialDimension={initialDimension}
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
          radius={[8, 8, 0, 0]}
          activeBar={{
            opacity: 0.8,
          }}
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
          tickCount={isMobile ? 3 : 6}
          tickMargin={4}
          label={{
            angle: 90,
            className: "font-semibold",
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
  Omit<React.ComponentPropsWithRef<typeof Card>, "children" | "title"> & {
    classNames?: ClassNames<
      | "action"
      | "chart"
      | "content"
      | "description"
      | "header"
      | "footer"
      | "title"
    >;
    action?: React.ReactNode;
    description?: React.ReactNode;
    title?: React.ReactNode;
    showDescription?: boolean;
    hideTitle?: boolean;
    chartHeight?: number | `${number}%`;
    chartWidth?: number | `${number}%`;
    debounce?: number;
    maxHeight?: number;
    initialDimension?: { height: number; width: number };
  }
> = (
  {
    action,
    className,
    classNames,
    chartHeight,
    chartWidth = "100%",
    debounce,
    initialDimension,
    maxHeight,
    style,
    hideTitle,
    showDescription,
    description = "Visualize earned tips by day of the week.",
    title = "Average Daily Tips",
    ...props
  },
) => {
  // context(s)
  const { data } = useWorkSchedule();
  // render the chart
  return (
    <Card
      className={cn(
        "flex flex-col flex-1 h-full w-full max-h-[65hv]",
        className,
      )}
      style={{
        height: chartHeight,
        width: chartWidth,
        ...style,
      }}
      {...props}
    >
      <CardHeader
        className={cn("w-full", classNames?.headerClassName)}
        hidden={!title && !description && !action}
      >
        <CardTitle
          className={cn(
            "text-lg leading-none tracking-tight",
            hideTitle ? "sr-only" : "not-sr-only",
            classNames?.titleClassName,
          )}
          hidden={!title}
        >
          {title}
        </CardTitle>
        <CardDescription
          className={cn(
            "leading-none tracking-tight line-clamp-2 truncate",
            classNames?.descriptionClassName,
            showDescription ? "not-sr-only" : "sr-only",
          )}
          hidden={!description}
        >
          {description}
        </CardDescription>
        {action && (
          <CardAction className={cn(classNames?.actionClassName)}>
            {action}
          </CardAction>
        )}
      </CardHeader>
      <CardContent
        className={cn(
          "px-0 h-[45vh] w-full",
          classNames?.contentClassName,
        )}
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
      </CardContent>
    </Card>
  );
};
TipsByDayOfWeek.displayName = "TipsByDayOfWeek";

export default TipsByDayOfWeek;
