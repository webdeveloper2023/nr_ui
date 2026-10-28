import { useState } from "react";
import { Star } from "lucide-react";
import { cn } from "../lib/cn";

type RatingSize = "xs" | "sm" | "md" | "lg";
type RatingColor = "warning" | "accent" | "danger" | "success" | "default";

export interface RatingProps {
  /** Baho (boshqariladigan) */
  value?: number;
  /** Boshlang'ich baho */
  defaultValue?: number;
  /** Baho o'zgarganda chaqiriladi */
  onChange?: (value: number) => void;
  /** Yulduzlar soni */
  max?: number;
  /** O'lcham */
  size?: RatingSize;
  /** To'ldirilgan yulduz rangi */
  color?: RatingColor;
  /** Faqat ko'rsatish, o'zgartirib bo'lmaydi */
  isReadOnly?: boolean;
  /** O'chirilgan holat */
  isDisabled?: boolean;
  /** Raqamli qiymatni yonida ko'rsatadi */
  showValue?: boolean;
  /** Qo'shimcha CSS klasslar */
  className?: string;
}

const sizes: Record<RatingSize, number> = { xs: 12, sm: 16, md: 20, lg: 26 };
const fills: Record<RatingColor, string> = {
  warning: "text-warning fill-warning",
  accent: "text-accent fill-accent",
  danger: "text-danger fill-danger",
  success: "text-success fill-success",
  default: "text-foreground fill-foreground",
};

export function Rating({
  value: valueProp,
  defaultValue = 0,
  onChange,
  max = 5,
  size = "md",
  color = "warning",
  isReadOnly = false,
  isDisabled = false,
  showValue = false,
  className = "",
}: RatingProps) {
  const [valueState, setValueState] = useState(defaultValue);
  const [hover, setHover] = useState<number | null>(null);
  const value = valueProp ?? valueState;
  const shown = hover ?? value;
  const isStatic = isReadOnly || isDisabled;

  const set = (v: number) => {
    if (isStatic) return;
    const next = v === value ? 0 : v;
    setValueState(next);
    onChange?.(next);
  };

  return (
    <div className={cn("inline-flex items-center gap-2", isDisabled && "opacity-50", className)}>
      <div className="flex items-center gap-0.5" role="radiogroup" aria-readonly={isReadOnly} onMouseLeave={() => setHover(null)}>
        {Array.from({ length: max }, (_, i) => {
          const n = i + 1;
          const fillPct = Math.max(0, Math.min(1, shown - i)) * 100;
          return (
            <button
              key={n}
              type="button"
              role="radio"
              aria-checked={value === n}
              aria-label={`${n} star`}
              disabled={isStatic}
              onClick={() => set(n)}
              onMouseEnter={() => !isStatic && setHover(n)}
              className={cn(
                "relative rounded-md transition-transform duration-150",
                "outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                isStatic ? "cursor-default" : "cursor-pointer hover:scale-110 active:scale-95"
              )}
            >
              <Star size={sizes[size]} strokeWidth={1.5} className="text-default fill-default" />
              <span className="absolute inset-0 overflow-hidden transition-[width] duration-150" style={{ width: `${fillPct}%` }}>
                <Star size={sizes[size]} strokeWidth={1.5} className={fills[color]} />
              </span>
            </button>
          );
        })}
      </div>
      {showValue && <span className="text-sm font-medium text-foreground tabular-nums">{value.toFixed(1)}</span>}
    </div>
  );
}

export default Rating;
