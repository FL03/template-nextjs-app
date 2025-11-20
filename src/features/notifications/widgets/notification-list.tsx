/**
 * Created At: 2025.11.01:15:01:01
 * @author - @FL03
 * @directory - src/features/notifications/widgets
 * @file - notification-list.tsx
 */
"use client";
// imports
import * as React from "react";
import { CheckedState } from "@radix-ui/react-checkbox";
// project
import { cn } from "@/lib/utils";
// feature-specific
import type { NotificationData } from "../types";
import { NotificationItemDropdownMenu } from "./actions";
// components
import { Checkbox } from "@/components/ui/checkbox";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";
import { NotificationStatusBadge } from "./notification-status";

// NotificationItem
export const NotificationItem: React.FC<
  Omit<
    React.ComponentPropsWithRef<typeof Item>,
    "asChild" | "onClick" | "children"
  > & {
    value: NotificationData;
    onClick?(item: NotificationData): void;
  }
> = ({ ref, className, value, onClick, ...props }) => {
  const [checked, setChecked] = React.useState<CheckedState>(false);

  const toggleSelected = () => setChecked((prev) => !prev);

  function handleOnClick(
    data: NotificationData,
  ): React.MouseEventHandler<HTMLDivElement> {
    return (event) => {
      // cleanup the event
      event.preventDefault();
      event.stopPropagation();
      // toggle the selected state
      toggleSelected();
      // invoke the onClick callback
      onClick?.(data);
    };
  }
  return (
    <Item
      ref={ref}
      key={value?.id}
      onClick={handleOnClick(value)}
      className={cn("flex-nowrap justify-stretch", className)}
      {...props}
    >
      <ItemMedia variant="icon">
        <Checkbox
          className="m-auto"
          checked={checked}
          onCheckedChange={setChecked}
          onClick={toggleSelected}
        />
      </ItemMedia>
      <ItemContent>
        <ItemTitle>{value?.message}</ItemTitle>
        <ItemDescription>{value?.sender}</ItemDescription>
      </ItemContent>
      <ItemContent className="items-center">
        <NotificationStatusBadge hideLabel status={value?.status} variant="outline"/>
      </ItemContent>
      <ItemActions>
        <NotificationItemDropdownMenu value={value} />
      </ItemActions>
    </Item>
  );
};

export const NotificationList: React.FC<
  React.ComponentPropsWithRef<typeof ItemGroup> & {
    items?: NotificationData[];
    itemSize?: React.ComponentProps<typeof NotificationItem>["size"];
    itemVariant?: React.ComponentProps<typeof NotificationItem>["variant"];
    onItemClick?(item: NotificationData): void;
  }
> = (
  {
    ref,
    className,
    items,
    itemSize = "sm",
    itemVariant = "outline",
    onItemClick,
    ...props
  },
) => (
  <ItemGroup
    {...props}
    ref={ref}
    className={cn(
      "flex-1 w-full h-full gap-1",
      className,
    )}
  >
    {items?.map((item) => (
      <NotificationItem
        key={item.id}
        value={item}
        onClick={onItemClick}
        size={itemSize}
        variant={itemVariant}
      />
    ))}
  </ItemGroup>
);
