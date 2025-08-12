/**
 * Created At: 2025.07.05:22:28:11
 * @author - @FL03
 * @file - provider.tsx
 */
"use client";
// imports
import * as React from "react";
// local
import { NoteData } from "../types";

type StateT = {
  isUpdating: boolean;
  isLoading: boolean;
  error: string | null;
};

type NoteContextT = {
  post: React.RefObject<NoteData | null>;
  state: StateT;
};

const NoteContext = React.createContext<NoteContextT | undefined>(undefined);

export const useNote = () => {
  const context = React.useContext(NoteContext);
  if (!context) {
    throw new Error("usePostEditor must be used within a BlogProvider");
  }
  return context;
};

/** A provider for the blog that provides the components access to the post editor. */
export const NoteProvider: React.FC<
  React.PropsWithChildren<React.ComponentPropsWithRef<"div">>
> = ({ ref, ...props }) => {
  const [_data, _setData] = React.useState<NoteData | null>(null);
  const [_error, _setError] = React.useState<string | null>(null);
  // declare various indicators for tracking the state of the data
  const [isLoading, setIsLoading] = React.useState(true);
  const [isUpdating] = React.useState(false);
  // memoize the various states into a single object
  const _state = React.useMemo<StateT>(
    () => ({
      isLoading,
      isUpdating,
      error: _error,
    }),
    [isLoading, isUpdating, _error],
  );

  const _onDataChange = React.useCallback(
    (post: NoteData | null) => {
      _setData(post);
    },
    [_setData],
  );

  // handle the loading state
  React.useEffect(() => {
    if (isLoading) {
    }

    return () => {
      setIsLoading(true);
    };
  }, [isLoading, setIsLoading]);
  // redeclare public variables
  const post = React.useRef<NoteData | null>(_data);
  const state = _state;
  // memoize the output
  const ctx = React.useMemo(
    () => ({
      post,
      state,
    }),
    [post, state],
  );
  return (
    <NoteContext.Provider value={ctx}>
      <div ref={ref} {...props} />
    </NoteContext.Provider>
  );
};
NoteProvider.displayName = "NoteProvider";

export default NoteProvider;
