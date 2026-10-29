import { forwardRef, type LabelHTMLAttributes, type ReactNode } from "react";
import { Info } from "lucide-react";
import { cn } from "../lib/cn";
import { notchedPad, type FieldSize } from "./fieldStyles";
import { useFieldDefaults, type NecessityIndicator } from "./formContext";
import { useLocale } from "./locale";
import { Tooltip } from "./Tooltip";

type LabelSize = "sm" | "md" | "lg";

export interface LabelProps extends Omit<LabelHTMLAttributes<HTMLLabelElement>, "children"> {
  /** Label text */
  children?: ReactNode;
  /** Size of the text */
  size?: LabelSize;
  /** Marks the field as required (asterisk or "Required", see necessityIndicator) */
  isRequired?: boolean;
  /** Marks the field as optional with a muted "Optional" */
  isOptional?: boolean;
  /** icon — an asterisk for required fields; text — the words "Required" / "Optional" */
  necessityIndicator?: NecessityIndicator;
  /** Help shown from an info icon next to the text */
  tooltip?: ReactNode;
  /** Smaller text under the label */
  description?: ReactNode;
  /** Content at the far end of the label row (a link, a counter, a badge) */
  endContent?: ReactNode;
  /** Dimmed, for a disabled field */
  isDisabled?: boolean;
  /** Danger color, for an invalid field */
  isInvalid?: boolean;
}

const sizeStyles: Record<LabelSize, string> = { sm: "text-xs", md: "text-sm", lg: "text-base" };

/** Marker after the label text: * or the word Required / Optional */
export function NecessityMark({ isRequired, isOptional, indicator }: { isRequired?: boolean; isOptional?: boolean; indicator: NecessityIndicator }) {
  const t = useLocale();
  if (isRequired) {
    return indicator === "text" ? (
      <span className="ml-1.5 rounded-md bg-danger-soft px-1.5 py-px text-[11px] font-medium text-danger-soft-foreground">{t.label.required}</span>
    ) : (
      <span aria-hidden className="ml-0.5 text-danger">
        *
      </span>
    );
  }
  if (isOptional) return <span className="ml-1.5 text-xs font-normal text-muted">{t.label.optional}</span>;
  return null;
}

/**
 * Border of a field whose label sits on it. A fieldset + legend opens a real gap in the line,
 * so it works on any background. `raised`: true / false, or "auto" to follow focus / value (CSS).
 */
export function FieldOutline({
  label,
  size,
  radius,
  raised,
  isInvalid,
  isFocused,
}: {
  label: ReactNode;
  size: FieldSize;
  radius: string;
  raised: boolean | "auto";
  isInvalid?: boolean;
  isFocused?: boolean;
}) {
  return (
    <fieldset
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-x-0 -top-1.5 bottom-0 m-0 min-w-0 border transition-colors duration-150",
        notchedPad[size],
        radius,
        isInvalid
          ? "border-danger"
          : cn(
              "border-border group-hover/field:border-[color-mix(in_oklab,var(--color-border)_55%,var(--color-foreground))]",
              isFocused ? "border-accent" : "group-focus-within/field:border-accent"
            )
      )}
    >
      <legend
        className={cn(
          "invisible float-none h-3 w-auto overflow-hidden whitespace-nowrap p-0 text-xs leading-3 font-medium transition-[max-width] duration-150 motion-reduce:transition-none",
          raised === true
            ? "max-w-full"
            : raised === false
              ? "max-w-[0.01px]"
              : "max-w-[0.01px] group-focus-within/field:max-w-full group-data-filled/field:max-w-full"
        )}
      >
        <span className="inline-block px-1">{label}</span>
      </legend>
    </fieldset>
  );
}

/**
 * Field label with the extras forms usually need: required / optional marker, an info tooltip,
 * a description and an end slot. Use it on its own or let fields render it (they share these props).
 */
export const Label = forwardRef<HTMLLabelElement, LabelProps>(
  (
    {
      children,
      size = "md",
      isRequired,
      isOptional,
      necessityIndicator,
      tooltip,
      description,
      endContent,
      isDisabled,
      isInvalid,
      className,
      style,
      ...props
    },
    ref
  ) => {
    const t = useLocale();
    const form = useFieldDefaults();
    const indicator = necessityIndicator ?? form.necessityIndicator ?? "icon";
    const optional = isOptional ?? (form.showOptional && !isRequired);
    return (
      <div className={cn("flex min-w-0 flex-col gap-0.5", isDisabled && "opacity-50", className)} style={style}>
        <div className="flex min-w-0 items-center gap-1">
          <label
            ref={ref}
            className={cn("min-w-0 select-none font-medium", sizeStyles[size], isInvalid ? "text-danger" : "text-foreground")}
            {...props}
          >
            {children}
            <NecessityMark isRequired={isRequired} isOptional={optional} indicator={indicator} />
          </label>
          {tooltip != null && (
            <Tooltip content={tooltip} size="sm">
              <button
                type="button"
                aria-label={t.label.info}
                className="inline-flex size-5 shrink-0 items-center justify-center rounded-full text-muted transition-colors hover:text-foreground outline-none focus-visible:ring-2 focus-visible:ring-focus cursor-help"
              >
                <Info size={14} aria-hidden />
              </button>
            </Tooltip>
          )}
          {endContent != null && <div className="ml-auto shrink-0 pl-2 text-sm">{endContent}</div>}
        </div>
        {description != null && <p className="text-xs text-muted">{description}</p>}
      </div>
    );
  }
);

Label.displayName = "Label";

export default Label;
