/**
 * Created At: 2025.08.10:15:52:47
 * @author - @FL03
 * @file - notebook.tsx
 */
"use client";
// imports
import * as React from "react";
// project
import { cn } from "@/lib/utils";
// components
import {
  Header,
  HeaderDescription,
  HeaderTitle,
} from "@/components/common/header";
// local
import { BookData } from "../types";

type WidgetPropsT = {
  notebook?: BookData;
  showDescription?: boolean;
};

/** The `NoteCard` component is a childless widget used to render a note. */
export const Notebook: React.FC<
  Omit<React.ComponentPropsWithRef<"div">, "title"> & WidgetPropsT
> = ({
  ref,
  className,
  notebook,
  showDescription,
  ...props
}) => {
  // render a skeleton if no notebook is provided
  if (!notebook) return null;
  // destructure the notebook
  const { title, description } = notebook;

  // render the card
  return (
    <div
      {...props}
      ref={ref}
      className={cn(
        "flex flex-1 flex-col relative z-auto px-4 py-2",
        className,
      )}
    >
      <Header>
        <HeaderTitle>{title}</HeaderTitle>
        {description && (
          <HeaderDescription
            className={showDescription ? "not-sr-only" : "sr-only"}
          >
            {description}
          </HeaderDescription>
        )}
      </Header>
    </div>
  );
};
Notebook.displayName = "Notebook";

export default Notebook;
