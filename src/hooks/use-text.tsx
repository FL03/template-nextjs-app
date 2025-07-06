/**
 * Created At: 2025.07.05:20:11:10
 * @author - @FL03
 * @file - use-texter.tsx
 */
'use client';
// imports
import React from 'react';

export type TextEditorState = {
  isEditing: boolean;
  isLoading: boolean;
  isSaving: boolean;
};

type EditorOptsT = {
  data?: string;
  defaultState?: TextEditorState;
  onEdit?: (data: string) => void;
  onSave?: (data: string) => void;
};

type EditorReturn = {
  data: string | null;
  state: TextEditorState;
  startEditing: () => void;
  stopEditing: () => void;
  toggleEditing: () => void;
};

type EditorT = (opts: EditorOptsT) => EditorReturn;

/**
 *
 * @returns {EditorReturn}
 */
export const useTextEditor = ({
  data: dataExt,
  defaultState,
  onEdit,
  ...opts
}: EditorOptsT = {}) => {
  // declare data-based state variables
  const [_data, _setData] = React.useState<string | null>(null);
  // declare state variables
  const [isEditing, setIsEditing] = React.useState<boolean>(
    defaultState?.isEditing ?? false
  );
  const [isLoading, setIsLoading] = React.useState<boolean>(
    defaultState?.isLoading ?? false
  );
  const [isSaving, setIsSaving] = React.useState<boolean>(
    defaultState?.isSaving ?? false
  );
  // memoize the various state values to reduce re-renders
  const _state = React.useMemo<TextEditorState>(
    () => ({
      isEditing,
      isLoading,
      isSaving,
    }),
    [isEditing, isLoading, isSaving]
  );

  // handle the data change
  const _onDataChange = React.useCallback(
    (value: string) => {
      // reflect the change(s) internally
      _setData(value);
      // use the callback, if provided, to process the data change
      if (onEdit) onEdit(value);
    },
    [onEdit, _setData]
  );
  // handle changes to the external data prop
  React.useEffect(() => {
    // ensure any external changes to the data are reflected internally
    if (dataExt && _data !== dataExt) {
      _onDataChange(dataExt);
    }
  }, [dataExt, _data, _onDataChange]);
  // handle the loading state
  React.useEffect(() => {
    if (isLoading) {

    }
    // handle the unmounting of the component
    return () => {
      // reset the loading state when the component unmounts
      setIsLoading(false);
    }
  }, [isLoading, setIsLoading])
  // redeclare public variables
  const data = _data;
  const state = _state;
  return React.useMemo(() => ({ data, state }), [data, state]);
};

export default useTextEditor;
