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
  Brush,
  ComposedChart,
  Legend,
  Line,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ClassNames, formatAsCurrency } from "@pzzld/core";
// project
import { cn } from "@/lib/utils";
// local
import { useWorkSchedule } from "../../providers";
import { ShiftData } from "../../types";
// components
import { ChartTooltip } from "@/components/common/charts";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Item, ItemContent, ItemGroup, ItemTitle } from "@/components/ui/item";

export const TipsOverTimeChart: React.FC<
  Omit<React.ComponentPropsWithRef<typeof ResponsiveContainer>, "children"> & {
    data?: ShiftData[];
    locale?: Intl.LocalesArgument;
    dateFormatOptions?: Intl.DateTimeFormatOptions;
  }
> = ({
  ref,
  data = [],
  debounce = 1,
  height = "100%",
  width = "100%",
  locale = "en-us",
  dateFormatOptions = { timeZone: "UTC" },
  ...props
}) => {
  const handleData = ({
    date,
    tips_cash = 0,
    tips_credit = 0,
  }: ShiftData) => ({
    date: new Date(date),
    tips_cash,
    tips_credit,
    total_tips: tips_cash + tips_credit,
  });

  const chartData = data.map(handleData).sort((a, b) => (
    compareAsc(a.date, b.date)
  ));
  return (
    <ResponsiveContainer
      ref={ref}
      debounce={debounce}
      height={height}
      width={width}
      {...props}
    >
      <ComposedChart
        accessibilityLayer
        data={chartData}
        title="Earned Tips"
      >
        {/* plots */}
        <Line
          name="Cash"
          dataKey="tips_cash"
          yAxisId="tips"
          type="monotone"
          activeDot={false}
          dot={false}
          fill="var(--color-chart-1)"
          stroke="var(--color-chart-1)"
        />
        <Line
          name="Credit"
          dataKey="tips_credit"
          yAxisId="tips"
          fill="var(--color-chart-2)"
          stroke="var(--color-chart-2)"
          strokeWidth={2}
          type="monotone"
          activeDot={false}
          dot={false}
        />
        {/* chart */}
        <XAxis
          dataKey="date"
          xAxisId="date"
          name="Date"
          textAnchor="middle"
          tickFormatter={(tick) => (
            new Date(tick).toLocaleDateString(locale, dateFormatOptions)
          )}
          tickMargin={2}
          type="category"
        />
        <YAxis
          allowDecimals
          yAxisId="tips"
          name="Earned Tips"
          type="number"
          width="auto"
          label={{
            value: "Earned Tips",
            angle: -90,
            position: "insideLeft",
            className: "font-semibold sr-only md:not-sr-only",
          }}
          tickMargin={2}
          tickFormatter={(tick) => (
            formatAsCurrency(Number(tick))
          )}
        />
        <Legend name="Legend" />
        <Brush
          dataKey="date"
          height={30}
          stroke="var(--color-primary)"
          tickFormatter={(value) => (
            new Date(value).toLocaleDateString(locale, dateFormatOptions)
          )}
        />
        <ReferenceLine y={0} stroke="--var(--color-primary)" />
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
                <ItemGroup className="w-full">
                  {payload.map((item, index) => (
                    <Item
                      key={index}
                      className="flex-nowrap w-full"
                      size="sm"
                    >
                      <ItemContent className="flex-1">
                        <ItemTitle className="text-nowrap font-semibold">
                          {item.name}
                        </ItemTitle>
                      </ItemContent>
                      <ItemContent className="justify-end">
                        <span className="font-mono">
                          {formatAsCurrency(Number(item.value))}
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
TipsOverTimeChart.displayName = "TipsOverTimeChart";

export const TipsOverTime: React.FC<
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
    maxHeight?: number;
    initialDimension?: { height: number; width: number };
    locale?: Intl.LocalesArgument;
    dateFormatOptions?: Intl.DateTimeFormatOptions;
  }
> = (
  {
    ref,
    action,
    className,
    classNames,
    locale,
    dateFormatOptions,
    chartHeight,
    chartWidth = "100%",
    initialDimension,
    description = "Visualize your earned tips over time!",
    title = "Tips Over Time",
    hideTitle,
    showDescription,
    ...props
  },
) => {
  const { data } = useWorkSchedule();
  return (
    <Card
      ref={ref}
      className={cn(
        "relative z-auto flex flex-col w-full",
        className,
      )}
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
        <TipsOverTimeChart
          data={data}
          className={classNames?.chartClassName}
          height={chartHeight}
          width={chartWidth}
          initialDimension={initialDimension}
          locale={locale}
          dateFormatOptions={dateFormatOptions}
        />
      </CardContent>
    </Card>
  );
};
TipsOverTime.displayName = "TipsOverTime";

export default TipsOverTime;
