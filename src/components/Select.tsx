import {
  forwardRef,
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type HTMLAttributes,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { cn } from "../lib/cn";
import { rx, useResponsive, type ResponsiveProp } from "./breakpoints";
import { useFieldDefaults, type NecessityIndicator } from "./formContext";
import { FieldOutline, Label, NecessityMark } from "./Label";
import { useLocale } from "./locale";
import {
  fieldBoxClasses,
  fieldDescriptionClasses,
  fieldErrorClasses,
  fieldHeight,
  fieldHeightInside,
  fieldHeightR,
  fieldInsidePadding,
  floatingLabel,
  notchedBox,
  notchedLabel,
  notchedLeft,
  fieldLeftLabelR,
  fieldLeftLayoutR,
  fieldPaddingR,
  fieldTextR,
  fieldPadding,
  fieldRadius,
  fieldText,
  type FieldRadius,
  type FieldSize,
  type FieldVariant,
  type LabelPlacement,
} from "./fieldStyles";

export interface SelectItemData {
  key: string;
  label: ReactNode;
  /** Text used for type-ahead search; defaults to the label */
  textValue?: string;
  startContent?: ReactNode;
  description?: string;
  isDisabled?: boolean;
}

export interface SelectProps extends Omit<HTMLAttributes<HTMLDivElement>, "onChange"> {
  /** Field label */
  label?: ReactNode;
  /** Label placement: outside (above), outside-left (beside), inside (small, inside the box), floating (on the border once open / chosen) or floating-inside (moves to the top inside the box) */
  labelPlacement?: LabelPlacement;
  /** Help shown from an info icon next to the label (outside placements) */
  labelTooltip?: ReactNode;
  /** Content at the far end of the label row (outside placement) */
  labelEndContent?: ReactNode;
  /** Marks the field as optional next to the label */
  isOptional?: boolean;
  /** How required / optional is shown: icon (*) or text ("Required" / "Optional") */
  necessityIndicator?: NecessityIndicator;
  /** Form field name: the selected key is submitted with the form */
  name?: string;
  /** Text shown when nothing is selected */
  placeholder?: string;
  /** Style: primary — white field with a shadow, secondary — gray field (inside cards) */
  variant?: FieldVariant;
  /** Size */
  size?: FieldSize;
  /** Corner radius */
  radius?: FieldRadius;
  /** Disabled state */
  isDisabled?: boolean;
  /** Required field (shows *) */
  isRequired?: boolean;
  /** Invalid state */
  isInvalid?: boolean;
  /** Text shown in the invalid state */
  errorMessage?: ReactNode;
  /** Glass (blur) listbox material; false gives a solid background */
  isBlurred?: boolean;
  /** Glass material: frosted (classic) or liquid (clear glass Liquid). Falls back to the global setting (html data-glass) */
  material?: "frosted" | "liquid";
  /** Adapts to the screen: touch-sized trigger and options with 16px text on mobile, touch-sized on tablet, larger lg on desktop; a left label moves on top on mobile. true = all breakpoints or a list like ["m", "t"] */
  responsive?: ResponsiveProp;
  /** Helper text below the field */
  description?: ReactNode;
  /** Leading content (e.g. an icon) */
  startContent?: ReactNode;
  /** List of options */
  items: SelectItemData[];
  /** Selected item key (controlled) */
  selectedKey?: string;
  /** Initially selected key (uncontrolled) */
  defaultSelectedKey?: string;
  /** Called when the selection changes */
  onSelectionChange?: (key: string) => void;
  /** Shown when the list is empty */
  emptyContent?: ReactNode;
}

export interface SelectItemProps extends Omit<HTMLAttributes<HTMLButtonElement>, "color"> {
  /** Unique item key */
  itemKey: string;
  /** Leading content (e.g. an icon) */
  startContent?: ReactNode;
  /** Description below the item */
  description?: string;
  /** Disabled state */
  isDisabled?: boolean;
  /** Inner content */
  children?: ReactNode;
}

const Chevron = ({ isOpen }: { isOpen: boolean }) => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden className={cn("transition-transform duration-200 ease-out", isOpen && "rotate-180")}>
    <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const CheckIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden className="shrink-0">
    <path d="M3 8.5L6 11.5L13 4.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const POPOVER_GAP = 6;
const POPOVER_MAX_H = 288;

interface PopoverPos {
  top: number;
  left: number;
  width: number;
  maxHeight: number;
  placement: "bottom" | "top";
}

export const Select = forwardRef<HTMLDivElement, SelectProps>((selectProps, ref) => {
    const form = useFieldDefaults();
    const {
      label,
      labelPlacement = form.labelPlacement ?? "outside",
      labelTooltip,
      labelEndContent,
      isOptional,
      necessityIndicator = form.necessityIndicator ?? "icon",
      name,
      placeholder,
      variant = form.variant ?? "primary",
      size = form.size ?? "md",
      radius = form.radius ?? "md",
      isDisabled = form.isDisabled ?? false,
      isRequired = false,
      isInvalid = false,
      errorMessage,
      description,
      startContent,
      items,
      selectedKey: controlledKey,
      defaultSelectedKey,
      onSelectionChange,
      emptyContent,
      isBlurred = true,
      material,
      responsive,
      className = "",
      ...props
    } = selectProps;
    const t = useLocale();
    const bps = useResponsive(responsive);
    const id = useId();
    const listId = `${id}-listbox`;
    const [internalKey, setInternalKey] = useState(defaultSelectedKey ?? "");
    const selectedKey = controlledKey ?? internalKey;
    const selectedItem = items.find((i) => i.key === selectedKey);

    const [isOpen, setIsOpen] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [visible, setVisible] = useState(false);
    const [activeIndex, setActiveIndex] = useState(-1);
    const [pos, setPos] = useState<PopoverPos>({ top: 0, left: 0, width: 0, maxHeight: POPOVER_MAX_H, placement: "bottom" });

    const triggerRef = useRef<HTMLButtonElement>(null);
    const listRef = useRef<HTMLDivElement>(null);
    const typeahead = useRef({ text: "", timer: 0 });

    const enabledIndexes = items.map((it, i) => (it.isDisabled ? -1 : i)).filter((i) => i >= 0);

    const open = useCallback(() => {
      if (isDisabled) return;
      const idx = items.findIndex((i) => i.key === selectedKey);
      setActiveIndex(idx >= 0 ? idx : enabledIndexes[0] ?? -1);
      setMounted(true);
      setIsOpen(true);
    }, [isDisabled, items, selectedKey, enabledIndexes]);

    const close = useCallback((refocus = true) => {
      setIsOpen(false);
      if (refocus) triggerRef.current?.focus();
    }, []);

    const select = (key: string) => {
      if (controlledKey === undefined) setInternalKey(key);
      onSelectionChange?.(key);
      close();
    };

    // Mount / animate
    useEffect(() => {
      if (isOpen) {
        const raf = requestAnimationFrame(() => requestAnimationFrame(() => setVisible(true)));
        return () => cancelAnimationFrame(raf);
      }
      setVisible(false);
      const timer = setTimeout(() => setMounted(false), 150);
      return () => clearTimeout(timer);
    }, [isOpen]);

    // Positioning (fixed, flips when there's no room below)
    const updatePosition = useCallback(() => {
      const el = triggerRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const below = window.innerHeight - r.bottom - POPOVER_GAP - 8;
      const above = r.top - POPOVER_GAP - 8;
      const placement = below < 200 && above > below ? "top" : "bottom";
      const maxHeight = Math.min(POPOVER_MAX_H, placement === "bottom" ? below : above);
      setPos({
        top: placement === "bottom" ? r.bottom + POPOVER_GAP : r.top - POPOVER_GAP,
        left: r.left,
        width: r.width,
        maxHeight,
        placement,
      });
    }, []);

    useLayoutEffect(() => {
      if (!isOpen) return;
      updatePosition();
      window.addEventListener("scroll", updatePosition, true);
      window.addEventListener("resize", updatePosition);
      return () => {
        window.removeEventListener("scroll", updatePosition, true);
        window.removeEventListener("resize", updatePosition);
      };
    }, [isOpen, updatePosition]);

    // Click outside
    useEffect(() => {
      if (!isOpen) return;
      const handler = (e: MouseEvent) => {
        const t = e.target as Node;
        if (!triggerRef.current?.contains(t) && !listRef.current?.contains(t)) close(false);
      };
      document.addEventListener("mousedown", handler);
      return () => document.removeEventListener("mousedown", handler);
    }, [isOpen, close]);

    // Keep active option in view
    useEffect(() => {
      if (!isOpen || activeIndex < 0) return;
      listRef.current?.querySelector<HTMLElement>(`[data-index="${activeIndex}"]`)?.scrollIntoView({ block: "nearest" });
    }, [activeIndex, isOpen, visible]);

    const move = (dir: 1 | -1) => {
      if (!enabledIndexes.length) return;
      const cur = enabledIndexes.indexOf(activeIndex);
      const next = cur < 0 ? (dir === 1 ? 0 : enabledIndexes.length - 1) : (cur + dir + enabledIndexes.length) % enabledIndexes.length;
      setActiveIndex(enabledIndexes[next]);
    };

    const onTypeahead = (char: string) => {
      const ta = typeahead.current;
      window.clearTimeout(ta.timer);
      ta.text += char.toLowerCase();
      ta.timer = window.setTimeout(() => (ta.text = ""), 500);
      const match = items.findIndex(
        (it) => !it.isDisabled && (it.textValue ?? (typeof it.label === "string" ? it.label : it.key)).toLowerCase().startsWith(ta.text)
      );
      if (match >= 0) setActiveIndex(match);
    };

    const onKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
      if (isDisabled) return;
      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          if (isOpen) move(1);
          else open();
          break;
        case "ArrowUp":
          e.preventDefault();
          if (isOpen) move(-1);
          else open();
          break;
        case "Home":
          if (isOpen) {
            e.preventDefault();
            setActiveIndex(enabledIndexes[0] ?? -1);
          }
          break;
        case "End":
          if (isOpen) {
            e.preventDefault();
            setActiveIndex(enabledIndexes[enabledIndexes.length - 1] ?? -1);
          }
          break;
        case "Enter":
        case " ":
          e.preventDefault();
          if (isOpen && activeIndex >= 0) select(items[activeIndex].key);
          else if (!isOpen) open();
          break;
        case "Escape":
          if (isOpen) {
            e.preventDefault();
            close();
          }
          break;
        case "Tab":
          if (isOpen) close(false);
          break;
        default:
          if (e.key.length === 1 && !e.metaKey && !e.ctrlKey) {
            if (!isOpen) open();
            onTypeahead(e.key);
          }
      }
    };

    const hasValue = Boolean(selectedItem);
    const isLeft = labelPlacement === "outside-left";
    const isInside = Boolean(label) && (labelPlacement === "inside" || labelPlacement === "floating-inside");
    const isFloating = isInside && labelPlacement === "floating-inside";
    const isNotched = Boolean(label) && labelPlacement === "floating";
    const raised = !(isFloating || isNotched) || hasValue || isOpen || Boolean(startContent);
    const optional = isOptional ?? (Boolean(form.showOptional) && !isRequired);
    const showError = isInvalid && Boolean(errorMessage);

    return (
      <div
        ref={ref}
        className={cn(
          "flex w-full",
          isLeft && label ? "flex-row items-start gap-3" : "flex-col gap-1.5",
          isLeft && label && rx(bps, fieldLeftLayoutR),
          isDisabled && "opacity-50 pointer-events-none",
          className
        )}
        {...props}
      >
        {label && !isInside && !isNotched && (
          <Label
            htmlFor={id}
            isRequired={isRequired}
            isOptional={optional}
            necessityIndicator={necessityIndicator}
            tooltip={labelTooltip}
            endContent={isLeft ? undefined : labelEndContent}
            style={isLeft && form.labelWidth !== undefined ? { width: form.labelWidth } : undefined}
            className={cn(isLeft && cn("shrink-0 justify-center", fieldHeight[size], rx(bps, fieldLeftLabelR)))}
          >
            {label}
          </Label>
        )}
        {name && <input type="hidden" name={name} value={selectedKey ?? ""} disabled={isDisabled} />}
        <div className="flex flex-col gap-1.5 flex-1 min-w-0">
          <button
            ref={triggerRef}
            id={id}
            type="button"
            disabled={isDisabled}
            onClick={() => (isOpen ? close(false) : open())}
            onKeyDown={onKeyDown}
            role="combobox"
            aria-expanded={isOpen}
            aria-haspopup="listbox"
            aria-controls={isOpen ? listId : undefined}
            aria-activedescendant={isOpen && activeIndex >= 0 ? `${id}-opt-${activeIndex}` : undefined}
            aria-invalid={isInvalid || undefined}
            aria-required={isRequired || undefined}
            className={cn(
              "relative w-full flex items-center text-left cursor-pointer outline-none",
              "focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-background",
              fieldPadding[size],
              fieldText[size],
              isInside ? fieldHeightInside[size] : cn(fieldHeight[size], rx(bps, fieldHeightR[size])),
              rx(bps, fieldPaddingR[size]),
              rx(bps, fieldTextR[size]),
              fieldRadius[radius],
              isNotched ? cn("group/field", notchedBox(variant), "mt-1.5") : fieldBoxClasses(variant, isInvalid, isOpen)
            )}
          >
            {isNotched && (
              <>
                <FieldOutline label={<>{label}<NecessityMark isRequired={isRequired} isOptional={optional} indicator={necessityIndicator} /></>} size={size} radius={fieldRadius[radius]} raised={raised} isInvalid={isInvalid} isFocused={isOpen} />
                <span
                  aria-hidden
                  className={cn(notchedLabel.base, notchedLeft[size], raised ? notchedLabel.raised : cn(notchedLabel.rest, floatingLabel.restText[size]), isOpen && "text-accent", isInvalid && "text-danger!")}
                >
                  {label}
                  <NecessityMark isRequired={isRequired} isOptional={optional} indicator={necessityIndicator} />
                </span>
              </>
            )}
            {startContent && <span className="flex items-center shrink-0 text-muted">{startContent}</span>}
            <span className={cn("relative flex-1 min-w-0 flex h-full items-center", isInside && fieldInsidePadding[size])}>
              {isInside && (
                <span
                  aria-hidden
                  className={cn(
                    floatingLabel.base,
                    raised ? cn(floatingLabel.raised, floatingLabel.raisedText[size]) : cn(floatingLabel.rest, floatingLabel.restText[size]),
                    isInvalid && "text-danger"
                  )}
                >
                  {label}
                  <NecessityMark isRequired={isRequired} isOptional={optional} indicator={necessityIndicator} />
                </span>
              )}
              {(isFloating || isNotched) && !raised ? null : hasValue ? (
                <span className="flex items-center gap-2 truncate text-foreground">
                  {selectedItem?.startContent && <span className="inline-flex shrink-0">{selectedItem.startContent}</span>}
                  <span className="truncate">{selectedItem?.label}</span>
                </span>
              ) : (
                <span className="truncate text-field-placeholder">{placeholder ?? t.select.placeholder}</span>
              )}
            </span>
            <span className="shrink-0 text-muted">
              <Chevron isOpen={isOpen} />
            </span>
          </button>

          {showError ? (
            <p className={fieldErrorClasses}>{errorMessage}</p>
          ) : (
            description && <p className={fieldDescriptionClasses}>{description}</p>
          )}
        </div>

        {mounted &&
          createPortal(
            <div
              ref={listRef}
              id={listId}
              role="listbox"
              data-glass={material}
              aria-labelledby={id}
              onMouseDown={(e) => e.preventDefault()}
              className={cn(
                "fixed z-50 p-1.5 overflow-y-auto overscroll-contain",
                "rounded-2xl",
                isBlurred ? "glass-thick" : "bg-overlay shadow-overlay",
                "transition-[opacity,transform] duration-150 ease-out",
                pos.placement === "bottom" ? "origin-top" : "origin-bottom",
                visible ? "opacity-100 scale-100 translate-y-0" : cn("opacity-0 scale-95", pos.placement === "bottom" ? "-translate-y-1" : "translate-y-1")
              )}
              style={{
                top: pos.placement === "bottom" ? pos.top : undefined,
                bottom: pos.placement === "top" ? window.innerHeight - pos.top : undefined,
                left: pos.left,
                width: pos.width,
                maxHeight: pos.maxHeight,
              }}
            >
              {items.length === 0 && <div className="px-2.5 py-3 text-center text-sm text-muted">{emptyContent ?? t.select.empty}</div>}
              {items.map((item, i) => {
                const isSelected = item.key === selectedKey;
                const isActive = i === activeIndex;
                return (
                  <div
                    key={item.key}
                    id={`${id}-opt-${i}`}
                    data-index={i}
                    role="option"
                    aria-selected={isSelected}
                    aria-disabled={item.isDisabled || undefined}
                    onMouseEnter={() => !item.isDisabled && setActiveIndex(i)}
                    onClick={() => !item.isDisabled && select(item.key)}
                    className={cn(
                      "flex items-center gap-2.5 px-2.5 min-h-9 py-1.5 rounded-xl text-sm text-foreground cursor-pointer select-none",
                      // Touch-sized options on mobile / tablet
                      rx(bps, { m: "mobile:min-h-11 mobile:text-base", t: "tablet:min-h-11" }),
                      "transition-colors duration-100",
                      isActive ? "bg-default" : "bg-transparent",
                      item.isDisabled && "opacity-50 pointer-events-none"
                    )}
                  >
                    {item.startContent && <span className="shrink-0 flex items-center text-muted">{item.startContent}</span>}
                    <div className="flex-1 min-w-0">
                      <div className="truncate">{item.label}</div>
                      {item.description && <div className="text-xs text-muted mt-0.5 truncate">{item.description}</div>}
                    </div>
                    {isSelected && <span className="text-accent"><CheckIcon /></span>}
                  </div>
                );
              })}
            </div>,
            document.body
          )}
      </div>
    );
  }
);

Select.displayName = "Select";

export default Select;
