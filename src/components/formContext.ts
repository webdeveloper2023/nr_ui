// Defaults a <Form> hands to every field inside it. A field's own prop always wins.
import { createContext, useContext } from "react";
import type { FieldRadius, FieldSize, FieldVariant, LabelPlacement } from "./fieldStyles";

/** How required / optional fields are marked: an asterisk, or a short word ("Required" / "Optional") */
export type NecessityIndicator = "icon" | "text";

export interface FieldDefaults {
  labelPlacement?: LabelPlacement;
  size?: FieldSize;
  variant?: FieldVariant;
  radius?: FieldRadius;
  isDisabled?: boolean;
  isReadOnly?: boolean;
  necessityIndicator?: NecessityIndicator;
  /** Marks every field that is not required as "Optional" */
  showOptional?: boolean;
  /** Width of "outside-left" labels, so the fields line up in one column */
  labelWidth?: number | string;
}

export const FormContext = createContext<FieldDefaults>({});

/** Form-level defaults for fields (empty outside a Form) */
export const useFieldDefaults = () => useContext(FormContext);

export type FormValues = Record<string, FormDataEntryValue | FormDataEntryValue[]>;

/** Reads every named field of a form; repeated names (checkbox groups) become arrays */
export function readFormValues(form: HTMLFormElement): FormValues {
  const out: FormValues = {};
  new FormData(form).forEach((value, key) => {
    const prev = out[key];
    out[key] = prev === undefined ? value : Array.isArray(prev) ? [...prev, value] : [prev, value];
  });
  return out;
}
