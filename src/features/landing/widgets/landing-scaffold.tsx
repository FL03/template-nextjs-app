
'use client';
// imports
import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
// project
import { cn } from '@/lib/utils';


export const LandingScaffold: React.FC<Omit<React.ComponentPropsWithRef<"div">, 'title'> & {
  asChild?: boolean;
}> = ({ ref, children, className, asChild, ...props }) => {
  // use a `Slot` if asChild is true
  const Comp = asChild ? Slot : 'div';
  // render the component
  return (
    <Comp {...props} ref={ref} className={cn("relative flex flex-col flex-1 w-full", className)}>
      <div className="flex flex-col items-center justify-center w-full max-w-3xl p-4">
        {children}
      </div>
    </Comp>
  );
}
LandingScaffold.displayName = 'LandingScaffold';

export default LandingScaffold;