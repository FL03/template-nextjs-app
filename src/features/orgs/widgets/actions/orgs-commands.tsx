/**
 * Created At: 2025.10.22:21:15:21
 * @author - @FL03
 * @directory - src/features/orgs/widgets
 * @file - org-actions.tsx
 */
'use client';
// imports
import React from 'react';
import {
  CommandIcon,
  EditIcon,
  FileSpreadsheetIcon,
  MoreVerticalIcon,
  RotateCwIcon,
} from 'lucide-react';
import { toast } from 'sonner';
import { ClassNames, downloadAsCSV, downloadAsJSON } from '@pzzld/core';
// project
import { useModal } from '@/hooks/use-modal';
import { logger } from '@/lib/logger';
import { cn } from '@/lib/utils';
// local
import { useOrganizations } from '../../provider';
// components
import { IconButton } from '@/components/common/button';
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandShortcut,
} from '@/components/ui/command';
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Popover } from '@/components/ui/popover';

const OrgCommandList: React.FC<
  React.ComponentPropsWithRef<typeof CommandList> & {
    classNames?: ClassNames<'list' | 'empty' | 'item' | 'group'>;
  }
> = ({ ref, children, className, classNames, ...props }) => {
  const { data, reload } = useOrganizations();
  return (
    <CommandList ref={ref} className={cn('w-full', className)} {...props}>
      <CommandEmpty>
        <Empty className={classNames?.emptyClassName}>
          <EmptyHeader>
            <EmptyMedia>
              <CommandIcon className='size-8' />
            </EmptyMedia>
            <EmptyTitle>No Organizations Found</EmptyTitle>
            <EmptyDescription>
              You have not created any organizations yet. Create an organization
              to get started.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      </CommandEmpty>
      <CommandGroup heading='Actions'>
        <CommandItem
          onSelect={async () => {
            // wrap the callback with a toast
            return toast.promise(reload(), {
              loading: 'Reloading...',
              error: 'Failed to reload; try again later.',
              success: 'Reloaded successfully.',
            });
          }}
        >
          <RotateCwIcon className='size-4' />
          <span>Reload</span>
          <CommandShortcut>⌘⇧R</CommandShortcut>
        </CommandItem>
      </CommandGroup>
      <CommandGroup heading='Export'>
        <CommandItem
          onClick={(event) => {
            // clean the event
            event.preventDefault();
            event.stopPropagation();
            // handle the download
            downloadAsJSON(
              data,
              `organizations-export-<${new Date().toISOString()}>.json`,
            );
          }}
        >
          <EditIcon className='size-4' />
          <span>Export JSON</span>
          <CommandShortcut>⌘⇧J</CommandShortcut>
        </CommandItem>
        <CommandItem
          onClick={(event) => {
            // clean the event
            event.preventDefault();
            event.stopPropagation();
            // handle the download
            downloadAsCSV(
              data,
              `organizations-export-<${new Date().toISOString()}>.csv`,
            );
          }}
        >
          <FileSpreadsheetIcon className='size-4' />
          <span>Export CSV</span>
          <CommandShortcut>⌘⇧C</CommandShortcut>
        </CommandItem>
      </CommandGroup>
    </CommandList>
  );
};

const OrganizationsCommandDialog: React.FC<
  Omit<React.ComponentPropsWithRef<typeof CommandDialog>, 'children'> & {
    kbdTrigger?: string;
    defaultOpen?: boolean;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
  }
> = ({ defaultOpen, open, onOpenChange, kbdTrigger = 'k', ...props }) => {
  const modal = useModal({ defaultOpen, open, onOpenChange });
  // create a callback to handle the keydown
  const handleKeyDown = React.useCallback(
    (event: KeyboardEvent) => {
      if (event.key === kbdTrigger && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        modal.toggle();
      }
    },
    [kbdTrigger, modal],
  );
  // toggle the modal on some command
  React.useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
  return (
    <CommandDialog {...props}>
      <CommandInput placeholder='Organizations... ⌘K' />
      <OrgCommandList />
    </CommandDialog>
  );
};

const OrganizationsCommandPopover: React.FC<
  React.ComponentPropsWithoutRef<typeof Popover> & {
    className?: string;
    classNames?: ClassNames<'list' | 'input' | 'empty' | 'item' | 'group'>;
  }
> = ({ className, classNames, ...props }) => (
  <Popover {...props}>
    <Command className={cn('h-96 w-80 sm:w-96', className)}>
      <CommandInput
        className={cn(
          'border-b-0 px-3 pt-3 pb-2 focus:ring-0 focus:ring-offset-0',
          classNames?.inputClassName,
        )}
        placeholder='Type a command or search...'
      />
      <OrgCommandList
        className={classNames?.listClassName}
        classNames={classNames}
      />
    </Command>
  </Popover>
);

const OrganizationsDropdownMenu: React.FC<
  React.ComponentPropsWithoutRef<typeof DropdownMenu> & {
    itemId?: string;
    classNames?: ClassNames<'content' | 'icon' | 'label' | 'trigger'>;
    alignContent?: React.ComponentProps<typeof DropdownMenuContent>['align'];
    contentSide?: React.ComponentProps<typeof DropdownMenuContent>['side'];
    triggerSize?: React.ComponentProps<typeof IconButton>['size'];
    triggerVariant?: React.ComponentProps<typeof IconButton>['variant'];
  }
> = ({
  classNames,
  itemId,
  alignContent = 'start',
  contentSide = 'bottom',
  dir = 'ltr',
  triggerSize = 'icon',
  triggerVariant = 'outline',
  ...props
}) => {
  const { data, reload } = useOrganizations();
  return (
    <DropdownMenu dir={dir} {...props}>
      <DropdownMenuTrigger asChild>
        <IconButton
          label='More'
          size={triggerSize}
          variant={triggerVariant}
          className={classNames?.triggerClassName}
          classNames={{ labelClassName: classNames?.labelClassName }}
        >
          <MoreVerticalIcon
            className={cn('size-4', classNames?.iconClassName)}
          />
        </IconButton>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className='w-64'
        align={alignContent}
        side={contentSide}
      >
        <DropdownMenuGroup>
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
              if (!itemId) {
                return logger.error(
                  'No organization ID passed to the delete button.',
                );
              }
              // wrap the callback with a toast
              return toast.promise(reload(), {
                loading: 'Reloading...',
                error: 'Failed to reload; try again later.',
                success: 'Reloaded successfully.',
              });
            }}
          >
            <RotateCwIcon className='size-4' />
            <span>Reload</span>
            <DropdownMenuShortcut>⌘⇧R</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuGroup>
          <DropdownMenuLabel>Export</DropdownMenuLabel>
          <DropdownMenuItem
            onClick={(event) => {
              // clean the event
              event.preventDefault();
              event.stopPropagation();
              // handle the download
              downloadAsJSON(
                data,
                `organizations-export-<${new Date().toISOString()}>.json`,
              );
            }}
          >
            <EditIcon className='size-4' />
            <span>Export JSON</span>
            <DropdownMenuShortcut>⌘⇧J</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={(event) => {
              // clean the event
              event.preventDefault();
              event.stopPropagation();
              // handle the download
              downloadAsCSV(
                data,
                `organizations-export-<${new Date().toISOString()}>.csv`,
              );
            }}
          >
            <FileSpreadsheetIcon className='size-4' />
            <span>Export CSV</span>
            <DropdownMenuShortcut>⌘⇧C</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
OrganizationsDropdownMenu.displayName = 'OrganizationsDropdownMenu';

export {
  OrganizationsCommandDialog,
  OrganizationsCommandPopover,
  OrganizationsDropdownMenu,
};
