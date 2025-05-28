/**
 * Created At: 2025.05.16:08:05:33
 * @author - @FL03
 * @file - portfolio-card.tsx
 */
'use client';
// imports
import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
// project
import { cn } from '@/lib/utils';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

type WidgetProps = {
  asChild?: boolean;
  description?: React.ReactNode;
  title?: React.ReactNode;
};

/** A modern view of the user's digital assets */
export const PortfolioCard: React.FC<
  Omit<React.ComponentPropsWithRef<typeof Card>, 'title'> & WidgetProps
> = ({
  ref,
  children,
  className,
  description,
  title = 'Portfolio',
  asChild,
  ...props
}) => {
  // handle the asChild state using a Slot component
  const Comp = asChild ? Slot : Card;
  // render the component
  return (
    <Comp
      {...props}
      ref={ref}
      className={cn('relative flex flex-col flex-1 w-full', className)}
    >
      <CardHeader>
        <CardTitle className="text-xl font-semibold">{title}</CardTitle>
        {description && (
          <CardDescription className="text-sm text-muted-foreground">
            {description}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Comp>
  );
};
PortfolioCard.displayName = 'PortfolioCard';

export default PortfolioCard;
