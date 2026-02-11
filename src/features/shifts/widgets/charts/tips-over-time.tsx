/**
 * Created At: 2025.10.31:09:50:15
 * @author - @FL03
 * @directory - src/features/shifts/widgets/charts
 * @file - tips-over-time.tsx
 */
'use client';
// imports
import * as React from 'react';
import { compareAsc } from 'date-fns';
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
} from 'recharts';
import { ClassNames, formatAsCurrency } from '@pzzld/core';
// local
import { useWorkSchedule } from '../../providers';
import { ShiftData } from '../../types';
// components
import { ChartDisplay, ChartTooltip } from '@/components/common/charts';
import { Item, ItemContent, ItemGroup, ItemTitle } from '@/components/ui/item';

export const TipsOverTimeChart: React.FC<
  Omit<
    React.ComponentPropsWithoutRef<typeof ResponsiveContainer>,
    'children' | 'data' | 'defaultValue' | 'value'
  > & {
    data?: ShiftData[];
    locale?: Intl.LocalesArgument;
    dateFormatOptions?: Intl.DateTimeFormatOptions;
  }
> = ({
  data = [],
  dateFormatOptions = { timeZone: 'UTC' },
  locale = 'en-us',
  aspect = 1.618,
  debounce = 1,
  maxHeight = 500,
  width = '100%',
  ...props
}) => {
  const handleData = ({ date, tips_cash = 0, tips_credit = 0 }: ShiftData) => ({
    date: new Date(date),
    tips_cash,
    tips_credit,
    total_tips: tips_cash + tips_credit,
  });

  const chartData = data
    .map(handleData)
    .sort((a, b) => compareAsc(a.date, b.date));
  return (
    <ResponsiveContainer
      aspect={aspect}
      debounce={debounce}
      maxHeight={maxHeight}
      width={width}
      {...props}
    >
      <ComposedChart accessibilityLayer data={chartData} title='Earned Tips'>
        {/* plots */}
        <Line
          name='Cash'
          dataKey='tips_cash'
          yAxisId='tips'
          activeDot={false}
          dot={false}
          fill='var(--color-chart-1)'
          stroke='var(--color-chart-1)'
          type='monotone'
        />
        <Line
          name='Credit'
          dataKey='tips_credit'
          yAxisId='tips'
          activeDot={false}
          dot={false}
          fill='var(--color-chart-2)'
          stroke='var(--color-chart-2)'
          strokeWidth={2}
          type='monotone'
        />
        {/* chart */}
        <XAxis
          dataKey='date'
          xAxisId='date'
          name='Date'
          textAnchor='middle'
          tickFormatter={(tick) =>
            new Date(tick).toLocaleDateString(locale, dateFormatOptions)
          }
          tickMargin={2}
          type='category'
        />
        <YAxis
          allowDecimals
          yAxisId='tips'
          name='Earned Tips'
          type='number'
          width='auto'
          label={{
            value: 'Earned Tips',
            angle: -90,
            position: 'insideLeft',
            className: 'text-sm font-bold sr-only md:not-sr-only',
          }}
          tickMargin={2}
          tickFormatter={(tick) => formatAsCurrency(Number(tick))}
        />
        <Legend name='Legend' />
        <Brush
          dataKey='date'
          height={30}
          stroke='var(--color-primary)'
          tickFormatter={(value) =>
            new Date(value).toLocaleDateString(locale, dateFormatOptions)
          }
        />
        <ReferenceLine y={0} stroke='--var(--color-primary)' />
        <Tooltip
          content={({ active, payload }) => {
            if (!active || !payload || payload?.length === 0) {
              return null;
            }
            const date = new Date(payload[0].payload.date);
            return (
              <ChartTooltip
                title={date.toLocaleDateString(locale, dateFormatOptions)}
              >
                <ItemGroup className='w-full'>
                  {payload.map((item, index) => (
                    <Item key={index} className='flex-nowrap w-full' size='sm'>
                      <ItemContent className='flex-1'>
                        <ItemTitle className='text-nowrap font-semibold'>
                          {item.name}
                        </ItemTitle>
                      </ItemContent>
                      <ItemContent className='justify-end'>
                        <span className='font-mono'>
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
TipsOverTimeChart.displayName = 'TipsOverTimeChart';

export const TipsOverTime: React.FC<
  Omit<React.ComponentPropsWithRef<typeof ChartDisplay>, 'children'> & {
    classNames?: ClassNames<
      | 'action'
      | 'chart'
      | 'content'
      | 'description'
      | 'header'
      | 'footer'
      | 'title'
    >;
    chartHeight?: number | `${number}%`;
    chartWidth?: number | `${number}%`;
    maxHeight?: number;
    initialDimension?: { height: number; width: number };
    locale?: Intl.LocalesArgument;
    dateFormatOptions?: Intl.DateTimeFormatOptions;
  }
> = ({
  ref,
  className,
  classNames,
  locale,
  dateFormatOptions,
  chartHeight,
  chartWidth,
  initialDimension,
  hideTitle,
  showDescription,
  description = 'Visualize your earned tips over time!',
  title = 'Tips Over Time',
  ...props
}) => {
  const { data } = useWorkSchedule();
  return (
    <ChartDisplay
      ref={ref}
      classNames={{
        ...classNames,
      }}
      {...props}
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
    </ChartDisplay>
  );
};
TipsOverTime.displayName = 'TipsOverTime';

export default TipsOverTime;
