import { useState, type ReactNode } from "react";
import { Check, Copy } from "lucide-react";
import { CodeBlock } from "./CodeBlock";

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

const SEMANTIC = [
  { token: "accent", cls: "bg-accent", soft: "bg-accent-soft text-accent-soft-foreground", desc: "Asosiy harakat rangi (systemBlue)" },
  { token: "success", cls: "bg-success", soft: "bg-success-soft text-success-soft-foreground", desc: "Muvaffaqiyat (systemGreen)" },
  { token: "warning", cls: "bg-warning", soft: "bg-warning-soft text-warning-soft-foreground", desc: "Ogohlantirish (systemOrange)" },
  { token: "danger", cls: "bg-danger", soft: "bg-danger-soft text-danger-soft-foreground", desc: "Xavf / xato (systemRed)" },
];

const SURFACES = [
  { token: "background", cls: "bg-background", desc: "Sahifa foni" },
  { token: "surface", cls: "bg-surface", desc: "Karta va panellar" },
  { token: "surface-secondary", cls: "bg-surface-secondary", desc: "Ichki bloklar" },
  { token: "surface-tertiary", cls: "bg-surface-tertiary", desc: "Chuqurroq ichki bloklar" },
  { token: "default", cls: "bg-default", desc: "Neytral to'ldirish (fill) — kulrang tugmalar" },
  { token: "field-secondary", cls: "bg-field-secondary", desc: "Kiritish maydoni foni" },
];

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
            {copied === cls ? "Copied" : cls}
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
      <p className="text-sm font-medium text-accent">Boshlash</p>
      <h1 className="mt-1 text-[40px] font-bold tracking-tight text-foreground">Ranglar va materiallar</h1>
      <p className="mt-3 max-w-2xl text-[17px] text-muted">
        NR UI o'zining yorqin tizim ranglarini ishlatadi. Har bir rang light va dark rejim uchun o'z qiymatiga ega va avtomatik almashadi.
        Shisha (glass) materiallar va yengil gradientlar kartalar va layoutlarga chuqurlik beradi.
      </p>

      {/* System colors */}
      <H2 id="system">System colors</H2>
      <p className="mb-6 text-[15px] text-muted">Rangni bosing — Tailwind klassi nusxalanadi. Barcha prefikslar ishlaydi: <code className="font-mono text-[13px] text-foreground">bg-</code>, <code className="font-mono text-[13px] text-foreground">text-</code>, <code className="font-mono text-[13px] text-foreground">border-</code>, <code className="font-mono text-[13px] text-foreground">ring-</code>, <code className="font-mono text-[13px] text-foreground">from-</code>…</p>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {SYSTEM_COLORS.map((c) => <Swatch key={c.name} {...c} />)}
      </div>

      <H2 id="grays">System grays</H2>
      <p className="mb-6 text-[15px] text-muted">gray … gray-6 — dark rejimda shkala teskari bo'ladi.</p>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {GRAYS.map((c) => <Swatch key={c.name} {...c} />)}
      </div>

      {/* Semantic */}
      <H2 id="semantic">Semantik ranglar</H2>
      <p className="mb-6 text-[15px] text-muted">Komponentlardagi <code className="font-mono text-[13px] text-foreground">color</code> prop'i shu tokenlarga ulanadi. Har birida to'liq (solid) va yumshoq (soft) varianti bor.</p>
      <div className="grid sm:grid-cols-2 gap-3">
        {SEMANTIC.map((s) => (
          <div key={s.token} className="flex items-center gap-4 rounded-2xl bg-surface-gradient p-4 shadow-surface">
            <div className={`size-12 shrink-0 rounded-xl ${s.cls}`} />
            <div className="min-w-0 flex-1">
              <p className="font-mono text-sm font-semibold text-foreground">{s.token}</p>
              <p className="text-xs text-muted">{s.desc}</p>
            </div>
            <span className={`rounded-full px-3 py-1 text-xs font-semibold ${s.soft}`}>soft</span>
          </div>
        ))}
      </div>

      <H2 id="surfaces">Fonlar va surface'lar</H2>
      <p className="mb-6 text-[15px] text-muted">"grouped" fon tizimi: kulrang kanva ustida oq kartalar (dark'da qora kanva va #1C1C1E kartalar).</p>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {SURFACES.map((s) => (
          <div key={s.token} className="rounded-2xl bg-surface p-2 shadow-surface">
            <div className={`h-16 rounded-xl ring-1 ring-separator ${s.cls}`} />
            <p className="px-1.5 pt-2.5 font-mono text-sm font-semibold text-foreground">{s.token}</p>
            <p className="px-1.5 pb-1 text-xs text-muted">{s.desc}</p>
          </div>
        ))}
      </div>

      {/* Materials */}
      <H2 id="glass">Glass materiallar</H2>
      <p className="mb-6 text-[15px] text-muted">
        Orqadagi kontentni xiralashtiradigan shaffof material. Komponentlarda <code className="font-mono text-[13px] text-foreground">isBlurred</code> prop'i yoki <code className="font-mono text-[13px] text-foreground">variant="glass"</code> orqali yoqiladi.
        Menyular, popover, modal va toast'lar default holatda glass.
      </p>
      <div className="relative overflow-hidden rounded-3xl bg-surface p-6 sm:p-10 shadow-surface">
        <Blobs />
        <div className="relative grid sm:grid-cols-3 gap-4">
          {[
            { cls: "glass-thin", title: "glass-thin", text: "Yengil — chip, hover qatlamlari, ikkinchi darajali tugmalar" },
            { cls: "glass", title: "glass", text: "Oddiy — navbar, sidebar, rasm ustidagi kartalar" },
            { cls: "glass-thick", title: "glass-thick", text: "Qalin — menyular, popover, modal, toast" },
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
<Dropdown>{/* menyu default holatda glass */}</Dropdown>
<Popover isBlurred={false}>{/* solid ko'rinish */}</Popover>`}
        />
      </div>

      {/* Liquid */}
      <H2 id="liquid">Liquid (clear glass)</H2>
      <p className="mb-6 text-[15px] text-muted">
        Shaffofroq shisha materiali: shaffofroq, yorqin chekka (specular rim), ichki nur va yuqoridagi yaltiroq qatlam — shisha linzadek ko'rinadi.
        Butun ilova uchun <code className="font-mono text-[13px] text-foreground">{'<html data-glass="liquid">'}</code>, bitta komponent uchun{" "}
        <code className="font-mono text-[13px] text-foreground">material="liquid"</code>. Header'dagi <b className="text-foreground">Frosted / Liquid</b> tugmasi bilan butun saytni almashtirib ko'ring.
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
                  ? "Klassik xira shisha — kuchli blur, ko'proq oq tus. Matn ko'p bo'lgan joylar uchun."
                  : "Liquid — orqadagi kontent aniqroq ko'rinadi, chetlari yaltiraydi. Navbar, tugmalar, suzuvchi panellar uchun."}
              </p>
              <div className="mt-5 flex gap-2">
                <span className="glass-thin rounded-full px-4 py-2 text-sm font-medium text-foreground">Tugma</span>
                <span className="glass-thin rounded-full px-4 py-2 text-sm font-medium text-foreground">Capsule</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-4">
        <CodeBlock
          code={`// Butun ilova — Liquid
document.documentElement.dataset.glass = "liquid";

// Bitta komponent
<Card variant="glass" material="liquid" />
<Navbar isBlurred material="liquid" />
<DropdownMenu material="liquid">...</DropdownMenu>

// Liquid ilova ichida bittasini klassik qilish
<Modal material="frosted" />`}
        />
      </div>

      {/* Gradients */}
      <H2 id="gradients">Yengil gradientlar</H2>
      <p className="mb-6 text-[15px] text-muted">
        Kartalar (<code className="font-mono text-[13px] text-foreground">bg-surface-gradient</code>) va sahifa foni (<code className="font-mono text-[13px] text-foreground">bg-canvas-gradient</code>) bilinar-bilinmas gradientga ega — shu sahifa fonining o'zi ham shunday.
      </p>
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="rounded-2xl bg-surface-gradient p-6 shadow-surface">
          <p className="font-mono text-sm font-semibold text-foreground">bg-surface-gradient</p>
          <p className="mt-2 text-sm text-muted">Card default varianti. Pastki o'ng burchakda accent rangning 3–5% tusi.</p>
        </div>
        <div className="rounded-2xl bg-surface p-6 shadow-surface">
          <p className="font-mono text-sm font-semibold text-foreground">bg-surface</p>
          <p className="mt-2 text-sm text-muted">Gradientsiz tekis surface — Card <code className="font-mono text-xs">variant="flat"</code>.</p>
        </div>
      </div>

      {/* Config */}
      <H2 id="config">Sozlash</H2>
      <p className="mb-6 text-[15px] text-muted">Hammasi CSS o'zgaruvchilar orqali — o'z CSS faylingizda qayta e'lon qiling.</p>
      <CodeBlock
        language="css"
        fileName="src/index.css"
        code={`@import "tailwindcss";
@import "nr-ui-kit/theme.css";

:root {
  /* Glass */
  --nr-glass-blur: 24px;       /* blur kuchi */
  --nr-glass-alpha: 0.62;      /* shaffoflik: 0 — to'liq shaffof, 1 — solid */
  --nr-glass-saturate: 180%;   /* orqadagi ranglar to'yinganligi */

  /* Gradientlar */
  --nr-gradient-surface: none; /* kartalarni tekis qilish */
  --nr-gradient-canvas: none;  /* sahifa fonini tekis qilish */
}

.dark {
  --nr-glass-alpha: 0.5;
}`}
      />
    </div>
  );
}
