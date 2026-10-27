import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  forwardRef,
  createContext,
  useContext,
  type ReactNode,
  type HTMLAttributes,
} from "react";
import { createPortal } from "react-dom";

type SelectVariant = "flat" | "bordered" | "underlined" | "faded";
type SelectColor = "default" | "primary" | "secondary" | "success" | "warning" | "danger";
type SelectSize = "sm" | "md" | "lg";
type SelectRadius = "none" | "sm" | "md" | "lg" | "full";

export interface SelectItemData {
  key: string;
  label: ReactNode;
  startContent?: ReactNode;
  description?: string;
  isDisabled?: boolean;
}

export interface SelectProps extends Omit<HTMLAttributes<HTMLDivElement>, "onChange" | "color"> {
  label?: string;
  placeholder?: string;
  variant?: SelectVariant;
  color?: SelectColor;
  size?: SelectSize;
  radius?: SelectRadius;
  isDisabled?: boolean;
  isRequired?: boolean;
  isInvalid?: boolean;
  errorMessage?: string;
  description?: string;
  items: SelectItemData[];
  selectedKey?: string;
  defaultSelectedKey?: string;
  onSelectionChange?: (key: string) => void;
}

export interface SelectItemProps extends Omit<HTMLAttributes<HTMLButtonElement>, "color"> {
  itemKey: string;
  startContent?: ReactNode;
  description?: string;
  isDisabled?: boolean;
  children?: ReactNode;
}

interface SelectContextValue {
  selectedKey: string;
  onSelect: (key: string) => void;
  setIsOpen: (open: boolean) => void;
}

const SelectContext = createContext<SelectContextValue | null>(null);

const sizeStyles: Record<SelectSize, { trigger: string; text: string; label: string }> = {
  sm: { trigger: "min-h-10", text: "text-xs", label: "text-xs" },
  md: { trigger: "min-h-12", text: "text-sm", label: "text-xs" },
  lg: { trigger: "min-h-14", text: "text-base", label: "text-sm" },
};

const radiusStyles: Record<SelectRadius, string> = {
  none: "rounded-none",
  sm: "rounded-sm",
  md: "rounded-lg",
  lg: "rounded-xl",
  full: "rounded-full",
};

const colorFocusRing: Record<SelectColor, string> = {
  default: "focus-within:ring-default-400",
  primary: "focus-within:ring-primary-500",
  secondary: "focus-within:ring-primary-300",
  success: "focus-within:ring-success-500",
  warning: "focus-within:ring-warning-500",
  danger: "focus-within:ring-danger-500",
};

const variantStyles: Record<SelectVariant, (isInvalid: boolean) => string> = {
  flat: (inv) =>
    `bg-default-100 hover:bg-default-200 ${inv ? "bg-danger-500/10" : ""}`,
  bordered: (inv) =>
    `border-2 ${inv ? "border-danger-500" : "border-default-200 hover:border-default-400"} bg-transparent`,
  underlined: (inv) =>
    `border-b-2 ${inv ? "border-danger-500" : "border-default-200 hover:border-default-400"} bg-transparent rounded-none !rounded-t-lg`,
  faded: (inv) =>
    `border-2 ${inv ? "border-danger-500" : "border-default-200"} bg-default-50 hover:bg-default-100`,
};

