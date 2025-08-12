"use client";

import React, { memo, useMemo } from "react";
import { SearchIcon, XIcon } from "lucide-react";
// project
import { cn } from "@/lib/utils";
// components
import { Collapsible, CollapsibleContent } from "@/components/ui/collapsible";
// local
import { CornerNavCarousel } from "./corner-nav-carousel";
import { ScrollProgressIndicator } from "./corner-nav-scroll";
import { CornerNavProvider, useCornerNav } from "./corner-nav-provider";
import {
  headerContainerVariants,
  headerTextWrapVariants,
  type MenuSize,
  MenuSurfaceVariants,
  widgetShellVariants,
} from "./variants";

// Search Bar Component
const CornerNavSearchBar = memo(function CornerNavSearchBar() {
  const { searchQuery, setSearchQuery, notifyActivity } = useCornerNav();

  return (
    <div className="sticky top-0 z-30 bg-slate-800/95 backdrop-blur-sm border-b border-slate-700/50 p-3">
      <div className="relative">
        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            notifyActivity();
          }}
          placeholder="Search apps, settings..."
          className={cn(
            "w-full pl-10 pr-4 py-2.5 rounded-lg text-white placeholder-slate-400 transition-all duration-200",
            "bg-slate-700/80 border border-slate-600/50",
            "focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500/50",
            "hover:bg-slate-700/90 hover:border-slate-500/60",
          )}
        />
      </div>
    </div>
  );
});

// Main Widget Internal Component
interface CornerNavWidgetInternalProps {
  className?: string;
  maxHeight?: number;
  variant?: MenuSurfaceVariants["variant"];
}

const CornerNavWidgetInternal = memo(function CornerNavWidgetInternal({
  children,
  maxHeight = 500,
  className,
  variant = "default",
}: React.PropsWithChildren<CornerNavWidgetInternalProps>) {
  const {
    layout,
    position,
    displayMode,
    size,
    onMouseEnter,
    onMouseLeave,
    notifyActivity,
  } = useCornerNav();

  const isExpanded = layout === "extended";

  const positionClasses = useMemo(() => {
    switch (position) {
      case "top-left":
        return "top-0 left-0";
      case "top-right":
        return "top-0 right-0";
      case "bottom-left":
        return "bottom-0 left-0";
      case "bottom-right":
        return "bottom-0 right-0";
      default:
        return "top-0 right-0";
    }
  }, [position]);

  const cornerRadius = useMemo(() => {
    if (displayMode === "full-collapse") return "rounded-full";

    switch (position) {
      case "top-left":
        return "rounded-br-3xl";
      case "top-right":
        return "rounded-bl-3xl";
      case "bottom-left":
        return "rounded-tr-3xl";
      case "bottom-right":
        return "rounded-tl-3xl";
      default:
        return "rounded-bl-3xl";
    }
  }, [position, displayMode]);

  return (
    <div className={cn("fixed z-40", positionClasses)}>
      <div
        className={cn(
          widgetShellVariants({ size, variant }),
          cornerRadius,
          "max-h-[80vh] sm:max-h-[70vh] md:max-h-none",
          className,
        )}
        style={{ maxHeight: isExpanded ? maxHeight : undefined }}
        onMouseEnter={() => {
          onMouseEnter();
          notifyActivity();
        }}
        onMouseLeave={onMouseLeave}
        onMouseMove={notifyActivity}
        onKeyDown={notifyActivity as any}
      >
        <div className="relative z-10">{children}</div>
      </div>
    </div>
  );
});

// Header Component
interface CornerNavHeaderProps {
  logo?: React.ReactNode;
  title?: string;
  subtitle?: string;
  className?: string;
}

export const CornerNavHeader = memo(function CornerNavHeader({
  logo,
  title,
  subtitle,
  className,
}: CornerNavHeaderProps) {
  const {
    layout,
    position,
    displayMode,
    scrollProgress,
    onClick,
    onClose,
    onMouseEnter,
    size,
  } = useCornerNav();

  const isExpanded = layout === "extended";

  const bannerRadius = useMemo(() => {
    if (displayMode === "full-collapse") return "rounded-full";

    switch (position) {
      case "top-left":
        return "rounded-br-2xl";
      case "top-right":
        return "rounded-bl-2xl";
      case "bottom-left":
        return "rounded-tr-2xl";
      case "bottom-right":
        return "rounded-tl-2xl";
      default:
        return "rounded-bl-2xl";
    }
  }, [position, displayMode]);

  const handleCloseClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onClose();
  };

  // Full collapse mode
  if (displayMode === "full-collapse") {
    return (
      <div
        className={cn(
          "flex items-center justify-center p-3 cursor-pointer transition-all duration-300 hover:scale-105",
          "bg-slate-800/90 border border-slate-700/60 hover:border-teal-500/50",
          "shadow-lg hover:shadow-xl",
          bannerRadius,
          className,
        )}
        onClick={onClick}
        onMouseEnter={onMouseEnter}
      >
        {logo}
      </div>
    );
  }

  return (
    <div
      className={cn(
        headerContainerVariants({ size: layout }),
        !isExpanded && bannerRadius,
        "hover:bg-accent/50",
        className,
      )}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
    >
      <ScrollProgressIndicator
        progress={scrollProgress.get()}
        position={position}
        isExpanded={layout === "extended"}
      />

      {logo && (
        <div className="flex-shrink-0 transition-transform duration-200 hover:scale-110">
          {logo}
        </div>
      )}

      <div className={cn(headerTextWrapVariants({ size }))}>
        {title && (
          <span className="text-sm font-medium tracking-wide block">
            {title}
          </span>
        )}
        {subtitle && (
          <div className="text-xs text-slate-300/80 opacity-75">{subtitle}</div>
        )}
      </div>

      {isExpanded && (
        <button
          onClick={handleCloseClick}
          className="p-1.5 text-slate-400 hover:text-teal-400 hover:bg-teal-500/10 transition-all duration-200 rounded-lg z-20"
          aria-label="Close"
        >
          <XIcon className="w-4 h-4" />
        </button>
      )}
    </div>
  );
});

