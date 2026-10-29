import { Link } from "react-router-dom";
import { ArrowRight, Layers, Moon, Palette } from "lucide-react";
import { CodeBlock } from "./CodeBlock";
import { GROUPS, GROUP_LABELS, registry } from "./registry";
import { COMPONENT_COUNT, PART_COUNT } from "./stats";
import { useT } from "./i18n/lang";

function Step({ n, title, children }: { n: number; title: string; children: React.ReactNode }) {
  return (
    <div className="relative pl-12 pb-12 last:pb-0">
      <span className="absolute left-0 top-0 flex h-8 w-8 items-center justify-center rounded-full bg-surface text-sm font-semibold text-foreground shadow-surface">{n}</span>
      <span className="absolute left-[15px] top-10 bottom-2 w-px bg-separator" />
      <h3 className="text-xl font-semibold tracking-tight text-foreground">{title}</h3>
      <div className="mt-3 space-y-3 text-[15px] leading-7 text-muted">{children}</div>
    </div>
  );
}

const code = (s: string) => <code className="rounded-md bg-default px-1.5 py-0.5 font-mono text-[13px] text-foreground">{s}</code>;

export default function GettingStarted() {
  const t = useT();
  const colorsLink = (label: string) => <Link to="/colors" className="text-accent hover:underline">{label}</Link>;

  return (
    <div className="max-w-[860px]">
      {/* Hero */}
      <section className="pt-6 pb-14 text-center">
        <p className="text-[15px] font-medium text-accent">nr ui kit · React + Tailwind v4</p>
        <h1 className="mt-4 text-5xl sm:text-6xl font-semibold leading-[1.05] tracking-[-0.035em]">
          <span className="text-foreground">{t({ en: "Beautiful interfaces,", uz: "Chiroyli interfeyslar,", ru: "Красивые интерфейсы," })}</span>
          <br />
          <span className="text-muted/70">{t({ en: "with less code", uz: "kamroq kod bilan", ru: "меньше кода" })}</span>
        </h1>
        <p className="mx-auto mt-6 max-w-lg text-[17px] leading-7 text-muted">
          {t({
            en: `${COMPONENT_COUNT} components (${PART_COUNT} parts with sub-components), dark mode and theme tokens. Every page has live examples, code and props.`,
            uz: `${COMPONENT_COUNT} ta komponent (ichki qismlari bilan ${PART_COUNT} ta), dark mode va theme tokenlar. Har bir sahifada jonli misol, kod va props.`,
            ru: `${COMPONENT_COUNT} компонентов (${PART_COUNT} с вложенными частями), тёмная тема и токены темы. На каждой странице — живые примеры, код и свойства.`,
          })}
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link to="/components/button" className="inline-flex h-11 items-center gap-2 rounded-full bg-accent px-5 text-sm font-medium text-accent-foreground transition-transform hover:bg-accent-hover active:scale-[0.97]">
            {t({ en: "Components", uz: "Komponentlar", ru: "Компоненты" })} <ArrowRight size={16} />
          </Link>
          <Link to="/dashboard" className="inline-flex h-11 items-center rounded-full bg-surface px-5 text-sm font-medium text-foreground shadow-surface transition-transform active:scale-[0.97]">
            {t({ en: "Dashboard template", uz: "Dashboard namunasi", ru: "Шаблон дашборда" })}
          </Link>
          <a href="#install" className="inline-flex h-11 items-center rounded-full bg-surface px-5 text-sm font-medium text-foreground shadow-surface transition-transform active:scale-[0.97]">
            {t({ en: "Installation", uz: "O'rnatish", ru: "Установка" })}
          </a>
        </div>
      </section>

      <div className="grid gap-4 sm:grid-cols-3">
        {[
          {
            key: "surface",
            icon: <Layers size={18} />,
            title: t({ en: "Surface system", uz: "Surface tizimi", ru: "Система поверхностей" }),
            text: t({ en: "Gray canvas, white surfaces, soft shadows.", uz: "Kulrang fon, oq surface, yengil soyalar.", ru: "Серый фон, белые поверхности, мягкие тени." }),
          },
          {
            key: "dark",
            icon: <Moon size={18} />,
            title: t({ en: "Dark mode", uz: "Dark mode", ru: "Тёмная тема" }),
            text: t({ en: "One `dark` class switches the whole UI.", uz: "Bitta `dark` klass — butun UI almashadi.", ru: "Один класс `dark` — и весь интерфейс меняется." }),
          },
          {
            key: "tokens",
            icon: <Palette size={18} />,
            title: t({ en: "Theme tokens", uz: "Theme tokenlar", ru: "Токены темы" }),
            text: t({ en: "Change accent and status colors in CSS.", uz: "Accent va status ranglarini CSS'da o'zgartiring.", ru: "Меняйте акцентный и статусные цвета в CSS." }),
          },
        ].map((f) => (
          <div key={f.key} className="rounded-3xl bg-surface p-5 shadow-surface">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent-soft text-accent-soft-foreground">{f.icon}</span>
            <p className="mt-4 font-medium text-foreground">{f.title}</p>
            <p className="mt-1 text-sm text-muted">{f.text}</p>
          </div>
        ))}
      </div>

      <h2 id="install" className="scroll-mt-28 mt-20 mb-8 text-[28px] font-semibold tracking-tight text-foreground">
        {t({ en: "Installation", uz: "O'rnatish", ru: "Установка" })}
      </h2>
      <Step n={1} title={t({ en: "Install the package", uz: "Paketni o'rnating", ru: "Установите пакет" })}>
        <p>
          {t({
            en: "NR UI Kit is free to use under the MIT license. Install it with:",
            uz: "NR UI Kit bepul, MIT litsenziyasi bilan foydalanishingiz mumkin. O'rnatish:",
            ru: "NR UI Kit бесплатен и распространяется под лицензией MIT. Установите пакет:",
          })}
        </p>
        <CodeBlock language="bash" code="npm install nr-ui-kit" />
        <p>
          {t({ en: "Requirements:", uz: "Talablar:", ru: "Требования:" })} {code("react ≥ 18")}, {code("react-dom ≥ 18")}. {code("lucide-react")}{" "}
          {t({ en: "is installed automatically.", uz: "avtomatik o'rnatiladi.", ru: "устанавливается автоматически." })}
        </p>
      </Step>
      <Step n={2} title={t({ en: "Add the styles", uz: "Stillarni ulang", ru: "Подключите стили" })}>
        <p>
          {t({
            en: <><b className="font-medium text-foreground">If you use Tailwind v4</b> (recommended) — in your main CSS file:</>,
            uz: <><b className="font-medium text-foreground">Tailwind v4 bor bo'lsa</b> (tavsiya) — asosiy CSS faylga:</>,
            ru: <><b className="font-medium text-foreground">Если используете Tailwind v4</b> (рекомендуется) — в основной CSS-файл:</>,
          })}
        </p>
        <CodeBlock language="css" fileName="src/index.css" code={`@import "tailwindcss";\n@import "nr-ui-kit/theme.css";`} />
        <p>
          {t({
            en: <>Then tokens like {code("bg-surface")}, {code("text-muted")}, {code("bg-accent")}, {code("shadow-surface")} work in your own code too.</>,
            uz: <>Shunda o'z kodingizda ham {code("bg-surface")}, {code("text-muted")}, {code("bg-accent")}, {code("shadow-surface")} kabi tokenlar ishlaydi.</>,
            ru: <>Тогда токены вроде {code("bg-surface")}, {code("text-muted")}, {code("bg-accent")}, {code("shadow-surface")} работают и в вашем коде.</>,
          })}
        </p>
        <p>
          {t({
            en: <><b className="font-medium text-foreground">Without Tailwind</b> — the prebuilt CSS:</>,
            uz: <><b className="font-medium text-foreground">Tailwind'siz</b> — tayyor CSS:</>,
            ru: <><b className="font-medium text-foreground">Без Tailwind</b> — готовый CSS:</>,
          })}
        </p>
        <CodeBlock fileName="src/main.tsx" code={`import "nr-ui-kit/styles.css";`} />
      </Step>
      <Step n={3} title={t({ en: "Provider (for Toast)", uz: "Provider (Toast uchun)", ru: "Провайдер (для Toast)" })}>
        <CodeBlock
          fileName="src/main.tsx"
          code={`import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ToastProvider } from "nr-ui-kit";
import "./index.css";
import App from "./App";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ToastProvider placement="bottom-right">
      <App />
    </ToastProvider>
  </StrictMode>
);`}
        />
      </Step>
      <Step n={4} title={t({ en: "Use it", uz: "Ishlating", ru: "Используйте" })}>
        <CodeBlock
          fileName="src/App.tsx"
          code={`import { Button, Card, CardBody, Input, useToast } from "nr-ui-kit";

export default function App() {
  const { addToast } = useToast();

  return (
    <Card className="max-w-sm">
      <CardBody className="space-y-3">
        <Input label="Email" type="email" variant="secondary" />
        <Button fullWidth onClick={() => addToast({ title: "${t({ en: "Sent!", uz: "Yuborildi!", ru: "Отправлено!" })}", color: "success" })}>
          ${t({ en: "Send", uz: "Yuborish", ru: "Отправить" })}
        </Button>
      </CardBody>
    </Card>
  );
}`}
        />
      </Step>

      <h2 id="responsive" className="scroll-mt-28 mt-20 mb-4 text-[28px] font-semibold tracking-tight text-foreground">
        {t({ en: "Responsive design", uz: "Responsive dizayn", ru: "Адаптивный дизайн" })}
      </h2>
      <p className="mb-4 text-[15px] text-muted">
        {t({
          en: <>Every component takes {code("responsive")}: on its own it adapts on all four breakpoints — {code("m")} mobile (&lt;768px), {code("t")} tablet, {code("l")} laptop, {code("d")} desktop (≥1536px); a list such as {code('["m", "t"]')} adapts only there. Wrap the app in {code("ResponsiveProvider")} to turn it on everywhere, and lay pages out with {code("Container")}, {code("Stack")} and {code("Grid")}. Details: <Link to="/components/responsive" className="text-accent hover:underline">Responsive</Link>.</>,
          uz: <>Har bir komponent {code("responsive")} qabul qiladi: o'zi yozilsa to'rtala breakpointga moslashadi — {code("m")} mobile (&lt;768px), {code("t")} tablet, {code("l")} laptop, {code("d")} desktop (≥1536px); {code('["m", "t"]')} kabi ro'yxat yozilsa faqat o'shalarga. Butun ilovaga yoqish uchun {code("ResponsiveProvider")} bilan o'rang, sahifani esa {code("Container")}, {code("Stack")} va {code("Grid")} bilan quring. Batafsil: <Link to="/components/responsive" className="text-accent hover:underline">Responsive</Link>.</>,
          ru: <>Каждый компонент принимает {code("responsive")}: сам по себе он адаптирует под все четыре брейкпоинта — {code("m")} mobile (&lt;768px), {code("t")} tablet, {code("l")} laptop, {code("d")} desktop (≥1536px); список вроде {code('["m", "t"]')} — только под них. Оберните приложение в {code("ResponsiveProvider")}, чтобы включить везде, а страницы стройте из {code("Container")}, {code("Stack")} и {code("Grid")}. Подробнее: <Link to="/components/responsive" className="text-accent hover:underline">Responsive</Link>.</>,
        })}
      </p>
      <CodeBlock
        fileName="src/App.tsx"
        code={`import { Button, Card, CardBody, Container, Grid, Input, ResponsiveProvider } from "nr-ui-kit";

export default function App() {
  return (
    <ResponsiveProvider>
      <Container>
        {/* ${t({ en: "1 column on mobile, 2 on tablet, 3 from laptop up", uz: "mobile'da 1 ustun, tablet'da 2, laptop'dan boshlab 3", ru: "1 колонка на mobile, 2 на tablet, 3 начиная с laptop" })} */}
        <Grid cols={3}>
          <Card>
            <CardBody>
              <Input label="Email" />
              <Button responsive={["m"]}>${t({ en: "Send", uz: "Yuborish", ru: "Отправить" })}</Button>
            </CardBody>
          </Card>
        </Grid>
      </Container>
    </ResponsiveProvider>
  );
}`}
      />

      <h2 id="theming" className="scroll-mt-28 mt-20 mb-4 text-[28px] font-semibold tracking-tight text-foreground">
        {t({ en: "Dark mode and theming", uz: "Dark mode va theme", ru: "Тёмная тема и оформление" })}
      </h2>
      <p className="mb-4 text-[15px] text-muted">
        {t({
          en: <>Dark mode — add the {code("dark")} class to {code("<html>")}:</>,
          uz: <>Dark mode — {code("<html>")} ga {code("dark")} klassi:</>,
          ru: <>Тёмная тема — добавьте класс {code("dark")} к {code("<html>")}:</>,
        })}
      </p>
      <CodeBlock code={`document.documentElement.classList.toggle("dark", isDark);`} lineNumbers={false} />
      <p className="mt-6 mb-4 text-[15px] text-muted">{t({ en: "Changing the brand color:", uz: "Brend rangini o'zgartirish:", ru: "Смена фирменного цвета:" })}</p>
      <CodeBlock
        language="css"
        fileName="src/index.css"
        code={`@import "tailwindcss";
@import "nr-ui-kit/theme.css";

@theme {
  /* ${t({ en: "Example: make the accent indigo", uz: "Masalan: accent'ni indigo qilish", ru: "Например: сделать акцент индиго" })} */
  --color-accent: #5856d6;
  --color-accent-hover: #6e6cdf;
  --color-accent-soft-foreground: #3634a3;
}`}
      />
      <p className="mt-6 mb-4 text-[15px] text-muted">
        {t({
          en: <>Tune glass and gradients app-wide — every component reads these variables. Details: {colorsLink("Colors & materials")}.</>,
          uz: <>Glass (shisha) va gradientlarni butun ilova bo'yicha sozlash — barcha komponentlar shu o'zgaruvchilarni ishlatadi. Batafsil: {colorsLink("Ranglar va materiallar")}.</>,
          ru: <>Настройка стекла и градиентов для всего приложения — все компоненты используют эти переменные. Подробнее: {colorsLink("Цвета и материалы")}.</>,
        })}
      </p>
      <CodeBlock
        language="css"
        fileName="src/index.css"
        code={`:root {
  --nr-glass-blur: 32px;      /* ${t({ en: "blur strength (default 24px)", uz: "blur kuchi (default 24px)", ru: "сила размытия (по умолчанию 24px)" })} */
  --nr-glass-alpha: 0.5;      /* ${t({ en: "glass transparency (0–1)", uz: "shisha shaffofligi (0–1)", ru: "прозрачность стекла (0–1)" })} */
  --nr-glass-saturate: 200%;  /* ${t({ en: "saturation of what's behind", uz: "orqadagi ranglar to'yinganligi", ru: "насыщенность фона под стеклом" })} */

  --nr-gradient-surface: none; /* ${t({ en: "turn off the soft card gradient", uz: "kartalardagi yengil gradientni o'chirish", ru: "отключить мягкий градиент карточек" })} */
  --nr-gradient-canvas: none;  /* ${t({ en: "turn off the page background gradient", uz: "sahifa fonidagi gradientni o'chirish", ru: "отключить градиент фона страницы" })} */
}`}
      />

      <h2 className="mt-20 mb-6 text-[28px] font-semibold tracking-tight text-foreground">{t({ en: "Components", uz: "Komponentlar", ru: "Компоненты" })}</h2>
      <div className="space-y-8">
        {GROUPS.map((g) => (
          <div key={g}>
            <p className="mb-3 text-sm font-medium text-muted">{t(GROUP_LABELS[g])}</p>
            <div className="flex flex-wrap gap-2">
              {registry.filter((e) => e.group === g).map((e) => (
                <Link key={e.slug} to={`/components/${e.slug}`} className="inline-flex h-8 items-center rounded-full bg-surface px-3.5 text-sm text-foreground shadow-surface transition-colors hover:bg-default">
                  {e.name}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
