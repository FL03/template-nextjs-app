/**
 * Created At: 2025.09.16:09:52:33
 * @author - @FL03
 * @directory - src/features/shifts/widgets
 * @file - shift-calendar-modal.tsx
 */
'use client';
// imports
import * as React from 'react';
import { XIcon } from 'lucide-react';
// project
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
// local
import { DeleteShiftButton, ShiftLinkButton } from '../actions';
import { ShiftTips } from '../shift-tips';
import type { ShiftData } from '../../types';
// components
import { Button } from '@/components/ui/button';
import { ButtonGroup } from '@/components/ui/button-group';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';

const ShiftInfoDialog: React.FC<
  React.ComponentPropsWithoutRef<typeof Dialog> &
    React.PropsWithChildren<{ className?: string; value?: ShiftData | null }>
> = ({ children, className, value, ...props }) => (
  <Dialog {...props}>
    {children && <DialogTrigger asChild>{children}</DialogTrigger>}
    <DialogContent>
      <DialogHeader>
        <DialogTitle>
          {value
            ? new Date(value?.date).toLocaleDateString('en-us', {
                timeZone: 'UTC',
              })
            : 'Shift'}
        </DialogTitle>
        <DialogDescription>
          View the earned tips for this shift.
        </DialogDescription>
      </DialogHeader>
      <div
        className={cn(
          'flex flex-1 flex-col h-full w-full gap-2 overflow-y-auto',
          className,
        )}
      >
        <ShiftTips value={value ?? undefined} />
        <DialogFooter className='w-full'>
          <ButtonGroup className='justify-center w-full'>
            <ShiftLinkButton itemId={value?.id} />
            <DeleteShiftButton itemId={value?.id} />
          </ButtonGroup>
        </DialogFooter>
      </div>
    </DialogContent>
  </Dialog>
);

const ShiftInfoDrawer: React.FC<
  React.ComponentPropsWithoutRef<typeof Drawer> & {
    className?: string;
    value?: ShiftData | null;
  }
> = ({ children, className, value, ...props }) => (
  <Drawer {...props}>
    {children && <DrawerTrigger asChild>{children}</DrawerTrigger>}
    <DrawerContent>
      <DrawerHeader>
        <DrawerTitle>
          {value
            ? new Date(value.date).toLocaleDateString('en-us', {
                timeZone: 'UTC',
              })
            : 'Shift'}
        </DrawerTitle>
        <DrawerDescription>
          View the earned tips for this day.
        </DrawerDescription>
      </DrawerHeader>
      <div
        className={cn(
          'flex flex-1 flex-col h-full w-full gap-2 overflow-y-auto',
          className,
        )}
      >
        <ShiftTips value={value ?? undefined} />
        <ButtonGroup orientation='vertical' className='w-full'>
          <ShiftLinkButton itemId={value?.id} />
          <DeleteShiftButton itemId={value?.id} />
        </ButtonGroup>
        <DrawerFooter>
          <DrawerClose asChild>
            <Button variant='secondary'>
              <XIcon className='size-4' />
              <span>Close</span>
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </div>
    </DrawerContent>
  </Drawer>
);

export const ShiftInfoModal: React.FC<
  React.PropsWithChildren<{
    className?: string;
    value?: ShiftData | null;
    open?: boolean;
    defaultOpen?: boolean;
    onOpenChange?(open: boolean): void;
  }>
> = ({ value, ...props }) => {
  const isMobile = useIsMobile();
  if (!value) return null;

  if (isMobile) {
    return <ShiftInfoDrawer {...props} value={value} />;
  } else {
    return <ShiftInfoDialog {...props} value={value} />;
  }
};
