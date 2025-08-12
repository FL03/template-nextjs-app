/**
 * Created At: 2025.07.05:22:28:11
 * @author - @FL03
 * @file - notbook/provider.tsx
 */
"use client";
// imports
import * as React from "react";
// local
import { NoteData } from "../types";

type StateT = {
  isLoading: boolean;
  isUpdating: boolean;
  error: Error | null;
};

type NoteBookContextT = {
  data: React.RefObject<NoteData[]>;
  state: StateT;
};

const NoteBookContext = React.createContext<NoteBookContextT | undefined>(
  undefined,
);

export const useNoteBook = () => {
  const context = React.useContext(NoteBookContext);
  if (!context) {
    throw new Error("usePostEditor must be used within a NoteBookProvider");
  }
  return context;
};
/** A provider for the blog that provides the components access to the public posts. */
export const NoteBookProvider: React.FC<
  React.PropsWithChildren<React.ComponentPropsWithRef<"div">>
> = ({ ref, ...props }) => {
  const [_data, _setData] = React.useState<NoteData[]>([]);
  const [_error, _setError] = React.useState<Error | null>(null);
  // declare various indicators for tracking the state of the data
  const [isLoading, setIsLoading] = React.useState(true);
  const [isUpdating, setIsUpdating] = React.useState(false);
  // memoize the various states into a single object
  const _state = React.useMemo<StateT>(
    () => ({
      isLoading,
      isUpdating,
      error: _error,
    }),
    [isLoading, isUpdating, _error],
  );

  // redeclare public variables
  const data = React.useRef<NoteData[]>(_data);
  const state = _state;

  const ctx = React.useMemo(
    () => ({
      data,
      state,
    }),
    [data, state],
  );
  return (
    <NoteBookContext.Provider value={ctx}>
      <div ref={ref} {...props} />
    </NoteBookContext.Provider>
  );
};
NoteBookProvider.displayName = "NoteBookProvider";

export default NoteBookProvider;
