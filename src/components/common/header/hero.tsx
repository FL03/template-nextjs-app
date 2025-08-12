/**
 * Created At: 2025.07.13:12:55:06
 * @author - @FL03
 * @file - hero.tsx
 */
'use client';
// imports
import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
// project
import { cn } from '@/lib/utils';


type HeroPropsT = {
  asChild?: boolean;
}

/**
 * The `Hero` component is a `div` element customized for use as a hero section in the application.
 */
export const Hero: React.FC<React.ComponentPropsWithRef<"div"> & HeroPropsT> = ({ref, className, asChild, ...props }) => {
  // fallback to a `Slot` component if `asChild` is true
  const Comp = asChild ? Slot : 'div';
  // render the Hero component
  return (
    <Comp
      {...props}
      ref={ref}
      className={cn(
        'relative flex flex-col items-center justify-center w-full h-full gap-4',
        'px-4 py-2 lg:px-8 lg:py-4',
        'bg-gradient-to-b from-background to-muted',
        className
      )}
    />
  )
};
Hero.displayName = 'Hero';

export default Hero;