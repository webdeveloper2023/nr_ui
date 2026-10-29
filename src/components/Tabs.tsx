import { useCallback, useId, useLayoutEffect, useRef, useState, type HTMLAttributes, type KeyboardEvent, type ReactNode } from "react";
import { cn } from "../lib/cn";
import { rx, useResponsive, type BreakpointClasses, type ResponsiveProp } from "./breakpoints";

type TabsVariant = "primary" | "secondary";
type TabsSize = "xs" | "sm" | "md" | "lg";
type TabsPlacement = "top" | "bottom" | "start" | "end";

export interface TabItem {
  /** Unique tab key */
  key: string;
  /** Tab title */
  title: ReactNode;
  /** Icon before the title */
  icon?: ReactNode;
  /** Disables the tab */
  isDisabled?: boolean;
}

export interface TabsProps extends Omit<HTMLAttributes<HTMLDivElement>, "onChange" | "children"> {
  /** Shows this component's own loading skeleton (same layout and shape) — set it while data is loading */
  skeleton?: boolean;
  /** Style: primary (gray track + white segment) or secondary (underline) */
  variant?: TabsVariant;
  /** Size */
  size?: TabsSize;
  /** Tabs fill the full width */
  fullWidth?: boolean;
  /** Tab list position relative to the content */
  placement?: TabsPlacement;
  /** Lays the tabs out vertically */
  isVertical?: boolean;
  /** Makes the track glass — looks best over colorful backgrounds or images */
  isBlurred?: boolean;
  /** Glass material: frosted (classic) or liquid (clearer, with shining edges). Falls back to the global setting (html data-glass) */
  material?: "frosted" | "liquid";
  /** Disables all tabs */
  isDisabled?: boolean;
  /** Keys of disabled tabs */
  disabledKeys?: string[];
  /** List of tabs */
  tabs: TabItem[];
  /** Selected tab (controlled) */
  selectedKey?: string;
  /** Initially selected tab (uncontrolled) */
  defaultSelectedKey?: string;
  /** Called when the tab changes */
  onSelectionChange?: (key: string) => void;
  /** Function that returns the panel content for the selected tab key */
  children?: (key: string) => ReactNode;
  /** Adapts to the screen: on mobile a horizontal tab list scrolls sideways instead of squeezing and tabs are touch-sized; touch-sized on tablet; larger lg on desktop. true = all breakpoints or a list like ["m", "t"] */
  responsive?: ResponsiveProp;
}

const sizeStyles: Record<TabsSize, { tab: string; underline: string }> = {
  xs: { tab: "h-6 px-2.5 text-[11px] gap-1", underline: "h-7 text-[11px] gap-1" },
  sm: { tab: "h-7 px-3 text-xs gap-1.5", underline: "h-8 text-xs gap-1.5" },
  md: { tab: "h-8 px-3.5 text-sm gap-2", underline: "h-10 text-sm gap-2" },
  lg: { tab: "h-10 px-4 text-base gap-2", underline: "h-12 text-base gap-2" },
};

// Mobile / tablet: touch-sized tabs. Desktop: lg grows a step.
const sizeStylesR: Record<TabsSize, { tab: BreakpointClasses; underline: BreakpointClasses }> = {
  xs: { tab: { m: "mobile:h-8 mobile:px-3" }, underline: { m: "mobile:h-9" } },
  sm: { tab: { m: "mobile:h-9 mobile:px-3.5 mobile:text-sm", t: "tablet:h-8" }, underline: { m: "mobile:h-10 mobile:text-sm", t: "tablet:h-9" } },
  md: { tab: { m: "mobile:h-10 mobile:px-4", t: "tablet:h-10 tablet:px-4" }, underline: { m: "mobile:h-11", t: "tablet:h-11" } },
  lg: { tab: { d: "desktop:h-12 desktop:px-5" }, underline: { d: "desktop:h-14" } },
};

interface CursorRect {
  x: number;
  y: number;
  w: number;
  h: number;
}

