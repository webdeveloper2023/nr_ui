import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { cn } from "../lib/cn";
import { useLocale } from "./locale";
import { rx, useBreakpoint, useResponsive, type BreakpointClasses, type ResponsiveProp } from "./breakpoints";

type PaginationColor = "default" | "accent";
type PaginationSize = "xs" | "sm" | "md" | "lg";
type PaginationVariant = "ghost" | "tertiary" | "surface";

export interface PaginationProps {
  /** Total number of pages */
  total: number;
  /** Current page */
  page: number;
  /** Called when the page changes */
  onChange: (page: number) => void;
  /** Pages shown on each side of the current page */
  siblings?: number;
  /** Active page color: default (black) or accent (blue) */
  color?: PaginationColor;
  /** Size */
  size?: PaginationSize;
  /** Style: ghost (transparent), tertiary (gray), surface (inside a white panel) */
  variant?: PaginationVariant;
  /** Shows previous / next buttons */
  showControls?: boolean;
  /** Packs the buttons tightly into one pill */
  isCompact?: boolean;
  /** Disabled (inactive) state */
  isDisabled?: boolean;
  /** Adapts to the screen: touch-sized (44px for md) buttons and no sibling pages on mobile so it fits a phone, touch-sized on tablet, larger lg on desktop. true = all breakpoints or a list like ["m", "t"] */
  responsive?: ResponsiveProp;
  /** Extra CSS classes */
  className?: string;
}

const sizes: Record<PaginationSize, string> = {
  xs: "min-w-6 h-6 text-[11px]",
  sm: "min-w-8 h-8 text-xs",
  md: "min-w-9 h-9 text-sm",
  lg: "min-w-10 h-10 text-sm",
};

// Mobile / tablet: touch targets. Laptop: static sizes. Desktop: lg grows a step.
const sizesR: Record<PaginationSize, BreakpointClasses> = {
  xs: { m: "mobile:min-w-8 mobile:h-8 mobile:text-xs" },
  sm: { m: "mobile:min-w-10 mobile:h-10 mobile:text-sm", t: "tablet:min-w-9 tablet:h-9" },
  md: { m: "mobile:min-w-11 mobile:h-11", t: "tablet:min-w-11 tablet:h-11" },
  lg: { m: "mobile:min-w-11 mobile:h-11", t: "tablet:min-w-11 tablet:h-11", d: "desktop:min-w-12 desktop:h-12 desktop:text-base" },
};

const activeStyles: Record<PaginationColor, string> = {
  default: "bg-foreground text-background",
  accent: "bg-accent text-accent-foreground",
};

function range(page: number, total: number, siblings: number): (number | "dots")[] {
  const totalShown = siblings * 2 + 5;
  if (total <= totalShown) return Array.from({ length: total }, (_, i) => i + 1);
  const left = Math.max(page - siblings, 1);
  const right = Math.min(page + siblings, total);
  const showLeftDots = left > 3;
  const showRightDots = right < total - 2;
  if (!showLeftDots) return [...Array.from({ length: siblings * 2 + 3 }, (_, i) => i + 1), "dots", total];
  if (!showRightDots) return [1, "dots", ...Array.from({ length: siblings * 2 + 3 }, (_, i) => total - siblings * 2 - 2 + i)];
  return [1, "dots", ...Array.from({ length: right - left + 1 }, (_, i) => left + i), "dots", total];
}

export function Pagination({
  total,
  page,
  onChange,
  siblings = 1,
  color = "default",
  size = "md",
  variant = "ghost",
  showControls = true,
  isCompact = false,
  isDisabled = false,
  responsive,
  className = "",
}: PaginationProps) {
  const t = useLocale();
  const bps = useResponsive(responsive);
  const bp = useBreakpoint();
  // No sibling pages on a phone: 1 … 5 … 20 fits next to the arrows
  const shownSiblings = bp === "m" && bps.includes("m") ? 0 : siblings;
  const base = cn(
    "flex items-center justify-center px-2 rounded-full font-medium tabular-nums select-none cursor-pointer",
    "transition-colors duration-150 active:scale-[0.96]",
    "outline-none focus-visible:z-10 focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-background",
    sizes[size],
    rx(bps, sizesR[size])
  );
  const grouped = isCompact || variant === "surface";
  const idle = cn(
    "text-foreground",
    variant === "tertiary" && !grouped ? "bg-default hover:bg-default-hover" : "hover:bg-default"
  );
  const control = cn(base, idle, "text-muted hover:text-foreground disabled:opacity-40 disabled:pointer-events-none");

  return (
    <nav
      aria-label={t.pagination.label}
      className={cn(
        "inline-flex items-center",
        grouped ? "gap-0.5 rounded-full p-1" : "gap-1",
        variant === "surface" && "bg-surface shadow-surface",
        variant === "tertiary" && grouped && "bg-default",
        isDisabled && "opacity-50 pointer-events-none",
        className
      )}
    >
      {showControls && (
        <button className={control} disabled={page <= 1} onClick={() => onChange(page - 1)} aria-label={t.pagination.previous}>
          <ChevronLeft size={16} />
        </button>
      )}
      {range(page, total, shownSiblings).map((p, i) =>
        p === "dots" ? (
          <span key={`d${i}`} className={cn("flex items-center justify-center text-muted", sizes[size], rx(bps, sizesR[size]))} aria-hidden>
            <MoreHorizontal size={15} />
          </span>
        ) : (
          <button
            key={p}
            className={cn(base, p === page ? cn(activeStyles[color], variant === "tertiary" && grouped && "bg-segment text-foreground shadow-field") : idle)}
            onClick={() => onChange(p)}
            aria-current={p === page ? "page" : undefined}
          >
            {p}
          </button>
        )
      )}
      {showControls && (
        <button className={control} disabled={page >= total} onClick={() => onChange(page + 1)} aria-label={t.pagination.next}>
          <ChevronRight size={16} />
        </button>
      )}
    </nav>
  );
}

export default Pagination;
