'use client';
// imports
import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
// project
import { cn } from '@/lib/utils';
// components
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

type AboutScreenViewProps = {
  description?: React.ReactNode;
  title?: React.ReactNode;
  asChild?: boolean;
};

export const AboutScreenView: React.FC<
  Omit<React.ComponentPropsWithRef<'div'>, 'title' | 'children'> &
    AboutScreenViewProps
> = ({
  ref,
  className,
  description = 'A private company empowering the next generation of internet-based experiences',
  title = 'Scattered-Systems, LLC',
  asChild,
  ...props
}) => {
  const Comp = asChild ? Slot : 'div';
  return (
    <Comp
      ref={ref}
      className={cn(
        'relative flex flex-1 items-center justify-center w-full h-full',
        className
      )}
      {...props}
    >
      <Card className="flex flex-col w-full">
        <CardHeader>
          {title && (
            <CardTitle className="text-2xl tracking-tight">{title}</CardTitle>
          )}
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
        <CardContent className="flex flex-1 flex-wrap justify-start gap-4 lg:gap-6 w-full">
          <div className="flex flex-col flex-1 w-full gap-2">
            <h3 className="font-semibold text-lg tracking-tight">About Us</h3>
            <span className="text-sm font-normal">
              Scattered-Systems, LLC is a private company dedicated to
              revolutionizing the way we interact with technology. Our mission
              is to create innovative solutions that empower individuals and
              businesses alike.
            </span>
          </div>
          <div className="flex flex-col gap-2">
            <h3 className="font-semibold text-lg tracking-tight">Our Vision</h3>
            <span className="text-sm font-normal">
              We envision a world where technology seamlessly integrates into
              everyday life, enhancing productivity and creativity.
            </span>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end gap-4 lg:gap-6 w-full min-h-1/12">
          <CardAction className="inline-flex flex-nowrap items-center gap-2">
            <span>Author</span>
            <span>Joe McCain III</span>
          </CardAction>
        </CardFooter>
      </Card>
    </Comp>
  );
};
AboutScreenView.displayName = 'AboutScreenView';

export default AboutScreenView;
