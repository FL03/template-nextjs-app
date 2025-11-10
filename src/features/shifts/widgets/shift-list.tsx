/**
 * Created At: 2025.09.11:15:57:41
 * @author - @FL03
 * @file - shift-list.tsx
 */
"use client";
// packages
import * as React from "react";
import { compareAsc, compareDesc } from "date-fns";
import { useRouter } from "next/navigation";
import { formatAsCurrency } from "@pzzld/core";
// project
import { useUsername } from "@/hooks/use-username";
import { cn } from "@/lib/utils";
// local
import { useWorkSchedule } from "../providers";
import { type ShiftData } from "../types";
import { ShiftContextMenu, ShiftDropdownMenu } from "./actions";
// components
import {
  Item,
  ItemActions,
  ItemContent,
  ItemGroup,
  ItemTitle,
} from "@/components/ui/item";

export const ShiftList: React.FC<
  React.ComponentPropsWithoutRef<typeof ItemGroup> & {
    descending?: boolean;
    itemCount?: number;
  }
> = ({ className, descending = false, itemCount = 5, ...props }) => {
  // initialize providers
  const { username: username } = useUsername();
  const { data: shifts } = useWorkSchedule();
  // setup the router
  const router = useRouter();

  const handleData = React.useCallback(
    (
      values: ShiftData[],
      { ascending = false, limit }: { ascending?: boolean; limit?: number } =
        {},
    ) => {
      values = values.sort((lhs, rhs) =>
        ascending
          ? compareAsc(new Date(lhs.date), new Date(rhs.date))
          : compareDesc(new Date(lhs.date), new Date(rhs.date))
      );
      if (limit) {
        values = values.slice(0, limit);
      }
      return values;
    },
    [],
  );

  const data = React.useMemo<ShiftData[]>(() => (
    handleData(shifts, { ascending: !descending, limit: itemCount })
  ), [shifts, descending, itemCount]);

  const renderItem = (
    itemData: ShiftData,
    index?: number,
  ) => {
    const { id, date, tips_cash: cash = 0, tips_credit: credit = 0 } = itemData;
    return (
      <ShiftContextMenu asChild key={index} itemId={itemData.id}>
        <Item
          id={itemData?.id}
          key={itemData?.id ?? index}
          className="items-center"
          onClick={() => {
            router.push(`/shifts/${id}?mode=read&username=${username}`);
          }}
        >
          <ItemContent>
            <ItemTitle className="text-right">
              {new Date(date).toLocaleDateString("en-US", { timeZone: "UTC" })}
            </ItemTitle>
          </ItemContent>
          <ItemContent className="">
            <ItemTitle className="text-left font-mono">
              {formatAsCurrency(cash + credit)}
            </ItemTitle>
          </ItemContent>
          <ItemActions>
            {/* actions menu */}
            <ShiftDropdownMenu item={itemData} />
          </ItemActions>
        </Item>
      </ShiftContextMenu>
    );
  };
  return (
    <ItemGroup
      className={cn("w-full", itemCount && "overflow-y-auto", className)}
      {...props}
    >
      {data?.map(renderItem)}
    </ItemGroup>
  );
};
ShiftList.displayName = "ShiftList";

export default ShiftList;
