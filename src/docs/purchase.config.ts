// Sotish sozlamalari — /pricing sahifasi shu qiymatlardan foydalanadi.
// To'lov tizimini ulaganingizda faqat shu faylni o'zgartirasiz.

export const PURCHASE = {
  /** Narx (bir martalik) */
  price: 10,
  currency: "$",

  /** Kirish beriladigan private repo */
  repo: "webdeveloper2023/nr_ui",

  /**
   * To'lov sahifasi havolasi (Payme, Click, Stripe Payment Link, Lemon Squeezy, Gumroad…).
   * Bo'sh bo'lsa — xaridor quyidagi kontakt orqali bog'lanadi.
   * Havolaga `?github=<username>&email=<email>` avtomatik qo'shiladi.
   */
  checkoutUrl: "",

  /** To'lov ulanmaguncha xaridor bog'lanadigan joy (masalan "https://t.me/username") */
  contactUrl: "",

  /** GitHub taklifi qancha vaqtda yuboriladi (sahifada ko'rsatiladi) */
  inviteEta: "24 soat ichida",
};
