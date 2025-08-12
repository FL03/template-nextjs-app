/**
 * Created At: 2025.07.06:17:12:19
 * @author - @FL03
 * @file - header.tsx
 */
"use client";
// imports
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
// project
import { cn } from "@/lib/utils";
import { TextSize } from "@/types";

type HeaderPropsT = { asChild?: boolean; vertical?: boolean };

/**
 * The `Header` is a custom container component used as the basis for any _headers_ within the application
 */
export const Header: React.FC<
  & Omit<React.ComponentPropsWithRef<"div">, "title">
  & React.PropsWithChildren<HeaderPropsT>
> = ({
  ref,
  className,
  asChild,
  vertical,
  ...props
}) => {
  // if asChild, fallback to the Slot component from Radix UI
  const Comp = asChild ? Slot : "div";
  // render the component
  return (
    <Comp
      {...props}
      ref={ref}
      className={cn(
        "flex flex-nowrap items-center gap-2 h-fit w-full mb-2",
        vertical ? "flex-col" : "flex-row",
        className,
      )}
    />
  );
};
Header.displayName = "Header";

// HeaderDescription
export const HeaderDescription: React.FC<
  React.ComponentPropsWithRef<"span"> & {
    asChild?: boolean;
    textSize?: TextSize;
  }
> = ({ ref, className, asChild, textSize = "sm", ...props }) => {
  // render as a Slot component as a fallback whenever asChild is true
  const Comp = asChild ? Slot : "span";
  // render the Sidebar component
  return (
    <Comp
      {...props}
      ref={ref}
      className={cn(
        "text-muted-foreground",
        textSize && `text-${textSize}`,
        className,
      )}
    />
  );
};
HeaderDescription.displayName = "HeaderDescription";

// HeaderTitle
export const HeaderTitle: React.FC<
  React.ComponentPropsWithRef<"div"> & {
    asChild?: boolean;
    textSize?: TextSize;
  }
> = ({ ref, className, asChild, textSize = "lg", ...props }) => {
  // render as a Slot component as a fallback whenever asChild is true
  const Comp = asChild ? Slot : "div";
  // render the Sidebar component
  return (
    <Comp
      {...props}
      ref={ref}
      className={cn(
        "font-semibold leading-none tracking-tight",
        textSize && `text-${textSize}`,
        className,
      )}
    />
  );
};
HeaderTitle.displayName = "HeaderTitle";

/**
 * The `HeaderContent` component is used to wrap the content of the header; i.e. the title and description. This is primarily used to ensure
 * that the title and description are displayed appropriately within the header layout and enables the header to use a leading and trailing slot.
 */
export const HeaderContent: React.FC<
  & React.PropsWithChildren<Omit<React.ComponentPropsWithRef<"div">, "title">>
  & {
    asChild?: boolean;
    extended?: boolean;
  }
> = ({
  ref,
  className,
  asChild,
  extended,
  ...props
}) => {
  // if asChild, fallback to the Slot component from Radix UI
  const Comp = asChild ? Slot : "div";
  // render the component
  return (
    <Comp
      {...props}
      ref={ref}
      className={cn(
        "flex flex-1 flex-col w-full",
        "order-2",
        className,
      )}
    />
  );
};
HeaderContent.displayName = "HeaderContent";

// HeaderLeading
export const HeaderLeading: React.FC<
  & React.PropsWithChildren<Omit<React.ComponentPropsWithRef<"div">, "title">>
  & {
    asChild?: boolean;
  }
> = ({
  ref,
  className,
  asChild,
  ...props
}) => {
  // if asChild, fallback to the Slot component from Radix UI
  const Comp = asChild ? Slot : "div";
  // render the component
  return (
    <Comp
      {...props}
      ref={ref}
      className={cn(
        "inline-flex flex-shrink-0 items-center w-fit",
        "left-0 order-first",
        className,
      )}
    />
  );
};
HeaderLeading.displayName = "HeaderLeading";

// HeaderTrailing
export const HeaderTrailing: React.FC<
  & React.PropsWithChildren<Omit<React.ComponentPropsWithRef<"div">, "title">>
  & {
    asChild?: boolean;
  }
> = ({
  ref,
  className,
  asChild,
  ...props
}) => {
  // if asChild, fallback to the Slot component from Radix UI
  const Comp = asChild ? Slot : "div";
  // render the component
  return (
    <Comp
      {...props}
      ref={ref}
      className={cn(
        "inline-flex flex-shrink-0 item-center justify-end w-fit",
        "right-0 ml-auto",
        "order-last",
        className,
      )}
    />
  );
};
HeaderTrailing.displayName = "HeaderTrailing";

export default Header;
