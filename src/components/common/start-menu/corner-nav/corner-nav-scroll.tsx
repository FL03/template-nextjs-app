/**
 * Created At: 2025.08.08:11:41:42
 * @author - @FL03
 * @file - corner-nav-scroll.tsx
 */
"use client";
// imports
import React, { memo } from "react";
import { motion } from "motion/react";
// project
import { cn } from "@/lib/utils";
// local
import { useCornerNav } from "./corner-nav-provider";

// Scroll Progress Indicator Component
interface ScrollProgressIndicatorProps {
  progress: number;
  position: "top-left" | "top-right" | "bottom-left" | "bottom-right";
  isExpanded: boolean;
}

export const ScrollProgressIndicator = memo(function ScrollProgressIndicator({
  progress,
  position,
  isExpanded,
}: ScrollProgressIndicatorProps) {
  const isBottomPosition = position.includes("bottom");
  const indicatorPosition = isBottomPosition ? "top" : "bottom";

  if (!isExpanded || progress === 0) return null;

  return (
    <div
      className={cn(
        "absolute left-0 right-0 h-0.5 flex justify-center pointer-events-none z-30",
        indicatorPosition === "top" ? "top-0" : "bottom-0",
      )}
    >
      <div
        className="bg-gradient-to-r from-teal-400 to-teal-600 shadow-sm rounded-full transition-all duration-300 ease-out"
        style={{ width: `${Math.min(progress * 90, 90)}%` }}
      />
    </div>
  );
});
ScrollProgressIndicator.displayName = "ScrollProgressIndicator";

// Scrollable Area Component
interface CornerNavScrollAreaProps {
  children: React.ReactNode;
  maxHeight?: number;
  className?: string;
}

export const CornerNavScrollArea = memo(function CornerNavScrollArea({
  children,
  maxHeight = 300,
  className,
}: CornerNavScrollAreaProps) {
  const { scrollProgress } = useCornerNav();

  return (
    <motion.div
      className={cn(
        "overflow-y-auto overflow-x-visible",
        "[&::-webkit-scrollbar]:hidden",
        "[-ms-overflow-style:none]",
        "[scrollbar-width:none]",
        "z-10",
        className,
      )}
      style={{
        maxHeight,
        scaleY: scrollProgress,
        scrollBehavior: "smooth",
        transform: "translateZ(0)",
        willChange: "scroll-position",
      }}
    >
      {children}
    </motion.div>
  );
});
