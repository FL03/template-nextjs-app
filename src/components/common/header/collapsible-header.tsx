/**
 * Created At: 2025.07.12:13:43:00
 * @author - @FL03
 * @file - dashboard-header.tsx
 */
'use client';
// imports
import * as React from 'react';
import { ChevronDownIcon, ChevronUpIcon } from 'lucide-react';
// project
import { logger } from '@/lib/logger';
import { cn } from '@/lib/utils';
import { TextSize } from '@/types';
// components
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';


type HeaderClassNames = {
  leadingClassName?: string;
  trailingClassName?: string;
  titleClassName?: string;
  descriptionClassName?: string;
};

type HeaderProps = {
  classNames?: HeaderClassNames;
  leading?: React.ReactNode;
  trailing?: React.ReactNode;
  title?: React.ReactNode;
  titleSize?: TextSize;
  description?: React.ReactNode;
  descriptionSize?: TextSize;
  asChild?: boolean;
};


export const CollapsibleHeader: React.FC<
  React.PropsWithChildren<Omit<HeaderProps, 'asChild'>> & {
    className?: string;
    open?: boolean;
    defaultOpen?: boolean;
    onOpenChange?: (open: boolean) => void;
  }
> = ({
  children,
  className,
  trailing,
  open,
  defaultOpen = false,
  onOpenChange,
  ...props
}) => {
  const [isOpen, setIsOpen] = React.useState(defaultOpen);
  // use a Slot component as a fallback whenever asChild is true

  const handleOpenChange = React.useCallback(
    (open: boolean) => {
      if (open) logger.trace('Opening dashboard header');
      else logger.trace('Closing dashboard header');
      // update the internal state
      setIsOpen(open);
      // if passed, call the onOpenChange callback
      if (onOpenChange) onOpenChange(open);
    },
    [onOpenChange, setIsOpen]
  );
  // ensure any changes to the external open prop are reflected in the internal state
  React.useEffect(() => {
    if (open !== undefined) {
      setIsOpen(open);
    }
  }, [open]);

  const renderTrailing = (c?: React.ReactNode) => {
    return (
      <div className="inline-flex flex-nowrap items-center justify-end gap-2 right-0 ml-auto">
        {c}
        <CollapsibleTrigger className="ml-auto">
          <span className="sr-only">Toggle Header</span>
          {isOpen ? (
            <ChevronUpIcon className="h-4 w-4" />
          ) : (
            <ChevronDownIcon className="h-4 w-4" />
          )}
        </CollapsibleTrigger>
      </div>
    );
  };

  // render the header component
  return (
    <Collapsible
      className={cn(
        'flex flex-nowrap items-center w-full gap-2 lg:gap-4',
        'border-b border-muted pb-2 lg:pb-4',
        className
      )}
      open={isOpen}
      onOpenChange={handleOpenChange}
    >
      
      <CollapsibleContent>
      {children}
      </CollapsibleContent>
    </Collapsible>
  );
};
CollapsibleHeader.displayName = 'CollapsibleHeader';

export default CollapsibleHeader;