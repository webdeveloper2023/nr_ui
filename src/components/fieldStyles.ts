// Shared styling for text-field-like controls (Input, Textarea, Select trigger).
import { cn } from "../lib/cn";

/** primary — white field with a soft shadow (on the gray canvas); secondary — gray fill, no shadow (inside surfaces). */
export type FieldVariant = "primary" | "secondary";
export type FieldSize = "xs" | "sm" | "md" | "lg";
export type FieldRadius = "sm" | "md" | "lg" | "full";
export type LabelPlacement = "outside" | "outside-left";

export const fieldRadius: Record<FieldRadius, string> = {
  sm: "rounded-lg",
  md: "rounded-xl",
  lg: "rounded-2xl",
  full: "rounded-full",
};

export const fieldHeight: Record<FieldSize, string> = {
  xs: "h-7 min-h-7",
  sm: "h-8 min-h-8",
  md: "h-10 min-h-10",
  lg: "h-12 min-h-12",
};

export const fieldText: Record<FieldSize, string> = {
  xs: "text-xs",
  sm: "text-sm",
  md: "text-sm",
  lg: "text-base",
};

export const fieldPadding: Record<FieldSize, string> = {
  xs: "px-2 gap-1",
  sm: "px-2.5 gap-1.5",
  md: "px-3 gap-2",
  lg: "px-3.5 gap-2.5",
};

export const fieldTransition = "transition-[background-color,box-shadow,color] duration-150 ease-out motion-reduce:transition-none";

/**
 * Visual "box" of a field. `isFocused` is for controls whose focus isn't a DOM focus-within (e.g. an open Select).
 */
export function fieldBoxClasses(variant: FieldVariant, isInvalid: boolean, isFocused = false): string {
  return cn(
    fieldTransition,
    variant === "primary"
      ? "bg-field shadow-field hover:bg-[color-mix(in_oklab,var(--color-field)_96%,var(--color-foreground))] focus-within:bg-field"
      : "bg-field-secondary hover:bg-[color-mix(in_oklab,var(--color-field-secondary)_94%,var(--color-foreground))] focus-within:bg-field-secondary",
    // outline (not ring): shadow-field owns box-shadow
    "outline-offset-[-1px]",
    isInvalid
      ? "outline-1 outline-danger focus-within:outline-2"
      : cn("focus-within:outline-1 focus-within:outline-foreground/25", isFocused && "outline-1 outline-foreground/25")
  );
}

export const fieldLabelClasses = "text-sm font-medium text-foreground select-none";
export const fieldDescriptionClasses = "text-xs text-muted";
export const fieldErrorClasses = "text-xs text-danger animate-fade-in";
