import { PHONE_COUNTRIES, type PhoneCountry } from "./phoneCountries";

export type { PhoneCountry };

const byIso2 = new Map(PHONE_COUNTRIES.map((c) => [c.iso2, c]));
const byIso3 = new Map(PHONE_COUNTRIES.map((c) => [c.iso3, c]));

/** "UZ", "uz", "UZB", "uzb" → Uzbekistan. Unknown code → undefined. */
export function getPhoneCountry(code: string | undefined): PhoneCountry | undefined {
  if (!code) return undefined;
  const key = code.trim().toUpperCase();
  return key.length === 3 ? byIso3.get(key) ?? byIso2.get(key) : byIso2.get(key);
}

/** Number of digits the mask can hold. */
export const maskDigits = (mask: string) => mask.split("").filter((ch) => ch === "#").length;

export const onlyDigits = (s: string) => s.replace(/\D/g, "");

/**
 * Split a national number into the typed part and the remaining guide.
 * ("## ### ## ##", "90123") → { typed: "90 123", guide: " __ __" }
 */
export function applyPhoneMask(mask: string, digits: string, placeholderChar = "_") {
  let typed = "";
  let i = 0;
  let pos = 0;
  for (; pos < mask.length && i < digits.length; pos++) {
    const ch = mask[pos];
    if (ch === "#") typed += digits[i++];
    else typed += ch;
  }
  const guide = mask.slice(pos).replace(/#/g, placeholderChar);
  return { typed, guide };
}

/** Position in `formatted` right after the n-th digit (n = 0 → before the first digit). */
export function caretAfterDigit(formatted: string, n: number) {
  if (n <= 0) {
    const first = formatted.search(/\d/);
    return first === -1 ? formatted.length : first;
  }
  let seen = 0;
  for (let i = 0; i < formatted.length; i++) {
    if (/\d/.test(formatted[i]) && ++seen === n) return i + 1;
  }
  return formatted.length;
}

// Shared dial codes → the country a bare number most likely belongs to
const PRIMARY_FOR_DIAL: Record<string, string> = {
  "1": "US", "7": "RU", "44": "GB", "39": "IT", "47": "NO", "61": "AU",
  "212": "MA", "262": "RE", "358": "FI", "590": "GP", "599": "CW",
};

/** Longest dial-code match for an international digit string ("998901234567" → UZ, "77011234567" → KZ). */
export function detectPhoneCountry(intlDigits: string, prefer?: string): PhoneCountry | undefined {
  let longest = 0;
  for (const c of PHONE_COUNTRIES) if (intlDigits.startsWith(c.dial)) longest = Math.max(longest, c.dial.length);
  if (!longest) return undefined;
  const matches = PHONE_COUNTRIES.filter((c) => c.dial.length === longest && intlDigits.startsWith(c.dial));
  if (matches.length === 1) return matches[0];

  const dial = matches[0].dial;
  // +7: Kazakhstan numbers start with 6 or 7 after the code, everything else is Russia
  if (dial === "7") return getPhoneCountry(/^7[67]/.test(intlDigits) ? "KZ" : "RU");
  const preferred = matches.find((c) => c.iso2 === prefer);
  if (preferred) return preferred;
  const primary = PRIMARY_FOR_DIAL[dial];
  return matches.find((c) => c.iso2 === primary) ?? matches[0];
}

/** Strip the dial code from an E.164 / international value when present. */
export function toNationalDigits(value: string, country: PhoneCountry) {
  const raw = value.trim();
  let digits = onlyDigits(raw);
  const max = maskDigits(country.mask);
  if ((raw.startsWith("+") || raw.startsWith("00") || digits.length > max) && digits.startsWith(raw.startsWith("00") ? "00" + country.dial : country.dial)) {
    digits = digits.slice((raw.startsWith("00") ? 2 : 0) + country.dial.length);
  }
  return digits.slice(0, max);
}

/** "+998901234567" + "UZ" → "+998 90 123 45 67" */
export function formatPhone(value: string, countryCode: string): string {
  const country = getPhoneCountry(countryCode);
  if (!country) return value;
  const national = toNationalDigits(value, country);
  return national ? `+${country.dial} ${applyPhoneMask(country.mask, national).typed}` : "";
}

export const isPhoneComplete = (national: string, country: PhoneCountry) =>
  national.length >= (country.minLength ?? maskDigits(country.mask));

/** 🇺🇿 from "UZ" */
export const flagEmoji = (iso2: string) =>
  iso2.toUpperCase().replace(/./g, (ch) => String.fromCodePoint(0x1f1e6 - 65 + ch.charCodeAt(0)));

export { PHONE_COUNTRIES };
