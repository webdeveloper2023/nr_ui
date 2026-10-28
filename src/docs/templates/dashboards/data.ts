// Demo data shared by the Solid / Frosted / Liquid dashboards.
import type { Lang, Tr } from "../../i18n/lang";

// ─── Locale helpers ─────────────────────────
export const intlLocale = (lang: Lang) => (lang === "uz" ? "uz-Latn-UZ" : lang === "ru" ? "ru-RU" : "en-US");

// Browsers often ship without Uzbek CLDR data, so Uzbek dates are formatted by hand.
const UZ_MONTHS = ["yanvar", "fevral", "mart", "aprel", "may", "iyun", "iyul", "avgust", "sentabr", "oktabr", "noyabr", "dekabr"];
const UZ_MONTHS_SHORT = ["yan", "fev", "mar", "apr", "may", "iyn", "iyl", "avg", "sen", "okt", "noy", "dek"];
const UZ_WEEKDAYS = ["Yakshanba", "Dushanba", "Seshanba", "Chorshanba", "Payshanba", "Juma", "Shanba"];

/** "2026-10-27" → "Oct 27" / "27 окт." / "27-okt" */
export const formatDay = (iso: string, lang: Lang) => {
  const d = new Date(`${iso}T12:00:00`);
  if (lang === "uz") return `${d.getDate()}-${UZ_MONTHS_SHORT[d.getMonth()]}`;
  return new Intl.DateTimeFormat(intlLocale(lang), { day: "numeric", month: "short" }).format(d);
};

/** Header line: "Tuesday, October 27" / "Вторник, 27 октября" / "Seshanba, 27-oktabr" */
export const formatToday = (lang: Lang, date = new Date("2026-10-27T12:00:00")) => {
  if (lang === "uz") return `${UZ_WEEKDAYS[date.getDay()]}, ${date.getDate()}-${UZ_MONTHS[date.getMonth()]}`;
  const s = new Intl.DateTimeFormat(intlLocale(lang), { weekday: "long", day: "numeric", month: "long" }).format(date);
  return s.charAt(0).toUpperCase() + s.slice(1);
};

// ─── Data ───────────────────────────────────
export type Status = "paid" | "pending" | "shipped" | "cancelled";
export type Order = { id: string; customer: string; email: string; product: string; amount: number; status: Status; /** ISO date */ date: string };

export const STATUS: Record<Status, { label: Tr; color: "success" | "warning" | "accent" | "danger" }> = {
  paid: { label: { en: "Paid", uz: "To'langan", ru: "Оплачен" }, color: "success" },
  pending: { label: { en: "Pending", uz: "Kutilmoqda", ru: "В ожидании" }, color: "warning" },
  shipped: { label: { en: "Shipped", uz: "Yo'lda", ru: "В пути" }, color: "accent" },
  cancelled: { label: { en: "Cancelled", uz: "Bekor qilingan", ru: "Отменён" }, color: "danger" },
};

export const ORDERS: Order[] = [
  { id: "#3210", customer: "Ali Valiyev", email: "ali@acme.uz", product: "Laptop Pro 14", amount: 1999, status: "paid", date: "2026-10-27" },
  { id: "#3209", customer: "Dilnoza Karimova", email: "dilnoza@acme.uz", product: "Phone X Pro", amount: 1199, status: "shipped", date: "2026-10-27" },
  { id: "#3208", customer: "Jasur Rahimov", email: "jasur@acme.uz", product: "Wireless earbuds", amount: 249, status: "pending", date: "2026-10-26" },
  { id: "#3207", customer: "Madina Usmonova", email: "madina@acme.uz", product: "Tablet Air 11", amount: 599, status: "paid", date: "2026-10-26" },
  { id: "#3206", customer: "Bekzod Tursunov", email: "bekzod@acme.uz", product: "Smartwatch S", amount: 399, status: "cancelled", date: "2026-10-25" },
  { id: "#3205", customer: "Nigora Aliyeva", email: "nigora@acme.uz", product: "Wireless keyboard", amount: 299, status: "paid", date: "2026-10-25" },
  { id: "#3204", customer: "Sardor Qodirov", email: "sardor@acme.uz", product: "5K display", amount: 1599, status: "shipped", date: "2026-10-24" },
  { id: "#3203", customer: "Kamola Ergasheva", email: "kamola@acme.uz", product: "Mini PC", amount: 599, status: "pending", date: "2026-10-24" },
];

export const REVENUE: Record<string, { data: number[]; total: string; change: string }> = {
  week: { data: [32, 41, 38, 52, 47, 61, 58], total: "$12,480", change: "+8.2%" },
  month: { data: [22, 28, 25, 31, 36, 33, 40, 44, 41, 48, 52, 49, 57, 61, 58, 66], total: "$48,230", change: "+12.5%" },
  year: { data: [120, 135, 128, 150, 162, 158, 175, 190, 184, 205, 221, 240], total: "$512,900", change: "+31.4%" },
};

export const TEAM = [
  { name: "Ali Valiyev", role: { en: "CEO", uz: "CEO", ru: "CEO" }, online: true },
  { name: "Dilnoza Karimova", role: { en: "Tech Lead", uz: "Tech Lead", ru: "Техлид" }, online: true },
  { name: "Jasur Rahimov", role: { en: "Designer", uz: "Dizayner", ru: "Дизайнер" }, online: false },
  { name: "Madina Usmonova", role: { en: "QA", uz: "QA", ru: "Тестировщик" }, online: true },
];

export const PAGE_SIZE = 5;
export const avatarUrl = (seed: string) => `https://i.pravatar.cc/150?u=${encodeURIComponent(seed)}`;
