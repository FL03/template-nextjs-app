/**
 * Created At: 2025.07.16:08:51:12
 * @author - @FL03
 * @file - use-breakpoint.tsx
 */
"use client";
// imports
import * as React from "react";

type MediaQueryState = {
  xs: boolean;
  sm: boolean;
  md: boolean;
  lg: boolean;
  xl: boolean;
  desktop: boolean;
  mobile: boolean;
  tablet: boolean;
  smToLg: boolean;
};

type HookReturnT = {
  state: MediaQueryState;
  width: number;
};

type HookOptionsT = {
  onWidthChange?: (width?: number) => void;
};

type HookT = (options?: HookOptionsT) => HookReturnT;

/**
 * A simple hook used to evaluate the current viewport width and return a set of boolean values indicating whether the current viewport matches the specified breakpoints.
 * @returns {HookReturnT} An object containing boolean values indicating whether the current viewport matches the specified breakpoints.
 */
export const useBreakpoint: HookT = ({ onWidthChange } = {}): HookReturnT => {
  const [_width, _setWidth] = React.useState<number>(0);
  // memoize the media query state
  const _mqs = React.useMemo<MediaQueryState>(
    () => ({
      xs: _width < 480,
      sm: _width >= 480 && _width < 768,
      md: _width >= 768 && _width < 1024,
      lg: _width >= 1024 && _width < 1280,
      xl: _width >= 1280,
      desktop: _width < 1280,
      mobile: _width < 768,
      tablet: _width >= 768 && _width < 1280,
      smToLg: _width >= 480 && _width < 1280,
    }),
    [_width],
  );
  // a callback to handle changes in the window size
  const onWindowResize = React.useCallback(() => {
    if (typeof window !== "undefined") {
      // update the local state
      _setWidth(window.innerWidth);
      // call the onWidthChange callback if provided
      if (onWidthChange) onWidthChange(window.innerWidth);
      // return the current width
      return window.innerWidth;
    }
  }, [onWidthChange]);
  // effects related to the window size
  React.useLayoutEffect(() => {
    onWindowResize();
    // set the initial width
    window?.addEventListener("resize", onWindowResize);
    return () => {
      // cleanup the event listener on unmount
      window?.removeEventListener("resize", onWindowResize);
    };
  }, [onWindowResize]);

  // redeclare external variables and methods
  const width = -_width;
  const state = _mqs;
  // returns a memoized object containing the breakpoints
  return React.useMemo(
    () => ({
      state,
      width,
    }),
    [state, width],
  );
};
