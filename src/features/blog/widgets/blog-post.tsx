/**
 * Created At: 2025.07.05:22:27:23
 * @author - @FL03
 * @file - blog-post.tsx
 */
'use client';
// imports
import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
// project
import { logger } from '@/lib/logger';
import { cn } from '@/lib/utils';

type WidgetPropsT = {
  asChild?: boolean;
  className?: string;
};

/** This component is the standard display for all blog post entries. */
export const BlogPost: React.FC<React.PropsWithChildren<WidgetPropsT>> = ({
  asChild,
  children,
  className,
  ...props
}) => {
  const Comp = asChild ? Slot : 'div';
  // logger
  logger.trace('Rendering PortfolioReport component');
  return (
    <Comp
      {...props}
      className={cn(
        'flex flex-col gap-4 p-4 bg-background text-foreground rounded-lg shadow-md',
        className
      )}
    >
      {children}
    </Comp>
  );
};
BlogPost.displayName = 'BlogPost';

export default BlogPost;
