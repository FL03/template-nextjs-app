/**
 * Created At: 2025.10.02:19:05:09
 * @author - @FL03
 * @directory - src/features/orgs/views
 * @file - orgs-list-view.tsx
 */
"use client";
// imports
import * as React from "react";
// components
import { RefreshButton } from "@/components/common/button";
import { ButtonGroup } from "@/components/ui/button-group";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
// local
import { useOrganizations } from "../provider";
import { OrganizationFormModal, OrganizationsList } from "../widgets";

type ViewProps = {
  title?: React.ReactNode;
  description?: React.ReactNode;
  showDescription?: boolean;
};

export const OrgsListView: React.FC<ViewProps> = (
  {
    description = "A list view of your organizations",
    title = "Organizations",
    showDescription,
  },
) => {
  const { reload, state: { isReloading } } = useOrganizations();
  return (
    <Card>
      <CardHeader>
        {title && <CardTitle className="text-xl">{title}</CardTitle>}
        {description && (
          <CardDescription hidden={!showDescription}>
            {description}
          </CardDescription>
        )}
        <CardAction>
          <ButtonGroup>
            <RefreshButton
              isRefreshing={isReloading}
              onRefresh={reload}
              variant="outline"
            />
            <OrganizationFormModal
              triggerSize="icon"
              triggerVariant="outline"
            />
          </ButtonGroup>
        </CardAction>
      </CardHeader>
      <CardContent>
        <OrganizationsList />
      </CardContent>
    </Card>
  );
};
