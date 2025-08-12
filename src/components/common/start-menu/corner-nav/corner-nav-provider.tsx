/**
 * Created At: 2025.08.08:11:15:13
 * @author - @FL03
 * @file - corner-nav-provider.tsx
 */
"use client";
// imports
import * as React from "react";
import { MotionValue, useScroll } from "motion/react";
// hooks
import { useIsMobile } from "@/hooks/use-mobile";
import { useNavLayout } from "@/hooks/use-corner-nav";
// local
import { type MenuSize } from "./variants";

// Enhanced context with all shared state
interface CornerNavContextValue {
  // Core state
  layout: MenuSize;
  isMobile: boolean;
  isExtended: boolean;
  position: "top-left" | "top-right" | "bottom-left" | "bottom-right";

  // core setters
  setLayout: (layout: MenuSize) => void;

  // Display modes
  displayMode: "corner" | "full-collapse";
  setDisplayMode: (mode: "corner" | "full-collapse") => void;

  // Size state (string-based, future-proof)
  size: MenuSize;
  setSize: (s: MenuSize) => void;
  notifyActivity: () => void;

  // Scroll state
  scrollProgress: MotionValue<number>;

  // Search state
  searchQuery: string;
  setSearchQuery: (query: string) => void;

  // Carousel state
  carouselIndex: number;
  setCarouselIndex: (index: number) => void;
  isCarouselCycling: boolean;
  setIsCarouselCycling: (cycling: boolean) => void;

  // Event handlers
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onClick: () => void;
  onClose: () => void;

  // Carousel handlers
  onCarouselSwipe: (direction: "left" | "right") => void;
  onCarouselCycle: (index: number) => void;
}

const CornerNavContext = React.createContext<CornerNavContextValue | null>(
  null,
);

export function useCornerNav() {
  const context = React.useContext(CornerNavContext);
  if (!context) {
    throw new Error(
      "Corner nav components must be used within CornerNavProvider",
    );
  }
  return context;
}

interface CornerNavProviderProps {
  position?: "top-left" | "top-right" | "bottom-left" | "bottom-right";
  hoverDelay?: number;
  mouseLeaveDelay?: number;
  initialDisplayMode?: "corner" | "full-collapse";
  carouselItems?: any[];

  inactivityMs?: number;
  defaultSize?: MenuSize;
  size?: MenuSize;
}

export const CornerNavProvider: React.FC<
  React.PropsWithChildren<CornerNavProviderProps>
