/**
 * Created At: 2025.10.02:19:00:18
 * @author - @FL03
 * @directory - src/features/orgs/widgets
 * @file - orgs-list.tsx
 */
"use client";
// imports
import * as React from "react";
import { useRouter } from "next/navigation";
// project
import { cn } from "@/lib/utils";
// local
import { useOrganizations } from "../provider";
import { OrganizationData } from "../types";
import { OrganizationContextMenu, OrganizationDropdownMenu } from "./actions";
// components
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemTitle,
} from "@/components/ui/item";

export const OrganizationsList: React.FC<
  Omit<React.ComponentPropsWithoutRef<typeof ItemGroup>, "children">
> = ({ className, ...props }) => {
  const { data } = useOrganizations();

  return (
    <ItemGroup {...props} className={cn("", className)}>
      {data?.map((org) => <OrganizationListItem key={org.id} org={org} />)}
    </ItemGroup>
  );
};

export const OrganizationListItem: React.FC<
  Omit<React.ComponentPropsWithoutRef<typeof Item>, "children"> & {
    org: OrganizationData;
  }
> = ({ className, org, onClick, ...props }) => {
  const router = useRouter();
  return (
    <OrganizationContextMenu itemId={org.id}>
      <Item
        className={cn(
          "",
          "cursor-pointer transition-opacity ease-in-out hover:opacity-75",
          className,
        )}
        onClick={(event) => {
          event.preventDefault();
          event.stopPropagation();
          if (onClick) onClick(event);
          // navigate to the org details page
          router.push(`/orgs/${org.id}`);
        }}
        {...props}
      >
        <ItemContent>
          <ItemTitle className="text-lg font-semibold tracking-tight leading-none">
            {org.name}
          </ItemTitle>
          {org.description && (
            <ItemDescription className="text-sm text-muted-foreground pt-1">
              {org.description}
            </ItemDescription>
          )}
        </ItemContent>
        <ItemActions>
          <OrganizationDropdownMenu itemId={org.id} />
        </ItemActions>
      </Item>
    </OrganizationContextMenu>
  );
};
