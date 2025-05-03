'use client';
// imports
import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
// components
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

type ScreenProps = {
  asChild?: boolean;
  description?: React.ReactNode;
  title?: React.ReactNode;
  footer?: React.ReactNode;
};
export const BlogScreenView: React.FC<
  React.PropsWithChildren<Omit<React.ComponentPropsWithRef<'div'>, 'title'>> &
    ScreenProps
> = ({
  ref,
  className,
  children,
  description,
  footer,
  title,
  asChild,
  ...props
}) => {
  const Comp = asChild ? Slot : 'div';

  return (
    <Comp {...props} ref={ref} className={className}>
      <Card className="flex flex-col flex-1 w-full gap-2">
        <CardHeader className="flex flex-nowrap items-start gap-2">
          <div className="flex flex-col mr-auto">
            <CardTitle className="text-2xl font-bold tracking-tight">
              {title}
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              {description}
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col flex-1 w-full h-full gap-2">
          {children}
        </CardContent>
        {footer && (
          <CardFooter className="flex flex-nowrap items-center justify-start w-full px-2 py-1 text-sm text-muted-foreground">
            {footer}
          </CardFooter>
        )}
      </Card>
    </Comp>
  );
};
BlogScreenView.displayName = 'BlogScreen';

export default BlogScreenView;
