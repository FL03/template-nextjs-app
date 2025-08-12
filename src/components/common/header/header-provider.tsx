/**
 * Created At: 2025.07.06:07:02:17
 * @author - @FL03
 * @file - scaffold-provider.tsx
 */
"use client";
// imports
import * as React from "react";

type HeaderContext = {
  extended: boolean;
};

const HeaderContext = React.createContext<HeaderContext | null>(null);

/** Access the shared context for the scaffold injected by the corresponding provider. */
export const useHeader = () => {
  const ctx = React.useContext(HeaderContext);
  // ensure the context is defined
  if (!ctx) {
    throw new Error(
      "`useHeader` must be used within the bounds of a `HeaderProvider`",
    );
  }
  return ctx;
};

// HeaderProvider
export const HeaderProvider: React.FC<
  React.PropsWithChildren<{ extended?: boolean }>
> = ({ children, extended: extendedProp }) => {
  // memoize any external values
  const extended = React.useMemo(() => extendedProp ?? false, [extendedProp]);

  // declare the memoized values for the scaffold provider
  const ctx = React.useMemo(() => ({ extended }), [extended]);
  return (
    <HeaderContext.Provider value={ctx}>
      {children}
    </HeaderContext.Provider>
  );
};
HeaderProvider.displayName = "HeaderProvider";

export default HeaderProvider;
