import { createContext, useContext } from "react";

/** Built-in languages for the library's default texts and aria-labels. */
export type NRLocale = "en" | "uz" | "ru";

/** Every user-visible default string and screen-reader label used inside the library. */
export interface NRMessages {
  common: {
    close: string;
    clear: string;
    loading: string;
    avatar: string;
  };
  select: {
    placeholder: string;
    empty: string;
  };
  phoneInput: {
    incomplete: string;
    countryLabel: string;
  };
  chat: {
    placeholder: string;
    typing: string;
    copy: string;
    regenerate: string;
    like: string;
    dislike: string;
    attach: string;
    send: string;
    stop: string;
  };
  fileUpload: {
    label: string;
    description: (maxSizeMB: number) => string;
    tooLarge: (fileNames: string, maxSizeMB: number) => string;
    remove: (fileName: string) => string;
    tooMany: (max: number) => string;
    browse: string;
    choose: string;
    change: string;
    add: string;
    selected: (count: number) => string;
  };
  pagination: {
    label: string;
    previous: string;
    next: string;
  };
  table: {
    empty: string;
    selectAll: string;
    selectRow: string;
  };
  sidebar: {
    expand: string;
    collapse: string;
  };
  navbar: {
    toggleMenu: string;
  };
  billing: {
    monthly: string;
    yearly: string;
  };
  pricing: {
    popular: string;
    cta: string;
  };
  rating: {
    star: (n: number) => string;
  };
  amountInput: {
    min: (amount: string) => string;
    max: (amount: string) => string;
    presets: string;
  };
  label: {
    required: string;
    optional: string;
    /** Accessible name of the info icon next to a label */
    info: string;
  };
  chart: {
    /** Accessible name of the range selector */
    range: string;
    rangeStart: string;
    rangeEnd: string;
    /** Legend button: "Hide Revenue" / "Show Revenue" */
    toggle: (label: string, hidden: boolean) => string;
    total: string;
    empty: string;
  };
}

const ruPlural = (n: number, one: string, few: string, many: string) => {
  const m10 = n % 10;
  const m100 = n % 100;
  if (m10 === 1 && m100 !== 11) return one;
  if (m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14)) return few;
  return many;
};