// Content Component (Now powered by shadcn/ui Collapsible + Tailwind animations)
interface CornerNavContentProps {
  children: React.ReactNode;
  className?: string;
}

export const CornerNavContent = memo(
  function CornerNavContent({ children, className }: CornerNavContentProps) {
    const { layout, displayMode } = useCornerNav();

    const isExpanded = layout === "extended";

    if (displayMode === "full-collapse") return null;

    return (
      <Collapsible open={isExpanded}>
        <CollapsibleContent
          className={cn(
            "data-[state=open]:animate-in data-[state=open]:fade-in data-[state=open]:slide-in-from-top-2",
            "data-[state=closed]:animate-out data-[state=closed]:fade-out data-[state=closed]:slide-out-to-top-2",
            "overflow-hidden z-20",
          )}
        >
          <div className={cn("flex flex-col overflow-visible", className)}>
            <CornerNavSearchBar />
            {children}
          </div>
        </CollapsibleContent>
      </Collapsible>
    );
  },
);

// Category Component
export const CornerNavCategory = memo(
  function CornerNavCategory(
    { children, className, title, ...props }:
      & Omit<React.ComponentPropsWithoutRef<"div">, "title">
      & React.PropsWithChildren<{ title?: string }>,
  ) {
    return (
      <div {...props} className={cn("", className)}>
        {title && (
          <div className="text-xs font-semibold text-teal-400/90 uppercase tracking-wider mb-3">
            {title}
          </div>
        )}
        <div className="grid grid-cols-2 gap-2">{children}</div>
      </div>
    );
  },
);

// Item Component
interface CornerNavItemProps {
  icon: React.ReactNode;
  label: string;
  href?: string;
  onClick?: () => void;
  className?: string;
}

export const CornerNavItem = memo(
  function CornerNavItem(
    { icon, label, href, onClick, className }: CornerNavItemProps,
  ) {
    const Component = (href ? "a" : "button") as any;
    return (
      <div className="relative group">
        <Component
          href={href}
          onClick={onClick}
          className={cn(
            "flex flex-col items-center justify-center p-2 rounded-lg transition-all duration-200 w-full group-hover:scale-105",
            "bg-slate-800/60 hover:bg-slate-700/80 border border-slate-700/40 hover:border-teal-500/40",
            "text-slate-300 hover:text-white shadow-sm hover:shadow-md",
            className,
          )}
        >
          <div className="mb-1 p-1.5 rounded-md bg-slate-700/60 group-hover:bg-teal-600/20 transition-all duration-200">
            <div className="w-4 h-4 flex items-center justify-center">
              {icon}
            </div>
          </div>

          <span className="text-xs font-medium text-center leading-tight px-1">
            {label}
          </span>
        </Component>

        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-slate-900/95 backdrop-blur-sm text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50 border border-slate-700/50">
          {label}
          <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-2 border-r-2 border-t-2 border-transparent border-t-slate-900/95">
          </div>
        </div>
      </div>
    );
  },
);

// Main Widget Component
interface CornerNavWidgetProps {
  children: React.ReactNode;
  position?: "top-left" | "top-right" | "bottom-left" | "bottom-right";
  maxHeight?: number;
  hoverDelay?: number;
  mouseLeaveDelay?: number;
  displayMode?: "corner" | "full-collapse";
  carouselItems?: any[];
  className?: string;

  // Size/inactivity related props
  inactivityMs?: number;
  initialSize?: MenuSize;
  size?: MenuSize;
}

export const CornerNavWidget = memo(
  function CornerNavWidget(props: CornerNavWidgetProps) {
    const { children, carouselItems = [], ...providerProps } = props;

    return (
      <CornerNavProvider {...providerProps} carouselItems={carouselItems}>
        <CornerNavWidgetInternal {...props}>{children}</CornerNavWidgetInternal>
      </CornerNavProvider>
    );
  },
);

// Export the carousel for use in demos
export { CornerNavCarousel };