const ChevronDown: React.FC<{ isOpen: boolean }> = ({ isOpen }) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
  >
    <path
      d="M4 6L8 10L12 6"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const Select = forwardRef<HTMLDivElement, SelectProps>(
  (
    {
      label,
      placeholder = "Select an option",
      variant = "flat",
      color = "default",
      size = "md",
      radius = "md",
      isDisabled = false,
      isRequired = false,
      isInvalid = false,
      errorMessage,
      description,
      items,
      selectedKey: controlledKey,
      defaultSelectedKey,
      onSelectionChange,
      className = "",
      ...props
    },
    ref
  ) => {
    const [internalKey, setInternalKey] = useState(defaultSelectedKey ?? "");
    const selectedKey = controlledKey ?? internalKey;
    const [isOpen, setIsOpen] = useState(false);
    const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0, width: 0 });
    const triggerRef = useRef<HTMLButtonElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const [mounted, setMounted] = useState(false);
    const [visible, setVisible] = useState(false);

    const selectedItem = items.find((i) => i.key === selectedKey);

    const onSelect = useCallback(
      (key: string) => {
        if (!controlledKey) setInternalKey(key);
        onSelectionChange?.(key);
        setIsOpen(false);
      },
      [controlledKey, onSelectionChange]
    );

    useEffect(() => {
      if (isOpen) {
        setMounted(true);
        requestAnimationFrame(() => {
          requestAnimationFrame(() => setVisible(true));
        });
      } else {
        setVisible(false);
        const timer = setTimeout(() => setMounted(false), 150);
        return () => clearTimeout(timer);
      }
    }, [isOpen]);

    useEffect(() => {
      if (isOpen && triggerRef.current) {
        const rect = triggerRef.current.getBoundingClientRect();
        setDropdownPos({
          top: rect.bottom + 4 + window.scrollY,
          left: rect.left + window.scrollX,
          width: rect.width,
        });
      }
    }, [isOpen]);

    // Click outside
    useEffect(() => {
      if (!isOpen) return;
      const handler = (e: MouseEvent) => {
        const target = e.target as Node;
        if (
          triggerRef.current &&
          !triggerRef.current.contains(target) &&
          dropdownRef.current &&
          !dropdownRef.current.contains(target)
        ) {
          setIsOpen(false);
        }
      };
      document.addEventListener("mousedown", handler);
      return () => document.removeEventListener("mousedown", handler);
    }, [isOpen]);

    // Keyboard
    useEffect(() => {
      if (!isOpen) return;
      const handler = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          setIsOpen(false);
          triggerRef.current?.focus();
        }
      };
      document.addEventListener("keydown", handler);
      return () => document.removeEventListener("keydown", handler);
    }, [isOpen]);

    const hasValue = !!selectedKey;
    const showFloatingLabel = label && (hasValue || isOpen);

    return (
      <div ref={ref} className={`w-full ${className}`} {...props}>
        {/* Trigger */}
        <button
          ref={triggerRef}
          type="button"
          disabled={isDisabled}
          onClick={() => setIsOpen((v) => !v)}
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          className={[
            "relative w-full flex items-center justify-between gap-2 px-3 cursor-pointer",
            "outline-none transition-all duration-200",
            "focus-within:ring-2",
            sizeStyles[size].trigger,
            sizeStyles[size].text,
            variant !== "underlined" ? radiusStyles[radius] : "",
            variantStyles[variant](isInvalid),
            colorFocusRing[color],
            isDisabled ? "opacity-50 pointer-events-none" : "",
          ].join(" ")}
        >
          <div className="flex-1 text-left min-w-0">
            {showFloatingLabel && (
              <span
                className={[
                  "block transition-all duration-200",
                  sizeStyles[size].label,
                  isInvalid ? "text-danger-500" : "text-default-400",
                ].join(" ")}
              >
                {label}
                {isRequired && <span className="text-danger-500 ml-0.5">*</span>}
              </span>
            )}
            {!showFloatingLabel && label && (
              <span className={`text-default-400 ${sizeStyles[size].text}`}>
                {label}
                {isRequired && <span className="text-danger-500 ml-0.5">*</span>}
              </span>
            )}
            {hasValue ? (
              <span className="block truncate text-default-800">
                {selectedItem?.startContent && (
                  <span className="inline-flex mr-2 align-middle">
                    {selectedItem.startContent}
                  </span>
                )}
                {selectedItem?.label}
              </span>
            ) : showFloatingLabel ? (
              <span className="block truncate text-default-400">{placeholder}</span>
            ) : null}
          </div>
          <span className="text-default-400 flex-shrink-0">
            <ChevronDown isOpen={isOpen} />
          </span>
        </button>

        {/* Helper text */}
        {isInvalid && errorMessage && (
          <p className="mt-1.5 text-xs text-danger-500">{errorMessage}</p>
        )}
        {!isInvalid && description && (
          <p className="mt-1.5 text-xs text-default-400">{description}</p>
        )}

        {/* Dropdown */}
        {mounted &&
          createPortal(
            <SelectContext.Provider value={{ selectedKey, onSelect, setIsOpen }}>
              <div
                ref={dropdownRef}
                role="listbox"
                className={[
                  "absolute z-50 py-1 max-h-64 overflow-y-auto",
                  "bg-white rounded-xl shadow-xl shadow-black/10 border border-default-100",
                  "transition-all duration-150 ease-out origin-top",
                  visible
                    ? "opacity-100 scale-100 translate-y-0"
                    : "opacity-0 scale-95 -translate-y-1",
                ].join(" ")}
                style={{
                  top: dropdownPos.top,
                  left: dropdownPos.left,
                  width: dropdownPos.width,
                }}
              >
                {items.map((item) => (
                  <SelectItemInternal key={item.key} item={item} />
                ))}
              </div>
            </SelectContext.Provider>,
            document.body
          )}
      </div>
    );
  }
);

Select.displayName = "Select";

const SelectItemInternal: React.FC<{ item: SelectItemData }> = ({ item }) => {
  const ctx = useContext(SelectContext);
  if (!ctx) return null;

  const isSelected = ctx.selectedKey === item.key;

  return (
    <button
      type="button"
      role="option"
      aria-selected={isSelected}
      disabled={item.isDisabled}
      onClick={() => ctx.onSelect(item.key)}
      className={[
        "w-full flex items-center gap-2 px-3 py-2 text-sm text-left",
        "outline-none transition-colors duration-100 cursor-pointer",
        "focus-visible:bg-default-100",
        isSelected
          ? "bg-primary-50 text-primary-500"
          : "text-default-700 hover:bg-default-100",
        item.isDisabled ? "opacity-50 pointer-events-none" : "",
      ].join(" ")}
    >
      {item.startContent && <span className="flex-shrink-0">{item.startContent}</span>}
      <div className="flex-1 min-w-0">
        <div className="truncate">{item.label}</div>
        {item.description && (
          <div className="text-xs text-default-400 mt-0.5 truncate">
            {item.description}
          </div>
        )}
      </div>
      {isSelected && (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="flex-shrink-0">
          <path
            d="M3 8.5L6 11.5L13 4.5"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
    </button>
  );
};

export default Select;
