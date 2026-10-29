// Shared styling for text-field-like controls (Input, Textarea, Select trigger).
import { cn } from "../lib/cn";
import type { BreakpointClasses } from "./breakpoints";

/** primary — white field with a soft shadow (on the gray canvas); secondary — gray fill, no shadow (inside surfaces). */
export type FieldVariant = "primary" | "secondary";
export type FieldSize = "xs" | "sm" | "md" | "lg";
export type FieldRadius = "sm" | "md" | "lg" | "full";
/**
 * outside — above the field; outside-left — beside it; inside — small, inside the box;
 * floating — rests like a placeholder and moves onto the border (which opens around it) on focus / value;
 * floating-inside — rests like a placeholder and moves to the top inside the box
 */
export type LabelPlacement = "outside" | "outside-left" | "inside" | "floating" | "floating-inside";

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

/** Taller boxes for labels drawn inside the field (inside / floating) */
export const fieldHeightInside: Record<FieldSize, string> = {
  xs: "h-10 min-h-10",
  sm: "h-12 min-h-12",
  md: "h-14 min-h-14",
  lg: "h-16 min-h-16",
};

/** Room above the value for the small label */
export const fieldInsidePadding: Record<FieldSize, string> = { xs: "pt-3.5", sm: "pt-4", md: "pt-5", lg: "pt-6" };

/** Position of an inside / floating label: resting (like a placeholder) and raised (small, at the top) */
export const floatingLabel = {
  base: "pointer-events-none absolute left-0 max-w-full origin-left truncate transition-[top,font-size,line-height,color,transform] duration-150 ease-out motion-reduce:transition-none",
  rest: "top-1/2 -translate-y-1/2 text-field-placeholder",
  raised: "translate-y-0 text-muted font-medium",
  restText: { xs: "text-xs", sm: "text-sm", md: "text-sm", lg: "text-base" } as Record<FieldSize, string>,
  raisedText: { xs: "top-1 text-[10px] leading-3", sm: "top-1.5 text-[11px] leading-4", md: "top-2 text-xs leading-4", lg: "top-2.5 text-xs leading-4" } as Record<FieldSize, string>,
  /** Raised while the field is focused or filled (the field box carries group/field and data-filled) */
  raisedWhenActive: {
    xs: "group-focus-within/field:top-1 group-focus-within/field:translate-y-0 group-focus-within/field:text-[10px] group-focus-within/field:leading-3 group-focus-within/field:text-muted group-data-filled/field:top-1 group-data-filled/field:translate-y-0 group-data-filled/field:text-[10px] group-data-filled/field:leading-3 group-data-filled/field:text-muted",
    sm: "group-focus-within/field:top-1.5 group-focus-within/field:translate-y-0 group-focus-within/field:text-[11px] group-focus-within/field:leading-4 group-focus-within/field:text-muted group-data-filled/field:top-1.5 group-data-filled/field:translate-y-0 group-data-filled/field:text-[11px] group-data-filled/field:leading-4 group-data-filled/field:text-muted",
    md: "group-focus-within/field:top-2 group-focus-within/field:translate-y-0 group-focus-within/field:text-xs group-focus-within/field:leading-4 group-focus-within/field:text-muted group-data-filled/field:top-2 group-data-filled/field:translate-y-0 group-data-filled/field:text-xs group-data-filled/field:leading-4 group-data-filled/field:text-muted",
    lg: "group-focus-within/field:top-2.5 group-focus-within/field:translate-y-0 group-focus-within/field:text-xs group-focus-within/field:leading-4 group-focus-within/field:text-muted group-data-filled/field:top-2.5 group-data-filled/field:translate-y-0 group-data-filled/field:text-xs group-data-filled/field:leading-4 group-data-filled/field:text-muted",
  } as Record<FieldSize, string>,
};

// ── Floating label on the border ────────────
/** Left edge of the label = the field's own side padding */
export const notchedLeft: Record<FieldSize, string> = { xs: "left-2", sm: "left-2.5", md: "left-3", lg: "left-3.5" };
/** Side padding of the outline, so the gap in the border lines up with the label */
export const notchedPad: Record<FieldSize, string> = { xs: "px-1", sm: "px-1.5", md: "px-2", lg: "px-2.5" };

export const notchedLabel = {
  base: "pointer-events-none absolute z-[1] max-w-[calc(100%-1.5rem)] origin-left truncate transition-[top,font-size,line-height,color,transform] duration-150 ease-out motion-reduce:transition-none",
  /** On the border */
  raised: "top-0 -translate-y-1/2 text-xs leading-3 font-medium text-muted group-focus-within/field:text-accent",
  /** Inside, like a placeholder */
  rest: "top-1/2 -translate-y-1/2 text-field-placeholder",
  /** Moves onto the border while the box is focused or filled */
  whenActive:
    "group-focus-within/field:top-0 group-focus-within/field:text-xs group-focus-within/field:leading-3 group-focus-within/field:font-medium group-focus-within/field:text-accent! group-data-filled/field:top-0 group-data-filled/field:text-xs group-data-filled/field:leading-3 group-data-filled/field:font-medium group-data-filled/field:text-muted",
};

/** Fill of a box whose border is drawn by the notched outline */
export const notchedBox = (variant: FieldVariant) =>
  cn(fieldTransition, variant === "primary" ? "bg-field" : "bg-field-secondary");

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

// ── Responsive (`responsive` prop) ──────────
// Mobile / tablet: touch-sized fields (44px for md) and 16px text on mobile so the browser does not zoom in on focus.
// Laptop: the static sizes. Desktop: lg grows a step.
export const fieldHeightR: Record<FieldSize, BreakpointClasses> = {
  xs: { m: "mobile:h-8 mobile:min-h-8" },
  sm: { m: "mobile:h-10 mobile:min-h-10", t: "tablet:h-9 tablet:min-h-9" },
  md: { m: "mobile:h-11 mobile:min-h-11", t: "tablet:h-11 tablet:min-h-11" },
  lg: { d: "desktop:h-14 desktop:min-h-14" },
};

export const fieldTextR: Record<FieldSize, BreakpointClasses> = {
  xs: {},
  sm: { m: "mobile:text-base" },
  md: { m: "mobile:text-base" },
  lg: { d: "desktop:text-lg" },
};

export const fieldPaddingR: Record<FieldSize, BreakpointClasses> = {
  xs: { m: "mobile:px-2.5" },
  sm: { m: "mobile:px-3" },
  md: { m: "mobile:px-3.5" },
  lg: { d: "desktop:px-4" },
};

/** "outside-left" labels move on top of the field on mobile */
export const fieldLeftLayoutR: BreakpointClasses = { m: "mobile:flex-col mobile:items-stretch mobile:gap-1.5" };
export const fieldLeftLabelR: BreakpointClasses = { m: "mobile:h-auto mobile:min-h-0" };

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
