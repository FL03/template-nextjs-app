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
// local
import { useWorkSchedule } from "../providers";
import { averageTips, totalTips } from "../utils";
import { ShiftCommandDialog, ShiftCommandMenu } from "./actions";
import { EarnedTipChartTabs } from "./charts";
import { ShiftFormModal } from "./modals";
import { ShiftList } from "./shift-list";
// components
import { InfoCard } from "@/components/common/info-card";
import {
  Dashboard,
  DashboardContent,
  DashboardDescription,
  DashboardDrawerPanel,
  DashboardHeader,
  DashboardLayout,
  DashboardProvider,
  DashboardSection,
  DashboardSheetPanel,
  DashboardTitle,
  useDashboard,
} from "@/components/common/dashboard";
import { LoadingScaffold } from "@/components/common/loading";
import { ButtonGroup } from "@/components/ui/button-group";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemGroup,
} from "@/components/ui/item";

const ShiftDashboardLeading: React.FC<
  Omit<React.ComponentPropsWithRef<typeof DashboardSection>, "children">
> = ({ ref, ...props }) => {
  const Calendar = dynamic(
    async () =>
      await import("./shift-calendar").then((mod) => mod.ShiftCalendar),
    {
      ssr: false,
      loading: () => <LoadingScaffold />,
    },
  );
  return (
    <DashboardSection ref={ref} {...props}>
      <Calendar className="order-first w-full" />
      <ShiftList descending className="flex-1 h-full w-full" itemCount={5} />
    </DashboardSection>
  );
};

const ShiftDashboardContent: React.FC<
  Omit<React.ComponentPropsWithRef<typeof DashboardSection>, "children">
> = ({ ref, ...props }) => {
  const { isMobile } = useDashboard();
  const { data } = useWorkSchedule();
  const ByDayChart = dynamic(
    async () => await import("./charts/tips-by-day"),
    {
      ssr: false,
      loading: () => <LoadingScaffold />,
    },
  );
  return (
    <DashboardSection ref={ref} {...props}>
      <ItemGroup className="flex-row flex-wrap gap-2 justify-evenly w-full">
        <InfoCard
          id="item-average-tips"
          variant="outline"
          title="Average"
          description="The average amount of earned tips per shift."
        >
          <span className="font-mono">
            {formatAsCurrency(averageTips(data))}
          </span>
        </InfoCard>
        <InfoCard
          id="item-total-tips"
          variant="outline"
          title="Total"
          description="Total amount of tips recieved"
        >
          <span className="font-mono">
            {formatAsCurrency(totalTips(data))}
          </span>
        </InfoCard>
        <InfoCard
          id="item-shift-count"
          variant="outline"
          title="Count"
          description="The number of shifts recorded."
        >
          <span className="font-mono">{data.length}</span>
        </InfoCard>
      </ItemGroup>
      {isMobile ? <ByDayChart /> : <EarnedTipChartTabs />}
    </DashboardSection>
  );
};

const ShiftDashboard: React.FC<
  React.ComponentPropsWithoutRef<typeof Dashboard> & {
    description?: React.ReactNode;
    title?: React.ReactNode;
    leading?: React.ReactNode;
    trailing?: React.ReactNode;
    hideTitle?: boolean;
    showDescription?: boolean;
  }
> = (
  {
    children,
    trailing,
    leading,
    hideTitle,
    showDescription,
    description = "View and manage your shifts, tips, and more!",
    title = "Dashboard",
    ...props
  },
) => {
  const { filter, setFilter } = useWorkSchedule();

  return (
    <DashboardProvider>
      <Dashboard {...props}>
        <DashboardHeader asChild>
          <Item className="flex-nowrap w-full">
            {Boolean(description || title) && (
              <ItemContent className="flex-1" hidden={hideTitle}>
                {title && (
                  <DashboardTitle className="text-xl" hidden={hideTitle}>
                    {title}
                  </DashboardTitle>
                )}
                {description && (
                  <DashboardDescription hidden={!showDescription}>
                    {description}
                  </DashboardDescription>
                )}
              </ItemContent>
            )}
            <ItemActions className="flex-nowrap">
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
          {leading && <DashboardSheetPanel>{leading}</DashboardSheetPanel>}
          {children && <DashboardContent>{children}</DashboardContent>}
          {trailing && <DashboardDrawerPanel>{trailing}</DashboardDrawerPanel>}
        </DashboardLayout>
      </Dashboard>
      <ShiftCommandDialog />
    </DashboardProvider>
  );
};
ShiftDashboard.displayName = "ShiftDashboard";

export { ShiftDashboard, ShiftDashboardContent, ShiftDashboardLeading };
