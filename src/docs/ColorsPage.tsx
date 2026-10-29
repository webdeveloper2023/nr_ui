import { useState, type ReactNode } from "react";
import { Check, Copy } from "lucide-react";
import { CodeBlock } from "./CodeBlock";
import { useT, type Tr } from "./i18n/lang";

// System colors — light / dark values as defined in theme.css
const SYSTEM_COLORS = [
  { name: "blue", label: "Blue", light: "#007AFF", dark: "#0A84FF" },
  { name: "green", label: "Green", light: "#34C759", dark: "#30D158" },
  { name: "indigo", label: "Indigo", light: "#5856D6", dark: "#5E5CE6" },
  { name: "orange", label: "Orange", light: "#FF9500", dark: "#FF9F0A" },
  { name: "pink", label: "Pink", light: "#FF2D55", dark: "#FF375F" },
  { name: "purple", label: "Purple", light: "#AF52DE", dark: "#BF5AF2" },
  { name: "red", label: "Red", light: "#FF3B30", dark: "#FF453A" },
  { name: "teal", label: "Teal", light: "#30B0C7", dark: "#40C8E0" },
  { name: "mint", label: "Mint", light: "#00C7BE", dark: "#63E6E2" },
  { name: "cyan", label: "Cyan", light: "#32ADE6", dark: "#64D2FF" },
  { name: "yellow", label: "Yellow", light: "#FFCC00", dark: "#FFD60A" },
  { name: "brown", label: "Brown", light: "#A2845E", dark: "#AC8E68" },
];

const GRAYS = [
  { name: "gray", light: "#8E8E93", dark: "#8E8E93" },
  { name: "gray-2", light: "#AEAEB2", dark: "#636366" },
  { name: "gray-3", light: "#C7C7CC", dark: "#48484A" },
  { name: "gray-4", light: "#D1D1D6", dark: "#3A3A3C" },
  { name: "gray-5", light: "#E5E5EA", dark: "#2C2C2E" },
  { name: "gray-6", light: "#F2F2F7", dark: "#1C1C1E" },
];

// Tailwind needs literal class names to generate them
const BG: Record<string, string> = {
  blue: "bg-blue", green: "bg-green", indigo: "bg-indigo", orange: "bg-orange", pink: "bg-pink", purple: "bg-purple",
  red: "bg-red", teal: "bg-teal", mint: "bg-mint", cyan: "bg-cyan", yellow: "bg-yellow", brown: "bg-brown",
  gray: "bg-gray", "gray-2": "bg-gray-2", "gray-3": "bg-gray-3", "gray-4": "bg-gray-4", "gray-5": "bg-gray-5", "gray-6": "bg-gray-6",
};

const SEMANTIC: { token: string; cls: string; soft: string; desc: Tr }[] = [
  { token: "accent", cls: "bg-accent", soft: "bg-accent-soft text-accent-soft-foreground", desc: { en: "Primary action color (systemBlue)", uz: "Asosiy harakat rangi (systemBlue)", ru: "Основной цвет действий (systemBlue)" } },
  { token: "success", cls: "bg-success", soft: "bg-success-soft text-success-soft-foreground", desc: { en: "Success (systemGreen)", uz: "Muvaffaqiyat (systemGreen)", ru: "Успех (systemGreen)" } },
  { token: "warning", cls: "bg-warning", soft: "bg-warning-soft text-warning-soft-foreground", desc: { en: "Warning (systemOrange)", uz: "Ogohlantirish (systemOrange)", ru: "Предупреждение (systemOrange)" } },
  { token: "danger", cls: "bg-danger", soft: "bg-danger-soft text-danger-soft-foreground", desc: { en: "Danger / error (systemRed)", uz: "Xavf / xato (systemRed)", ru: "Опасность / ошибка (systemRed)" } },
];

const SURFACES: { token: string; cls: string; desc: Tr }[] = [
  { token: "background", cls: "bg-background", desc: { en: "Page background", uz: "Sahifa foni", ru: "Фон страницы" } },
  { token: "surface", cls: "bg-surface", desc: { en: "Cards and panels", uz: "Karta va panellar", ru: "Карточки и панели" } },
  { token: "surface-secondary", cls: "bg-surface-secondary", desc: { en: "Nested blocks", uz: "Ichki bloklar", ru: "Вложенные блоки" } },
  { token: "surface-tertiary", cls: "bg-surface-tertiary", desc: { en: "Deeper nested blocks", uz: "Chuqurroq ichki bloklar", ru: "Глубже вложенные блоки" } },
  { token: "default", cls: "bg-default", desc: { en: "Neutral fill — gray buttons", uz: "Neytral to'ldirish (fill) — kulrang tugmalar", ru: "Нейтральная заливка — серые кнопки" } },
  { token: "field-secondary", cls: "bg-field-secondary", desc: { en: "Input field background", uz: "Kiritish maydoni foni", ru: "Фон поля ввода" } },
];

