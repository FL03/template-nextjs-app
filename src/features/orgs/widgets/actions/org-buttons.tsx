/**
 * Created At: 2025.11.08:10:25:27
 * @author - @FL03
 * @directory - src/features/orgs/widgets/actions
 * @file - org-buttons.tsx
 */
'use client';
import * as React from 'react';
import { EditIcon, Trash2Icon, ViewIcon } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import { ClassNames } from '@pzzld/core';
// project
import { cn } from '@/lib/utils';
// local
import { deleteOrganization } from '../../utils';
// components
import { IconButton } from '@/components/common/button';
import { Button } from '@/components/ui/button';

type ActionButtonProps<T = {}> = T &
  Omit<
    React.ComponentPropsWithRef<typeof Button>,
    'asChild' | 'children' | 'onClick' | 'title'
  > & {
    classNames?: ClassNames<'icon' | 'label'>;
    itemId?: string;
  };

export const DeleteOrganizationButton: React.FC<
  ActionButtonProps<{ label?: string }>
> = ({
  ref,
  className,
  itemId,
  label = 'Delete',
  variant = 'destructive',
  classNames: { labelClassName, iconClassName } = {},
  ...props
}) => (
  <IconButton
    {...props}
    ref={ref}
    className={cn('w-full', className)}
    classNames={{ labelClassName }}
    label={label}
    variant={variant}
    onClick={(event) => {
      // cleanup the event
      event.preventDefault();
      event.stopPropagation();
      // delete the organization
      toast.promise(deleteOrganization(itemId), {
        loading: 'Deleting organization...',
        success: 'Organization deleted.',
        error: 'Failed to delete organization.',
      });
    }}
  >
    <Trash2Icon className={cn('size-4', iconClassName)} />
  </IconButton>
);

export const OrganizationLinkButton: React.FC<
  ActionButtonProps<{ mode?: string }>
> = ({
  ref,
  className,
  classNames,
  itemId,
  size,
  mode = 'edit',
  variant = 'link',
  ...props
}) => {
  const isEdit = React.useMemo(() => mode.match(/(:?edit|update)/gim), [mode]);
  return (
    <Button
      asChild
      ref={ref}
      className={cn('w-full', className)}
      size={size}
      variant={variant}
      {...props}
    >
      <Link
        href={{
          pathname: `/organizations/${itemId}`,
          query: {
            mode,
          },
        }}
      >
        {isEdit ? (
          <EditIcon className={cn('size-4', classNames?.iconClassName)} />
        ) : (
          <ViewIcon className={cn('size-4', classNames?.iconClassName)} />
        )}
        <span
          className={cn(
            size?.startsWith('icon') ? 'sr-only' : 'not-sr-only',
            classNames?.labelClassName,
          )}
        >
          {isEdit ? 'Edit' : 'View'}
        </span>
      </Link>
    </Button>
  );
};
