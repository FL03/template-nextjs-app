/**
 * Created At: 2025.07.05:08:39:48
 * @author - @FL03
 * @file - landing-screen.tsx
 */
'use client';
// imports
import * as React from 'react';
import Link from 'next/link';
import { Slot } from '@radix-ui/react-slot';
// project
import { cn } from '@/lib/utils';
import { ContentHead } from '@/components/common/headers';
import { Button } from '@/components/ui/button';

type LandingScreenProps = {
  description?: React.ReactNode;
  title?: React.ReactNode;
  asChild?: boolean;
};

export const LandingScreen: React.FC<
  Omit<React.ComponentPropsWithRef<'section'>, 'title' | 'children'> &
    LandingScreenProps
> = ({
  ref,
  className,
  description = 'Welcome to my portfolio!',
  title = 'Puzzled',
  asChild,
  ...props
}) => {
  const Comp = asChild ? Slot : 'section';
  return (
    <Comp
      ref={ref}
      className={cn(
        'relative flex flex-1 items-center w-full h-full',
        className
      )}
      {...props}
    >
      {/* hero */}
      <div
        className={cn(
          'flex flex-col w-full px-4 py-2 bg-accent text-accent-foreground',
          'drop-shadow-2xl shadow-inner rounded-2xl'
        )}
      >
        {/* header */}
        <ContentHead title="pzzld" />
        {/* footer */}
        <div className="flex flex-nowrap items-center justify-end w-full gap-4 lg:gap-6 h-1/6">
          <div className="ml-auto inline-flex justify-end gap-4 lg:gap-6 w-full ">
            <Button
              asChild
              variant="link"
              className="inline-flex flex-nowrap items-center gap-2"
            >
              <Link href="/about">Learn More</Link>
            </Button>
          </div>
        </div>
      </div>
    </Comp>
  );
};
LandingScreen.displayName = 'LandingScreen';

export default LandingScreen;
