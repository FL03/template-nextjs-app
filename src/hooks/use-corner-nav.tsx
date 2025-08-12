/**
 * Created At: 2025.08.08:11:16:31
 * @author - @FL03
 * @file - use-corner-nav.tsx
 */
"use client";
// imports
import * as React from "react";

type NavLayout = "default" | "compact" | "extended";

interface UseCornerNavProps {
  isMobile: boolean;
  hoverDelay?: number;
  mouseLeaveDelay?: number;
}

export const useNavLayout = ({
  isMobile,
  hoverDelay = 300,
  mouseLeaveDelay = 500,
}: UseCornerNavProps) => {
  const [layout, setLayout] = React.useState<NavLayout>("default");
  // declare references for the timeouts
  const hoverTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);
  const leaveTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);
  // true if the layout is extended
  const isExtended = React.useMemo(() => layout === "extended", [layout]);

  const expand = React.useCallback(() => {
    // Clear any pending leave timeout
    if (leaveTimeoutRef.current) {
      clearTimeout(leaveTimeoutRef.current);
      leaveTimeoutRef.current = null;
    }
    setLayout("extended");
  }, []);

  const collapse = React.useCallback(() => {
    setLayout("compact");
  }, []);

  const toggle = React.useCallback(() => {
    setLayout((prev) => {
      switch (prev) {
        case "default":
          return isMobile ? "extended" : "compact";
        case "compact":
          return "extended";
        case "extended":
          return "default";
        default:
          return "default";
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
  }, []);

  return React.useMemo(() => ({
    layout,
    isExtended,
    setLayout,
    expand,
    collapse,
    toggle,
    handleMouseEnter,
    handleMouseLeave,
    handleClick,
    cleanup,
  }), [
    layout,
    isExtended,
    setLayout,
    expand,
    collapse,
    toggle,
    handleMouseEnter,
    handleMouseLeave,
    handleClick,
    cleanup,
  ]);
};
