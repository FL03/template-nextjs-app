/**
 * Created At: 2025.09.11:17:01:23
 * @author - @FL03
 * @file - tip-charts.tsx
 */
'use client';
// imports
import * as React from 'react';
import dynamic from 'next/dynamic';
// project
import { cn } from '@/lib/utils';
// components
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LoadingScaffold } from '@/components/common/loading';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';

export const EarnedTipChartTabs: React.FC<
  Omit<React.ComponentPropsWithRef<typeof Tabs>, 'children'> & {
    ssr?: boolean;
  }
> = ({
  ref,
  className,
  value,
  onValueChange,
  defaultValue = 'daily',
  ssr = false,
  ...props
}) => {
  const [tab, setTab] = React.useState<string>(defaultValue);
  // handle changes to the current tab
  const handleTabChange = React.useCallback(
    (nxt: string) =>
      setTab((prev) => {
        if (prev === nxt) return prev;
        if (onValueChange) onValueChange(nxt);
        return nxt;
      }),
    [onValueChange],
  );
  // synchronize the local state with the external one
  React.useEffect(() => {
    if (value && value !== tab) {
      setTab(value);
    }
  }, [tab, value]);

  const TipsByDayOfWeek = dynamic(async () => await import('./tips-by-day'), {
    ssr,
    loading: () => <LoadingScaffold />,
  });

  const TipsOverTime = dynamic(async () => await import('./tips-over-time'), {
    ssr,
    loading: () => <LoadingScaffold />,
  });

  return (
    <Card
      className={cn(
        'relative z-auto flex flex-1 flex-col h-full w-full',
        className,
      )}
    >
      <CardContent className='flex flex-1 flex-col w-full px-0'>
        <Tabs {...props} ref={ref} onValueChange={handleTabChange} value={tab}>
          <CardHeader className='flex flex-nowrap items-center justify-center gap-4 px-6'>
            <TabsList
              defaultValue='daily'
              className='mx-auto justify-self-center'
            >
              <div className='flex flex-nowrap gap-2 w-full'>
                <TabsTrigger value='daily' asChild>
                  <Button variant='ghost'>By Day</Button>
                </TabsTrigger>
                <TabsTrigger asChild value='historical'>
                  <Button variant='ghost'>Over Time</Button>
                </TabsTrigger>
              </div>
            </TabsList>
          </CardHeader>
          <CardFooter className='p-0 flex flex-1 items-center h-full w-full'>
            <TabsContent value='daily'>
              <TipsByDayOfWeek showDescription />
            </TabsContent>
            <TabsContent value='historical'>
              <TipsOverTime showDescription />
            </TabsContent>
          </CardFooter>
        </Tabs>
      </CardContent>
    </Card>
  );
};
EarnedTipChartTabs.displayName = 'EarnedTipChartTabs';
