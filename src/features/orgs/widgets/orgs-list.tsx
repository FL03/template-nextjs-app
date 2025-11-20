/**
 * Created At: 2025.10.02:19:00:18
 * @author - @FL03
 * @directory - src/features/orgs/widgets
 * @file - orgs-list.tsx
 */
"use client";
// imports
import * as React from "react";
import Link from "next/link";
import { ClassNames } from "@pzzld/core";
// project
import { cn } from "@/lib/utils";
// local
import { useOrganizations } from "../provider";
import { OrganizationData } from "../types";
import {
  OrganizationContextMenu,
  OrganizationDropdownMenu,
  OrganizationsDropdownMenu,
} from "./actions";
import { OrganizationFormModal } from "./modals";
// components
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemTitle,
} from "@/components/ui/item";
import { ButtonGroup } from "@/components/ui/button-group";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const OrganizationListItem: React.FC<
  Omit<
    React.ComponentPropsWithoutRef<typeof Item>,
    "asChild" | "children" | "defaultValue" | "value"
  > & {
    value: OrganizationData;
  }
> = ({ className, value, onClick, ...props }) => (
  <OrganizationContextMenu itemId={value.id}>
    <Item
      asChild
      className={cn(
        "w-full",
        "cursor-pointer transition-opacity ease-in-out hover:opacity-75",
        className,
      )}
      {...props}
    >
      <Link href={{ pathname: `/orgs/${value.id}` }}>
        <ItemContent>
          <ItemTitle className="text-lg font-semibold tracking-tight leading-none">
            {value.name}
          </ItemTitle>
          {value.description && (
            <ItemDescription className="text-sm text-muted-foreground pt-1">
              {value.description}
            </ItemDescription>
          )}
        </ItemContent>
        <ItemActions>
          <OrganizationDropdownMenu itemId={value.id} />
        </ItemActions>
      </Link>
    </Item>
  </OrganizationContextMenu>
);
OrganizationListItem.displayName = "OrganizationListItem";

const OrganizationsList: React.FC<
  Omit<React.ComponentPropsWithoutRef<typeof ItemGroup>, "children">
> = ({ className, ...props }) => {
  const { data } = useOrganizations();

  return (
    <ItemGroup {...props} className={cn("", className)}>
      {data?.map((org) => <OrganizationListItem key={org.id} value={org} />)}
    </ItemGroup>
  );
};
OrganizationsList.displayName = "OrganizationsList";

const OrgsListView: React.FC<
  React.ComponentPropsWithRef<typeof Card> & {
    classNames?: ClassNames<
      "action" | "content" | "footer" | "header" | "title" | "description"
    >;
    title?: React.ReactNode;
    description?: React.ReactNode;
    showDescription?: boolean;
  }
> = (
  {
    ref,
    children,
    className,
    classNames,
    description = "A list view of your organizations",
    title = "Organizations",
    showDescription,
    ...props
  },
) => (
  <Card ref={ref} className={cn("w-full", className)} {...props}>
    <CardHeader>
      <CardTitle
        className={cn("text-xl", classNames?.titleClassName)}
        hidden={!title}
      >
        {title}
      </CardTitle>
      <CardDescription
        className={cn(
          "text-muted-foreground",
          showDescription ? "not-sr-only" : "sr-only",
          classNames?.descriptionClassName,
        )}
        hidden={!description}
      >
        {description}
      </CardDescription>
      <CardAction>
        <ButtonGroup>
          <OrganizationFormModal
            triggerSize="icon"
            triggerVariant="outline"
          />
          <OrganizationsDropdownMenu />
        </ButtonGroup>
      </CardAction>
    </CardHeader>
    <CardContent
      className={cn("flex-1 h-full w-full", classNames?.contentClassName)}
    >
      <OrganizationsList />
    </CardContent>
    <CardFooter
      hidden={!children}
      className={cn("w-full", classNames?.footerClassName)}
    >
      {children}
    </CardFooter>
  </Card>
);
OrgsListView.displayName = "OrganizationsListView";

export { OrganizationListItem, OrganizationsList, OrgsListView };
