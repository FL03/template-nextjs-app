'use client';
// imports
import * as React from 'react';
import Link from 'next/link';
import { Slot } from '@radix-ui/react-slot';
// project
import { cn } from '@/lib/utils';
// components
import {
  CardAction,
} from '@/components/ui/card';

const ListLink: React.FC<
  React.ComponentPropsWithRef<'li'> & {
    asChild?: boolean;
    href: React.ComponentProps<typeof Link>['href'];
  }
> = ({ ref, className, children, href, asChild, ...props }) => {
  // if asChild, use a `Slot` component, otherwise use a `li` element
  const Comp = asChild ? Slot : 'li';
  return (
    <Comp ref={ref} className={cn('flex flex-nowrap flex-1 text-sm font-normal', className)} {...props}>
      <Link href={href}>{children}</Link>
    </Comp>
  );
};

export const AboutScreenView: React.FC<
  Omit<React.ComponentPropsWithRef<'section'>, 'title' | 'children'> & {
    asChild?: boolean;
  }
> = ({ ref, className, asChild, ...props }) => {
  const Comp = asChild ? Slot : 'section';
  return (
    <Comp
      ref={ref}
      className={cn('relative flex-1 h-full w-full', className)}
      {...props}
    >
      <div className="flex flex-col flex-1 gap-4 lg:gap-6 w-full">
        {/* header */}
        <div className="flex flex-nowrap items-center gap-4 lg:gap-6 w-full">
          <div className="flex flex-col flex-1 w-full">
            <div className="text-2xl font-bold tracking-tight">About</div>
            <span className="text-muted-foreground italic">A little bit about me!</span>
          </div>
        </div>
        {/* content */}
        <div className="flex flex-col flex-1 items-start justify-center gap-4 lg:gap-6 w-full">
          <span className="font-semibold text-lg">Projects</span>
          <ul className="font-normal gap-2">
            <ListLink href="https://github.com/FL03/rshyper">rshyper</ListLink>
            <ListLink href="https://scsys.io">Scattered Systems, LLC</ListLink>
          </ul>
        </div>
        {/* footer */}
        <div className="flex justify-end gap-4 lg:gap-6 w-full min-h-1/12">
          <CardAction className="inline-flex flex-nowrap items-center gap-2">
            <span>Author</span>
            <span>Joe McCain III</span>
          </CardAction>
        </div>
      </div>
    </Comp>
  );
};
AboutScreenView.displayName = 'AboutScreenView';

export default AboutScreenView;
