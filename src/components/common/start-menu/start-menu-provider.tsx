/**
 * Created At: 2025.08.07:10:48:57
 * @author - @FL03
 * @file - provider.tsx
 */
"use client";
// imports
import * as React from "react";
// hooks
import { useStartMenu } from "@/hooks/use-start-menu";
// local
import type { Corner } from "./types";

type CornerNavContext = {
  mode: "expanded" | "collapsed";
  isMobile: boolean;
  position: Corner;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onClick: () => void;
  onClose: () => void;
};

type ProviderOptions = {
  collapseOnExitDelay?: number;
  hoverDelay?: number;
  maxHeight?: number;
  position?: Corner;
};

const CornerNavContext = React.createContext<CornerNavContext | null>(null);

export const useControlPanel = () => {
  const context = React.useContext(CornerNavContext);
  if (!context) {
    throw new Error(
      "To access the context of the Start Menu, you must use the `StartMenuProvider`.",
    );
  }
  return context;
};

export const ControlPanelProvider: React.FC<
  React.PropsWithChildren<ProviderOptions>
> = (
  {
    children,
    collapseOnExitDelay = 500,
    hoverDelay = 300,
    position = "top-right",
  } = {},
) => {
  const {
    mode,
    isMobile,
    expand,
    collapse,
    handleMouseEnter,
    handleMouseLeave,
    handleClick,
  } = useStartMenu({
    hoverDelay,
    mouseLeaveDelay: collapseOnExitDelay,
  });

  const contextValue = React.useMemo<CornerNavContext>(() => ({
    mode,
    isMobile,
    position,
    onMouseEnter: handleMouseEnter,
    onMouseLeave: handleMouseLeave,
    onClick: handleClick,
    onClose: collapse,
  }), [
    mode,
    isMobile,
    position,
    handleMouseEnter,
    handleMouseLeave,
    handleClick,
    collapse,
  ]);
  return (
    <CornerNavContext.Provider value={contextValue}>
      {children}
    </CornerNavContext.Provider>
  );
};
ControlPanelProvider.displayName = "CornerNavProvider";

export { CornerNavContext };
