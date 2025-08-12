/**
 * Created At: 2025.08.05:05:06:04
 * @author - @FL03
 * @file - editor.tsx
 */
"use client";
// imports
import * as React from "react";
// project
import { cn } from "@/lib/utils";
// components
import { Textarea } from "@/components/ui/textarea";
// local
import {
  FontSizeSelect,
  FontStyleSelect,
  TextEditorToolbar,
  TextFormatGroup,
  TitleEditor,
} from ".";
import { logger } from "@/lib/logger";

type TextEditorProps = {
  className?: string;
  content?: string | null;
  defaultContent?: string | null;
  title?: string;
  defaultTitle?: string;
  onContentChange?: (value: string) => void;
  onTitleChange?: (value: string) => void;
};

/**
 * The `TextEditor` component is a rich text editor that allows users to edit text content with various formatting options.
 */
export const TextEditor: React.FC<TextEditorProps> = ({
  className,
  content: contentProp,
  title,
  defaultContent = "",
  defaultTitle = "Untitled",
  onContentChange,
  onTitleChange,
}) => {
  // memoize the content prop to avoid unnecessary re-renders
  const _dataExt = React.useMemo(() => contentProp ?? undefined, [contentProp]);
  const [_content, _setContent] = React.useState<string>(
    _dataExt || defaultContent || "",
  );
  // a callback for handling changes to the content
  const handleContentChange = React.useCallback(
    (next: string) => {
      // update the content state
      _setContent(next);
      // if the `onContentChange` prop is provided, call it with the new value
      if (onContentChange) onContentChange(next);
    },
    [onContentChange, _setContent],
  );
  // if any changes are detected in the `contentProp`, update the state
  React.useEffect(() => {
    if (_dataExt !== undefined && _dataExt !== _content) {
      handleContentChange(_dataExt);
    }
  }, [handleContentChange]);
  // render the component
  return (
    <div
      className={cn(
        "flex flex-1 flex-col h-full w-full relative z-auto",
        className,
      )}
    >
      {/* toolbar */}
      <TextEditorToolbar>
        <TextFormatGroup />
        <FontSizeSelect defaultValue="11" />
        <FontStyleSelect defaultValue="Normal" />
      </TextEditorToolbar>
      <div
        className={cn(
          "flex flex-1 flex-col w-full gap-2 px-4 py-2 mt-2",
          "bg-accent text-accent-foreground border-accent/10 border rounded-lg shadow-inner drop-shadow-sm",
          "focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-accent/20 focus-within:ring-offset-accent-foreground",
        )}
      >
        {/* Title */}
        <TitleEditor
          defaultValue={defaultTitle}
          value={title}
          onValueChange={onTitleChange}
        />
        {/* content */}
        <Textarea
          content={_content}
          onChange={(event) => {
            // prevent the default behavior for the textarea
            event.preventDefault();
            // stop the propagation of the event
            event.stopPropagation();
            // log the event
            logger.trace(
              event,
              "detected change to the content of the text editor...",
            );
            // handle the content change
            handleContentChange(event.target.value);
          }}
          className="h-full w-full overflow-y-auto"
        />
      </div>
    </div>
  );
};
TextEditor.displayName = "TextEditor";

export default TextEditor;
