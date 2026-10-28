// Demo data shared by the Solid / Frosted / Liquid dashboards.
// ─── Data ───────────────────────────────────
export type Status = "paid" | "pending" | "shipped" | "cancelled";
export type Order = { id: string; customer: string; email: string; product: string; amount: number; status: Status; date: string };

export const STATUS: Record<Status, { label: string; color: "success" | "warning" | "accent" | "danger" }> = {
  paid: { label: "To'langan", color: "success" },
  pending: { label: "Kutilmoqda", color: "warning" },
  shipped: { label: "Yo'lda", color: "accent" },
  cancelled: { label: "Bekor qilingan", color: "danger" },
};

export const ORDERS: Order[] = [
  { id: "#3210", customer: "Ali Valiyev", email: "ali@acme.uz", product: "Laptop Pro 14", amount: 1999, status: "paid", date: "27 okt" },
  { id: "#3209", customer: "Dilnoza Karimova", email: "dilnoza@acme.uz", product: "Phone X Pro", amount: 1199, status: "shipped", date: "27 okt" },
  { id: "#3208", customer: "Jasur Rahimov", email: "jasur@acme.uz", product: "Wireless earbuds", amount: 249, status: "pending", date: "26 okt" },
  { id: "#3207", customer: "Madina Usmonova", email: "madina@acme.uz", product: "Tablet Air 11", amount: 599, status: "paid", date: "26 okt" },
  { id: "#3206", customer: "Bekzod Tursunov", email: "bekzod@acme.uz", product: "Smartwatch S", amount: 399, status: "cancelled", date: "25 okt" },
  { id: "#3205", customer: "Nigora Aliyeva", email: "nigora@acme.uz", product: "Wireless keyboard", amount: 299, status: "paid", date: "25 okt" },
  { id: "#3204", customer: "Sardor Qodirov", email: "sardor@acme.uz", product: "5K display", amount: 1599, status: "shipped", date: "24 okt" },
  { id: "#3203", customer: "Kamola Ergasheva", email: "kamola@acme.uz", product: "Mini PC", amount: 599, status: "pending", date: "24 okt" },
];

export const REVENUE: Record<string, { data: number[]; total: string; change: string }> = {
  week: { data: [32, 41, 38, 52, 47, 61, 58], total: "$12,480", change: "+8.2%" },
  month: { data: [22, 28, 25, 31, 36, 33, 40, 44, 41, 48, 52, 49, 57, 61, 58, 66], total: "$48,230", change: "+12.5%" },
  year: { data: [120, 135, 128, 150, 162, 158, 175, 190, 184, 205, 221, 240], total: "$512,900", change: "+31.4%" },
};

export const TEAM = [
  { name: "Ali Valiyev", role: "CEO", online: true },
  { name: "Dilnoza Karimova", role: "Tech Lead", online: true },
  { name: "Jasur Rahimov", role: "Dizayner", online: false },
  { name: "Madina Usmonova", role: "QA", online: true },
];

export const PAGE_SIZE = 5;
export const avatarUrl = (seed: string) => `https://i.pravatar.cc/150?u=${encodeURIComponent(seed)}`;
