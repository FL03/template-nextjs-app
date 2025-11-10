/**
 * Created At: 2025.11.05:09:04:18
 * @author - @FL03
 * @directory - src/features/shifts/widgets
 * @file - shift-commands.tsx
 */
"use client";
// imports
import * as React from "react";
import {
  CommandIcon,
  CopyIcon,
  MoreHorizontalIcon,
  RotateCwIcon,
} from "lucide-react";
import { toast } from "sonner";
import { ClassNames } from "@pzzld/core";
// project
import { cn, downloadAsCSV, downloadAsJSON } from "@/lib/utils";
import { useModal } from "@/hooks/use-modal";
// local
import { useWorkSchedule } from "../../providers";
// components
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandShortcut,
} from "@/components/ui/command";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Popover } from "@/components/ui/popover";

const ShiftsCommandList: React.FC<
  React.ComponentPropsWithRef<typeof CommandList> & {
    classNames?: ClassNames<"empty" | "item" | "group">;
  }
> = (
  {
    ref,
    classNames,
    ...props
  },
) => {
  const { data, reload } = useWorkSchedule();
  return (
    <CommandList ref={ref} {...props}>
      <CommandEmpty className={classNames?.emptyClassName}>
        <Empty>
          <EmptyMedia>
            <CommandIcon className="size-5" />
          </EmptyMedia>
          <EmptyHeader>
            <EmptyTitle>No results found</EmptyTitle>
            <EmptyDescription>
              Unable to find any content or commands related to your search.
              Please try again with different keywords.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      </CommandEmpty>
      <CommandGroup heading="Export">
        <CommandItem
          onSelect={() => {
            downloadAsCSV(data, "shifts-data.csv");
          }}
        >
          <span>Export CSV</span>
          <CommandShortcut>⌘⇧C</CommandShortcut>
        </CommandItem>
        <CommandItem
          onSelect={() => {
            downloadAsJSON(data, "shifts-data.json");
          }}
        >
          <span>Export JSON</span>
          <CommandShortcut>⌘⇧D</CommandShortcut>
        </CommandItem>
      </CommandGroup>
      <CommandGroup heading="Actions">
        <CommandItem onSelect={reload}>
          <span>Reload</span>
          <CommandShortcut>⌘⇧R</CommandShortcut>
        </CommandItem>
      </CommandGroup>
    </CommandList>
  );
};

export const ShiftCommandPopover: React.FC<
  React.ComponentPropsWithoutRef<typeof Popover> & {
    className?: string;
    classNames?: ClassNames<"list" | "input" | "empty" | "item" | "group">;
  }
> = (
  {
    className,
    classNames,
    ...props
  },
) => {
  return (
    <Popover {...props}>
      <Command
        className={cn("h-96 w-80 sm:w-96", className)}
      >
        <CommandInput
          className={cn(
            "border-b-0 px-3 pt-3 pb-2 focus:ring-0 focus:ring-offset-0",
            classNames?.inputClassName,
          )}
          placeholder="Type a command or search..."
        />
        <ShiftsCommandList
          className={classNames?.listClassName}
          classNames={classNames}
        />
      </Command>
    </Popover>
  );
};

export const ShiftCommandDialog: React.FC<
  React.ComponentPropsWithoutRef<typeof CommandDialog> & {
    classNames?: ClassNames<"empty" | "item" | "group" | "list">;
    kbdKey?: string;
  }
> = (
  {
    classNames,
    defaultOpen,
    open,
    onOpenChange,
    kbdKey = "k",
    ...props
  },
) => {
  const modal = useModal({ defaultOpen, open, onOpenChange });
  // create a callback to handle the keydown
  const handleKeyDown = React.useCallback((event: KeyboardEvent) => {
    if (event.key === kbdKey && (event.metaKey || event.ctrlKey)) {
      event.preventDefault();
      modal.toggle();
    }
  }, [kbdKey, modal]);
  // toggle the modal on some command
  React.useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);
  return (
    <CommandDialog
      open={modal.isOpen}
      onOpenChange={modal.setIsOpen}
      {...props}
    >
      <CommandInput />
      <ShiftsCommandList
        className={classNames?.listClassName}
        classNames={classNames}
      />
    </CommandDialog>
  );
};

const labels = [
  "feature",
  "bug",
  "enhancement",
  "documentation",
  "design",
  "question",
  "maintenance",
];

export const ShiftCommandDropdownMenu: React.FC<
  Omit<React.ComponentPropsWithoutRef<typeof DropdownMenu>, "children"> & {
    label?: string;
    classNames?: ClassNames<"content" | "icon" | "label" | "trigger">;
    alignContent?: React.ComponentProps<typeof DropdownMenuContent>["align"];
    contentSide?: React.ComponentProps<typeof DropdownMenuContent>["side"];
    triggerSize?: React.ComponentProps<typeof Button>["size"];
    triggerVariant?: React.ComponentProps<typeof Button>["variant"];
  }
> = (
  {
    label = "Commands",
    classNames,
    alignContent = "start",
    contentSide = "right",
    triggerSize = "icon",
    triggerVariant = "outline",
    ...props
  },
) => {
  const { data, ...schedule } = useWorkSchedule();

  return (
    <DropdownMenu {...props}>
      <DropdownMenuTrigger asChild>
        <Button
          variant={triggerVariant}
          size={triggerSize}
          className={cn(classNames?.triggerClassName)}
        >
          <MoreHorizontalIcon
            className={cn("size-4", classNames?.iconClassName)}
          />
          <span
            className={cn(
              triggerSize?.startsWith("icon") ? "sr-only" : "not-sr-only",
              classNames?.labelClassName,
            )}
          >
            Open menu
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align={alignContent}
        side={contentSide}
        className="w-xs"
      >
        <DropdownMenuGroup>
          <DropdownMenuLabel>Export</DropdownMenuLabel>
          <DropdownMenuItem
            disabled={!data}
            onClick={() => {
              toast.info("Preparing JSON export...", {
                id: "export-shifts-json",
                duration: 3000,
              });
              downloadAsJSON(data, "shifts-data.json");
            }}
          >
            Export JSON
          </DropdownMenuItem>
          <DropdownMenuItem
            disabled={!data}
            onClick={() => (
              downloadAsCSV(data, "shifts-data.csv")
            )}
          >
            Export CSV
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuGroup>
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem
            onClick={(event) => {
              // cleanup the event
              event.preventDefault();
              event.stopPropagation();
              // copy shifts data
              toast.promise(
                navigator.clipboard.writeText(
                  JSON.stringify(data, undefined, 2),
                ),
                {
                  loading: "Copying shifts data to clipboard...",
                  success: "Shifts data copied to clipboard!",
                  error: "Failed to copy shifts data.",
                },
              );
            }}
          >
            <CopyIcon className="size-4" />
            <span>Copy</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            disabled={schedule.state.isReloading}
            onClick={schedule.reload}
          >
            <RotateCwIcon className="size-4" />
            <span>Reload Shifts</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
