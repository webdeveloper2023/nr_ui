import React, { useState, useCallback, forwardRef, type ReactNode, type HTMLAttributes } from "react";

type AccordionVariant = "light" | "shadow" | "bordered" | "splitted";
type AccordionSelectionMode = "single" | "multiple";

export interface AccordionProps extends Omit<HTMLAttributes<HTMLDivElement>, "onChange"> {
  variant?: AccordionVariant;
  selectionMode?: AccordionSelectionMode;
  defaultExpandedKeys?: Set<string>;
  expandedKeys?: Set<string>;
  onExpandedChange?: (keys: Set<string>) => void;
  children?: ReactNode;
}

export interface AccordionItemProps extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  itemKey: string;
  title: ReactNode;
  subtitle?: ReactNode;
  startContent?: ReactNode;
  indicator?: ReactNode;
  isDisabled?: boolean;
  children?: ReactNode;
}

interface AccordionContextValue {
  variant: AccordionVariant;
  expandedKeys: Set<string>;
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
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    className={`transition-transform duration-300 ${isOpen ? "rotate-180" : "rotate-0"}`}
  >
    <path
      d="M5 7.5L10 12.5L15 7.5"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const variantContainerStyles: Record<AccordionVariant, string> = {
  light: "",
  shadow: "rounded-xl shadow-md shadow-default-200/50 bg-white",
  bordered: "rounded-xl border border-default-200",
  splitted: "flex flex-col gap-2",
};

const variantItemStyles: Record<AccordionVariant, { wrapper: string; header: string }> = {
  light: {
    wrapper: "border-b border-default-100 last:border-b-0",
    header: "",
  },
  shadow: {
    wrapper: "border-b border-default-50 last:border-b-0",
    header: "",
  },
  bordered: {
    wrapper: "border-b border-default-100 last:border-b-0",
    header: "",
  },
  splitted: {
    wrapper: "rounded-xl shadow-md shadow-default-200/50 bg-white overflow-hidden",
    header: "",
  },
};

export const Accordion = forwardRef<HTMLDivElement, AccordionProps>(
  (
    {
      variant = "light",
      selectionMode = "single",
      defaultExpandedKeys,
      expandedKeys: controlledKeys,
      onExpandedChange,
      children,
      className = "",
      ...props
    },
    ref
  ) => {
    const [internalKeys, setInternalKeys] = useState<Set<string>>(
      defaultExpandedKeys ?? new Set()
    );
    const expandedKeys = controlledKeys ?? internalKeys;

    const toggleKey = useCallback(
      (key: string) => {
        const next = new Set(expandedKeys);
        if (next.has(key)) {
          next.delete(key);
        } else {
          if (selectionMode === "single") {
            next.clear();
          }
          next.add(key);
        }
        if (!controlledKeys) setInternalKeys(next);
        onExpandedChange?.(next);
      },
      [expandedKeys, selectionMode, controlledKeys, onExpandedChange]
    );

    return (
      <AccordionContext.Provider value={{ variant, expandedKeys, toggleKey }}>
        <div
          ref={ref}
          className={`w-full ${variantContainerStyles[variant]} ${className}`}
          {...props}
        >
          {children}
        </div>
      </AccordionContext.Provider>
    );
  }
);

Accordion.displayName = "Accordion";

export const AccordionItem = forwardRef<HTMLDivElement, AccordionItemProps>(
  (
    {
      itemKey,
      title,
      subtitle,
      startContent,
      indicator,
      isDisabled = false,
      children,
      className = "",
      ...props
    },
    ref
  ) => {
    const { variant, expandedKeys, toggleKey } = useAccordionContext();
    const isOpen = expandedKeys.has(itemKey);
    const styles = variantItemStyles[variant];

    return (
      <div
        ref={ref}
        className={`${styles.wrapper} ${isDisabled ? "opacity-50" : ""} ${className}`}
        {...props}
      >
        {/* Header */}
        <button
          type="button"
          onClick={() => !isDisabled && toggleKey(itemKey)}
          disabled={isDisabled}
          aria-expanded={isOpen}
          className={[
            "w-full flex items-center gap-3 px-4 py-3 text-left",
            "transition-colors duration-150 outline-none cursor-pointer",
            "focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-inset",
            !isDisabled ? "hover:bg-default-50" : "",
            styles.header,
          ].join(" ")}
        >
          {startContent && (
            <span className="flex-shrink-0">{startContent}</span>
          )}
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium text-default-800">{title}</div>
            {subtitle && (
              <div className="text-xs text-default-400 mt-0.5">{subtitle}</div>
            )}
          </div>
          <span className="flex-shrink-0 text-default-400">
            {indicator ?? <ChevronIcon isOpen={isOpen} />}
          </span>
        </button>

        {/* Content with CSS grid height animation */}
        <div
          className="grid transition-[grid-template-rows] duration-300 ease-out"
          style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
        >
          <div className="overflow-hidden">
            <div className="px-4 pb-4 pt-1 text-sm text-default-600">
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
