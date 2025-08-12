/**
 * Created At: 2025.05.23:00:01:48
 * @author - @FL03
 * @file - layout.tsx
 */
import { Metadata } from "next";
import { PropsWithChildren } from "react";

// page metadata
export const metadata: Metadata = {
  title: "Text Editor",
  description: "A rich text editor for creating and editing documents.",
};

export default function Layout(
  { children }: Readonly<PropsWithChildren>,
) {
  // render the layout
  return (
    <div className="container mx-auto flex-1 h-full w-full">
      {children}
    </div>
  );
}
Layout.displayName = "EditorLayout";
