/**
 * Created At: 2025.09.11:15:10:25
 * @author - @FL03
 * @file - shift-dashboard.tsx
 */
"use client";
// imports
import * as React from "react";
import dynamic from "next/dynamic";
import { formatAsCurrency } from "@pzzld/core";
// project
import { OrgCombo } from "@/features/orgs";
import { cn } from "@/lib/utils";
// local
import { useWorkSchedule } from "../providers";
import { averageTips, totalTips } from "../utils";
import { ShiftCommandDialog, ShiftCommandMenu } from "./actions";
import { TipCharts } from "./charts";
import { ShiftFormModal } from "./modals";
import { ShiftList } from "./shift-list";
// components
import { InfoItem } from "@/components/common/info-card";
import {
  Dashboard,
  DashboardContent,
  DashboardHeader,
  DashboardLayout,
  DashboardLeading,
  DashboardProvider,
  DashboardSection,
  DashboardTrailing,
} from "@/components/common/dashboard";
import { LoadingScaffold } from "@/components/common/loading";
import { ButtonGroup } from "@/components/ui/button-group";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemTitle,
} from "@/components/ui/item";

const ShiftDashboardLeading: React.FC<
  Omit<React.ComponentPropsWithoutRef<typeof DashboardSection>, "children">
> = ({ className, ...props }) => {
  const Calendar = dynamic(
    async () =>
      await import("./shift-calendar").then((mod) => mod.ShiftCalendar),
    {
      ssr: false,
      loading: () => <LoadingScaffold />,
    },
  );
  return (
    <DashboardSection
      {...props}
      className={cn(
        "flex flex-1 flex-col h-full w-full relative z-auto gap-2",
        className,
      )}
    >
      <Calendar className="order-first w-full" />
      <ShiftList descending className="flex-1 h-full w-full" itemCount={5} />
    </DashboardSection>
  );
};

const ShiftDashboardContent: React.FC<
  Omit<React.ComponentPropsWithoutRef<typeof DashboardSection>, "children">
> = ({ className, ...props }) => {
  const { data } = useWorkSchedule();
  return (
    <DashboardSection
      className={cn(
        "flex flex-1 flex-col h-full w-full gap-4 lg:gap-6",
        className,
      )}
      {...props}
    >
      <ItemGroup className="flex-row flex-wrap gap-2 justify-evenly w-full">
        <InfoItem
          id="item-average-tips"
          variant="outline"
          title="Average"
          description="The average amount of earned tips per shift."
        >
          <span className="font-mono">
            {formatAsCurrency(averageTips(data))}
          </span>
        </InfoItem>
        <InfoItem
          id="item-total-tips"
          variant="outline"
          title="Total"
          description="Total amount of tips recieved"
        >
          <span className="font-mono">
            {formatAsCurrency(totalTips(data))}
          </span>
        </InfoItem>
        <InfoItem
          id="item-shift-count"
          variant="outline"
          title="Count"
          description="The number of shifts recorded."
        >
          <span className="font-mono">{data.length}</span>
        </InfoItem>
      </ItemGroup>
      <TipCharts className="flex-1 h-full w-full" />
    </DashboardSection>
  );
};

const ShiftDashboard: React.FC<
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
                <ShiftCommandMenu triggerVariant="outline" />
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
      <ShiftCommandDialog />
    </DashboardProvider>
  );
};
ShiftDashboard.displayName = "ShiftDashboard";

export { ShiftDashboard, ShiftDashboardContent, ShiftDashboardLeading };
