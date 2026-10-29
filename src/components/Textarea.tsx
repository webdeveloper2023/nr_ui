import {
  forwardRef,
  useId,
  useImperativeHandle,
  useLayoutEffect,
  useRef,
  useState,
  type ChangeEvent,
  type ReactNode,
  type TextareaHTMLAttributes,
} from "react";
import { cn } from "../lib/cn";
import {
  fieldBoxClasses,
  fieldDescriptionClasses,
  fieldErrorClasses,
  fieldLeftLabelR,
  fieldLeftLayoutR,
  fieldText,
  fieldTextR,
  type FieldSize,
  type FieldVariant,
  notchedBox,
  notchedLabel,
  notchedLeft,
  type LabelPlacement,
} from "./fieldStyles";
import { rx, useBreakpoint, useResponsive, type BreakpointClasses, type ResponsiveProp } from "./breakpoints";
import { useFieldDefaults, type NecessityIndicator } from "./formContext";
import { FieldOutline, Label, NecessityMark } from "./Label";

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  /** Shows this component's own loading skeleton (same layout and shape) — set it while data is loading */
  skeleton?: boolean;
  /** Style: primary — white field with a shadow, secondary — gray field (inside cards) */
  variant?: FieldVariant;
  /** Size */
  size?: FieldSize;
  /** Corner radius */
  radius?: "sm" | "md" | "lg";
  /** Field label */
  label?: ReactNode;
  /** Label placement: outside (above), outside-left (beside), inside (small, inside the box), floating (on the border once focused / filled) or floating-inside (moves to the top inside the box) */
  labelPlacement?: LabelPlacement;
  /** Help shown from an info icon next to the label (outside placements) */
  labelTooltip?: ReactNode;
  /** Content at the far end of the label row (outside placement) */
  labelEndContent?: ReactNode;
  /** Marks the field as optional next to the label */
  isOptional?: boolean;
  /** How required / optional is shown: icon (*) or text ("Required" / "Optional") */
  necessityIndicator?: NecessityIndicator;
  /** Helper text below the field */
  description?: ReactNode;
  /** Text shown in the invalid state */
  errorMessage?: ReactNode;
  /** Invalid state */
  isInvalid?: boolean;
  /** Disabled state */
  isDisabled?: boolean;
  /** Read-only */
  isReadOnly?: boolean;
  /** Required field (shows *) */
  isRequired?: boolean;
  /** Minimum rows */
  minRows?: number;
  /** Maximum rows while auto-growing */
  maxRows?: number;
  /** Disables auto-resizing */
  disableAutosize?: boolean;
  /** Shows the character count (with maxLength) */
  showCount?: boolean;
  /** Called with the new value when it changes */
  onValueChange?: (value: string) => void;
  /** Fills the container width */
  fullWidth?: boolean;
  /** Adapts to the screen: 16px text and roomier padding on mobile (no zoom on focus), larger lg on desktop. true = all breakpoints or a list like ["m", "t"] */
  responsive?: ResponsiveProp;
}

const lineHeight: Record<FieldSize, number> = { xs: 16, sm: 20, md: 20, lg: 24 };
const padding: Record<FieldSize, string> = { xs: "px-2 py-1", sm: "px-2.5 py-1.5", md: "px-3 py-2", lg: "px-3.5 py-2.5" };
const paddingR: Record<FieldSize, BreakpointClasses> = {
  xs: {},
  sm: { m: "mobile:px-3 mobile:py-2" },
  md: { m: "mobile:px-3.5 mobile:py-2.5" },
  lg: { d: "desktop:px-4 desktop:py-3" },
};
const radiusStyles = { sm: "rounded-lg", md: "rounded-xl", lg: "rounded-2xl", full: "rounded-2xl" } as const;

