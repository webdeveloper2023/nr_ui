import type { NRLocale } from "./locale";

/** Currencies AmountInput knows how to name and spell out. */
export type AmountCurrency = "UZS" | "USD" | "EUR" | "RUB";

type Forms = readonly [string, string, string]; // en: one / other / other · uz: same word · ru: one / few / many

interface CurrencyInfo {
  /** Default number of minor-unit digits */
  decimals: number;
  symbol: Record<NRLocale, string>;
  major: Record<NRLocale, Forms>;
  minor: Record<NRLocale, Forms>;
}

export const AMOUNT_CURRENCIES: Record<AmountCurrency, CurrencyInfo> = {
  UZS: {
    decimals: 0,
    symbol: { en: "UZS", uz: "so'm", ru: "сум" },
    major: { en: ["sum", "sums", "sums"], uz: ["so'm", "so'm", "so'm"], ru: ["сум", "сума", "сумов"] },
    minor: { en: ["tiyin", "tiyins", "tiyins"], uz: ["tiyin", "tiyin", "tiyin"], ru: ["тийин", "тийина", "тийинов"] },
  },
  USD: {
    decimals: 2,
    symbol: { en: "$", uz: "$", ru: "$" },
    major: { en: ["dollar", "dollars", "dollars"], uz: ["dollar", "dollar", "dollar"], ru: ["доллар", "доллара", "долларов"] },
    minor: { en: ["cent", "cents", "cents"], uz: ["sent", "sent", "sent"], ru: ["цент", "цента", "центов"] },
  },
  EUR: {
    decimals: 2,
    symbol: { en: "€", uz: "€", ru: "€" },
    major: { en: ["euro", "euros", "euros"], uz: ["yevro", "yevro", "yevro"], ru: ["евро", "евро", "евро"] },
    minor: { en: ["cent", "cents", "cents"], uz: ["sent", "sent", "sent"], ru: ["цент", "цента", "центов"] },
  },
  RUB: {
    decimals: 2,
    symbol: { en: "₽", uz: "₽", ru: "₽" },
    major: { en: ["ruble", "rubles", "rubles"], uz: ["rubl", "rubl", "rubl"], ru: ["рубль", "рубля", "рублей"] },
    minor: { en: ["kopeck", "kopecks", "kopecks"], uz: ["kopek", "kopek", "kopek"], ru: ["копейка", "копейки", "копеек"] },
  },
};

/** Picks the word form that agrees with `n` (Russian has one / few / many). */
function pick(locale: NRLocale, n: number, forms: Forms): string {
  if (locale === "ru") {
    const m10 = n % 10;
    const m100 = n % 100;
    if (m10 === 1 && m100 !== 11) return forms[0];
    if (m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14)) return forms[1];
    return forms[2];
  }
  return locale === "en" && n !== 1 ? forms[1] : forms[0];
}

