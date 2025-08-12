/**
 * Created At: 2025.08.06:18:34:53
 * @author - @FL03
 * @file - details.tsx
 */
"use client";
//imports
import * as React from "react";
// project
import { cn } from "@/lib/utils";
// components
import { BackButton } from "@/components/common/button";
import {
  Header,
  HeaderContent,
  HeaderDescription,
  HeaderLeading,
  HeaderTitle,
  HeaderTrailing,
} from "@/components/common/header";

type ScaffoldClasses = {
  contentClassName?: string;
  descriptionClassName?: string;
  titleClassName?: string;
  leadingClassName?: string;
  trailingClassName?: string;
};

type ScaffoldProps = {
  classNames?: ScaffoldClasses;
  leading?: React.ReactNode;
  trailing?: React.ReactNode;
  description?: React.ReactNode;
  title?: React.ReactNode;
  withBack?: boolean;
};
/**
 * The `DetailScaffold` component renders the view for the settings screen;
 */
export const DetailScaffold: React.FC<
  Omit<React.ComponentPropsWithRef<"div">, "title"> & ScaffoldProps
> = (
  {
    ref,
    children,
    className,
    classNames,
    description,
    title,
    leading,
    trailing,
    withBack,
    ...props
  },
) => {
  // destructure classNames
  const {
    contentClassName,
    descriptionClassName,
    titleClassName,
    leadingClassName,
    trailingClassName,
  } = classNames || {};
  // returns true if leading is provided
  const showLeading = Boolean(leading) || withBack;
  // render the configuration panel
  return (
    <div
      {...props}
      ref={ref}
      className={cn("flex flex-col flex-1 h-full w-full", className)}
    >
      <Header>
        {showLeading && (
          <HeaderLeading
            className={leadingClassName}
          >
            {withBack && <BackButton />}
            {leading}
          </HeaderLeading>
        )}
        <HeaderContent>
          {title && (
            <HeaderTitle className={titleClassName}>{title}</HeaderTitle>
          )}
          {description && (
            <HeaderDescription className={descriptionClassName}>
              {description}
            </HeaderDescription>
          )}
        </HeaderContent>
        {trailing && (
          <HeaderTrailing
            className={trailingClassName}
          >
            {trailing}
          </HeaderTrailing>
        )}
      </Header>
      <div
        className={cn(
          "flex flex-col flex-1 h-full w-full px-4 py-2",
          "bg-accent text-accent-foreground rounded-lg drop-shadow-2xl border border-accent/10",
          contentClassName,
        )}
      >
        {children}
      </div>
    </div>
  );
};
DetailScaffold.displayName = "DetailScaffold";

export default DetailScaffold;