const C = (s: string) => <code className="font-mono text-[13px] text-foreground">{s}</code>;

function useCopy() {
  const [copied, setCopied] = useState<string | null>(null);
  const copy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(text);
      setTimeout(() => setCopied(null), 1200);
    } catch {
      /* clipboard blocked */
    }
  };
  return { copied, copy };
}

function H2({ id, children }: { id: string; children: ReactNode }) {
  return <h2 id={id} className="scroll-mt-28 mt-16 mb-2 text-[28px] font-semibold tracking-tight text-foreground">{children}</h2>;
}

function Blobs() {
  return (
    <>
      <div className="absolute -left-16 -top-16 size-64 rounded-full bg-blue opacity-70 blur-3xl" />
      <div className="absolute right-0 top-6 size-72 rounded-full bg-pink opacity-60 blur-3xl" />
      <div className="absolute bottom-[-4rem] left-1/3 size-64 rounded-full bg-mint opacity-60 blur-3xl" />
      <div className="absolute bottom-0 right-1/4 size-40 rounded-full bg-orange opacity-50 blur-2xl" />
    </>
  );
}

export default function ColorsPage() {
  const { copied, copy } = useCopy();
  const t = useT();

  const Swatch = ({ name, label, light, dark }: { name: string; label?: string; light: string; dark: string }) => {
    const cls = BG[name];
    return (
      <button
        onClick={() => copy(cls)}
        className="group text-left rounded-2xl bg-surface-gradient p-2 shadow-surface transition-transform hover:-translate-y-0.5 cursor-pointer"
      >
        <div className={`relative h-20 rounded-xl ${cls}`}>
          <span className="absolute right-2 top-2 flex h-6 items-center gap-1 rounded-full glass-thin px-2 text-[11px] font-medium text-foreground opacity-0 transition-opacity group-hover:opacity-100">
            {copied === cls ? <Check size={12} /> : <Copy size={12} />}
            {copied === cls ? t({ en: "Copied", uz: "Nusxalandi", ru: "Скопировано" }) : cls}
          </span>
        </div>
        <div className="px-1.5 pb-1 pt-2.5">
          <p className="text-sm font-semibold text-foreground">{label ?? name}</p>
          <p className="mt-0.5 font-mono text-[11px] text-muted">
            {light} <span className="opacity-50">/</span> {dark}
          </p>
        </div>
      </button>
    );
  };

  return (
    <div className="max-w-5xl">
      <p className="text-sm font-medium text-accent">{t({ en: "Getting started", uz: "Boshlash", ru: "Начало работы" })}</p>
      <h1 className="mt-1 text-[40px] font-bold tracking-tight text-foreground">{t({ en: "Colors & materials", uz: "Ranglar va materiallar", ru: "Цвета и материалы" })}</h1>
      <p className="mt-3 max-w-2xl text-[17px] text-muted">
        {t({
          en: "NR UI uses its own vivid system palette. Every color has its own light and dark value and switches automatically. Glass materials and soft gradients add depth to cards and layouts.",
          uz: "NR UI o'zining yorqin tizim ranglaridan foydalanadi. Har bir rang light va dark rejim uchun o'z qiymatiga ega va avtomatik almashadi. Shisha (glass) materiallar va yengil gradientlar kartalar va layoutlarga chuqurlik beradi.",
          ru: "NR UI использует собственную яркую системную палитру. У каждого цвета есть своё значение для светлой и тёмной темы, переключение автоматическое. Стеклянные материалы и мягкие градиенты придают глубину карточкам и макетам.",
        })}
      </p>

      {/* System colors */}
      <H2 id="system">System colors</H2>
      <p className="mb-6 text-[15px] text-muted">
        {t({ en: "Click a color to copy its Tailwind class. Every prefix works:", uz: "Rangni bosing — Tailwind klassi nusxalanadi. Barcha prefikslar ishlaydi:", ru: "Нажмите на цвет — скопируется класс Tailwind. Работают все префиксы:" })}{" "}
        {C("bg-")}, {C("text-")}, {C("border-")}, {C("ring-")}, {C("from-")}…
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {SYSTEM_COLORS.map((c) => <Swatch key={c.name} {...c} />)}
      </div>

      <H2 id="grays">System grays</H2>
      <p className="mb-6 text-[15px] text-muted">
        gray … gray-6 — {t({ en: "the scale is inverted in dark mode.", uz: "dark rejimda shkala teskari bo'ladi.", ru: "в тёмной теме шкала инвертируется." })}
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {GRAYS.map((c) => <Swatch key={c.name} {...c} />)}
      </div>

      {/* Semantic */}
      <H2 id="semantic">{t({ en: "Semantic colors", uz: "Semantik ranglar", ru: "Семантические цвета" })}</H2>
      <p className="mb-6 text-[15px] text-muted">
        {t({
          en: <>The {C("color")} prop on components maps to these tokens. Each one has a solid and a soft variant.</>,
          uz: <>Komponentlardagi {C("color")} prop'i shu tokenlarga ulanadi. Har birida to'liq (solid) va yumshoq (soft) varianti bor.</>,
          ru: <>Свойство {C("color")} у компонентов связано с этими токенами. У каждого есть сплошной (solid) и мягкий (soft) вариант.</>,
        })}
      </p>
      <div className="grid sm:grid-cols-2 gap-3">
        {SEMANTIC.map((s) => (
          <div key={s.token} className="flex items-center gap-4 rounded-2xl bg-surface-gradient p-4 shadow-surface">
            <div className={`size-12 shrink-0 rounded-xl ${s.cls}`} />
            <div className="min-w-0 flex-1">
              <p className="font-mono text-sm font-semibold text-foreground">{s.token}</p>
              <p className="text-xs text-muted">{t(s.desc)}</p>
            </div>
            <span className={`rounded-full px-3 py-1 text-xs font-semibold ${s.soft}`}>soft</span>
          </div>
        ))}
      </div>

      <H2 id="surfaces">{t({ en: "Backgrounds & surfaces", uz: "Fonlar va surface'lar", ru: "Фоны и поверхности" })}</H2>
      <p className="mb-6 text-[15px] text-muted">
        {t({
          en: "A “grouped” background system: white cards on a gray canvas (in dark mode, a black canvas with #1C1C1E cards).",
          uz: "“Grouped” fon tizimi: kulrang kanva ustida oq kartalar (dark'da qora kanva va #1C1C1E kartalar).",
          ru: "Система фонов «grouped»: белые карточки на сером холсте (в тёмной теме — чёрный холст и карточки #1C1C1E).",
        })}
      </p>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {SURFACES.map((s) => (
          <div key={s.token} className="rounded-2xl bg-surface p-2 shadow-surface">
            <div className={`h-16 rounded-xl ring-1 ring-separator ${s.cls}`} />
            <p className="px-1.5 pt-2.5 font-mono text-sm font-semibold text-foreground">{s.token}</p>
            <p className="px-1.5 pb-1 text-xs text-muted">{t(s.desc)}</p>
          </div>
        ))}
      </div>

      {/* Materials */}
      <H2 id="glass">{t({ en: "Glass materials", uz: "Glass materiallar", ru: "Стеклянные материалы" })}</H2>
      <p className="mb-6 text-[15px] text-muted">
        {t({
          en: <>A translucent material that blurs the content behind it. Turn it on with the {C("isBlurred")} prop or {C('variant="glass"')}. Menus, popovers, modals and toasts are glass by default.</>,
          uz: <>Orqadagi kontentni xiralashtiradigan shaffof material. Komponentlarda {C("isBlurred")} prop'i yoki {C('variant="glass"')} orqali yoqiladi. Menyular, popover, modal va toast'lar default holatda glass.</>,
          ru: <>Полупрозрачный материал, который размывает контент позади. Включается свойством {C("isBlurred")} или {C('variant="glass"')}. Меню, поповеры, модальные окна и тосты стеклянные по умолчанию.</>,
        })}
      </p>
      <div className="relative overflow-hidden rounded-3xl bg-surface p-6 sm:p-10 shadow-surface">
        <Blobs />
        <div className="relative grid sm:grid-cols-3 gap-4">
          {[
            { cls: "glass-thin", title: "glass-thin", text: t({ en: "Thin — chips, hover layers, secondary buttons", uz: "Yengil — chip, hover qatlamlari, ikkinchi darajali tugmalar", ru: "Тонкий — чипы, слои при наведении, второстепенные кнопки" }) },
            { cls: "glass", title: "glass", text: t({ en: "Regular — navbars, sidebars, cards over images", uz: "Oddiy — navbar, sidebar, rasm ustidagi kartalar", ru: "Обычный — навбары, сайдбары, карточки поверх изображений" }) },
            { cls: "glass-thick", title: "glass-thick", text: t({ en: "Thick — menus, popovers, modals, toasts", uz: "Qalin — menyular, popover, modal, toast", ru: "Плотный — меню, поповеры, модальные окна, тосты" }) },
          ].map((m) => (
            <div key={m.cls} className={`rounded-2xl p-5 ${m.cls}`}>
              <p className="font-mono text-sm font-semibold text-foreground">{m.title}</p>
              <p className="mt-2 text-sm text-foreground/75">{m.text}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-4">
        <CodeBlock
          code={`<div className="glass rounded-2xl p-5">...</div>

<Card variant="glass" />
<Navbar isBlurred />
<Dropdown>{/* ${t({ en: "the menu is glass by default", uz: "menyu default holatda glass", ru: "меню стеклянное по умолчанию" })} */}</Dropdown>
<Popover isBlurred={false}>{/* ${t({ en: "solid look", uz: "solid ko'rinish", ru: "сплошной вид" })} */}</Popover>`}
        />
      </div>

      {/* Liquid material */}
      <H2 id="liquid">{t({ en: "Liquid material", uz: "Liquid material", ru: "Материал liquid" })}</H2>
      <p className="mb-6 text-[15px] text-muted">
        {t({
          en: <>A clearer glass with a bright specular rim, an inner glow and a sheen on top — it looks like a glass lens. For the whole app use {C('<html data-glass="liquid">')}, for one component {C('material="liquid"')}. </>,
          uz: <>Shaffofroq shisha: yorqin chekka (specular rim), ichki nur va yuqoridagi yaltiroq qatlam — shisha linzadek ko'rinadi. Butun ilova uchun {C('<html data-glass="liquid">')}, bitta komponent uchun {C('material="liquid"')}. </>,
          ru: <>Более прозрачное стекло с яркой бликовой кромкой, внутренним свечением и бликом сверху — выглядит как стеклянная линза. Для всего приложения — {C('<html data-glass="liquid">')}, для одного компонента — {C('material="liquid"')}. </>,
        })}
      </p>
      <div className="relative overflow-hidden rounded-3xl bg-surface p-6 sm:p-10 shadow-surface">
        <Blobs />
        <div className="absolute inset-0 opacity-30 [background-image:repeating-linear-gradient(90deg,var(--color-foreground)_0_1px,transparent_1px_28px)]" />
        <div className="relative grid sm:grid-cols-2 gap-5">
          {(["frosted", "liquid"] as const).map((m) => (
            <div key={m} data-glass={m} className="glass rounded-[28px] p-6">
              <p className="font-mono text-sm font-semibold text-foreground">data-glass="{m}"</p>
              <p className="mt-2 text-sm text-foreground/75">
                {m === "frosted"
                  ? t({ en: "Classic frosted glass — strong blur, more white tint. For text-heavy areas.", uz: "Klassik xira shisha — kuchli blur, ko'proq oq tus. Matn ko'p bo'lgan joylar uchun.", ru: "Классическое матовое стекло — сильное размытие, больше белого оттенка. Для мест с большим количеством текста." })
                  : t({ en: "Liquid — the content behind stays clearer and the edges shine. For navbars, buttons and floating panels.", uz: "Liquid — orqadagi kontent aniqroq ko'rinadi, chetlari yaltiraydi. Navbar, tugmalar, suzuvchi panellar uchun.", ru: "Liquid — контент позади виден чётче, края блестят. Для навбаров, кнопок и плавающих панелей." })}
              </p>
              <div className="mt-5 flex gap-2">
                <span className="glass-thin rounded-full px-4 py-2 text-sm font-medium text-foreground">{t({ en: "Button", uz: "Tugma", ru: "Кнопка" })}</span>
                <span className="glass-thin rounded-full px-4 py-2 text-sm font-medium text-foreground">Capsule</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-4">
        <CodeBlock
          code={`// ${t({ en: "Whole app — liquid material", uz: "Butun ilova — liquid material", ru: "Всё приложение — материал liquid" })}
document.documentElement.dataset.glass = "liquid";

// ${t({ en: "One component", uz: "Bitta komponent", ru: "Один компонент" })}
<Card variant="glass" material="liquid" />
<Navbar isBlurred material="liquid" />
<DropdownMenu material="liquid">...</DropdownMenu>

// ${t({ en: "Make one classic inside a liquid app", uz: "Liquid ilova ichida bittasini klassik qilish", ru: "Сделать один классическим внутри liquid-приложения" })}
<Modal material="frosted" />`}
        />
      </div>

      {/* Gradients */}
      <H2 id="gradients">{t({ en: "Soft gradients", uz: "Yengil gradientlar", ru: "Мягкие градиенты" })}</H2>
      <p className="mb-6 text-[15px] text-muted">
        {t({
          en: <>Cards ({C("bg-surface-gradient")}) and the page background ({C("bg-canvas-gradient")}) have a barely noticeable gradient — so does this page's background.</>,
          uz: <>Kartalar ({C("bg-surface-gradient")}) va sahifa foni ({C("bg-canvas-gradient")}) bilinar-bilinmas gradientga ega — shu sahifa fonining o'zi ham shunday.</>,
          ru: <>У карточек ({C("bg-surface-gradient")}) и фона страницы ({C("bg-canvas-gradient")}) едва заметный градиент — у фона этой страницы тоже.</>,
        })}
      </p>
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="rounded-2xl bg-surface-gradient p-6 shadow-surface">
          <p className="font-mono text-sm font-semibold text-foreground">bg-surface-gradient</p>
          <p className="mt-2 text-sm text-muted">
            {t({ en: "Card's default variant. A 3–5% accent tint in the bottom-right corner.", uz: "Card default varianti. Pastki o'ng burchakda accent rangning 3–5% tusi.", ru: "Вариант Card по умолчанию. Оттенок акцента 3–5% в правом нижнем углу." })}
          </p>
        </div>
        <div className="rounded-2xl bg-surface p-6 shadow-surface">
          <p className="font-mono text-sm font-semibold text-foreground">bg-surface</p>
          <p className="mt-2 text-sm text-muted">
            {t({ en: "Flat surface without a gradient —", uz: "Gradientsiz tekis surface —", ru: "Плоская поверхность без градиента —" })} Card <code className="font-mono text-xs">variant="flat"</code>.
          </p>
        </div>
      </div>

      {/* Config */}
      <H2 id="config">{t({ en: "Configuration", uz: "Sozlash", ru: "Настройка" })}</H2>
      <p className="mb-6 text-[15px] text-muted">
        {t({ en: "Everything is CSS variables — redeclare them in your own CSS file.", uz: "Hammasi CSS o'zgaruvchilar orqali — o'z CSS faylingizda qayta e'lon qiling.", ru: "Всё настраивается CSS-переменными — переопределите их в своём CSS-файле." })}
      </p>
      <CodeBlock
        language="css"
        fileName="src/index.css"
        code={`@import "tailwindcss";
@import "nr-ui-kit/theme.css";

:root {
  /* Glass */
  --nr-glass-blur: 24px;       /* ${t({ en: "blur strength", uz: "blur kuchi", ru: "сила размытия" })} */
  --nr-glass-alpha: 0.62;      /* ${t({ en: "opacity: 0 — fully clear, 1 — solid", uz: "shaffoflik: 0 — to'liq shaffof, 1 — solid", ru: "непрозрачность: 0 — полностью прозрачно, 1 — сплошное" })} */
  --nr-glass-saturate: 180%;   /* ${t({ en: "saturation of what's behind", uz: "orqadagi ranglar to'yinganligi", ru: "насыщенность фона под стеклом" })} */

  /* ${t({ en: "Gradients", uz: "Gradientlar", ru: "Градиенты" })} */
  --nr-gradient-surface: none; /* ${t({ en: "flat cards", uz: "kartalarni tekis qilish", ru: "плоские карточки" })} */
  --nr-gradient-canvas: none;  /* ${t({ en: "flat page background", uz: "sahifa fonini tekis qilish", ru: "плоский фон страницы" })} */
}

.dark {
  --nr-glass-alpha: 0.5;
}`}
      />
    </div>
  );
}
