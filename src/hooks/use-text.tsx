/**
 * Created At: 2025.07.05:20:11:10
 * @author - @FL03
 * @file - use-texter.tsx
 */
"use client";
import logger from "@/lib/logger";
// imports
import React from "react";

export type TextEditorState = {
  isEditing: boolean;
  isSaving: boolean;
};

type EditorOptsT = {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  onSave?: (value: string) => void;
};

type EditorReturn = {
  data: string | null;
  state: TextEditorState;
  write: (data: string) => void;
  save: () => void;
};

type EditorT = (opts?: EditorOptsT) => EditorReturn;

/** */
export const useText: EditorT = ({
  value: valueProp,
  defaultValue = "",
  onValueChange,
  onSave,
} = {}) => {
  // initialize the primary states
  const [content, setContent] = React.useState<string>(defaultValue);
  // define the various signals of the hook
  const [isEditing, setIsEditing] = React.useState<boolean>(false);
  const [isSaving, setIsSaving] = React.useState<boolean>(false);
  // aggregate the signals into a single, memoized state object
  const _state = React.useMemo<TextEditorState>(
    () => ({
      isEditing,
      isSaving,
    }),
    [isEditing, isSaving],
  );
  // handle the data change
  const _onValueChange = React.useCallback(
    (value: string) => (
      setContent((prev) => {
        // if the value is the same as the previous value, return the previous value
        if (prev === value) return prev;
        // if provided, call the onValueChange callback before updating the state
        if (onValueChange) onValueChange(value);
        // return the new value
        return value;
      })
    ),
    [onValueChange],
  );
  // save the data
  const _save = React.useCallback(() => {
    // if the content is empty, do not save
    if (!content) {
      logger.warn("No content to save.");
      return;
    }
    // set the saving state to true
    if (!isSaving) setIsSaving(true);
    // use the callback, if provided, to process the data save
    if (onSave) onSave(content);
    // reset the editing state after saving
    setIsEditing(false);
    // reset the saving state after saving
    setIsSaving(false);
  }, [content, isSaving, onSave]);
  // a callback for writing data to the editor
  const _write = React.useCallback(
    (value: string) => {
      // set the editing state to true
      setIsEditing(true);
      // update the internal data state
      _onValueChange(value);
    },
    [_onValueChange],
  );
  // handle changes to the external data prop
  React.useEffect(() => {
    // ensure any external changes to the data are reflected internally
    if (valueProp && content !== valueProp) {
      _onValueChange(valueProp);
    }
  }, [valueProp, content, _onValueChange]);
  // redeclare public variables
  const data = content;
  const state = _state;
  // redeclare public methods
  const save = _save;
  const write = _write;

  // memoize the output values to reduce re-renders
  return React.useMemo(() => ({ data, state, save, write }), [
    data,
    state,
    save,
    write,
  ]);
};

export default useText;
