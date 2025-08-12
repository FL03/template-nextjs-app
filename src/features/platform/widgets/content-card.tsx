/**
 * Created At: 2025.07.23:16:47:30
 * @author - @FL03
 * @file - about-screen.tsx
 */
"use client";
// imports
import * as React from "react";
// project
import { cn } from "@/lib/utils";
// components
import { ProseWrapper } from "@/components/common/typography";
import { FlexHeader } from "@/components/common/header";

type CardClassNames = {
  contentClassName?: string;
  descriptionClassName?: string;
  headerClassName?: string;
  titleClassName?: string;
};

// Content Card Component
export const ContentCard: React.FC<
  Omit<React.ComponentPropsWithRef<"div">, "title"> & {
    classNames?: CardClassNames;
    description?: React.ReactNode;
    title?: React.ReactNode;
    author?: string;
    centerTitle?: boolean;
    hideDescription?: boolean;
  }
> = (
  {
    ref,
    children,
    className,
    classNames,
    author,
    description,
    title,
    centerTitle,
    hideDescription,
    ...props
  },
) => {
  // destructure the classNames
  const {
    contentClassName,
    headerClassName,
    ...headerClassNames
  } = classNames || {};
  // determine if the footer should be displayed
  const showFooter = Boolean(author);
  // render the component
  return (
    <div
      ref={ref}
      className={cn(
        "flex flex-col flex-1 h-full w-full items-center relative z-auto px-4 py-2",
        "rounded-2xl border border-accent/20 bg-accent text-accent-foreground inset-0.5 shadow-inner",
        "transition-all duration-300 ease-in-out overflow-y-auto",
        className,
      )}
      {...props}
    >
      {/* header */}
      <FlexHeader
        className={cn('items-center', headerClassName)}
        classNames={headerClassNames}
        title={title}
        description={description}
        titleSize="3xl"
      />
      {/* content */}
      <ProseWrapper className="flex flex-1 flex-col h-full w-full">
        {children}
      </ProseWrapper>
      {/* footer */}
      <div
        className={cn(
          "bottom-0 flex justify-end gap-2 w-full",
          showFooter ? "flex" : "hidden",
        )}
      >
        {author && (
          <div className="ml-auto right-0 inline-flex flex-nowrap items-center gap-1 text-sm">
            <span className="text-muted-foreground">Author:</span>
            <span className="font-semibold">{author}</span>
          </div>
        )}
      </div>
    </div>
  );
};
ContentCard.displayName = "ContentCard";

export default ContentCard;
