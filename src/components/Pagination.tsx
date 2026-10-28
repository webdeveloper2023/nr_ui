import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { cn } from "../lib/cn";

type PaginationColor = "default" | "accent";
type PaginationSize = "xs" | "sm" | "md" | "lg";
type PaginationVariant = "ghost" | "tertiary" | "surface";

export interface PaginationProps {
  /** Jami sahifalar soni */
  total: number;
  /** Joriy sahifa */
  page: number;
  /** Sahifa o'zgarganda chaqiriladi */
  onChange: (page: number) => void;
  /** Joriy sahifa yonida ko'rinadigan sahifalar soni */
  siblings?: number;
  /** Faol sahifa rangi: default (qora) yoki accent (ko'k) */
  color?: PaginationColor;
  /** O'lcham */
  size?: PaginationSize;
  /** Ko'rinish: ghost (shaffof), tertiary (kulrang), surface (oq panel ichida) */
  variant?: PaginationVariant;
  /** Oldingi/keyingi tugmalarini ko'rsatish */
  showControls?: boolean;
  /** Tugmalarni bitta pill ichida zich joylashtirish */
  isCompact?: boolean;
  /** O'chirilgan (faol emas) holat */
  isDisabled?: boolean;
  /** Qo'shimcha CSS klasslar */
  className?: string;
}

const sizes: Record<PaginationSize, string> = {
  xs: "min-w-6 h-6 text-[11px]",
  sm: "min-w-8 h-8 text-xs",
  md: "min-w-9 h-9 text-sm",
  lg: "min-w-10 h-10 text-sm",
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
  className = "",
}: PaginationProps) {
  const base = cn(
    "flex items-center justify-center px-2 rounded-full font-medium tabular-nums select-none cursor-pointer",
    "transition-colors duration-150 active:scale-[0.96]",
    "outline-none focus-visible:z-10 focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-background",
    sizes[size]
  );
  const grouped = isCompact || variant === "surface";
  const idle = cn(
    "text-foreground",
    variant === "tertiary" && !grouped ? "bg-default hover:bg-default-hover" : "hover:bg-default"
  );
  const control = cn(base, idle, "text-muted hover:text-foreground disabled:opacity-40 disabled:pointer-events-none");

  return (
    <nav
      aria-label="Pagination"
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
        <button className={control} disabled={page <= 1} onClick={() => onChange(page - 1)} aria-label="Previous">
          <ChevronLeft size={16} />
        </button>
      )}
      {range(page, total, siblings).map((p, i) =>
        p === "dots" ? (
          <span key={`d${i}`} className={cn("flex items-center justify-center text-muted", sizes[size])} aria-hidden>
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
        <button className={control} disabled={page >= total} onClick={() => onChange(page + 1)} aria-label="Next">
          <ChevronRight size={16} />
        </button>
      )}
    </nav>
  );
}

export default Pagination;
