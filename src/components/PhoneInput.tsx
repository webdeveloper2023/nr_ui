import {
  forwardRef,
  useImperativeHandle,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type ClipboardEvent,
  type FocusEvent,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import { cn } from "../lib/cn";
import { useLocale } from "./locale";
import { rx, useResponsive, type BreakpointClasses, type ResponsiveProp } from "./breakpoints";
import { Input, type InputProps } from "./Input";
import {
  PHONE_COUNTRIES,
  applyPhoneMask,
  caretAfterDigit,
  detectPhoneCountry,
  flagEmoji,
  getPhoneCountry,
  isPhoneComplete,
  maskDigits,
  onlyDigits,
  toNationalDigits,
  type PhoneCountry,
} from "./phoneMask";

export interface PhoneValueInfo {
  /** Fully formatted: "+998 90 123 45 67" */
  formatted: string;
  /** National digits only: "901234567" */
  national: string;
  /** Selected country */
  country: PhoneCountry;
  /** Whether the number is complete */
  isComplete: boolean;
}

export interface PhoneInputProps
  extends Omit<InputProps, "value" | "defaultValue" | "onValueChange" | "type" | "inputOverlay" | "startContent"> {
  /** Country as an ISO code — 2 letters ("UZ") or 3 letters ("UZB"), case-insensitive */
  country?: string;
  /** Value (E.164 "+998901234567" or digits only) — controlled */
  value?: string;
  /** Initial value (uncontrolled) */
  defaultValue?: string;
  /** Called with the E.164 value ("+998901234567", or "" when empty) and extra info */
  onValueChange?: (value: string, info: PhoneValueInfo) => void;
  /** Lets the user pick the country from a list (flag + dial code button) */
  isCountrySelectable?: boolean;
  /** Called with the ISO alpha-2 code when the country changes */
  onCountryChange?: (iso2: string) => void;
  /** Limits the picker to these countries (ISO codes) */
  countries?: string[];
  /** Character used for empty mask slots */
  placeholderChar?: string;
  /** Shows the remaining part as a gray mask guide */
  showMaskGuide?: boolean;
  /** Flag: emoji, ISO code, none, or your own render function */
  flag?: "emoji" | "code" | "none" | ((country: PhoneCountry) => ReactNode);
  /** Automatically shows an error on blur when the number is incomplete */
  autoValidate?: boolean;
  /** Error text used by autoValidate */
  incompleteMessage?: ReactNode;
  /** Extra leading content (before the flag and dial code) */
  startContent?: ReactNode;
  /** Adapts to the screen like Input (44px field with 16px text on mobile, touch-sized on tablet, larger lg on desktop); the country picker's tap area grows to the full field height on mobile and tablet. true = all breakpoints or a list like ["m", "t"] */
  responsive?: ResponsiveProp;
}

// The country picker is an invisible native select over flag + dial code; on touch screens its tap area
// grows to the full 44px field height
const pickerR: BreakpointClasses = { m: "mobile:-inset-y-3", t: "tablet:-inset-y-3" };

const FALLBACK = getPhoneCountry("UZ") ?? PHONE_COUNTRIES[0];

export const PhoneInput = forwardRef<HTMLInputElement, PhoneInputProps>(
  (
    {
      country: countryProp = "UZ",
      value,
      defaultValue,
      onValueChange,
      isCountrySelectable = false,
      onCountryChange,
      countries,
      placeholderChar = "_",
      showMaskGuide = true,
      flag = "emoji",
      autoValidate = false,
      incompleteMessage,
      startContent,
      isInvalid,
      errorMessage,
      isDisabled,
      size = "md",
      onBlur,
      onKeyDown,
      onPaste,
      placeholder,
      responsive,
      ...props
    },
    ref
  ) => {
    const t = useLocale();
    const bps = useResponsive(responsive);
    const inputRef = useRef<HTMLInputElement>(null);
    useImperativeHandle(ref, () => inputRef.current as HTMLInputElement);

    const [iso2, setIso2] = useState(() => (getPhoneCountry(countryProp) ?? FALLBACK).iso2);
    // Follow `country` prop changes (adjust state during render instead of an effect)
    const [prevCountryProp, setPrevCountryProp] = useState(countryProp);
    if (countryProp !== prevCountryProp) {
      setPrevCountryProp(countryProp);
      const c = getPhoneCountry(countryProp);
      if (c) setIso2(c.iso2);
    }
    const country = getPhoneCountry(iso2) ?? FALLBACK;
    const max = maskDigits(country.mask);

    const isControlled = value !== undefined;
    const [internal, setInternal] = useState(() => toNationalDigits(defaultValue ?? "", country));
    const national = isControlled ? toNationalDigits(value ?? "", country) : internal;
    const { typed, guide } = applyPhoneMask(country.mask, national, placeholderChar);
    const complete = isPhoneComplete(national, country);

    const [blurred, setBlurred] = useState(false);
    const autoInvalid = autoValidate && blurred && national.length > 0 && !complete;

    // Caret to restore after a re-format (n-th digit)
    const pendingCaret = useRef<number | null>(null);
    useLayoutEffect(() => {
      const el = inputRef.current;
      if (pendingCaret.current === null || !el || document.activeElement !== el) return;
      const pos = caretAfterDigit(typed, pendingCaret.current);
      el.setSelectionRange(pos, pos);
      pendingCaret.current = null;
    });

    const emit = (digits: string, c: PhoneCountry) => {
      const d = digits.slice(0, maskDigits(c.mask));
      if (!isControlled) setInternal(d);
      const masked = applyPhoneMask(c.mask, d).typed;
      onValueChange?.(d ? `+${c.dial}${d}` : "", {
        formatted: d ? `+${c.dial} ${masked}` : "",
        national: d,
        country: c,
        isComplete: isPhoneComplete(d, c),
      });
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
      const raw = e.target.value;
      const caret = e.target.selectionStart ?? raw.length;
      const digits = onlyDigits(raw).slice(0, max);
      pendingCaret.current = Math.min(onlyDigits(raw.slice(0, caret)).length, digits.length);
      emit(digits, country);
    };

    // Backspace/Delete over a separator removes the neighbouring digit instead of getting stuck
    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
      onKeyDown?.(e);
      const el = e.currentTarget;
      const start = el.selectionStart ?? 0;
      const end = el.selectionEnd ?? 0;
      if (start !== end || e.defaultPrevented) return;
      if (e.key === "Backspace" && start > 0 && !/\d/.test(el.value[start - 1])) {
        e.preventDefault();
        const n = onlyDigits(el.value.slice(0, start)).length;
        if (n === 0) return;
        pendingCaret.current = n - 1;
        emit(national.slice(0, n - 1) + national.slice(n), country);
      } else if (e.key === "Delete" && start < el.value.length && !/\d/.test(el.value[start])) {
        e.preventDefault();
        const n = onlyDigits(el.value.slice(0, start)).length;
        pendingCaret.current = n;
        emit(national.slice(0, n) + national.slice(n + 1), country);
      }
    };

    // Pasting "+7 999 …" / "00998…" switches country (when selectable) and strips the dial code
    const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
      onPaste?.(e);
      const text = e.clipboardData.getData("text").trim();
      if (!/^(\+|00)/.test(text)) return;
      e.preventDefault();
      const intl = onlyDigits(text).replace(/^00/, "");
      let target = country;
      if (isCountrySelectable) {
        const detected = detectPhoneCountry(intl, country.iso2);
        if (detected && detected.iso2 !== country.iso2) {
          target = detected;
          setIso2(detected.iso2);
          onCountryChange?.(detected.iso2);
        }
      }
      const digits = intl.startsWith(target.dial) ? intl.slice(target.dial.length) : intl;
      pendingCaret.current = Math.min(digits.length, maskDigits(target.mask));
      emit(digits, target);
    };

    const handleBlur = (e: FocusEvent<HTMLInputElement>) => {
      setBlurred(true);
      onBlur?.(e);
    };

    const selectCountry = (code: string) => {
      const next = getPhoneCountry(code);
      if (!next) return;
      setIso2(next.iso2);
      onCountryChange?.(next.iso2);
      emit(national, next);
      inputRef.current?.focus();
    };

    const options = useMemo(() => {
      const list = countries?.length
        ? countries.map((c) => getPhoneCountry(c)).filter((c): c is PhoneCountry => Boolean(c))
        : PHONE_COUNTRIES;
      return [...list].sort((a, b) => a.name.localeCompare(b.name));
    }, [countries]);

    const flagNode =
      flag === "none" ? null : flag === "code" ? (
        <span className="rounded bg-default px-1 py-px text-[10px] font-semibold text-muted">{country.iso2}</span>
      ) : flag === "emoji" ? (
        <span className="text-[1.15em] leading-none">{flagEmoji(country.iso2)}</span>
      ) : (
        flag(country)
      );

    const prefix = (
      <span className="relative flex items-center gap-1.5 text-foreground">
        {flagNode}
        <span className="font-medium tabular-nums">+{country.dial}</span>
        {isCountrySelectable && (
          <>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-muted" aria-hidden>
              <path d="m6 9 6 6 6-6" />
            </svg>
            <select
              aria-label={t.phoneInput.countryLabel}
              value={country.iso2}
              disabled={isDisabled}
              onChange={(e) => selectCountry(e.target.value)}
              onClick={(e) => e.stopPropagation()}
              className={cn("absolute inset-0 w-full cursor-pointer opacity-0", rx(bps, pickerR))}
            >
              {options.map((c) => (
                <option key={c.iso2} value={c.iso2}>
                  {flagEmoji(c.iso2)} {c.name} (+{c.dial})
                </option>
              ))}
            </select>
          </>
        )}
        <span className="ml-1 h-4 w-px bg-separator" />
      </span>
    );

    return (
      <Input
        {...props}
        ref={inputRef}
        size={size}
        responsive={responsive}
        type="tel"
        inputMode="tel"
        autoComplete="tel-national"
        isDisabled={isDisabled}
        value={typed}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onPaste={handlePaste}
        onBlur={handleBlur}
        onClear={() => {
          emit("", country);
          props.onClear?.();
        }}
        placeholder={showMaskGuide ? undefined : placeholder}
        isInvalid={Boolean(isInvalid) || autoInvalid}
        errorMessage={autoInvalid && !errorMessage ? incompleteMessage ?? t.phoneInput.incomplete : errorMessage}
        startContent={
          <span className="flex items-center gap-2">
            {startContent}
            {prefix}
          </span>
        }
        inputOverlay={
          showMaskGuide ? (
            <span className="tabular-nums">
              <span className="invisible">{typed}</span>
              <span className="text-field-placeholder">
                {guide.split("").map((ch, i) =>
                  ch !== placeholderChar ? (
                    ch
                  ) : placeholderChar === "_" ? (
                    // one digit-wide slot with a short bar, so groups stay visually separated
                    <span key={i} className="inline-flex w-[1ch] justify-center align-baseline">
                      <span className="h-[1.5px] w-[0.62ch] translate-y-[0.2em] rounded-full bg-current opacity-70" />
                    </span>
                  ) : (
                    <span key={i} className="inline-block w-[1ch] text-center">{ch}</span>
                  )
                )}
              </span>
            </span>
          ) : undefined
        }
        classNames={{ ...props.classNames, input: cn("tabular-nums", props.classNames?.input) }}
      />
    );
  }
);

PhoneInput.displayName = "PhoneInput";
export default PhoneInput;
