/**
 * Created At: 2025.07.06:19:27:50
 * @author - @FL03
 * @file - user-portal.tsx
 */
import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';

type PortalPropsT = {
  asChild?: boolean;
  leading?: React.ReactNode;
  trailing?: React.ReactNode;
};


/**
 * The `UserPortal` component is designed to be a complete virtual workspace for users to enjoy. Each portal is designed to be unique, morphing to the user's needs and preferences
 * using WebAssembly modules to orchestrate a variety of features and functionalities. 
 */
export const UserPortal: React.FC<
  Omit<React.ComponentPropsWithRef<'div'>, 'children' | 'title'> &
    React.PropsWithChildren<PortalPropsT>
> = ({ ref, children, asChild, ...props }) => {
  // render the component as a slot when asChild is true
  const Comp = asChild ? Slot : 'div';
  // render the portal
  return (
    <Comp
      ref={ref}
      className="flex flex-col flex-1 min-h-full w-full gap-4"
      {...props}
    >
      {children}
    </Comp>
  );
};