> = ({
  children,
  size: sizeProp,
  carouselItems = [],
  defaultSize = "default",
  hoverDelay = 300,
  inactivityMs = 8000,
  initialDisplayMode = "corner",
  mouseLeaveDelay = 500,
  position = "top-right",
}) => {
  const isMobile = useIsMobile();
  const scrollRef = React.useRef<HTMLDivElement>(null);

  // Core navigation state with mouse leave delay
  const {
    layout,
    isExtended,
    setLayout,
    collapse,
    toggle,
    handleMouseEnter,
    handleMouseLeave,
    handleClick,
    cleanup,
  } = useNavLayout({ isMobile, hoverDelay, mouseLeaveDelay });

  // Scroll progress
  const { scrollYProgress: scrollProgress } = useScroll();

  // Display mode state
  const [displayMode, setDisplayMode] = React.useState<
    "corner" | "full-collapse"
  >(
    initialDisplayMode,
  );

  // Search state
  const [searchQuery, setSearchQuery] = React.useState("");

  // Carousel state
  const [carouselIndex, setCarouselIndex] = React.useState(0);
  const [isCarouselCycling, setIsCarouselCycling] = React.useState(false);

  // Size state (string-based, future-proof)
  const isControlled = sizeProp !== undefined;
  const [_size, _setSize] = React.useState<MenuSize>(
    defaultSize,
  );
  // Inactivity management
  const inactivityTimerRef = React.useRef<NodeJS.Timeout | null>(null);
  const notifyActivity = React.useCallback(() => {
    // Any activity restores default size if we are shrunk
    if (!isControlled && _size !== "default") {
      handleSizeChange("default");
    }
    // Reset inactivity timer
    if (inactivityTimerRef.current) clearTimeout(inactivityTimerRef.current);
    if (!isControlled) {
      inactivityTimerRef.current = setTimeout(() => {
        handleSizeChange("compact");
      }, Math.max(1500, inactivityMs));
    }
  }, [inactivityMs, isControlled, _size]);

  // Start inactivity timer when mounted and whenever size changes via activity
  React.useEffect(() => {
    notifyActivity();
    return () => {
      if (inactivityTimerRef.current) clearTimeout(inactivityTimerRef.current);
    };
  }, [notifyActivity]);

  // Global keyboard shortcut for Ctrl+M
  React.useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key.toLowerCase() === "m") {
        e.preventDefault();
        toggle();
        notifyActivity();
      }
    };

    window.addEventListener("keydown", handleGlobalKeyDown);
    return () => window.removeEventListener("keydown", handleGlobalKeyDown);
  }, [toggle, notifyActivity]);

  // Cleanup on unmount
  React.useEffect(() => cleanup, [cleanup]);

  // Carousel handlers with performance optimization
  const onCarouselSwipe = React.useCallback(
    (direction: "left" | "right") => {
      setIsCarouselCycling(true);
      const newIndex = direction === "left"
        ? (carouselIndex - 1 + carouselItems.length) % carouselItems.length
        : (carouselIndex + 1) % carouselItems.length;
      setCarouselIndex(newIndex);

      // Reset cycling state after animation
      setTimeout(() => setIsCarouselCycling(false), 300);
      notifyActivity();
    },
    [carouselIndex, carouselItems.length, notifyActivity],
  );

  const onCarouselCycle = React.useCallback(
    (index: number) => {
      setIsCarouselCycling(true);
      setCarouselIndex(index % carouselItems.length);
      setTimeout(() => setIsCarouselCycling(false), 300);
      notifyActivity();
    },
    [carouselItems.length, notifyActivity],
  );

  const handleSizeChange = React.useCallback(
    (s: MenuSize) => {
      if (!isControlled) _setSize(s);
    },
    [isControlled],
  );

  // reflect any external size changes
  React.useEffect(() => {
    if (sizeProp && sizeProp !== _size) {
      handleSizeChange(sizeProp);
    }
  }, [_size, sizeProp, handleSizeChange]);

  // redefine external variables
  const size = _size;

  // Memoized context value for performance
  const contextValue = React.useMemo(
    () => ({
      // Core state
      layout,
      isExtended,
      isMobile,
      position,

      setLayout,

      // Display modes
      displayMode,
      setDisplayMode,

      // Size state
      size,
      setSize: handleSizeChange,
      notifyActivity,

      // Scroll state
      scrollProgress,
      scrollRef,

      // Search state
      searchQuery,
      setSearchQuery,

      // Carousel state
      carouselIndex,
      setCarouselIndex,
      isCarouselCycling,
      setIsCarouselCycling,

      // Event handlers
      onMouseEnter: () => {
        handleMouseEnter();
        notifyActivity();
      },
      onMouseLeave: handleMouseLeave,
      onClick: () => {
        handleClick();
        notifyActivity();
      },
      onClose: () => {
        collapse();
        notifyActivity();
      },

      // Carousel handlers
      onCarouselSwipe,
      onCarouselCycle,
    }),
    [
      layout,
      isExtended,
      isMobile,
      position,
      displayMode,
      size,
      scrollProgress,
      scrollRef,
      searchQuery,
      carouselIndex,
      isCarouselCycling,
      setLayout,
      handleMouseEnter,
      handleMouseLeave,
      handleClick,
      collapse,
      onCarouselSwipe,
      onCarouselCycle,
      notifyActivity,
    ],
  );

  return (
    <CornerNavContext.Provider value={contextValue}>
      {children}
    </CornerNavContext.Provider>
  );
};
