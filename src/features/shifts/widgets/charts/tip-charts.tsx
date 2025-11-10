/**
 * Created At: 2025.09.11:17:01:23
 * @author - @FL03
 * @file - tip-charts.tsx
 */
"use client";
// imports
import * as React from "react";
import dynamic from "next/dynamic";
// components
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import TipsOverTimeChart from "./tips-over-time";
// import AverageDailyTipsChart from "./daily-averages";

export const TipCharts: React.FC<
  Omit<
    React.ComponentPropsWithoutRef<typeof Tabs>,
    "children"
  >
> = ({
  defaultValue = "daily",
  value,
  onValueChange,
  ...props
}) => {
  const [tab, setTab] = React.useState<string>(defaultValue);
  // handle changes to the current tab
  const handleTabChange = React.useCallback((nxt: string) => (
    setTab((prev) => {
      if (prev === nxt) return prev;
      if (onValueChange) onValueChange(nxt);
      return nxt;
    })
  ), [onValueChange]);
  // synchronize the local state with the external one
  React.useEffect(() => {
    if (value && value !== tab) {
      setTab(value);
    }
  }, [tab, value]);

  const AverageDailyTipsChart = dynamic(
    async () => (
      (await import("./daily-averages")).AverageDailyTipsChart
    ),
    { ssr: false },
  );
  const TipsOverTimeChart = dynamic(
    async () => (
      (await import("./tips-over-time")).TipsOverTimeChart
    ),
    { ssr: false },
  );

  return (
    <Tabs
      {...props}
      onValueChange={handleTabChange}
      value={tab}
    >
      <Card className="relative z-auto flex flex-col w-full">
        <TabsList defaultValue="daily" className="mt-2 mx-auto max-w-fit">
          <div className="flex flex-row flex-nowrap gap-2">
            <TabsTrigger value="daily" asChild>
              <Button size="sm" variant="ghost">
                By Day
              </Button>
            </TabsTrigger>
            <TabsTrigger asChild value="historical">
              <Button size="sm" variant="ghost">
                Over Time
              </Button>
            </TabsTrigger>
          </div>
        </TabsList>
        <TabsContent value="daily">
          <CardHeader>
            <CardTitle>Daily Averages</CardTitle>
            <CardDescription>
              Visualize the average tips recieved per day
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-1 h-full w-full items-center">
            <AverageDailyTipsChart />
          </CardContent>
        </TabsContent>
        <TabsContent value="historical">
          <CardHeader>
            <CardTitle>Tips Over Time</CardTitle>
            <CardDescription>
              Visualize the tips recieved over time
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-1 h-full w-full items-center">
            <TipsOverTimeChart />
          </CardContent>
        </TabsContent>
      </Card>
    </Tabs>
  );
};
