/**
 * 2025-04-02
 * @author: @FL03
 * @file: back-button.tsx
 */
'use client';
// imports
import * as React from 'react';
import { ArrowLeftIcon, ArrowRightIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
// components
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

export const BackButton: React.FC<
  Omit<React.ComponentPropsWithRef<typeof Button>, 'children' | 'asChild'> & {
    description?: React.ReactNode;
    label?: React.ReactNode;
    orientation?: 'left' | 'right';
    showLabel?: boolean;
  }
> = ({
  ref,
  onClick,
  description = 'Return to the previous page',
  orientation = 'left',
  label = 'Back',
  size = 'icon',
  variant = 'ghost',
  showLabel = false,
  ...props
}) => {
  // Use the router to navigate back
  const router = useRouter();
  const Icon: React.FC<{ className?: string; size?: number }> = ({
    ...props
  }) => {
    switch (orientation) {
      case 'left':
        return <ArrowLeftIcon {...props} />;
      case 'right':
        return <ArrowRightIcon {...props} />;
      default:
        return <ArrowLeftIcon {...props} />;
    }
  };
  // return the back button with a tooltip
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            {...props}
            ref={ref}
            onClick={(event) => {
              // prevent the default action
              event.preventDefault();
              // if the onClick prop is provided, call it
              if (onClick) onClick(event);
              // otherwise use the router to go back
              else router.back();
            }}
            size={size}
            variant={variant}
          >
            <Icon className="h-8 w-8" />
            <span className={showLabel ? 'not-sr-only' : 'sr-only'}>
              {label}
            </span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>{description}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
BackButton.displayName = 'BackButton';

export default BackButton;
