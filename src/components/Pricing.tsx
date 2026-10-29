import type { ReactNode } from "react";
import { Check, X } from "lucide-react";
import { Button } from "./Button";
import { cn } from "../lib/cn";
import { useLocale } from "./locale";
import { rx, useResponsive, type BreakpointClasses, type ResponsiveProp } from "./breakpoints";

export type BillingPeriod = "monthly" | "yearly";

export interface BillingToggleProps {
  /** Selected period */
  value: BillingPeriod;
  /** Called when the billing period changes */
  onChange: (value: BillingPeriod) => void;
  /** Discount badge next to the yearly option */
  yearlyBadge?: string;
  /** Button labels */
  labels?: { monthly: string; yearly: string };
  /** Adapts to the screen: fills the width with two equal touch-sized (44px) options on mobile, touch-sized on tablet. true = all breakpoints or a list like ["m", "t"] */
  responsive?: ResponsiveProp;
  /** Extra CSS classes */
  className?: string;
}

const toggleR: BreakpointClasses = { m: "mobile:flex mobile:w-full" };
const toggleOptionR: BreakpointClasses = { m: "mobile:h-11 mobile:min-w-0 mobile:flex-1 mobile:text-base", t: "tablet:h-11" };

export function BillingToggle({ value, onChange, yearlyBadge = "-20%", labels: labelsProp, responsive, className = "" }: BillingToggleProps) {
  const t = useLocale();
  const bps = useResponsive(responsive);
  const labels = labelsProp ?? t.billing;
  const options: BillingPeriod[] = ["monthly", "yearly"];
  return (
    <div role="radiogroup" className={cn("relative inline-flex p-1 rounded-full bg-default", rx(bps, toggleR), className)}>
      <span
        className={cn(
          "absolute top-1 bottom-1 left-1 w-[calc(50%-4px)] rounded-full bg-segment shadow-field",
          "transition-transform duration-300 ease-(--ease-out-soft)",
          value === "yearly" ? "translate-x-full" : "translate-x-0"
        )}
      />
      {options.map((key) => (
        <button
          key={key}
          role="radio"
          aria-checked={value === key}
          onClick={() => onChange(key)}
          className={cn(
            "relative z-10 flex items-center justify-center gap-1.5 min-w-32 h-8 px-4 rounded-full text-sm font-medium cursor-pointer",
            rx(bps, toggleOptionR),
            "transition-colors duration-150 outline-none focus-visible:ring-2 focus-visible:ring-focus",
            value === key ? "text-foreground" : "text-muted hover:text-foreground"
          )}
        >
          {labels[key]}
          {key === "yearly" && yearlyBadge && (
            <span className="rounded-full bg-success-soft px-1.5 py-px text-[11px] font-medium text-success-soft-foreground">{yearlyBadge}</span>
          )}
        </button>
      ))}
    </div>
  );
}

export type PricingFeature = string | { label: string; included: boolean };

export interface PricingCardProps {
  /** Plan name */
  name: string;
  /** Plan description */
  description?: string;
  /** Price: { monthly, yearly } or text (e.g. "Custom") */
  price: { monthly: number; yearly: number } | string;
  /** Current billing period */
  period: BillingPeriod;
  /** Currency symbol */
  currency?: string;
  /** Feature list (string or { label, included }) */
  features: PricingFeature[];
  /** Feature list heading */
  featuresTitle?: string;
  /** Primary button text */
  ctaLabel?: string;
  /** Called when the plan button is pressed */
  onSelect?: () => void;
  /** Highlights the plan as popular (accent border + badge) */
  isPopular?: boolean;
  /** Text of the popular plan badge */
  popularLabel?: string;
  /** Style: default (soft gradient), inverse (dark) or gradient (accent → indigo) */
  variant?: "default" | "inverse" | "gradient";
  /** Makes the card glass — for colorful backgrounds */
  isBlurred?: boolean;
  /** Glass material: frosted (classic) or liquid (clearer, with shining edges). Falls back to the global setting (html data-glass) */
  material?: "frosted" | "liquid";
  /** Icon next to the title */
  icon?: ReactNode;
  /** Adapts to the screen: full width with tighter padding and a smaller price on mobile, roomier padding and a larger price on desktop; the button becomes touch-sized. true = all breakpoints or a list like ["m", "t"] */
  responsive?: ResponsiveProp;
  /** Extra CSS classes */
  className?: string;
}

const cardR: BreakpointClasses = { m: "mobile:w-full mobile:p-5 mobile:rounded-2xl", d: "desktop:p-8" };
const priceR: BreakpointClasses = { m: "mobile:text-3xl", d: "desktop:text-5xl" };

