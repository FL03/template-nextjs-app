/**
 * Created At: 2025.08.08:11:35:41
 * @author - @FL03
 * @file - corner-nav-carousel.tsx
 */
"use client";
// imports
import React, { memo } from "react";
import { motion, PanInfo, useMotionValue, useTransform } from "motion/react";
// project
import { cn } from "@/lib/utils";
// local
import { useCornerNav } from "./corner-nav-provider";

interface CarouselItem {
  icon: React.ReactNode;
  label: string;
  href?: string;
  onClick?: () => void;
  active?: boolean;
}

interface CornerNavCarouselProps {
  items: CarouselItem[];
  itemsPerView?: number;
  className?: string;
}

export const CornerNavCarousel = memo(function CornerNavCarousel({
  items,
  itemsPerView = 4,
  className,
}: CornerNavCarouselProps) {
  const {
    layout: isExpanded,
    carouselIndex,
    isCarouselCycling,
    onCarouselSwipe,
    notifyActivity,
  } = useCornerNav();

  const x = useMotionValue(0);

  // Subtle perspective effect on drag
  const rotateY = useTransform(x, [-100, 0, 100], [-6, 0, 6]);
  const scale = useTransform(x, [-100, 0, 100], [0.985, 1, 0.985]);

  // Calculate visible items with infinite cycling
  const getVisibleItems = () => {
    const visibleItems = [];
    for (let i = 0; i < itemsPerView; i++) {
      const itemIndex = (carouselIndex + i) % items.length;
      visibleItems.push({
        ...items[itemIndex],
        originalIndex: itemIndex,
        displayIndex: i,
      });
    }
    return visibleItems;
  };

  const visibleItems = getVisibleItems();

  // Handle pan gestures
  const handlePanEnd = (_: any, info: PanInfo) => {
    const threshold = 50;
    if (Math.abs(info.offset.x) > threshold) {
      const direction = info.offset.x > 0 ? "left" : "right";
      onCarouselSwipe(direction);
    }
    x.set(0); // Reset position
  };

  if (!isExpanded) return null;

  return (
    <div className={cn("sticky bottom-0 z-30 p-3", className)}>
      <div
        className={cn(
          "relative mx-auto rounded-xl transition-shadow duration-300",
          "w-2/3",
          "bg-slate-800/95 border border-slate-700/60 shadow-lg",
        )}
      >
        <motion.div
          className="relative z-10 flex items-center justify-center gap-2 px-4 py-2"
          style={{
            x: isCarouselCycling ? x : 0,
            rotateY: isCarouselCycling ? rotateY : 0,
            scale: isCarouselCycling ? scale : 1,
          }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.2}
          onPanEnd={handlePanEnd}
          animate={{ x: 0, rotateY: 0, scale: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          onMouseMove={notifyActivity}
          onPointerDown={notifyActivity}
        >
          {visibleItems.map((item, index) => (
            <CarouselButton
              key={`${item.originalIndex}-${carouselIndex}`}
              {...item}
              index={index}
              isCenter={index === Math.floor(itemsPerView / 2)}
            />
          ))}
        </motion.div>
      </div>
    </div>
  );
});

interface CarouselButtonProps extends CarouselItem {
  index: number;
  isCenter: boolean;
  originalIndex?: number;
  displayIndex?: number;
}

const CarouselButton = memo(function CarouselButton({
  icon,
  label,
  href,
  onClick,
  active = false,
  isCenter,
}: CarouselButtonProps) {
  const { notifyActivity } = useCornerNav();
  const Component = (href ? "a" : "button") as any;

  const handleClick = () => {
    onClick?.();
    notifyActivity();
  };

  return (
    <motion.div
      className="relative group flex-shrink-0"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{
        opacity: 1,
        scale: isCenter ? 1.08 : 1,
        z: isCenter ? 10 : 0,
      }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
      whileHover={{
        scale: isCenter ? 1.12 : 1.04,
        y: -1,
      }}
      whileTap={{ scale: 0.96 }}
    >
      <Component
        href={href}
        onClick={handleClick}
        className={cn(
          "flex items-center justify-center rounded-lg transition-all duration-200",
          "w-7 h-7",
          "bg-slate-700/80 hover:bg-slate-600/90 border border-slate-600/40 hover:border-slate-500/60",
          "text-slate-300 hover:text-white",
          "shadow-sm hover:shadow-md",
          active &&
            "bg-teal-600/90 border-teal-500/60 text-white shadow-teal-500/30",
          isCenter && !active && "ring-1 ring-slate-500/40 bg-slate-700/90",
        )}
        title={label}
      >
        <div className="w-3.5 h-3.5 flex items-center justify-center">
          {icon}
        </div>
      </Component>

      {/* Tooltip */}
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-slate-900/95 backdrop-blur-sm text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50 border border-slate-700/50 shadow-lg">
        {label}
        <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-2 border-r-2 border-t-2 border-transparent border-t-slate-900/95" />
      </div>
    </motion.div>
  );
});

export default CornerNavCarousel;
