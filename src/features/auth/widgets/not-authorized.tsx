/**
 * Created At: 2025.10.22:20:07:12
 * @author - @FL03
 * @directory - src/features/auth/widgets
 * @file - not-authorized.tsx
 */
import * as React from "react";
// project
import { cn } from "@/lib/utils";
// components
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const NotAuthorizedCard: React.FC<
  & React.PropsWithChildren<Omit<React.ComponentPropsWithRef<"div">, "title">>
  & {
    title?: React.ReactNode;
    description?: React.ReactNode;
    classNames?: {
      titleClassName?: string;
      descriptionClassName?: string;
      contentClassName?: string;
      footerClassName?: string;
      headerClassName?: string;
    };
  }
> = ({
  ref,
  children,
  className,
  classNames,
  description = "User is not authorized to view the content",
  title = "Not Authorized",
  ...props
}) => (
  <Card
    {...props}
    ref={ref}
    className={cn("flex flex-1 h-full w-full", className)}
  >
    <CardContent
      className={cn("flex-1 h-full w-full", classNames?.contentClassName)}
    >
      <CardHeader>
        {title && (
          <CardTitle className={cn("text-xl", classNames?.titleClassName)}>
            {title}
          </CardTitle>
        )}
        {description && (
          <CardDescription className={classNames?.descriptionClassName}>
            {description}
          </CardDescription>
        )}
      </CardHeader>
      {children && (
        <CardFooter
          className={cn(
            "flex flex-1 items-center justify-center h-full w-full",
            classNames?.footerClassName,
          )}
        >
          {children}
        </CardFooter>
      )}
    </CardContent>
  </Card>
);
