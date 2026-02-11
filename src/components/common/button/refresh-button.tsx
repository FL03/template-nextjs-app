/**
 * 2025-04-01
 * @author: @FL03
 * @description: a refresh button component that can be used to refresh the page or a specific component.
 * @file: refresh-button.tsx
 */
'use client';
// imports
import * as React from 'react';
import { RefreshCwIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { ClassNames } from '@pzzld/core';
// project
import { logger } from '@/lib/logger';
import { cn } from '@/lib/utils';
// components
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

type ButtonProps = {
  classNames?: ClassNames<'icon' | 'label'>;
  description?: React.ReactNode;
  disabled?: boolean;
  isRefreshing?: boolean;
  onRefresh?(): void;
  onRefreshChange?(refreshing: boolean): void;
};

export const RefreshButton: React.FC<
  Omit<React.ComponentPropsWithRef<typeof Button>, 'children'> & ButtonProps
> = ({
  ref,
  classNames,
  description = 'Refresh the content',
  size = 'icon',
  variant = 'ghost',
  disabled,
  isRefreshing,
  onClick,
  onRefresh,
  onRefreshChange,
  ...props
}) => {
  const [reloading, setIsReloading] = React.useState<boolean>(
    Boolean(isRefreshing),
  );
  const router = useRouter();
  if (onClick && onRefresh) {
    logger.warn(
      'RefreshButton: both onClick and onRefresh props are provided, onClick will be ignored',
    );
  }

  // handle the refresh change event
  const handleRefreshChange = (refreshing: boolean) => {
    setIsReloading((prev) => {
      if (prev === refreshing) return prev;
      if (onRefreshChange) onRefreshChange(refreshing);
      return refreshing;
    });
  };
  // handle the refresh action
  const handleOnClick = (): React.MouseEventHandler<HTMLButtonElement> => {
    // return the click handler
    return async (event) => {
      if (!reloading) setIsReloading(true);
      // cleanup the event
      event.preventDefault();
      event.stopPropagation();
      // log the event
      logger.trace(event, 'Refreshing...');
      try {
        if (onRefresh) onRefresh();
        else if (onClick) onClick(event);
        else router.refresh();
      } finally {
        // set the refreshing state to true
        handleRefreshChange(false);
      }
    };
  };
  // synchronize the internal state with the external prop
  React.useEffect(() => {
    if (isRefreshing !== undefined && isRefreshing !== reloading) {
      setIsReloading(isRefreshing);
    }
  }, [isRefreshing, reloading]);

  // render the component
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            {...props}
            ref={ref}
            data-slot='refresh-button'
            disabled={disabled || isRefreshing}
            onClick={handleOnClick()}
            size={size}
            variant={variant}
          >
            <RefreshCwIcon
              className={cn(
                'size-4',
                reloading && 'animate-spin',
                classNames?.iconClassName,
              )}
            />
            <span
              className={cn(
                size?.startsWith('icon') ? 'sr-only' : 'not-sr-only',
                classNames?.labelClassName,
                reloading && 'animate-pulse',
              )}
            >
              {reloading ? 'Refreshing' : 'Refresh'}
            </span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>{description}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
RefreshButton.displayName = 'RefreshButton';
