/**
 * Created At: 2025.09.11:21:01:41
 * @author - @FL03
 * @file - daily-averages.tsx
 */
"use client";
// imports
import * as React from "react";
import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
// project
import { useIsMobile } from "@/hooks/use-mobile";
import { formatAsCurrency } from "@/lib/fmt";
import { cn } from "@/lib/utils";
// local
import { useWorkSchedule } from "../../providers";
import { computeDailyTipMetrics } from "../../utils";
// components
import { ChartTooltip } from "@/components/common/chart-tooltip";

/**
 * The `AverageDailyTipsChart` component renders a bar chart displaying the average tips received for each day of the week.
 * This chart is critical for visualizing tipping patterns and trends over the week, enabling users to make informed decisions based on their earnings.
 */
export const AverageDailyTipsChart: React.FC<
  Omit<React.ComponentPropsWithoutRef<"div">, "children" | "title"> & {
    chartHeight?: number | string;
    chartWidth?: number | string;
    initialDimension?: { height: number; width: number };
  }
> = (
  {
    className,
    style,
    chartHeight,
    chartWidth = "100%",
    initialDimension,
    ...props
  },
) => {
  // use the schedule provider
  const { data: shifts } = useWorkSchedule();
  const isMobile = useIsMobile();
  // abbreviate day names
  const dayAbbreviation = (day: string) => day.slice(0, 3);

  const chartData = React.useMemo(
    () => Object.values(computeDailyTipMetrics(shifts)),
    [shifts],
  );
  // render the chart
  return (
    <div
      className={cn("h-[200px] lg:h-[400px] w-full max-h-[70vh]", className)}
      style={{
        maxWidth: "100vw",
        height: chartHeight,
        width: chartWidth,
        ...style,
      }}
      {...props}
    >
      <ResponsiveContainer
        height="100%"
        width="100%"
        debounce={1}
        initialDimension={initialDimension}
      >
        <ComposedChart
          accessibilityLayer
          data={chartData}
          title="Average Daily Tips"
        >
          {/* plots */}
          <Bar
            stackId="daily"
            dataKey="average"
            name="Average"
            label={{
              className:
                "pt-2 font-semibold text-nowrap sr-only md:not-sr-only",
              fill: "var(--color-primary-foreground)",
              opacity: 1,
              position: "insideTop",
              formatter: (value) => formatAsCurrency(Number(value)),
            }}
            type="monotone"
            fill="var(--color-primary)"
            radius={[8, 8, 0, 0]}
          />
          {/* chart */}
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <Legend name="Legend" />
          <XAxis
            dataKey="day"
            name="Day"
            padding="gap"
            tickFormatter={(value) => dayAbbreviation(String(value))}
            type="category"
          />
          <YAxis
            allowDecimals
            autoReverse
            name="Amount"
            orientation="right"
            type="number"
            tickCount={isMobile ? 4 : 8}
            tickMargin={isMobile ? 2 : 6}
            tickFormatter={(value) =>
              formatAsCurrency(Number(value), { precision: 0 })}
          />
          <Tooltip
            content={({ active, payload }) => {
              if (!active || !payload || payload?.length === 0) {
                return null;
              }
              return (
                <ChartTooltip
                  withSeparator
                  description="Average tips received on this day of the week."
                  title={payload[0].payload.day}
                >
                  <ul className="flex flex-col gap-1 w-full">
                    {payload.map((item, index) => (
                      <li
                        key={index}
                        className="flex flex-nowrap items-center gap-1"
                      >
                        <span
                          className="text-nowrap font-semibold"
                          style={{ color: item.stroke }}
                        >
                          {item.name}:
                        </span>
                        <span>
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
AverageDailyTipsChart.displayName = "AverageDailyTipsChart";

export default AverageDailyTipsChart;
