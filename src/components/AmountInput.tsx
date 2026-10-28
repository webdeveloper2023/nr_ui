import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useLayoutEffect,
  useRef,
  useState,
  type ChangeEvent,
  type FocusEvent,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import { cn } from "../lib/cn";
import { useLocale, type NRLocale } from "./locale";
import { Input, type InputProps } from "./Input";
import {
  AMOUNT_CURRENCIES,
  amountToWords,
  decimalSeparator,
  formatAmount,
  groupSeparator,
  type AmountCurrency,
} from "./amountWords";

export interface AmountValueInfo {
  /** Formatted with locale separators: "1 250 000" */
  formatted: string;
  /** The amount in words: "Bir million ikki yuz ellik ming so'm" */
  words: string;
  /** Whether the amount is within min / max */
  isValid: boolean;
}

export interface AmountInputProps
  extends Omit<InputProps, "value" | "defaultValue" | "onValueChange" | "type" | "inputOverlay" | "min" | "max"> {
  /** Amount (controlled); null when empty */
  value?: number | null;
  /** Initial amount (uncontrolled) */
  defaultValue?: number | null;
  /** Called with the numeric amount (null when empty) and extra info */
  onValueChange?: (value: number | null, info: AmountValueInfo) => void;
  /** Currency: sets the symbol, default decimals and the currency words; null for a plain number */
  currency?: AmountCurrency | null;
  /** Number of decimal digits allowed (defaults to the currency's: UZS 0, others 2) */
  decimals?: number;
  /** Shows the amount spelled out in words under the field */
  showWords?: boolean;
  /** Language of the words and separators (defaults to the LocaleProvider language) */
  wordsLocale?: NRLocale;
  /** Smallest allowed amount (checked after the field is left) */
  min?: number;
  /** Largest allowed amount (checked after the field is left) */
  max?: number;
  /** Quick-pick amounts shown as buttons under the field */
  presets?: number[];
  /** Replaces the currency symbol shown at the end of the field */
  currencySymbol?: ReactNode;
  /** Maximum digits before the decimal separator */
  maxDigits?: number;
}

interface Parts {
  int: string;
  /** null when no decimal separator was typed */
  frac: string | null;
}

const isDecimalChar = (ch: string, locale: NRLocale) => ch === "." || (locale !== "en" && ch === ",");

/** Reads what the user typed: digits plus (at most) one decimal separator. */
function parseTyped(text: string, locale: NRLocale, decimals: number): Parts {
  let int = "";
  let frac: string | null = null;
  for (const ch of text) {
    if (/\d/.test(ch)) {
      if (frac === null) int += ch;
      else if (frac.length < decimals) frac += ch;
    } else if (decimals > 0 && frac === null && isDecimalChar(ch, locale)) {
      frac = "";
    }
  }
  int = int.replace(/^0+(?=\d)/, "");
  if (frac !== null && int === "") int = "0";
  return { int, frac };
}

const render = ({ int, frac }: Parts, locale: NRLocale) =>
  int.replace(/\B(?=(\d{3})+(?!\d))/g, groupSeparator(locale)) + (frac !== null ? decimalSeparator(locale) + frac : "");

const canonical = ({ int, frac }: Parts) => (int === "" && frac === null ? "" : (int || "0") + (frac ? `.${frac}` : ""));

function fromNumber(value: number | null | undefined, decimals: number): Parts {
  if (value === null || value === undefined || !Number.isFinite(value)) return { int: "", frac: null };
  const [int, frac = ""] = Math.abs(value).toFixed(decimals).split(".");
  return { int, frac: frac && Number(frac) > 0 ? frac : null };
}

/** Digits and decimal separators count toward caret position; group separators don't. */
const significantBefore = (text: string, pos: number, locale: NRLocale) =>
  [...text.slice(0, pos)].filter((ch) => /\d/.test(ch) || isDecimalChar(ch, locale)).length;

function caretAfter(text: string, count: number, locale: NRLocale) {
  if (count <= 0) return 0;
  let seen = 0;
  for (let i = 0; i < text.length; i++) {
    if (/\d/.test(text[i]) || isDecimalChar(text[i], locale)) seen++;
    if (seen === count) return i + 1;
  }
  return text.length;
}

