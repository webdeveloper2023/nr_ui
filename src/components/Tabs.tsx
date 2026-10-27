import { useCallback, useLayoutEffect, useRef, useState, type HTMLAttributes, type KeyboardEvent, type ReactNode } from "react";
import { cn } from "../lib/cn";

type TabsVariant = "primary" | "secondary";
type TabsSize = "sm" | "md" | "lg";
type TabsPlacement = "top" | "bottom" | "start" | "end";

export interface TabItem {
  /** Tab'ning noyob kaliti */
  key: string;
  /** Tab sarlavhasi */
  title: ReactNode;
  /** Sarlavha oldidagi ikonka */
  icon?: ReactNode;
  /** Tab'ni o'chirib qo'yadi */
  isDisabled?: boolean;
}

export interface TabsProps extends Omit<HTMLAttributes<HTMLDivElement>, "onChange" | "children"> {
  /** Ko'rinish: primary (kulrang trek + oq segment) yoki secondary (pastki chiziq) */
  variant?: TabsVariant;
  /** O'lcham */
  size?: TabsSize;
  /** Tablar butun kenglikni egallaydi */
  fullWidth?: boolean;
  /** Tablar joylashuvi kontentga nisbatan */
  placement?: TabsPlacement;
  /** Tablarni vertikal joylashtiradi */
  isVertical?: boolean;
  /** Barcha tablarni o'chiradi */
  isDisabled?: boolean;
  /** O'chirilgan tablar kalitlari */
  disabledKeys?: string[];
  /** Tablar ro'yxati */
  tabs: TabItem[];
  /** Tanlangan tab (controlled) */
  selectedKey?: string;
  /** Boshlang'ich tanlangan tab (uncontrolled) */
  defaultSelectedKey?: string;
  /** Tab almashganda chaqiriladi */
  onSelectionChange?: (key: string) => void;
  /** Tanlangan tab kalitiga qarab panel kontentini qaytaruvchi funksiya */
  children?: (key: string) => ReactNode;
}

const sizeStyles: Record<TabsSize, { tab: string; underline: string }> = {
  sm: { tab: "h-7 px-3 text-xs gap-1.5", underline: "h-8 text-xs gap-1.5" },
  md: { tab: "h-8 px-3.5 text-sm gap-2", underline: "h-10 text-sm gap-2" },
  lg: { tab: "h-10 px-4 text-base gap-2", underline: "h-12 text-base gap-2" },
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
  isDisabled = false,
  disabledKeys = [],
  tabs,
  selectedKey: controlledKey,
  defaultSelectedKey,
  onSelectionChange,
  children,
  className = "",
  ...props
}: TabsProps) => {
  const [internalKey, setInternalKey] = useState(defaultSelectedKey ?? tabs[0]?.key ?? "");
  const selectedKey = controlledKey ?? internalKey;
  const resolvedPlacement: TabsPlacement = isVertical && (placement === "top" || placement === "bottom") ? "start" : placement;
  const vertical = resolvedPlacement === "start" || resolvedPlacement === "end";
  const underline = variant === "secondary";

  const tabRefs = useRef<Map<string, HTMLButtonElement>>(new Map());
  const [cursor, setCursor] = useState<CursorRect | null>(null);
  const [animate, setAnimate] = useState(false);

  const isKeyDisabled = (tab: TabItem) => isDisabled || tab.isDisabled || disabledKeys.includes(tab.key);

  const onSelect = useCallback(
    (key: string) => {
      if (controlledKey === undefined) setInternalKey(key);
      onSelectionChange?.(key);
    },
    [controlledKey, onSelectionChange]
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
    const enabled = tabs.filter((t) => !isKeyDisabled(t));
    const idx = enabled.findIndex((t) => t.key === selectedKey);
    let target = idx;
    if (e.key === keys[0]) target = (idx + 1) % enabled.length;
    else if (e.key === keys[1]) target = (idx - 1 + enabled.length) % enabled.length;
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
      className={cn(
        "relative flex",
        vertical ? "flex-col h-fit" : cn("items-center", fullWidth ? "w-full" : "w-fit"),
        underline
          ? cn("gap-6", vertical ? "gap-1 border-r border-separator pr-4" : "border-b border-separator")
          : cn("bg-default p-1 gap-0.5", vertical ? "rounded-3xl" : "rounded-full"),
        !underline && !vertical && "overflow-x-auto"
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
      {tabs.map((tab) => {
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
            aria-selected={isActive}
            tabIndex={isActive ? 0 : -1}
            disabled={disabled}
            onClick={() => onSelect(tab.key)}
            className={cn(
              "relative z-10 inline-flex items-center font-medium whitespace-nowrap select-none cursor-pointer rounded-full",
              "outline-none transition-colors duration-150",
              "focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-background",
              underline ? sizeStyles[size].underline : sizeStyles[size].tab,
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
    <div role="tabpanel" key={selectedKey} className={cn("animate-fade-in text-sm", vertical ? "flex-1 min-w-0" : "pt-4")}>
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
      {list}
      {panel}
    </div>
  );
};

Tabs.displayName = "Tabs";
export default Tabs;