export function PricingCard({
  name,
  description,
  price,
  period,
  currency = "$",
  features,
  featuresTitle,
  ctaLabel,
  onSelect,
  isPopular = false,
  popularLabel,
  variant = "default",
  isBlurred = false,
  material,
  icon,
  responsive,
  className = "",
}: PricingCardProps) {
  const t = useLocale();
  const bps = useResponsive(responsive);
  const amount = typeof price === "string" ? price : price[period];
  const isInverse = variant === "inverse";
  const isGradient = variant === "gradient";
  // Classes for dark-on-light (default), inverse and gradient surfaces
  const tone = (base: string, inverse: string, gradient: string) => (isGradient ? gradient : isInverse ? inverse : base);
  const muted = tone("text-muted", "text-background/60", "text-white/75");

  return (
    <div
      data-glass={material}
      className={cn(
        "relative flex flex-col rounded-3xl p-6",
        rx(bps, cardR),
        tone(
          isBlurred ? "glass text-foreground" : "bg-surface-gradient text-foreground shadow-surface",
          "bg-foreground text-background",
          "bg-linear-to-br from-accent to-indigo text-white shadow-overlay"
        ),
        isPopular && variant === "default" && "outline-2 outline-accent",
        isPopular && variant === "default" && !isBlurred && "[background-image:linear-gradient(160deg,color-mix(in_oklab,var(--color-accent)_6%,var(--color-surface)),var(--color-surface)_45%,color-mix(in_oklab,var(--color-indigo)_6%,var(--color-surface)))]",
        className
      )}
    >
      <div className="flex items-center gap-2.5">
        {icon && (
          <span
            className={cn(
              "flex items-center justify-center w-8 h-8 rounded-lg [&_svg]:size-4",
              tone("bg-accent-soft text-accent-soft-foreground", "bg-background/10 text-background", "bg-white/20 text-white")
            )}
          >
            {icon}
          </span>
        )}
        <h3 className="flex-1 text-base font-semibold">{name}</h3>
        {isPopular && (
          <span
            className={cn(
              "rounded-full px-2.5 h-6 inline-flex items-center text-xs font-medium",
              tone("bg-accent-soft text-accent-soft-foreground", "bg-background/10 text-background", "bg-white/20 text-white")
            )}
          >
            {popularLabel ?? t.pricing.popular}
          </span>
        )}
      </div>
      {description && <p className={cn("mt-2 text-sm", muted)}>{description}</p>}

      <div className="mt-6 flex items-baseline gap-1">
        {typeof amount === "number" ? (
          <>
            <span key={`${period}-${amount}`} className={cn("text-4xl font-semibold tracking-tight tabular-nums animate-slide-up", rx(bps, priceR))}>
              {currency}
              {amount}
            </span>
            <span className={cn("text-sm", muted)}>/{period === "monthly" ? "mo" : "yr"}</span>
          </>
        ) : (
          <span className={cn("text-4xl font-semibold tracking-tight", rx(bps, priceR))}>{amount}</span>
        )}
      </div>

      <Button
        className={cn("mt-6", isGradient && "!bg-white !text-accent hover:!bg-white/90")}
        variant={isPopular || isInverse || isGradient ? "primary" : "tertiary"}
        fullWidth
        responsive={bps}
        onClick={onSelect}
      >
        {ctaLabel ?? t.pricing.cta}
      </Button>

      <div className={cn("my-6 h-px", tone("bg-separator", "bg-background/15", "bg-white/20"))} />

      {featuresTitle && <p className={cn("mb-3 text-xs font-medium", muted)}>{featuresTitle}</p>}
      <ul className="space-y-3 text-sm">
        {features.map((f) => {
          const label = typeof f === "string" ? f : f.label;
          const included = typeof f === "string" ? true : f.included;
          return (
            <li key={label} className="flex items-start gap-2.5">
              <span
                className={cn(
                  "mt-0.5 flex items-center justify-center w-4 h-4 rounded-full shrink-0",
                  included
                    ? tone("bg-accent-soft text-accent-soft-foreground", "bg-background/15 text-background", "bg-white/25 text-white")
                    : tone("bg-default text-muted", "bg-background/10 text-background/50", "bg-white/10 text-white/50")
                )}
              >
                {included ? <Check size={10} strokeWidth={3} /> : <X size={9} strokeWidth={3} />}
              </span>
              <span className={cn(included ? tone("text-foreground", "text-background/90", "text-white/90") : cn(muted, "line-through"))}>{label}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default PricingCard;
