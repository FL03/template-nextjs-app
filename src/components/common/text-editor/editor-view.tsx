/**
 * Created At: 2025.07.05:20:09:51
 * @author - @FL03
 * @file - views/editor.tsx
 */
"use client";
// imports
import * as React from "react";
import dynamic from "next/dynamic";
// local
import { TextEditorProvider } from "./editor-provider";

type TextEditorProps = {
  className?: string;
};

/**
 * The `DocumentEditor` component is an optimized view of the text editor, automatically importing the editor widget and providing the necessary context for text editing.
 */
export function DocumentEditor({ ...props }: TextEditorProps) {
  // dynamically import the text editor component
  const Comp = dynamic(async () => import("./text-editor"), {
    ssr: false,
  });
  // render the component
  return (
    <TextEditorProvider>
      <Comp {...props} />
    </TextEditorProvider>
  );
}
DocumentEditor.displayName = "DocumentEditor";

export default DocumentEditor;