export const Tabs = ({
  variant = "primary",
  size = "md",
  fullWidth = false,
  placement = "top",
  isVertical = false,
  isBlurred = false,
  material,
  isDisabled = false,
  disabledKeys = [],
  tabs,
  selectedKey: controlledKey,
  defaultSelectedKey,
  onSelectionChange,
  children,
  responsive,
  className = "",
  ...props
}: TabsProps) => {
  const bps = useResponsive(responsive);
  const isKeyDisabled = (tab: TabItem) => isDisabled || tab.isDisabled || disabledKeys.includes(tab.key);
  const [internalKey, setInternalKey] = useState(defaultSelectedKey ?? (tabs.find((t) => !isKeyDisabled(t)) ?? tabs[0])?.key ?? "");
  const selectedKey = controlledKey ?? internalKey;
  const baseId = useId();
  const tabId = (index: number) => `${baseId}-tab-${index}`;
  const panelId = `${baseId}-panel`;
  const selectedIndex = tabs.findIndex((t) => t.key === selectedKey);
  // Roving tabindex: the selected tab, or the first enabled one when the selected tab is disabled
  const enabledTabs = tabs.filter((t) => !isKeyDisabled(t));
  const focusKey = enabledTabs.some((t) => t.key === selectedKey) ? selectedKey : enabledTabs[0]?.key;
  const resolvedPlacement: TabsPlacement = isVertical && (placement === "top" || placement === "bottom") ? "start" : placement;
  const vertical = resolvedPlacement === "start" || resolvedPlacement === "end";
  const underline = variant === "secondary";
  // A horizontal list gets a sideways scroller on mobile instead of overflowing the screen
  const scrollOnMobile = !vertical && bps.includes("m");

  const tabRefs = useRef<Map<string, HTMLButtonElement>>(new Map());
  const [cursor, setCursor] = useState<CursorRect | null>(null);
  const [animate, setAnimate] = useState(false);

  const onSelect = useCallback(
    (key: string) => {
      if (controlledKey === undefined) setInternalKey(key);
      onSelectionChange?.(key);
      if (scrollOnMobile) tabRefs.current.get(key)?.scrollIntoView?.({ block: "nearest", inline: "nearest" });
    },
    [controlledKey, onSelectionChange, scrollOnMobile]
  );

  useLayoutEffect(() => {
    const update = () => {
      const el = tabRefs.current.get(selectedKey);
      if (!el) return setCursor(null);
      const next = { x: el.offsetLeft, y: el.offsetTop, w: el.offsetWidth, h: el.offsetHeight };
      setCursor((prev) => (prev && prev.x === next.x && prev.y === next.y && prev.w === next.w && prev.h === next.h ? prev : next));
    };
    update();
    const ro = new ResizeObserver(update);
    tabRefs.current.forEach((el) => ro.observe(el));
    return () => ro.disconnect();
  }, [selectedKey, variant, size, tabs]);

  // Slide the thumb only after the first measured paint (no slide-in on mount)
  useLayoutEffect(() => {
    if (cursor && !animate) {
      const id = requestAnimationFrame(() => setAnimate(true));
      return () => cancelAnimationFrame(id);
    }
  }, [cursor, animate]);

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const keys = vertical ? ["ArrowDown", "ArrowUp"] : ["ArrowRight", "ArrowLeft"];
    if (!keys.includes(e.key) && e.key !== "Home" && e.key !== "End") return;
    e.preventDefault();
    const enabled = enabledTabs;
    if (!enabled.length) return;
    // Move from the focused tab (the selected one may be disabled and unfocusable)
    const idx = enabled.findIndex((t) => tabRefs.current.get(t.key) === document.activeElement);
    let target = idx;
    if (e.key === keys[0]) target = idx < 0 ? 0 : (idx + 1) % enabled.length;
    else if (e.key === keys[1]) target = idx < 0 ? enabled.length - 1 : (idx - 1 + enabled.length) % enabled.length;
    else if (e.key === "Home") target = 0;
    else if (e.key === "End") target = enabled.length - 1;
    const key = enabled[target]?.key;
    if (key) {
      onSelect(key);
      tabRefs.current.get(key)?.focus();
    }
  };

  const cursorStyle = (() => {
    if (!cursor) return { opacity: 0 };
    if (underline) {
      return vertical
        ? { transform: `translate(0px, ${cursor.y}px)`, width: 2, height: cursor.h, right: -1, top: 0 }
        : { transform: `translate(${cursor.x}px, 0px)`, width: cursor.w, height: 2, bottom: -1, left: 0 };
    }
    return { transform: `translate(${cursor.x}px, ${cursor.y}px)`, width: cursor.w, height: cursor.h, top: 0, left: 0 };
  })();

  const list = (
    <div
      role="tablist"
      aria-orientation={vertical ? "vertical" : "horizontal"}
      onKeyDown={handleKeyDown}
      data-glass={material}
      className={cn(
        "relative flex",
        vertical ? "flex-col h-fit" : cn("items-center", fullWidth ? "w-full" : "w-fit"),
        underline
          ? cn("gap-6", vertical ? "gap-1 border-r border-separator pr-4" : "border-b border-separator")
          : cn(isBlurred ? "glass-thin" : "bg-default", "p-1 gap-0.5", vertical ? "rounded-3xl" : "rounded-full"),
        !underline && !vertical && "overflow-x-auto",
        scrollOnMobile && "mobile:w-max mobile:min-w-full",
        underline && !vertical && rx(bps, { m: "mobile:gap-4" })
      )}
    >
      <span
        aria-hidden
        className={cn(
          "absolute z-0 pointer-events-none",
          animate && "transition-[transform,width,height,opacity] duration-300 ease-(--ease-out-soft)",
          underline ? "bg-accent rounded-full" : "bg-segment shadow-field rounded-full"
        )}
        style={cursorStyle}
      />
      {tabs.map((tab, index) => {
        const isActive = selectedKey === tab.key;
        const disabled = isKeyDisabled(tab);
        return (
          <button
            key={tab.key}
            ref={(el) => {
              if (el) tabRefs.current.set(tab.key, el);
              else tabRefs.current.delete(tab.key);
            }}
            type="button"
            role="tab"
            id={tabId(index)}
            aria-selected={isActive}
            aria-controls={isActive && children ? panelId : undefined}
            tabIndex={tab.key === focusKey ? 0 : -1}
            disabled={disabled}
            onClick={() => onSelect(tab.key)}
            className={cn(
              "relative z-10 inline-flex items-center font-medium whitespace-nowrap select-none cursor-pointer rounded-full",
              "outline-none transition-colors duration-150",
              "focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-background",
              underline ? sizeStyles[size].underline : sizeStyles[size].tab,
              rx(bps, underline ? sizeStylesR[size].underline : sizeStylesR[size].tab),
              vertical ? "justify-start" : "justify-center",
              underline && vertical && "px-2",
              fullWidth && !vertical && "flex-1",
              isActive ? "text-foreground" : "text-muted hover:text-foreground",
              disabled && "opacity-50 pointer-events-none"
            )}
          >
            {tab.icon && <span className="flex shrink-0">{tab.icon}</span>}
            <span>{tab.title}</span>
          </button>
        );
      })}
    </div>
  );

  const panel = children ? (
    <div
      role="tabpanel"
      id={panelId}
      aria-labelledby={selectedIndex >= 0 ? tabId(selectedIndex) : undefined}
      tabIndex={0}
      key={selectedKey}
      className={cn("animate-fade-in text-sm rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-focus", vertical ? "flex-1 min-w-0" : "pt-4")}
    >
      {children(selectedKey)}
    </div>
  ) : null;

  return (
    <div
      className={cn(
        "flex",
        vertical ? "gap-6" : "flex-col",
        resolvedPlacement === "bottom" && "flex-col-reverse",
        resolvedPlacement === "end" && "flex-row-reverse",
        className
      )}
      {...props}
    >
      {scrollOnMobile ? (
        <div className="mobile:overflow-x-auto mobile:overscroll-x-contain mobile:[scrollbar-width:none] mobile:[&::-webkit-scrollbar]:hidden">{list}</div>
      ) : (
        list
      )}
      {panel}
    </div>
  );
};

Tabs.displayName = "Tabs";
export default Tabs;
