/**
 * Created At: 2025.07.27:17:04:59
 * @author - @FL03
 * @file - portfolio/provider.tsx
 */
"use client";
// imports
import * as React from "react";
// project
import { logger } from "@/lib/logger";
import { useUserPortfolio } from "@/hooks/use-portfolio";
// local
import { PortfolioData } from "./types";

type PortfolioContext = {} & ReturnType<typeof useUserPortfolio>;

// declare the `PortfolioContext` instance which will be used to provide wallet information
const PortfolioContext = React.createContext<PortfolioContext | undefined>(
  undefined,
);

/** Access the current context injected by the `PortfolioProfivder`. */
export const usePortfolio = () => {
  // i
  const context = React.useContext(PortfolioContext);
  if (!context) {
    throw new Error(
      "`usePortfolio` must be used within the bounds of a `PortfolioProvider`",
    );
  }
  return context;
};

type ProviderProps = {
  username?: string;
  onError?: (error: string | null) => void;
  onValueChange?: (data?: PortfolioData | null) => void;
};

/** The `PortfolioProvider` component provides various paramaters, methods, and more */
export const PortfolioProvider: React.FC<
  React.PropsWithChildren<
    ProviderProps
  >
> = ({ children, username, onValueChange, onError }) => {
  // use the hook to access the portfolio data and state
  const { data, state, ...userPortfolio } = useUserPortfolio({
    username,
    onError,
    onValueChange,
  });
  // memoize the context to reduce unnecessary re-renders
  const context = React.useMemo(() => ({ data, state, ...userPortfolio  }), [data, state, userPortfolio]);
  // provide the context with
  return (
    <PortfolioContext.Provider value={context}>
      {children}
    </PortfolioContext.Provider>
  );
};
PortfolioProvider.displayName = "PortfolioProvider";

export default PortfolioProvider;
