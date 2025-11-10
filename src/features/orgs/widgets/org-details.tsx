/**
 * Created At: 2025.10.02:20:07:39
 * @author - @FL03
 * @directory - src/features/orgs/widgets
 * @file - org-details.tsx
 */
"use client";
// imports
import * as React from "react";
import { VariantProps } from "class-variance-authority";
import { FileEditIcon, Trash2Icon, XIcon } from "lucide-react";
// project
import { cn } from "@/lib/utils";
import { useOrg } from "@/hooks/use-org";
// local
import { OrganizationForm } from "./org-form";
// components
import { IconButton } from "@/components/common/button";
import { DetailScaffold } from "@/components/common/details";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Empty,
  EmptyContent,
  EmptyHeader,
  EmptyTitle,
} from "@/components/ui/empty";
import { Spinner } from "@/components/ui/spinner";

const isEditMode = (value: string): boolean => (
  ["edit", "update", "modify"].includes(value.toLowerCase())
);

export const OrgDetails: React.FC<
  Omit<
    React.ComponentPropsWithRef<typeof DetailScaffold>,
    "children" | "trailing" | "title" | "hidden"
  > & {
    orgId?: string;
    readonly?: boolean;
    showDescription?: boolean;
    defaultMode?: string;
    mode?: string;
    onModeChange?(mode: string): void;
  }
> = (
  {
    ref,
    className,
    orgId,
    showDescription,
    defaultMode = "read",
    mode,
    onModeChange,
    ...props
  },
) => {
  const { data, state: { isLoading }, ...org } = useOrg({ id: orgId });

  const [view, setView] = React.useState<string>(
    isEditMode(mode ?? defaultMode) ? "edit" : "read",
  );

  const isEditing = React.useMemo(() => isEditMode(view), [view]);

  const handleModeChange = React.useCallback((next: string) => {
    setView((prev) => {
      if (prev === next) return prev;
      const nextMode = isEditMode(next) ? "edit" : "read";
      onModeChange?.(nextMode);
      return nextMode;
    });
  }, [onModeChange]);

  const toggleMode = () => {
    handleModeChange(isEditing ? "read" : "edit");
  };

  React.useEffect(() => {
    if (mode && mode !== view) {
      setView(mode);
    }
  }, [mode, view]);

  const ActionGroup = (
    { size = "icon-lg", variant = "outline" }: VariantProps<
      typeof buttonVariants
    >,
  ) => (
    <ButtonGroup>
      <IconButton
        label={isEditing ? "Cancel" : "Edit"}
        size={size}
        variant={variant}
        onClick={toggleMode}
      >
        {isEditing
          ? <XIcon className="size-5" />
          : <FileEditIcon className="size-5" />}
      </IconButton>
      <IconButton
        label="Delete"
        variant="destructive"
        size={size}
        onClick={org.delete}
      >
        <Trash2Icon className="size-5" />
      </IconButton>
    </ButtonGroup>
  );

  const Content = () => {
    if (isLoading) {
      return (
        <div className="flex flex-1 h-full w-full items-center justify-center">
          <div className="inline-flex flex-nowrap items-center m-auto gap-2">
            <Spinner className="size-7" />
            <span className="animate-pulse text-lg font-semibold">Loading...</span>
          </div>
        </div>
      );
    }
    if (!data && !isLoading) {
      return (
        <Empty>
          <EmptyHeader>
            <EmptyTitle>No Data</EmptyTitle>
          </EmptyHeader>
          <EmptyContent className="text-center">
            No data available for this organization.
          </EmptyContent>
        </Empty>
      );
    }
    if (isEditing) {
      return (
        <OrganizationForm defaultValues={{ ...data }} onCancel={toggleMode} />
      );
    }
    return (
      <>
        <CardHeader>
          <CardTitle className="text-lg">{data?.name}</CardTitle>
          {data?.description && (
            <CardDescription>
              {data?.description}
            </CardDescription>
          )}
          <CardAction>
            <Badge variant="secondary">
              {data?.category}
            </Badge>
          </CardAction>
        </CardHeader>
      </>
    );
  };
  // render
  return (
    <DetailScaffold
      showDescription
      withBack
      ref={ref}
      className={cn("flex-1 h-full w-full", className)}
      trailing={<ActionGroup size="icon" />}
      title="Organization Details"
      description="View and edit the details of a particular organization"
      {...props}
    >
      <Card className="flex flex-1 h-full w-full">
        <CardContent className="flex-1 h-full w-full">
          <Content />
        </CardContent>
      </Card>
    </DetailScaffold>
  );
};
