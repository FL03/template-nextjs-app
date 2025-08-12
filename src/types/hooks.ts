/**
 * Created At: 2025.07.15:09:53:46
 * @author - @FL03
 * @file - hooks.ts
 */
/** This type establishes a set of allowable primitive types for building custom hook states. */
export type HookState = boolean | string | number;

export type Stateful<TState extends HookState = HookState> = TState | null | undefined;
/** This type establishes a common interface for states used by custom hooks implemented throughout the project */
export type HookCallbackState = {
  isLoading: boolean;
  isError: boolean;
  isRefreshing: boolean;
  isSuccess: boolean
  isUpdating: boolean;
} & {
  [key: string]: Stateful<HookState>;
}


export type HookCallbackReturn<TOut> = TOut & {
  state: HookCallbackState;
}
/** 
 * A type alias for a function or method that accepts an optional set of parameters and returns a value of type TOut.
 * @param {TOpts} options - an optional set of parameters that can be passed to the hook.
 * @return {TOut} - returns a value of type TOut.
 */
export type HookCallback<TOpts, TOut> = (options?: TOpts) => TOut;

export const DEFAULT_HOOK_STATE: HookCallbackState = ({
  isLoading: true,
  isError: false,
  isRefreshing: false,
  isSuccess: false,
  isUpdating: false,
});

/** 
 * A method designed to streamline the creation of new hook state objects.
 * @param {Partial<HookCallbackState> | null | undefined} state - an optional object that can be used to override the default values of the hook state
 * @returns {HookCallbackState} - returns an instance of a hook state object that uses the given values or their defaults
*/
export const generateHookState = (state?: Partial<HookCallbackState> | null): HookCallbackState => {
  return {
    ...DEFAULT_HOOK_STATE,
    ...state,
  };
}