import React, { useState, useCallback, useId, forwardRef, type ReactNode, type HTMLAttributes } from "react";
import { cn } from "../lib/cn";

type AccordionVariant = "default" | "surface" | "bordered" | "splitted";
type AccordionSelectionMode = "single" | "multiple";

export interface AccordionProps extends Omit<HTMLAttributes<HTMLDivElement>, "onChange"> {
  /** Ko'rinish varianti */
  variant?: AccordionVariant;
  /** Bir vaqtda bitta yoki bir nechta ochilishi */
  selectionMode?: AccordionSelectionMode;
  /** Boshlang'ich ochiq elementlar */
  defaultExpandedKeys?: Set<string>;
  /** Ochiq elementlar (boshqariladigan) */
  expandedKeys?: Set<string>;
  /** Ochiq elementlar o'zgarganda chaqiriladi */
  onExpandedChange?: (keys: Set<string>) => void;
  /** O'chirilgan elementlar kalitlari */
  disabledKeys?: Set<string>;
  /** Ixcham (kichik oraliqlar) */
  isCompact?: boolean;
  /** Elementlar orasida chiziq */
  showDivider?: boolean;
  /** Strelka indikatorini yashirish */
  hideIndicator?: boolean;
  /** Ochilgan holatdagi kontent */
  children?: ReactNode;
}

export interface AccordionItemProps extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  /** Elementning noyob kaliti */
  itemKey?: string;
  /** Sarlavha */
  title: ReactNode;
  /** Sarlavha ostidagi matn */
  subtitle?: ReactNode;
  /** Boshidagi kontent (ikonka va h.k.) */
  startContent?: ReactNode;
  /** Maxsus indikator ikonka */
  indicator?: ReactNode;
  /** O'chirilgan (faol emas) holat */
  isDisabled?: boolean;
  /** Ochilgan holatdagi kontent */
  children?: ReactNode;
}

interface AccordionContextValue {
  variant: AccordionVariant;
  expandedKeys: Set<string>;
  disabledKeys?: Set<string>;
  isCompact: boolean;
  showDivider: boolean;
  hideIndicator: boolean;
  toggleKey: (key: string) => void;
}

const AccordionContext = React.createContext<AccordionContextValue | null>(null);

const useAccordionContext = () => {
  const ctx = React.useContext(AccordionContext);
  if (!ctx) throw new Error("AccordionItem must be used within Accordion");
  return ctx;
};

const ChevronIcon: React.FC<{ isOpen: boolean }> = ({ isOpen }) => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 20 20"
    fill="none"
    className={cn("transition-transform duration-300 ease-(--ease-out-soft)", isOpen ? "rotate-180" : "rotate-0")}
  >
    <path d="M5 7.5L10 12.5L15 7.5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const variantContainerStyles: Record<AccordionVariant, string> = {
  default: "",
  surface: "px-5 rounded-3xl bg-surface-gradient shadow-surface",
  bordered: "px-5 rounded-3xl border border-border",
  splitted: "flex flex-col gap-2",
};

const variantItemStyles: Record<AccordionVariant, string> = {
  default: "",
  surface: "",
  bordered: "",
  splitted: "px-5 rounded-2xl bg-surface-gradient shadow-surface",
};

export const Accordion = forwardRef<HTMLDivElement, AccordionProps>(
  (
    {
      variant = "default",
      selectionMode = "single",
      defaultExpandedKeys,
      expandedKeys: controlledKeys,
      onExpandedChange,
      disabledKeys,
      isCompact = false,
      showDivider = true,
      hideIndicator = false,
      children,
      className = "",
      ...props
    },
    ref
  ) => {
    const [internalKeys, setInternalKeys] = useState<Set<string>>(defaultExpandedKeys ?? new Set());
    const expandedKeys = controlledKeys ?? internalKeys;

    const toggleKey = useCallback(
      (key: string) => {
        const next = new Set(selectionMode === "single" ? [] : expandedKeys);
        if (expandedKeys.has(key)) next.delete(key);
        else next.add(key);
        if (!controlledKeys) setInternalKeys(next);
        onExpandedChange?.(next);
      },
      [expandedKeys, selectionMode, controlledKeys, onExpandedChange]
    );

    return (
      <AccordionContext.Provider
        value={{ variant, expandedKeys, disabledKeys, isCompact, showDivider: showDivider && variant !== "splitted", hideIndicator, toggleKey }}
      >
        <div ref={ref} className={cn("w-full", variantContainerStyles[variant], className)} {...props}>
          {children}
        </div>
      </AccordionContext.Provider>
    );
  }
);

Accordion.displayName = "Accordion";

export const AccordionItem = forwardRef<HTMLDivElement, AccordionItemProps>(
  (
    { itemKey, title, subtitle, startContent, indicator, isDisabled = false, children, className = "", ...props },
    ref
  ) => {
    const { variant, expandedKeys, disabledKeys, isCompact, showDivider, hideIndicator, toggleKey } = useAccordionContext();
    const fallbackKey = useId();
    const key = itemKey ?? fallbackKey;
    const contentId = `${fallbackKey}-content`;
    const isOpen = expandedKeys.has(key);
    const disabled = isDisabled || Boolean(disabledKeys?.has(key));

    return (
      <div
        ref={ref}
        data-open={isOpen || undefined}
        className={cn(
          variantItemStyles[variant],
          showDivider && "border-b border-separator last:border-b-0",
          disabled && "opacity-50",
          className
        )}
        {...props}
      >
        <h3 className="m-0">
          <button
            type="button"
            onClick={() => !disabled && toggleKey(key)}
            disabled={disabled}
            aria-expanded={isOpen}
            aria-controls={contentId}
            className={cn(
              "group w-full flex items-center gap-3 text-left outline-none rounded-xl",
              "transition-opacity duration-150",
              "focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-background",
              isCompact ? "py-2" : "py-4",
              disabled ? "cursor-not-allowed" : "cursor-pointer"
            )}
          >
            {startContent && <span className="flex-shrink-0 flex items-center">{startContent}</span>}
            <span className="flex-1 min-w-0">
              <span className={cn("block font-medium text-foreground", isCompact ? "text-sm" : "text-base")}>{title}</span>
              {subtitle && <span className="block text-sm text-muted mt-0.5 font-normal">{subtitle}</span>}
            </span>
            {!hideIndicator && (
              <span className="flex-shrink-0 text-muted group-hover:text-foreground transition-colors">
                {indicator ?? <ChevronIcon isOpen={isOpen} />}
              </span>
            )}
          </button>
        </h3>

        <div
          id={contentId}
          role="region"
          className="grid transition-[grid-template-rows,opacity] duration-300 ease-(--ease-out-soft)"
          style={{ gridTemplateRows: isOpen ? "1fr" : "0fr", opacity: isOpen ? 1 : 0 }}
        >
          <div className="overflow-hidden" inert={!isOpen}>
            <div className={cn("text-sm leading-6 text-muted", isCompact ? "pb-2" : "pb-4")}>
              {children}
            </div>
          </div>
        </div>
      </div>
    );
  }
);

AccordionItem.displayName = "AccordionItem";

export default Accordion;