export const AmountInput = forwardRef<HTMLInputElement, AmountInputProps>(
  (
    {
      value,
      defaultValue,
      onValueChange,
      currency = "UZS",
      decimals: decimalsProp,
      showWords = true,
      wordsLocale,
      min,
      max,
      presets,
      currencySymbol,
      maxDigits = 15,
      description,
      errorMessage,
      isInvalid,
      isDisabled,
      isReadOnly,
      endContent,
      onChange,
      onBlur,
      onKeyDown,
      className = "",
      fullWidth = true,
      ...props
    },
    ref
  ) => {
    const t = useLocale();
    const locale = wordsLocale ?? t.locale;
    const info = currency ? AMOUNT_CURRENCIES[currency] : null;
    const decimals = Math.max(0, decimalsProp ?? info?.decimals ?? 0);

    const inputRef = useRef<HTMLInputElement>(null);
    useImperativeHandle(ref, () => inputRef.current as HTMLInputElement);

    const [parts, setParts] = useState<Parts>(() => fromNumber(value !== undefined ? value : defaultValue, decimals));
    const [touched, setTouched] = useState(false);
    const pendingCaret = useRef<number | null>(null);
    const lastEmitted = useRef<number | null | undefined>(value);

    const amountText = canonical(parts);
    const amount = amountText === "" ? null : Number(amountText);
    const outOfRange = amount !== null && ((min !== undefined && amount < min) || (max !== undefined && amount > max));
    const formatOpts = { locale, decimals };
    const words = amount === null ? "" : amountToWords(amountText, { locale, currency, decimals });

    // Controlled: follow outside changes (ignore echoes of what we just emitted)
    useEffect(() => {
      if (value === undefined || value === lastEmitted.current) return;
      lastEmitted.current = value;
      setParts(fromNumber(value, decimals));
    }, [value, decimals]);

    useLayoutEffect(() => {
      if (pendingCaret.current === null || !inputRef.current) return;
      inputRef.current.setSelectionRange(pendingCaret.current, pendingCaret.current);
      pendingCaret.current = null;
    });

    const commit = (next: Parts) => {
      setParts(next);
      const text = canonical(next);
      const nextAmount = text === "" ? null : Number(text);
      lastEmitted.current = nextAmount;
      const valid = nextAmount === null || !((min !== undefined && nextAmount < min) || (max !== undefined && nextAmount > max));
      onValueChange?.(nextAmount, {
        formatted: nextAmount === null ? "" : render(next, locale),
        words: nextAmount === null ? "" : amountToWords(text, { locale, currency, decimals }),
        isValid: valid,
      });
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
      onChange?.(e);
      const raw = e.target.value;
      const next = parseTyped(raw, locale, decimals);
      if (next.int.length > maxDigits) return; // too long — keep the previous value
      const rendered = render(next, locale);
      let count = significantBefore(raw, e.target.selectionStart ?? raw.length, locale);
      // A leading "0" was added in front of a lone decimal separator
      if (raw.replace(/\D/g, "") === "" && next.frac !== null) count += 1;
      pendingCaret.current = caretAfter(rendered, count, locale);
      commit(next);
    };

    // Backspace / Delete next to a group separator removes the digit beyond it
    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
      onKeyDown?.(e);
      const el = e.currentTarget;
      const pos = el.selectionStart ?? 0;
      if (pos !== el.selectionEnd) return;
      const sep = groupSeparator(locale);
      if (e.key === "Backspace" && el.value[pos - 1] === sep) el.setSelectionRange(pos - 1, pos - 1);
      if (e.key === "Delete" && el.value[pos] === sep) el.setSelectionRange(pos + 1, pos + 1);
    };

    const handleBlur = (e: FocusEvent<HTMLInputElement>) => {
      onBlur?.(e);
      setTouched(true);
      // "12," → "12" and "12,5" → "12,50"
      if (parts.frac !== null) {
        const frac = parts.frac === "" || Number(parts.frac) === 0 ? null : parts.frac.padEnd(decimals, "0");
        if (frac !== parts.frac) commit({ ...parts, frac });
      }
    };

    const rangeError =
      touched && outOfRange
        ? amount! < (min ?? -Infinity)
          ? t.amountInput.min(formatAmount(min!, formatOpts))
          : t.amountInput.max(formatAmount(max!, formatOpts))
        : null;

    const symbol = currencySymbol ?? (info ? info.symbol[locale] : null);
    const wordsLine = showWords && words ? <span className="block text-foreground/80">{words}</span> : null;

    return (
      <div className={cn("flex flex-col gap-2", fullWidth ? "w-full" : "w-fit", className)}>
        <Input
          {...props}
          ref={inputRef}
          type="text"
          inputMode={decimals > 0 ? "decimal" : "numeric"}
          autoComplete="off"
          fullWidth={fullWidth}
          isDisabled={isDisabled}
          isReadOnly={isReadOnly}
          value={render(parts, locale)}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          isInvalid={Boolean(isInvalid) || Boolean(rangeError)}
          errorMessage={errorMessage ?? rangeError}
          classNames={{ ...props.classNames, input: cn("tabular-nums", props.classNames?.input) }}
          description={
            description || wordsLine ? (
              <>
                {description && <span className="block">{description}</span>}
                {wordsLine}
              </>
            ) : undefined
          }
          endContent={
            symbol || endContent ? (
              <span className="flex items-center gap-2">
                {endContent}
                {symbol && <span className="text-sm font-medium text-muted select-none">{symbol}</span>}
              </span>
            ) : undefined
          }
        />
        {presets && presets.length > 0 && (
          <div role="group" aria-label={t.amountInput.presets} className="flex flex-wrap gap-1.5">
            {presets.map((preset) => (
              <button
                key={preset}
                type="button"
                disabled={isDisabled || isReadOnly}
                aria-pressed={amount === preset}
                onClick={() => {
                  commit(fromNumber(preset, decimals));
                  inputRef.current?.focus();
                }}
                className={cn(
                  "h-7 rounded-full px-3 text-xs font-medium tabular-nums transition-colors cursor-pointer",
                  "outline-none focus-visible:ring-2 focus-visible:ring-focus disabled:opacity-50 disabled:pointer-events-none",
                  amount === preset ? "bg-accent text-accent-foreground" : "bg-default text-foreground hover:bg-default-hover"
                )}
              >
                {formatAmount(preset, formatOpts)}
                {symbol && typeof symbol === "string" && <span className="ml-1 opacity-70">{symbol}</span>}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }
);

AmountInput.displayName = "AmountInput";
export default AmountInput;
