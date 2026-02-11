/**
 * Created At: 2025.09.14:13:46:56
 * @author - @FL03
 * @file - shift-info.tsx
 */
'use client';
// imports
import * as React from 'react';
import { EditIcon, XIcon } from 'lucide-react';
// project
import { useCurrentUser } from '@/features/auth';
import { cn } from '@/lib/utils';
// local
import { ShiftItemContextMenu, ShiftItemDropdownMenu } from './actions';
import { ShiftForm } from './shift-form';
import { ShiftTips } from './shift-tips';
// components
import { IconButton } from '@/components/common/button';
import { DetailScaffold } from '@/components/common/details';
import { Badge } from '@/components/ui/badge';
import { ButtonGroup } from '@/components/ui/button-group';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';
import { useWorkShift } from '../providers';

type ShiftDetailsProps = {
  defaultMode?: string;
  mode?: string;
  shiftId?: string;
  username?: string;
  readonly?: boolean;
};

export const ShiftDetails: React.FC<
  Omit<
    React.ComponentProps<typeof DetailScaffold>,
    'children' | 'id' | 'trailing'
  > &
    ShiftDetailsProps
> = ({
  className,
  readonly,
  shiftId,
  defaultMode = 'read',
  mode: modeProp,
  ...props
}) => {
  const [currentMode, setCurrentMode] = React.useState<string>(defaultMode);
  const isEditing = React.useMemo(
    () => currentMode.match(/^(edit|update|updating)/gim),
    [currentMode],
  );
  // use the hook to get a reference to the username
  const { username } = useCurrentUser();
  const {
    data,
    state: { isLoading },
  } = useWorkShift();
  // determine if the user is assigned to the shift
  const isAssigned = React.useMemo(
    () => data?.assignee === username,
    [data, username],
  );

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
        size='icon'
        variant='outline'
        disabled={readonly}
        label={isEditing ? 'Close' : 'Edit'}
        onClick={(event) => {
          event.preventDefault();
          event.stopPropagation();
          // switch to form view
          setCurrentMode((prev) => (prev === 'read' ? 'update' : 'read'));
        }}
      >
        {isEditing ? (
          <XIcon className='size-4' />
        ) : (
          <EditIcon className='size-4' />
        )}
      </IconButton>
      <ShiftItemDropdownMenu item={data} triggerVariant='outline' />
    </ButtonGroup>
  );

  const Content = () => {
    if (isLoading) {
      return (
        <Empty>
          <EmptyHeader>
            <EmptyMedia>
              <Spinner className='size-8' />
            </EmptyMedia>
            <EmptyTitle className='animate-pulse'>Loading...</EmptyTitle>
          </EmptyHeader>
        </Empty>
      );
    }
    if (!data && !isLoading) {
      return (
        <Empty>
          <EmptyHeader>
            <EmptyMedia>
              <EditIcon className='size-8' />
            </EmptyMedia>
            <EmptyTitle>No Data</EmptyTitle>
            <EmptyDescription className='text-center'>
              No data available for this shift.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      );
    }
    if (showForm) {
      return <ShiftForm isEditing defaultValues={data} />;
    }
    return (
      <>
        <CardHeader>
          <CardTitle className='text-lg'>
            {new Date(data?.date).toLocaleDateString('en-us', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
              timeZone: 'UTC',
            })}
          </CardTitle>
          <CardDescription></CardDescription>
          <CardAction>
            <Badge variant='outline'>
              {isAssigned ? 'Assigned' : 'Unassigned'}
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className='flex flex-col flex-1 h-full w-full'>
          <ShiftTips value={data} />
        </CardFooter>
      </>
    );
  };
  // render the shift details
  return (
    <ShiftItemContextMenu itemId={shiftId}>
      <DetailScaffold
        showDescription
        withBack
        id={shiftId}
        title='Shift Details'
        description='View and edit the details of a particular shift'
        trailing={<ActionGroup />}
        {...props}
      >
        <Card className={cn('flex flex-1 h-full w-full', className)}>
          <CardContent className='flex-1 h-full w-full'>
            <Content />
          </CardContent>
        </Card>
      </DetailScaffold>
    </ShiftItemContextMenu>
  );
};
ShiftDetails.displayName = 'ShiftDetails';
