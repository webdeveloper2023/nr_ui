import { forwardRef, useMemo, type FormHTMLAttributes, type ReactNode } from "react";
import { cn } from "../lib/cn";
import { ResponsiveContext, spaceClasses, useResponsive, type ResponsiveProp, type ResponsiveValue, type Space } from "./breakpoints";
import type { FieldRadius, FieldSize, FieldVariant, LabelPlacement } from "./fieldStyles";
import { FormContext, readFormValues, type FieldDefaults, type FormValues, type NecessityIndicator } from "./formContext";

type SubmitEventOf = Parameters<NonNullable<FormHTMLAttributes<HTMLFormElement>["onSubmit"]>>[0];

export interface FormProps extends Omit<FormHTMLAttributes<HTMLFormElement>, "children"> {
  /** Label placement of every field inside: outside, outside-left, inside, floating or floating-inside */
  labelPlacement?: LabelPlacement;
  /** Size of every field inside */
  size?: FieldSize;
  /** Style of every field inside: primary or secondary */
  variant?: FieldVariant;
  /** Corner radius of every field inside */
  radius?: FieldRadius;
  /** Disables every field inside */
  isDisabled?: boolean;
  /** Makes every field inside read-only */
  isReadOnly?: boolean;
  /** How required / optional fields are marked: icon (*) or text ("Required" / "Optional") */
  necessityIndicator?: NecessityIndicator;
  /** Marks every field that is not required as "Optional" */
  showOptional?: boolean;
  /** Width of "outside-left" labels, so all fields line up in one column (e.g. 140 or "10rem") */
  labelWidth?: number | string;
  /** Space between the fields (shared spacing scale) */
  gap?: ResponsiveValue<Space>;
  /** Turns on responsive behaviour for every field inside (see ResponsiveProvider). true = all breakpoints or a list like ["m", "t"] */
  responsive?: ResponsiveProp;
  /** Called on submit with the field values by name (the page does not reload) */
  onValues?: (values: FormValues, event: SubmitEventOf) => void;
  /** Fields and buttons */
  children?: ReactNode;
}

/**
 * A form that sets defaults for every field inside — label placement, size, variant, radius,
 * disabled / read-only, required and optional markers — while each field can still override them.
 */
export const Form = forwardRef<HTMLFormElement, FormProps>(
  (
    {
      labelPlacement,
      size,
      variant,
      radius,
      isDisabled,
      isReadOnly,
      necessityIndicator,
      showOptional,
      labelWidth,
      gap = "md",
      responsive,
      onValues,
      onSubmit,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const bps = useResponsive(responsive);
    const defaults = useMemo<FieldDefaults>(
      () => ({ labelPlacement, size, variant, radius, isDisabled, isReadOnly, necessityIndicator, showOptional, labelWidth }),
      [labelPlacement, size, variant, radius, isDisabled, isReadOnly, necessityIndicator, showOptional, labelWidth]
    );

    const handleSubmit = (e: SubmitEventOf) => {
      onSubmit?.(e);
      if (!onValues || e.defaultPrevented) return;
      e.preventDefault();
      onValues(readFormValues(e.currentTarget), e);
    };

    const content = (
      <FormContext.Provider value={defaults}>
        <form
          ref={ref}
          aria-disabled={isDisabled || undefined}
          onSubmit={handleSubmit}
          className={cn("flex w-full flex-col", spaceClasses("gap", gap, bps), className)}
          {...props}
        >
          {children}
        </form>
      </FormContext.Provider>
    );

    // `responsive` on the form reaches every field, like a ResponsiveProvider
    return responsive === undefined ? content : <ResponsiveContext.Provider value={responsive}>{content}</ResponsiveContext.Provider>;
  }
);

Form.displayName = "Form";

export default Form;
