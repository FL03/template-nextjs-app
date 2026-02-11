// error-card.tsx
'use client';
// imports
import * as React from 'react';
// project
import { logger } from '@/lib/logger';
import { cn } from '@/lib/utils';
// components
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ButtonGroup, ButtonGroupText } from '@/components/ui/button-group';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

/**
 * A simple component to display an error card with a title, description, and message.
 */
export const ErrorCard: React.FC<
  Omit<React.ComponentPropsWithRef<typeof Card>, 'title'> &
    React.PropsWithChildren<{
      description?: React.ReactNode;
      title?: React.ReactNode;
      status?: string | number;
      reset?(): void;
    }>
> = ({
  ref,
  children,
  className,
  status = 500,
  title = 'Error',
  reset,
  ...props
}) => (
  <Card
    {...props}
    ref={ref}
    className={cn('flex flex-1 flex-col h-full w-full', className)}
  >
    <CardContent className='flex-1 h-full w-full'>
      <CardHeader>
        <CardTitle className='text-xl leading-none tracking-tight'>
          {title}
        </CardTitle>
        <CardAction>
          <ButtonGroup>
            <Button onClick={reset} disabled={!reset} variant='outline'>
              Reset
            </Button>
            <ButtonGroupText className='text-sm'>
              {typeof status === 'number' ? `HTTP ${status}` : status}
            </ButtonGroupText>
          </ButtonGroup>
        </CardAction>
      </CardHeader>
      <CardFooter>
        {children && <CardDescription>{children}</CardDescription>}
      </CardFooter>
    </CardContent>
  </Card>
);

/** A custom error boundary */
export class ErrorBoundary extends React.PureComponent<
  React.PropsWithChildren<{}>,
  { hasError: boolean }
> {
  state = { hasError: false };

  static getDerivedStateFromError(err: any) {
    const error = err instanceof Error ? err : new Error(String(err));
    logger.error(error, `[ErrorBoundary] Uncaught error: ${error.message}`);
    return { hasError: true };
  }

  componentDidCatch(error: any, errorInfo: any) {
    logger.error(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className='flex flex-col flex-1 w-full min-h-full'>
          <div className='flex flex-col w-full'>
            <h2 className='text-xl font-semibold leading-none tracking-tight'>
              Error
            </h2>
            <span className='leading-none tracking-tight text-muted-foreground'>
              Something went wrong.
            </span>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
