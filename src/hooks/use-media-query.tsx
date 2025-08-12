/**
 * Created At: 2025.07.16:08:47:14
 * @author - @FL03
 * @file - use-media-query.tsx
 */
'use client';
// imports
import * as React from 'react';

/**
 * A custom hook that listens to media query changes and returns a boolean indicating whether the query matches.
 * @param {string} query - The media query string to evaluate, e.g., '(max-width: 600px)'.
 * @returns {boolean} true if the media query matches, false otherwise.
 */
export const useMediaQuery = (query: string): boolean => {
  const [isMatch, setIsMatch] = React.useState<boolean>(false);

  const _listener = React.useCallback(
    (event: MediaQueryListEvent) => {
      setIsMatch(event.matches);
    },
    [setIsMatch]
  );
  // useLayoutEffect to ensure the media query is evaluated before the browser paints
  React.useLayoutEffect(() => {
    // create a media query list
    const mediaQueryList = window.matchMedia(query);
    // update the state based on the initial match
    setIsMatch(mediaQueryList.matches);
    // add the listener to the media query list
    mediaQueryList.addEventListener('change', _listener);
    // cleanup function to remove the listener
    return () => {
      mediaQueryList.removeEventListener('change', _listener);
    };
  }, [query, _listener, setIsMatch]);

  // returns a memoized object containing the breakpoints
  return React.useMemo<boolean>(() => isMatch, [isMatch]);
};
