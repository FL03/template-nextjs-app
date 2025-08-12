/**
 * Created At: 2025.07.06:07:02:17
 * @author - @FL03
 * @file - scaffold-provider.tsx
 */
"use client";
// imports
import * as React from "react";
// project
import { useIsMobile } from "@/hooks/use-mobile";
import { useText } from "@/hooks/use-text";

type TextEditorContext = {
  isMobile: boolean;
};

const TextEditorContext = React.createContext<TextEditorContext | null>(null);

export const useTextEditor = () => {
  const ctx = React.useContext(TextEditorContext);
  if (!ctx) {
    throw new Error("useScaffold must be used within a ScaffoldProvider");
  }
  return ctx;
};

// TextEditorProvider
export const TextEditorProvider: React.FC<
  React.PropsWithChildren<
    {
      onValueChange?: (value: string) => void;
      onSave?: (value: string) => void;
    }
  >
> = ({ children, onValueChange, onSave }) => {
  // use the hook to control the text
  const { data, state, write, save } = useText({
    onValueChange,
    onSave,
  });
  // use the isMobile hook to determine if the device is mobile
  const isMobile = useIsMobile();

  // declare the memoized values for the scaffold provider
  const ctx = React.useMemo(() => ({ data, state, write, save, isMobile }), [
    data,
    isMobile,
    state,
    save,
    write,
  ]);
  return (
    <TextEditorContext.Provider value={ctx}>
      {children}
    </TextEditorContext.Provider>
  );
};
TextEditorProvider.displayName = "ScaffoldProvider";

export default TextEditorProvider;
