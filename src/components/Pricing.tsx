import type { ReactNode } from "react";
import { Check, X } from "lucide-react";
import { Button } from "./Button";
import { cn } from "../lib/cn";

export type BillingPeriod = "monthly" | "yearly";

export interface BillingToggleProps {
  /** Tanlangan davr */
  value: BillingPeriod;
  /** Davr o'zgarganda chaqiriladi */
  onChange: (value: BillingPeriod) => void;
  /** Yillik variant yonidagi chegirma belgisi */
  yearlyBadge?: string;
  /** Tugma matnlari */
  labels?: { monthly: string; yearly: string };
  /** Qo'shimcha CSS klasslar */
  className?: string;
}

export function BillingToggle({ value, onChange, yearlyBadge = "-20%", labels = { monthly: "Monthly", yearly: "Yearly" }, className = "" }: BillingToggleProps) {
  const options: BillingPeriod[] = ["monthly", "yearly"];
  return (
    <div role="radiogroup" className={cn("relative inline-flex p-1 rounded-full bg-default", className)}>
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
  /** Tarif nomi */
  name: string;
  /** Tarif tavsifi */
  description?: string;
  /** Narx: { monthly, yearly } yoki matn (masalan, "Custom") */
  price: { monthly: number; yearly: number } | string;
  /** Joriy to'lov davri */
  period: BillingPeriod;
  /** Valyuta belgisi */
  currency?: string;
  /** Imkoniyatlar ro'yxati (string yoki { label, included }) */
  features: PricingFeature[];
  /** Imkoniyatlar ro'yxati sarlavhasi */
  featuresTitle?: string;
  /** Asosiy tugma matni */
  ctaLabel?: string;
  /** Tarif tugmasi bosilganda chaqiriladi */
  onSelect?: () => void;
  /** Mashhur tarif sifatida ajratib ko'rsatadi (accent ramka + belgi) */
  isPopular?: boolean;
  /** Mashhur tarif belgisi matni */
  popularLabel?: string;
  /** Ko'rinish: oq surface yoki teskari (qora) karta */
  variant?: "default" | "inverse";
  /** Sarlavha yonidagi ikonka */
  icon?: ReactNode;
  /** Qo'shimcha CSS klasslar */
  className?: string;
}

export function PricingCard({
  name,
  description,
  price,
  period,
  currency = "$",
  features,
  featuresTitle,
  ctaLabel = "Get started",
  onSelect,
  isPopular = false,
  popularLabel = "Most popular",
  variant = "default",
  icon,
  className = "",
}: PricingCardProps) {
  const amount = typeof price === "string" ? price : price[period];
  const isInverse = variant === "inverse";
  const muted = isInverse ? "text-background/60" : "text-muted";

  return (
    <div
      className={cn(
        "relative flex flex-col rounded-3xl p-6",
        isInverse ? "bg-foreground text-background" : "bg-surface text-foreground shadow-surface",
        isPopular && !isInverse && "outline-2 outline-accent",
        className
      )}
    >
      <div className="flex items-center gap-2.5">
        {icon && (
          <span
            className={cn(
              "flex items-center justify-center w-8 h-8 rounded-lg [&_svg]:size-4",
              isInverse ? "bg-background/10 text-background" : "bg-accent-soft text-accent-soft-foreground"
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
              isInverse ? "bg-background/10 text-background" : "bg-accent-soft text-accent-soft-foreground"
            )}
          >
            {popularLabel}
          </span>
        )}
      </div>
      {description && <p className={cn("mt-2 text-sm", muted)}>{description}</p>}

      <div className="mt-6 flex items-baseline gap-1">
        {typeof amount === "number" ? (
          <>
            <span key={`${period}-${amount}`} className="text-4xl font-semibold tracking-tight tabular-nums animate-slide-up">
              {currency}
              {amount}
            </span>
            <span className={cn("text-sm", muted)}>/{period === "monthly" ? "mo" : "yr"}</span>
          </>
        ) : (
          <span className="text-4xl font-semibold tracking-tight">{amount}</span>
        )}
      </div>

      <Button className="mt-6" variant={isPopular || isInverse ? "primary" : "tertiary"} fullWidth onClick={onSelect}>
        {ctaLabel}
      </Button>

      <div className={cn("my-6 h-px", isInverse ? "bg-background/15" : "bg-separator")} />

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
                    ? isInverse
                      ? "bg-background/15 text-background"
                      : "bg-accent-soft text-accent-soft-foreground"
                    : isInverse
                      ? "bg-background/10 text-background/50"
                      : "bg-default text-muted"
                )}
              >
                {included ? <Check size={10} strokeWidth={3} /> : <X size={9} strokeWidth={3} />}
              </span>
              <span className={cn(included ? (isInverse ? "text-background/90" : "text-foreground") : cn(muted, "line-through"))}>{label}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default PricingCard;
