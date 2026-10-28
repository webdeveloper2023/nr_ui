import { describe, expect, it } from "vitest";
import { amountToWords, formatAmount, numberToWords } from "../src/components/amountWords";

describe("numberToWords", () => {
  it.each([
    [0, "zero"],
    [7, "seven"],
    [15, "fifteen"],
    [42, "forty-two"],
    [100, "one hundred"],
    [1001, "one thousand one"],
    [1250000, "one million two hundred fifty thousand"],
    [2000000005, "two billion five"],
  ])("en %d", (n, words) => expect(numberToWords(n, "en")).toBe(words));

  it.each([
    [0, "nol"],
    [11, "o'n bir"],
    [44, "qirq to'rt"],
    [100, "bir yuz"],
    [1999, "bir ming to'qqiz yuz to'qson to'qqiz"],
    [1250000, "bir million ikki yuz ellik ming"],
    [3000000000, "uch milliard"],
  ])("uz %d", (n, words) => expect(numberToWords(n, "uz")).toBe(words));

  it.each([
    [0, "ноль"],
    [12, "двенадцать"],
    [21, "двадцать один"],
    [1000, "одна тысяча"],
    [2000, "две тысячи"],
    [5000, "пять тысяч"],
    [11000, "одиннадцать тысяч"],
    [21000, "двадцать одна тысяча"],
    [1250000, "один миллион двести пятьдесят тысяч"],
    [2000000, "два миллиона"],
    [5000000000, "пять миллиардов"],
  ])("ru %d", (n, words) => expect(numberToWords(n, "ru")).toBe(words));

  it("handles negatives", () => {
    expect(numberToWords(-5, "ru")).toBe("минус пять");
  });
});

describe("amountToWords", () => {
  it("spells sums in every language", () => {
    expect(amountToWords(1250000, { locale: "uz" })).toBe("Bir million ikki yuz ellik ming so'm");
    expect(amountToWords(1250000, { locale: "ru" })).toBe("Один миллион двести пятьдесят тысяч сумов");
    expect(amountToWords(1250000, { locale: "en" })).toBe("One million two hundred fifty thousand sums");
  });

  it("agrees the Russian currency word with the number", () => {
    expect(amountToWords(1, { locale: "ru", currency: "RUB" })).toBe("Один рубль");
    expect(amountToWords(3, { locale: "ru", currency: "RUB" })).toBe("Три рубля");
    expect(amountToWords(11, { locale: "ru", currency: "RUB" })).toBe("Одиннадцать рублей");
    expect(amountToWords(1000, { locale: "ru", currency: "RUB" })).toBe("Одна тысяча рублей");
    expect(amountToWords(22, { locale: "ru" })).toBe("Двадцать два сума");
  });

  it("adds the minor units as digits", () => {
    expect(amountToWords("21.05", { locale: "ru", currency: "USD" })).toBe("Двадцать один доллар 05 центов");
    expect(amountToWords(1.01, { locale: "en", currency: "USD" })).toBe("One dollar 01 cent");
    expect(amountToWords("100.5", { locale: "uz", currency: "EUR" })).toBe("Bir yuz yevro 50 sent");
    expect(amountToWords(12, { locale: "ru", currency: "RUB" })).toBe("Двенадцать рублей");
  });

  it("uses English plurals of the whole number", () => {
    expect(amountToWords(1, { currency: "USD" })).toBe("One dollar");
    expect(amountToWords(1001, { currency: "USD" })).toBe("One thousand one dollars");
  });

  it("spells a plain number without currency", () => {
    expect(amountToWords(42, { locale: "uz", currency: null, capitalize: false })).toBe("qirq ikki");
  });
});

describe("formatAmount", () => {
  it("groups by locale", () => {
    expect(formatAmount(1250000, { locale: "uz" })).toBe("1 250 000");
    expect(formatAmount(1250000, { locale: "en" })).toBe("1,250,000");
    expect(formatAmount(1250000.5, { locale: "ru", decimals: 2 })).toBe("1 250 000,50");
    expect(formatAmount(12, { locale: "en", decimals: 2 })).toBe("12");
  });
});
