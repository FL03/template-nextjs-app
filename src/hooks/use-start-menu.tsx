/**
 * Created At: 2025.08.07:10:58:11
 * @author - @FL03
 * @file - use-nav.tsx
 */
"use client";
// imports
import React from "react";
// hooks
import { useIsMobile } from "./use-mobile";

interface UseCornerNavProps {
  hoverDelay?: number;
  mouseLeaveDelay?: number;
}

type PanelMode = "expanded" | "collapsed";

type UseNavReturnT = {
  isMobile: boolean;
  mode: PanelMode;
  expand: () => void;
  collapse: () => void;
  toggle: () => void;
  handleMouseEnter: () => void;
  handleMouseLeave: () => void;
  handleClick: () => void;
  cleanup: () => void;
};

export const useStartMenu = ({
  hoverDelay = 300,
  mouseLeaveDelay = 500,
}: UseCornerNavProps): UseNavReturnT => {
  // call the useIsMobile hook to determine if the device is mobile
  const isMobile = useIsMobile();
  // setup the state of the layout
  const [mode, setMode] = React.useState<PanelMode>("collapsed");
  // define the hover and leave timeout refs
  const hoverTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);
  const leaveTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  const expand = React.useCallback(() => {
    // Clear any pending leave timeout
    if (leaveTimeoutRef.current) {
      clearTimeout(leaveTimeoutRef.current);
      leaveTimeoutRef.current = null;
    }
    setMode("expanded");
  }, []);

  const collapse = React.useCallback(() => {
    setMode("collapsed");
  }, []);

  const toggle = React.useCallback(() => {
    setMode((prev) => {
      switch (prev) {
        case "expanded":
          return "collapsed";
        default:
          return "expanded";
      }
    });
  }, []);

  const handleMouseEnter = React.useCallback(() => {
    if (isMobile) return;

    // Clear any pending leave timeout
    if (leaveTimeoutRef.current) {
      clearTimeout(leaveTimeoutRef.current);
      leaveTimeoutRef.current = null;
    }

    // Clear any pending hover timeout
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }

    hoverTimeoutRef.current = setTimeout(expand, hoverDelay);
  }, [isMobile, hoverDelay, expand]);

  const handleMouseLeave = React.useCallback(() => {
    if (isMobile) return;

    // Clear any pending hover timeout
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }

    // Add delay before collapsing to prevent accidental closures
    leaveTimeoutRef.current = setTimeout(collapse, mouseLeaveDelay);
  }, [isMobile, collapse, mouseLeaveDelay]);

  const handleClick = React.useCallback(() => {
    if (isMobile) {
      toggle();
    } else {
      expand();
    }
  }, [isMobile, toggle, expand]);

  // Cleanup function
  const cleanup = React.useCallback(() => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
    if (leaveTimeoutRef.current) {
      clearTimeout(leaveTimeoutRef.current);
      leaveTimeoutRef.current = null;
    }
  }, [hoverTimeoutRef, leaveTimeoutRef]);

  return React.useMemo(() => ({
    isMobile,
    mode,
    expand,
    collapse,
    toggle,
    handleMouseEnter,
    handleMouseLeave,
    handleClick,
    cleanup,
  }), [
    isMobile,
    mode,
    expand,
    collapse,
    toggle,
    handleMouseEnter,
    handleMouseLeave,
    handleClick,
    cleanup,
  ]);
};

export default useStartMenu;