const EN_ONES = ["", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen"];
const EN_TENS = ["", "", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety"];
const EN_SCALES = ["", "thousand", "million", "billion", "trillion"];

const UZ_ONES = ["", "bir", "ikki", "uch", "to'rt", "besh", "olti", "yetti", "sakkiz", "to'qqiz"];
const UZ_TENS = ["", "o'n", "yigirma", "o'ttiz", "qirq", "ellik", "oltmish", "yetmish", "sakson", "to'qson"];
const UZ_SCALES = ["", "ming", "million", "milliard", "trillion"];

const RU_HUNDREDS = ["", "сто", "двести", "триста", "четыреста", "пятьсот", "шестьсот", "семьсот", "восемьсот", "девятьсот"];
const RU_TEENS = ["десять", "одиннадцать", "двенадцать", "тринадцать", "четырнадцать", "пятнадцать", "шестнадцать", "семнадцать", "восемнадцать", "девятнадцать"];
const RU_TENS = ["", "", "двадцать", "тридцать", "сорок", "пятьдесят", "шестьдесят", "семьдесят", "восемьдесят", "девяносто"];
const RU_UNITS = ["", "один", "два", "три", "четыре", "пять", "шесть", "семь", "восемь", "девять"];
const RU_UNITS_FEMININE = ["", "одна", "две", ...RU_UNITS.slice(3)];
const RU_SCALES: (Forms | null)[] = [
  null,
  ["тысяча", "тысячи", "тысяч"],
  ["миллион", "миллиона", "миллионов"],
  ["миллиард", "миллиарда", "миллиардов"],
  ["триллион", "триллиона", "триллионов"],
];

const ZERO: Record<NRLocale, string> = { en: "zero", uz: "nol", ru: "ноль" };
const MINUS: Record<NRLocale, string> = { en: "minus", uz: "minus", ru: "минус" };

/** Spells out 1–999. */
function triple(n: number, locale: NRLocale, feminine: boolean): string[] {
  const h = Math.floor(n / 100);
  const r = n % 100;
  const t = Math.floor(r / 10);
  const u = r % 10;
  const out: string[] = [];
  if (locale === "en") {
    if (h) out.push(`${EN_ONES[h]} hundred`);
    if (r) out.push(r < 20 ? EN_ONES[r] : EN_TENS[t] + (u ? `-${EN_ONES[u]}` : ""));
  } else if (locale === "uz") {
    if (h) out.push(UZ_ONES[h], "yuz");
    if (t) out.push(UZ_TENS[t]);
    if (u) out.push(UZ_ONES[u]);
  } else {
    if (h) out.push(RU_HUNDREDS[h]);
    if (t === 1) out.push(RU_TEENS[u]);
    else {
      if (t) out.push(RU_TENS[t]);
      if (u) out.push((feminine ? RU_UNITS_FEMININE : RU_UNITS)[u]);
    }
  }
  return out;
}

/**
 * Spells out a whole number (up to 999 trillion) in English, Uzbek or Russian.
 * numberToWords(1250000, "uz") → "bir million ikki yuz ellik ming"
 */
export function numberToWords(value: number, locale: NRLocale = "en"): string {
  if (!Number.isFinite(value)) return "";
  const n = Math.trunc(Math.abs(value));
  if (n === 0) return ZERO[locale];
  if (n >= 1e15) return String(n);
  const groups: number[] = [];
  for (let x = n; x > 0; x = Math.floor(x / 1000)) groups.push(x % 1000);
  const words: string[] = value < 0 ? [MINUS[locale]] : [];
  for (let i = groups.length - 1; i >= 0; i--) {
    const g = groups[i];
    if (!g) continue;
    // Russian thousands are feminine: "одна тысяча", "две тысячи"
    words.push(...triple(g, locale, locale === "ru" && i === 1));
    if (i > 0) words.push(locale === "ru" ? pick("ru", g, RU_SCALES[i]!) : (locale === "en" ? EN_SCALES : UZ_SCALES)[i]);
  }
  return words.join(" ");
}

export interface AmountWordsOptions {
  /** Language of the words */
  locale?: NRLocale;
  /** Currency to name after the number; null spells out the whole part only */
  currency?: AmountCurrency | null;
  /** Minor-unit digits (defaults to the currency's) */
  decimals?: number;
  /** Capitalizes the first letter (default true) */
  capitalize?: boolean;
}

/** "1250000.5" / 1250000.5 → ["1250000", "50"] with the fraction padded to `decimals`. */
function splitAmount(value: number | string, decimals: number): [string, string] {
  const text = typeof value === "number" ? value.toFixed(decimals) : value.trim();
  const [int = "0", frac = ""] = text.replace(/^-/, "").split(".");
  return [int.replace(/^0+(?=\d)/, "") || "0", frac.slice(0, decimals).padEnd(decimals, "0")];
}

/**
 * Writes an amount in words, the way payment orders and invoices require it.
 * amountToWords(1250000, { locale: "uz" }) → "Bir million ikki yuz ellik ming so'm"
 * amountToWords("21.05", { locale: "ru", currency: "USD" }) → "Двадцать один доллар 05 центов"
 */
export function amountToWords(value: number | string, options: AmountWordsOptions = {}): string {
  const { locale = "en", currency = "UZS", capitalize = true } = options;
  const info = currency ? AMOUNT_CURRENCIES[currency] : null;
  const decimals = options.decimals ?? info?.decimals ?? 0;
  const [intText, fracText] = splitAmount(value, decimals);
  const whole = Number(intText);
  const negative = typeof value === "number" ? value < 0 : value.trim().startsWith("-");
  let text = numberToWords(negative ? -whole : whole, locale);
  if (info) {
    text += ` ${pick(locale, whole, info.major[locale])}`;
    const minor = Number(fracText || "0");
    if (minor > 0) text += ` ${fracText} ${pick(locale, minor, info.minor[locale])}`;
  }
  return capitalize ? text.charAt(0).toUpperCase() + text.slice(1) : text;
}

/** Thousands separator per locale. */
export const groupSeparator = (locale: NRLocale) => (locale === "en" ? "," : " ");
/** Decimal separator per locale. */
export const decimalSeparator = (locale: NRLocale) => (locale === "en" ? "." : ",");

/**
 * Formats an amount with locale separators (no currency).
 * formatAmount(1250000.5, { locale: "uz", decimals: 2 }) → "1 250 000,50"
 */
export function formatAmount(value: number | string, { locale = "en" as NRLocale, decimals = 0 } = {}): string {
  const [int, frac] = splitAmount(value, decimals);
  const grouped = int.replace(/\B(?=(\d{3})+(?!\d))/g, groupSeparator(locale));
  const sign = (typeof value === "number" ? value < 0 : value.trim().startsWith("-")) ? "-" : "";
  return sign + grouped + (decimals > 0 && Number(frac) > 0 ? decimalSeparator(locale) + frac : "");
}
