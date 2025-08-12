import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
//  project
import { cn } from "@/lib/utils";
import { TextSize } from "@/types";
import {
  Header,
  HeaderContent,
  HeaderDescription,
  HeaderLeading,
  HeaderTitle,
  HeaderTrailing,
} from "./header";

type ClassNames = {
  contentClassName?: string;
  descriptionClassName?: string;
  leadingClassName?: string;
  titleClassName?: string;
  trailingClassName?: string;
};

type ContentHeaderProps = {
  extended?: boolean;
  leading?: React.ReactNode;
  trailing?: React.ReactNode;
  description?: React.ReactNode;
  title?: React.ReactNode;
  descriptionSize?: TextSize;
  titleSize?: TextSize;
  classNames?: ClassNames;
};

/**
 * The `FlexHeader` component is a pre-formatted header component equipped with a title and description displayed elegantly
 * between optional leading and trailing content. It is designed to be flexible and customizable, allowing granular control over its
 * appearance and behavio using the `classNames` prop.
 */
export const FlexHeader: React.FC<
  & Omit<React.ComponentPropsWithRef<"div">, "children" | "title">
  & ContentHeaderProps
> = ({
  ref,
  leading,
  trailing,
  className,
  description,
  title,
  extended,
  descriptionSize = "sm",
  titleSize = "base",
  classNames = {},
  ...props
}) => {
  // destructure classNames
  const {
    contentClassName,
    leadingClassName,
    trailingClassName,
    descriptionClassName,
    titleClassName,
  } = classNames;
  // returns true if either a description or title is provided
  const withHeader: boolean = Boolean(description) || Boolean(title);

  const renderDisplay = () => {
    if (extended) {
      return (
        <>
          <div className="flex flex-row flex-nowrap w-full h-fit items-center justify-between">
            {leading && (
              <HeaderLeading
                className={leadingClassName}
              >
                {leading}
              </HeaderLeading>
            )}
            {trailing && (
              <HeaderTrailing
                className={trailingClassName}
              >
                {trailing}
              </HeaderTrailing>
            )}
          </div>
          {withHeader && (
            <HeaderContent className={contentClassName}>
              {title && (
                <HeaderTitle
                  className={titleClassName}
                  textSize={titleSize}
                >
                  {title}
                </HeaderTitle>
              )}
              {description && (
                <HeaderDescription
                  className={descriptionClassName}
                  textSize={descriptionSize}
                >
                  {description}
                </HeaderDescription>
              )}
            </HeaderContent>
          )}
        </>
      );
    }
    // otherwise, render the header as is
    return (
      <>
        {leading && (
          <HeaderLeading
            className={leadingClassName}
          >
            {leading}
          </HeaderLeading>
        )}
        {withHeader && (
          <HeaderContent className={contentClassName}>
            {title && (
              <HeaderTitle
                className={titleClassName}
                textSize={titleSize}
              >
                {title}
              </HeaderTitle>
            )}
            {description && (
              <HeaderDescription
                className={descriptionClassName}
                textSize={descriptionSize}
              >
                {description}
              </HeaderDescription>
            )}
          </HeaderContent>
        )}
        {trailing && (
          <HeaderTrailing
            className={trailingClassName}
          >
            {trailing}
          </HeaderTrailing>
        )}
      </>
    );
  };
  // render the component
  return (
    <Header
      {...props}
      ref={ref}
      className={className}
    >
      {renderDisplay()}
    </Header>
  );
};
FlexHeader.displayName = "FlexHeader";

export default FlexHeader;
