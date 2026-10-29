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
  { id: "#3204", customer: "Sardor Qodirov", email: "sardor@acme.uz", product: '27" 5K display', amount: 1599, status: "shipped", date: "2026-10-24" },
  { id: "#3203", customer: "Kamola Ergasheva", email: "kamola@acme.uz", product: "Mini PC", amount: 599, status: "pending", date: "2026-10-24" },
];

export const REVENUE: Record<string, { data: number[]; total: string; change: string }> = {
  week: { data: [32, 41, 38, 52, 47, 61, 58], total: "$12,480", change: "+8.2%" },
  month: { data: [22, 28, 25, 31, 36, 33, 40, 44, 41, 48, 52, 49, 57, 61, 58, 66], total: "$48,230", change: "+12.5%" },
  year: { data: [120, 135, 128, 150, 162, 158, 175, 190, 184, 205, 221, 240], total: "$512,900", change: "+31.4%" },
};

export const TEAM = [
  { name: "Rafiqjon Nazirov", role: { en: "Founder · you", uz: "Asoschi · siz", ru: "Основатель · вы" }, online: true },
  { name: "Dilnoza Karimova", role: { en: "Tech Lead", uz: "Tech Lead", ru: "Техлид" }, online: true },
  { name: "Jasur Rahimov", role: { en: "Designer", uz: "Dizayner", ru: "Дизайнер" }, online: false },
  { name: "Madina Usmonova", role: { en: "QA", uz: "QA", ru: "Тестировщик" }, online: true },
];

export const PAGE_SIZE = 5;
export const avatarUrl = (seed: string) => `https://i.pravatar.cc/150?u=${encodeURIComponent(seed)}`;

// ─── Charts ─────────────────────────────────
const DAY0 = new Date("2026-07-30T12:00:00");
/** 90 days of revenue (this period and the one before), deterministic so every render matches */
export const DAILY = Array.from({ length: 90 }, (_, i) => {
  const date = new Date(DAY0.getFullYear(), DAY0.getMonth(), DAY0.getDate() + i);
  const weekend = date.getDay() === 0 || date.getDay() === 6;
  const base = 1180 + i * 7 + Math.sin(i / 4.2) * 170 + Math.sin(i / 13) * 220 - (weekend ? 210 : 0);
  return { date, revenue: Math.round(base), previous: Math.round(base * 0.84 + Math.cos(i / 5) * 120) };
});

/** Visible window of the revenue chart per range tab: [first, last] row */
export const RANGES: Record<string, [number, number]> = { week: [83, 89], month: [60, 89], quarter: [0, 89] };

export const CHANNELS = [
  { key: "online", label: { en: "Online", uz: "Onlayn", ru: "Онлайн" }, value: 31420 },
  { key: "store", label: { en: "In-store", uz: "Do'kon", ru: "Магазин" }, value: 12610 },
  { key: "wholesale", label: { en: "Wholesale", uz: "Ulgurji", ru: "Опт" }, value: 4200 },
] as const;

export const WEEKDAYS: Tr[] = [
  { en: "Mon", uz: "Du", ru: "Пн" },
  { en: "Tue", uz: "Se", ru: "Вт" },
  { en: "Wed", uz: "Ch", ru: "Ср" },
  { en: "Thu", uz: "Pa", ru: "Чт" },
  { en: "Fri", uz: "Ju", ru: "Пт" },
  { en: "Sat", uz: "Sh", ru: "Сб" },
  { en: "Sun", uz: "Ya", ru: "Вс" },
];
export const WEEK_ORDERS = [
  { paid: 142, shipped: 38, cancelled: 6 },
  { paid: 156, shipped: 41, cancelled: 4 },
  { paid: 149, shipped: 46, cancelled: 7 },
  { paid: 171, shipped: 52, cancelled: 5 },
  { paid: 188, shipped: 57, cancelled: 9 },
  { paid: 121, shipped: 30, cancelled: 3 },
  { paid: 98, shipped: 22, cancelled: 2 },
];

export const CATEGORIES = [
  { key: "laptops", label: { en: "Laptops", uz: "Noutbuklar", ru: "Ноутбуки" }, value: 18400 },
  { key: "phones", label: { en: "Phones", uz: "Telefonlar", ru: "Телефоны" }, value: 14900 },
  { key: "audio", label: { en: "Audio", uz: "Audio", ru: "Аудио" }, value: 6200 },
  { key: "tablets", label: { en: "Tablets", uz: "Planshetlar", ru: "Планшеты" }, value: 5300 },
  { key: "accessories", label: { en: "Accessories", uz: "Aksessuarlar", ru: "Аксессуары" }, value: 3430 },
] as const;

export const GOALS = [
  { key: "sales", label: { en: "Sales plan", uz: "Sotuv rejasi", ru: "План продаж" }, value: 78 },
  { key: "customers", label: { en: "New customers", uz: "Yangi mijozlar", ru: "Новые клиенты" }, value: 68 },
  { key: "stock", label: { en: "Restocking", uz: "Ombor", ru: "Склад" }, value: 55 },
] as const;
