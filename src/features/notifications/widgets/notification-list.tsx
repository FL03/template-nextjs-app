/**
 * Notification List Component
 * Created At: 2025-04-09:07:42:06
 * @author - @FL03
 * @description - This component displays a list of notifications for the user.
 * @file - notification-list.tsx
 */
"use client";
// imports
import * as React from "react";
// project
import { logger } from "@/lib/logger";
import { cn } from "@/lib/utils";
// feature-specific
import type { Notification } from "../types";
// components
import { ListItem, UList } from "@/components/common/list";
import {
  Tile,
  TileContent,
  TileLeading,
  TileTrailing,
} from "@/components/common/tile";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";

// the notification list item component
const NotificationListItem: React.FC<
  Omit<
    React.ComponentPropsWithRef<typeof ListItem>,
    "asChild" | "onClick" | "children"
  > & {
    item?: Notification | null;
    onClick?: (item: Notification) => void;
    onSelected?: (item: Notification) => void;
  }
> = ({ ref, item: itemProp, onClick, onSelected, ...props }) => {
  // memoize the item to prevent unnecessary re-renders
  const item = React.useMemo(() => itemProp || null, [itemProp]);
  // local state
  const [selected, setSelected] = React.useState(false);

  // ensure the selected signal is in sync with the item
  React.useEffect(() => {
    // handle the case where the item is present
    if (item && item.status) {
      // check if the item is read or selected
      setSelected(["read", "selected"].includes(item.status));
    }
  }, [item]);
  // if the item is not present, return null
  if (!item) return null;
  // deconstruct the item
  const { message, status } = item;

  function handleOnItemClick(item: Notification) {
    // handle click event here
    logger.trace("Handling the click event for a notification...");
    // handle select event here
    setSelected((prev) => !prev);
    // finish out by calling the onClick prop if it exists
    if (onClick) onClick(item);
    // return
    return;
  }

  function handleSelect(
    item: Notification,
  ) {
    // handle select event here
    logger.trace("Handling the select event for a notification...");
    // toggle the selected state
    setSelected((prev) => !prev);
    // call the onSelected callback if possible
    if (onSelected) onSelected(item);
  }
  // render the notification list item
  return (
    <ListItem
      {...props}
      asChild
      ref={ref}
      onClick={(event) => {
        // prevent the default action of the checkbox
        event.preventDefault();
        // prevent the event from bubbling up to the list item
        event.stopPropagation();
        // handle the click event
        handleOnItemClick(item);
      }}
    >
      <Tile>
        <TileLeading>
          <Checkbox
            checked={selected}
            onClick={(event) => {
              // prevent the default action of the checkbox
              event.preventDefault();
              // prevent the event from bubbling up to the list item
              event.stopPropagation();
              // handle the select event
              handleSelect(item);
            }}
          />
        </TileLeading>
        <TileContent>{message}</TileContent>
        <TileTrailing>
          <Badge>{status}</Badge>
        </TileTrailing>
      </Tile>
    </ListItem>
  );
};
NotificationListItem.displayName = "NotificationListItem";

export const NotificationList: React.FC<
  React.ComponentPropsWithRef<typeof UList> & {
    items?: Notification[];
    onItemClick?: (item: Notification) => void;
    onItemSelected?: (item: Notification) => void;
  }
> = ({ ref, className, onItemClick, onItemSelected, items = [], ...props }) => {
  return (
    <UList
      {...props}
      ref={ref}
      className={cn(
        "flex flex-col flex-1 w-full h-full gap-1 px-4 py-2",
        "bg-accent text-accent-foreground border border-accent/10 rounded-xl shadow-md inset-0.5",
        className,
      )}
    >
      {items.map((item, index) => (
        <NotificationListItem
          key={index}
          item={item}
          onClick={onItemClick}
          onSelected={onItemSelected}
        />
      ))}
    </UList>
  );
};
NotificationList.displayName = "NotificationList";

export default NotificationList;
