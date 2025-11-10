/**
 * Created At: 2025.09.11:15:10:25
 * @author - @FL03
 * @file - shift-dashboard.tsx
 */
"use client";
// imports
import * as React from "react";
import dynamic from "next/dynamic";
// project
import { OrgCombo } from "@/features/orgs";
import { cn } from "@/lib/utils";
import { formatAsCurrency } from "@/lib/fmt";
// local
import { useWorkSchedule } from "../providers";
import { averageTips, totalTips } from "../utils";
import { ShiftCommandDropdownMenu } from "./actions";
import { TipCharts } from "./charts";
import { ShiftFormModal } from "./modals";
// components
import { InfoCard } from "@/components/common/cards";
import {
  Dashboard,
  DashboardContent,
  DashboardHeader,
  DashboardLayout,
  DashboardLeading,
  DashboardProvider,
  DashboardTrailing,
} from "@/components/common/dashboard";
import { ButtonGroup } from "@/components/ui/button-group";
import { Card } from "@/components/ui/card";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from "@/components/ui/item";

export const ShiftDashboardLeading: React.FC<
  Omit<React.ComponentPropsWithoutRef<"div">, "children">
> = ({ className, ...props }) => {
  const Calendar = dynamic(
    async () =>
      await import("./shift-calendar").then((mod) => mod.ShiftCalendar),
    {
      ssr: false,
      loading: () => (
        <Card className="w-full h-96 animate-pulse bg-secondary/10 px-4 py-2" />
      ),
    },
  );
  return (
    <div
      {...props}
      className={cn(
        "flex flex-1 flex-col h-full w-full relative z-auto gap-2",
        className,
      )}
    >
      <Calendar className="order-first w-full" />
    </div>
  );
};

export const ShiftDashboardContent: React.FC<
  Omit<React.ComponentPropsWithoutRef<"div">, "children">
> = ({ className, ...props }) => {
  const { data } = useWorkSchedule();
  return (
    <div
      className={cn(
        "flex flex-1 flex-col h-full w-full gap-4 lg:gap-6",
        className,
      )}
      {...props}
    >
      <div className="flex flex-wrap w-full gap-2 lg:gap-4 items-center justify-evenly">
        <InfoCard
          id="average-tips-card"
          title="Average"
          description="The average amount of tips recieved per shift."
        >
          {formatAsCurrency(averageTips(data))}
        </InfoCard>
        <InfoCard
          id="total-tips-card"
          title="Total"
          description="The total amount of tips recieved throughout all shifts."
        >
          {formatAsCurrency(totalTips(data))}
        </InfoCard>
        <InfoCard
          id="shift-count-card"
          title="Count"
          description="The total number of shifts recorded."
        >
          {data.length}
        </InfoCard>
      </div>
      <TipCharts className="flex-1 h-full w-full" />
    </div>
  );
};

export const ShiftDashboard: React.FC<
  React.ComponentPropsWithoutRef<typeof Dashboard> & {
    description?: React.ReactNode;
    title?: React.ReactNode;
    showDescription?: boolean;
    leading?: React.ReactNode;
    trailing?: React.ReactNode;
  }
> = (
  {
    children,
    showDescription,
    trailing,
    leading,
    description = "View and manage your shifts, tips, and more!",
    title = "Shifts",
    ...props
  },
) => {
  const { filter, setFilter } = useWorkSchedule();

  return (
    <DashboardProvider>
      <Dashboard {...props}>
        <DashboardHeader>
          <Item>
            <ItemContent>
              {title && <ItemTitle className="text-xl">{title}</ItemTitle>}
              {description && (
                <ItemDescription hidden={!showDescription}>
                  {description}
                </ItemDescription>
              )}
            </ItemContent>
            <ItemActions>
              <OrgCombo
                onValueChange={(value) => {
                  setFilter({
                    key: "organization_id",
                    value: value?.id ?? null,
                  });
                }}
              />
              <ButtonGroup>
                <ShiftFormModal
                  defaultValues={filter?.value
                    ? { organization_id: filter?.value }
                    : undefined}
                  triggerVariant="outline"
                />
                <ShiftCommandDropdownMenu triggerVariant="outline" />
              </ButtonGroup>
            </ItemActions>
          </Item>
        </DashboardHeader>
        <DashboardLayout>
          {leading && <DashboardLeading>{leading}</DashboardLeading>}
          {children && <DashboardContent>{children}</DashboardContent>}
          {trailing && <DashboardTrailing>{trailing}</DashboardTrailing>}
        </DashboardLayout>
      </Dashboard>
    </DashboardProvider>
  );
};
ShiftDashboard.displayName = "ShiftDashboard";

export default ShiftDashboard;
