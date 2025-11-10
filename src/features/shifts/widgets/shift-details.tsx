/**
 * Created At: 2025.09.14:13:46:56
 * @author - @FL03
 * @file - shift-info.tsx
 */
"use client";
// imports
import * as React from "react";
import { Edit2Icon, FileOutputIcon, TrashIcon, XIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
// project
import { useCurrentUser } from "@/features/auth";
import { cn, downloadAsJSON } from "@/lib/utils";
// local
import { ShiftContextMenu } from "./actions";
import { ShiftForm } from "./shift-form";
import { TipTile } from "./shift-tips";
// components
import { IconButton } from "@/components/common/button";
import { DetailScaffold } from "@/components/common/details";
import { Badge } from "@/components/ui/badge";
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
import { ItemGroup, ItemSeparator } from "@/components/ui/item";
import { Spinner } from "@/components/ui/spinner";
import {
  Empty,
  EmptyContent,
  EmptyHeader,
  EmptyTitle,
} from "@/components/ui/empty";
import { useWorkShift } from "../providers";

type ShiftDetailsProps = {
  defaultMode?: string;
  mode?: string;
  shiftId?: string;
  username?: string;
  readonly?: boolean;
};

export const ShiftDetails: React.FC<
  & Omit<
    React.ComponentProps<typeof DetailScaffold>,
    "children" | "id" | "trailing"
  >
  & ShiftDetailsProps
> = (
  {
    className,
    readonly,
    shiftId,
    defaultMode = "read",
    mode: modeProp,
    ...props
  },
) => {
  const [currentMode, setCurrentMode] = React.useState<string>(defaultMode);
  const isEditing = React.useMemo(
    () =>
      ["edit", "editing", "update", "updating"].includes(
        currentMode.toLowerCase(),
      ),
    [
      currentMode,
    ],
  );
  // use the hook to get a reference to the username
  const { username } = useCurrentUser();
  const { data, error, state: { isLoading }, ...shift } = useWorkShift();
  // create a reference to the router
  const router = useRouter();
  // determine if the user is assigned to the shift
  const isAssigned = React.useMemo(() => data?.assignee === username, [
    data,
    username,
  ]);

  React.useEffect(() => {
    if (modeProp && modeProp !== currentMode) setCurrentMode(modeProp);
  }, [currentMode, modeProp]);

  // returns true if the form can and should be shown
  const showForm = React.useMemo(
    () => isAssigned && !readonly && isEditing,
    [isAssigned, isEditing, readonly],
  );

  if (!data) return null;

  const ActionGroup = () => (
    <ButtonGroup>
      <IconButton
        size="icon"
        variant="outline"
        disabled={readonly}
        label={isEditing ? "Close" : "Edit"}
        onClick={(event) => {
          event.preventDefault();
          event.stopPropagation();
          // switch to form view
          setCurrentMode((prev) => (prev === "read" ? "update" : "read"));
        }}
      >
        {isEditing
          ? <XIcon className="size-4" />
          : <Edit2Icon className="size-4" />}
      </IconButton>
      <IconButton
        size="icon"
        variant="outline"
        label="Export"
        onClick={() => {
          downloadAsJSON(data, `shift-${shiftId}.json`);
        }}
      >
        <FileOutputIcon className="size-4" />
      </IconButton>
      <IconButton
        label="Delete"
        size="icon"
        variant="destructive"
        onClick={async () => {
          // notify the user
          toast.promise(
            shift.delete().then(() => {
              router.back();
            }),
            {
              loading: "Deleting shift...",
              success: "Successfully deleted shift",
              error: "Error deleting shift",
            },
          );
        }}
      >
        <TrashIcon className="size-4" />
      </IconButton>
    </ButtonGroup>
  );

  const Content = () => {
    if (isLoading) {
      return (
        <div className="flex flex-1 h-full w-full items-center justify-center">
          <div className="inline-flex flex-nowrap items-center m-auto gap-2">
            <Spinner className="size-7" />
            <span className="animate-pulse">Loading...</span>
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
            No data available for this shift.
          </EmptyContent>
        </Empty>
      );
    }
    if (showForm) {
      return (
        <ShiftForm
          isEditing
          defaultValues={data}
        />
      );
    }
    const { tips_cash, tips_credit } = data;
    return (
      <>
        <CardHeader>
          <CardTitle className="text-lg">
            {new Date(data?.date).toLocaleDateString("en-us", {
              year: "numeric",
              month: "short",
              day: "numeric",
              timeZone: "UTC",
            })}
          </CardTitle>
          <CardDescription>
          </CardDescription>
          <CardAction>
            <Badge variant="outline">
              {isAssigned ? "Assigned" : "Unassigned"}
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex flex-col flex-1 h-full w-full">
          <ItemGroup className="w-full">
            <TipTile label="Cash" value={tips_cash} />
            <TipTile label="Credit" value={tips_credit} />
            <ItemSeparator />
            <TipTile label="Total tips" value={tips_cash + tips_credit} />
          </ItemGroup>
        </CardFooter>
      </>
    );
  };
  // render the shift details
  return (
    <ShiftContextMenu itemId={shiftId}>
      <DetailScaffold
        showDescription
        withBack
        id={shiftId}
        title="Shift Details"
        description="View and edit the details of a particular shift"
        trailing={<ActionGroup />}
        {...props}
      >
        <Card
          className={cn("flex flex-1 h-full w-full", className)}
        >
          <CardContent className="flex-1 h-full w-full">
            <Content />
          </CardContent>
        </Card>
      </DetailScaffold>
    </ShiftContextMenu>
  );
};
ShiftDetails.displayName = "ShiftDetails";

export default ShiftDetails;