export const NR_MESSAGES: Record<NRLocale, NRMessages> = {
  en: {
    common: { close: "Close", clear: "Clear", loading: "Loading", avatar: "Avatar" },
    select: { placeholder: "Select…", empty: "No options" },
    phoneInput: { incomplete: "Phone number is incomplete", countryLabel: "Country code" },
    chat: {
      placeholder: "Ask anything…",
      typing: "Typing",
      copy: "Copy",
      regenerate: "Regenerate",
      like: "Like",
      dislike: "Dislike",
      attach: "Attach",
      send: "Send",
      stop: "Stop",
    },
    fileUpload: {
      label: "Click to upload or drag and drop",
      description: (mb) => `Max size: ${mb} MB`,
      tooLarge: (names, mb) => `${names} — larger than ${mb} MB`,
      remove: (name) => `Remove ${name}`,
      tooMany: (max) => `You can add up to ${max} files`,
      browse: "Browse",
      choose: "Choose file",
      change: "Change",
      add: "Add",
      selected: (n) => (n === 1 ? "1 file selected" : `${n} files selected`),
    },
    pagination: { label: "Pagination", previous: "Previous page", next: "Next page" },
    table: { empty: "No rows to display.", selectAll: "Select all rows", selectRow: "Select row" },
    sidebar: { expand: "Expand sidebar", collapse: "Collapse sidebar" },
    navbar: { toggleMenu: "Toggle menu" },
    billing: { monthly: "Monthly", yearly: "Yearly" },
    pricing: { popular: "Most popular", cta: "Get started" },
    rating: { star: (n) => (n === 1 ? "1 star" : `${n} stars`) },
    amountInput: { min: (a) => `Minimum amount is ${a}`, max: (a) => `Maximum amount is ${a}`, presets: "Quick amounts" },
    label: { required: "Required", optional: "Optional", info: "More info" },
    chart: { range: "Visible range", rangeStart: "Range start", rangeEnd: "Range end", toggle: (l, h) => `${h ? "Show" : "Hide"} ${l}`, total: "Total", empty: "No data" },
  },
  uz: {
    common: { close: "Yopish", clear: "Tozalash", loading: "Yuklanmoqda", avatar: "Avatar" },
    select: { placeholder: "Tanlang", empty: "Variantlar yo'q" },
    phoneInput: { incomplete: "Telefon raqam to'liq kiritilmagan", countryLabel: "Davlat kodi" },
    chat: {
      placeholder: "Nimani bilmoqchisiz?",
      typing: "Yozmoqda",
      copy: "Nusxa olish",
      regenerate: "Qayta yaratish",
      like: "Yoqdi",
      dislike: "Yoqmadi",
      attach: "Fayl biriktirish",
      send: "Yuborish",
      stop: "To'xtatish",
    },
    fileUpload: {
      label: "Yuklash uchun bosing yoki faylni shu yerga tashlang",
      description: (mb) => `Maksimal hajm: ${mb} MB`,
      tooLarge: (names, mb) => `${names} — ${mb} MB dan katta`,
      remove: (name) => `${name} faylini o'chirish`,
      tooMany: (max) => `Ko'pi bilan ${max} ta fayl qo'shish mumkin`,
      browse: "Tanlash",
      choose: "Fayl tanlash",
      change: "Almashtirish",
      add: "Qo'shish",
      selected: (n) => `${n} ta fayl tanlandi`,
    },
    pagination: { label: "Sahifalar", previous: "Oldingi sahifa", next: "Keyingi sahifa" },
    table: { empty: "Ko'rsatish uchun ma'lumot yo'q.", selectAll: "Barcha qatorlarni tanlash", selectRow: "Qatorni tanlash" },
    sidebar: { expand: "Yon panelni ochish", collapse: "Yon panelni yig'ish" },
    navbar: { toggleMenu: "Menyuni ochish/yopish" },
    billing: { monthly: "Oylik", yearly: "Yillik" },
    pricing: { popular: "Eng mashhur", cta: "Boshlash" },
    rating: { star: (n) => `${n} yulduz` },
    amountInput: { min: (a) => `Eng kam summa: ${a}`, max: (a) => `Eng ko'p summa: ${a}`, presets: "Tezkor summalar" },
    label: { required: "Majburiy", optional: "Ixtiyoriy", info: "Batafsil" },
    chart: { range: "Ko'rinadigan oraliq", rangeStart: "Oraliq boshi", rangeEnd: "Oraliq oxiri", toggle: (l, h) => `${l}: ${h ? "ko'rsatish" : "yashirish"}`, total: "Jami", empty: "Ma'lumot yo'q" },
  },
  ru: {
    common: { close: "Закрыть", clear: "Очистить", loading: "Загрузка", avatar: "Аватар" },
    select: { placeholder: "Выберите…", empty: "Нет вариантов" },
    phoneInput: { incomplete: "Номер телефона введён не полностью", countryLabel: "Код страны" },
    chat: {
      placeholder: "Спросите что угодно…",
      typing: "Печатает",
      copy: "Копировать",
      regenerate: "Сгенерировать заново",
      like: "Нравится",
      dislike: "Не нравится",
      attach: "Прикрепить файл",
      send: "Отправить",
      stop: "Остановить",
    },
    fileUpload: {
      label: "Нажмите для загрузки или перетащите файл сюда",
      description: (mb) => `Максимальный размер: ${mb} МБ`,
      tooLarge: (names, mb) => `${names} — больше ${mb} МБ`,
      remove: (name) => `Удалить ${name}`,
      tooMany: (max) => `Можно добавить не больше ${max} файлов`,
      browse: "Выбрать",
      choose: "Выбрать файл",
      change: "Заменить",
      add: "Добавить",
      selected: (n) => `Выбрано файлов: ${n}`,
    },
    pagination: { label: "Пагинация", previous: "Предыдущая страница", next: "Следующая страница" },
    table: { empty: "Нет данных для отображения.", selectAll: "Выбрать все строки", selectRow: "Выбрать строку" },
    sidebar: { expand: "Развернуть боковую панель", collapse: "Свернуть боковую панель" },
    navbar: { toggleMenu: "Открыть/закрыть меню" },
    billing: { monthly: "Ежемесячно", yearly: "Ежегодно" },
    pricing: { popular: "Популярный", cta: "Начать" },
    rating: { star: (n) => `${n} ${ruPlural(n, "звезда", "звезды", "звёзд")}` },
    amountInput: { min: (a) => `Минимальная сумма: ${a}`, max: (a) => `Максимальная сумма: ${a}`, presets: "Быстрые суммы" },
    label: { required: "Обязательно", optional: "Необязательно", info: "Подробнее" },
    chart: { range: "Видимый диапазон", rangeStart: "Начало диапазона", rangeEnd: "Конец диапазона", toggle: (l, h) => `${h ? "Показать" : "Скрыть"} ${l}`, total: "Всего", empty: "Нет данных" },
  },
};

export type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends (...args: never[]) => unknown ? T[K] : T[K] extends object ? DeepPartial<T[K]> : T[K];
};

export interface LocaleContextValue {
  locale: NRLocale;
  messages: NRMessages;
}

export const LocaleContext = createContext<LocaleContextValue>({ locale: "en", messages: NR_MESSAGES.en });

/** Merge user overrides into the built-in messages of a locale. */
export function mergeMessages(base: NRMessages, overrides?: DeepPartial<NRMessages>): NRMessages {
  if (!overrides) return base;
  const out = { ...base } as Record<string, Record<string, unknown>>;
  for (const [section, values] of Object.entries(overrides)) {
    if (values) out[section] = { ...out[section], ...(values as Record<string, unknown>) };
  }
  return out as unknown as NRMessages;
}

/** Current locale messages (English when no LocaleProvider is mounted). */
export function useLocale(): NRMessages & { locale: NRLocale } {
  const { locale, messages } = useContext(LocaleContext);
  return { ...messages, locale };
}