// Label drawn inside the box: room above the text, the resting spot (first line) and the raised spot
const insideTop: Record<FieldSize, string> = { xs: "!pt-5", sm: "!pt-6", md: "!pt-6", lg: "!pt-7" };
const insideLeft: Record<FieldSize, string> = { xs: "left-2", sm: "left-2.5", md: "left-3", lg: "left-3.5" };
const restTop: Record<FieldSize, string> = { xs: "top-5 text-xs", sm: "top-6 text-sm", md: "top-6 text-sm", lg: "top-7 text-base" };
const raisedTop: Record<FieldSize, string> = { xs: "top-1 text-[10px]", sm: "top-1.5 text-[11px]", md: "top-2 text-xs", lg: "top-2 text-xs" };
const raisedWhenActive: Record<FieldSize, string> = {
  xs: "group-focus-within/field:top-1 group-focus-within/field:text-[10px] group-focus-within/field:text-muted group-data-filled/field:top-1 group-data-filled/field:text-[10px] group-data-filled/field:text-muted",
  sm: "group-focus-within/field:top-1.5 group-focus-within/field:text-[11px] group-focus-within/field:text-muted group-data-filled/field:top-1.5 group-data-filled/field:text-[11px] group-data-filled/field:text-muted",
  md: "group-focus-within/field:top-2 group-focus-within/field:text-xs group-focus-within/field:text-muted group-data-filled/field:top-2 group-data-filled/field:text-xs group-data-filled/field:text-muted",
  lg: "group-focus-within/field:top-2 group-focus-within/field:text-xs group-focus-within/field:text-muted group-data-filled/field:top-2 group-data-filled/field:text-xs group-data-filled/field:text-muted",
};

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>((props, ref) => {
  const form = useFieldDefaults();
  const {
    variant = form.variant ?? "primary",
    size = form.size ?? "md",
    radius = (form.radius === "full" ? "lg" : form.radius) ?? "md",
    label,
    labelPlacement = form.labelPlacement ?? "outside",
    labelTooltip,
    labelEndContent,
    isOptional,
    necessityIndicator = form.necessityIndicator ?? "icon",
    description,
    errorMessage,
    isInvalid = false,
    isDisabled = form.isDisabled ?? false,
    isReadOnly = form.isReadOnly ?? false,
    isRequired = false,
    minRows = 3,
    maxRows = 8,
    disableAutosize = false,
    showCount = false,
    onValueChange,
    fullWidth = true,
    responsive,
    className = "",
    value,
    defaultValue,
    onChange,
    maxLength,
    id: idProp,
    ...rest
  } = props;

  const autoId = useId();
  const id = idProp ?? autoId;
  const areaRef = useRef<HTMLTextAreaElement>(null);
  useImperativeHandle(ref, () => areaRef.current as HTMLTextAreaElement);

  const [internalValue, setInternalValue] = useState(String(defaultValue ?? ""));
  const isControlled = value !== undefined;
  const currentValue = isControlled ? String(value ?? "") : internalValue;
  const bps = useResponsive(responsive);
  const bp = useBreakpoint();
  // 16px text on mobile needs a taller line; autosize measures with the line height in use
  const lh = bps.includes(bp) && ((bp === "m" && (size === "sm" || size === "md")) || (bp === "d" && size === "lg")) ? lineHeight[size] + 4 : lineHeight[size];

  useLayoutEffect(() => {
    const el = areaRef.current;
    if (!el || disableAutosize) return;
    el.style.height = "auto";
    const next = Math.min(Math.max(el.scrollHeight, minRows * lh), maxRows * lh);
    el.style.height = `${next}px`;
    el.style.overflowY = el.scrollHeight > maxRows * lh ? "auto" : "hidden";
  }, [currentValue, minRows, maxRows, lh, disableAutosize]);

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    if (!isControlled) setInternalValue(e.target.value);
    onChange?.(e);
    onValueChange?.(e.target.value);
  };

  const showError = isInvalid && Boolean(errorMessage);
  const isLeft = labelPlacement === "outside-left";
  const isInside = Boolean(label) && (labelPlacement === "inside" || labelPlacement === "floating-inside");
  const isFloating = isInside && labelPlacement === "floating-inside";
  const isNotched = Boolean(label) && labelPlacement === "floating";
  const optional = isOptional ?? (Boolean(form.showOptional) && !isRequired);

  return (
    <div
      className={cn(
        "flex",
        isLeft && label ? "flex-row items-start gap-3" : "flex-col gap-1.5",
        isLeft && label && rx(bps, fieldLeftLayoutR),
        fullWidth ? "w-full" : cn("w-fit", rx(bps, { m: "mobile:w-full" })),
        isDisabled && "opacity-50 pointer-events-none",
        className
      )}
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
          className={cn(isLeft && cn("shrink-0 pt-2", rx(bps, fieldLeftLabelR)))}
        >
          {label}
        </Label>
      )}
      <div className="flex min-w-0 flex-1 flex-col gap-1.5">
        <div
          onClick={() => areaRef.current?.focus()}
          data-filled={currentValue.length > 0 || undefined}
          className={cn(
            "group/field relative flex w-full cursor-text",
            padding[size],
            rx(bps, paddingR[size]),
            isInside && insideTop[size],
            radiusStyles[radius],
            isNotched ? cn(notchedBox(variant), "mt-1.5") : fieldBoxClasses(variant, isInvalid)
          )}
        >
          {isNotched && (
            <>
              <FieldOutline label={<>{label}<NecessityMark isRequired={isRequired} isOptional={optional} indicator={necessityIndicator} /></>} size={size} radius={radiusStyles[radius]} raised="auto" isInvalid={isInvalid} />
              <label
                htmlFor={id}
                className={cn(
                  notchedLabel.base,
                  notchedLeft[size],
                  // Rests on the first line, moves onto the border
                  "text-field-placeholder translate-y-0",
                  "top-2.5",
                  size === "lg" ? "text-base" : size === "xs" ? "text-xs" : "text-sm",
                  notchedLabel.whenActive,
                  "group-focus-within/field:-translate-y-1/2 group-data-filled/field:-translate-y-1/2",
                  isInvalid && "text-danger!"
                )}
              >
                {label}
                <NecessityMark isRequired={isRequired} isOptional={optional} indicator={necessityIndicator} />
              </label>
            </>
          )}
          {isInside && (
            <label
              htmlFor={id}
              className={cn(
                "pointer-events-none absolute max-w-[calc(100%-1.5rem)] truncate leading-4 transition-[top,font-size,color] duration-150 ease-out motion-reduce:transition-none",
                insideLeft[size],
                isFloating ? cn(restTop[size], "text-field-placeholder", raisedWhenActive[size]) : cn(raisedTop[size], "font-medium text-muted"),
                isFloating && "group-focus-within/field:font-medium group-data-filled/field:font-medium",
                showError && "text-danger group-focus-within/field:text-danger group-data-filled/field:text-danger"
              )}
            >
              {label}
              <NecessityMark isRequired={isRequired} isOptional={optional} indicator={necessityIndicator} />
            </label>
          )}
          <textarea
            ref={areaRef}
            id={id}
            value={currentValue}
            onChange={handleChange}
            disabled={isDisabled}
            readOnly={isReadOnly}
            required={isRequired}
            maxLength={maxLength}
            rows={minRows}
            aria-invalid={isInvalid || undefined}
            style={{ lineHeight: `${lh}px` }}
            className={cn(
              "w-full bg-transparent outline-none resize-none text-foreground placeholder:text-field-placeholder",
              fieldText[size],
              rx(bps, fieldTextR[size]),
              (isFloating || isNotched) && "placeholder:opacity-0 focus:placeholder:opacity-100",
              disableAutosize && "resize-y"
            )}
            {...rest}
          />
        </div>
        {(showError || description || showCount) && (
          <div className="flex items-start justify-between gap-3">
            {showError ? <p className={fieldErrorClasses}>{errorMessage}</p> : <p className={fieldDescriptionClasses}>{description}</p>}
            {showCount && (
              <span className={cn("shrink-0 text-xs tabular-nums", maxLength && currentValue.length >= maxLength ? "text-danger" : "text-muted")}>
                {currentValue.length}
                {maxLength ? ` / ${maxLength}` : ""}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
});

Textarea.displayName = "Textarea";
export default Textarea;
