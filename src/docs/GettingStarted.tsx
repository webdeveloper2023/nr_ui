import { Link } from "react-router-dom";
import { ArrowRight, Layers, Moon, Palette } from "lucide-react";
import { CodeBlock } from "./CodeBlock";
import { GROUPS, registry } from "./registry";

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
  return (
    <div className="max-w-[860px]">
      {/* Hero */}
      <section className="pt-6 pb-14 text-center">
        <p className="text-[15px] font-medium text-accent">nr ui kit · React + Tailwind v4</p>
        <h1 className="mt-4 text-5xl sm:text-6xl font-semibold leading-[1.05] tracking-[-0.035em]">
          <span className="text-foreground">Chiroyli interfeyslar,</span>
          <br />
          <span className="text-muted/70">kamroq kod bilan</span>
        </h1>
        <p className="mx-auto mt-6 max-w-lg text-[17px] leading-7 text-muted">
          {registry.length}+ ta komponent, dark mode va theme tokenlar. Har bir sahifada jonli misol, kod va props.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link to="/components/button" className="inline-flex h-11 items-center gap-2 rounded-full bg-accent px-5 text-sm font-medium text-accent-foreground transition-transform hover:bg-accent-hover active:scale-[0.97]">
            Komponentlar <ArrowRight size={16} />
          </Link>
          <Link to="/dashboard" className="inline-flex h-11 items-center rounded-full bg-surface px-5 text-sm font-medium text-foreground shadow-surface transition-transform active:scale-[0.97]">
            Dashboard namunasi
          </Link>
          <a href="#install" className="inline-flex h-11 items-center rounded-full bg-surface px-5 text-sm font-medium text-foreground shadow-surface transition-transform active:scale-[0.97]">
            O'rnatish
          </a>
        </div>
      </section>

      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { icon: <Layers size={18} />, title: "Surface tizimi", text: "Kulrang fon, oq surface, yengil soyalar." },
          { icon: <Moon size={18} />, title: "Dark mode", text: "Bitta `dark` klass — butun UI almashadi." },
          { icon: <Palette size={18} />, title: "Theme tokenlar", text: "Accent va status ranglarini CSS'da o'zgartiring." },
        ].map((f) => (
          <div key={f.title} className="rounded-3xl bg-surface p-5 shadow-surface">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent-soft text-accent-soft-foreground">{f.icon}</span>
            <p className="mt-4 font-medium text-foreground">{f.title}</p>
            <p className="mt-1 text-sm text-muted">{f.text}</p>
          </div>
        ))}
      </div>

      <h2 id="install" className="scroll-mt-28 mt-20 mb-8 text-[28px] font-semibold tracking-tight text-foreground">O'rnatish</h2>
      <Step n={1} title="Paketni o'rnating">
        <p>GitHub'dan (private repo uchun GitHub'ga kirgan bo'lishingiz kerak):</p>
        <CodeBlock language="bash" code="npm install github:webdeveloper2023/nr_ui" />
        <p>npm'ga publish qilingandan keyin:</p>
        <CodeBlock language="bash" code="npm install nr-ui-kit" />
        <p>Talablar: {code("react ≥ 18")}, {code("react-dom ≥ 18")}. {code("lucide-react")} avtomatik o'rnatiladi.</p>
      </Step>
      <Step n={2} title="Stillarni ulang">
        <p><b className="font-medium text-foreground">Tailwind v4 bor bo'lsa</b> (tavsiya) — asosiy CSS faylga:</p>
        <CodeBlock language="css" fileName="src/index.css" code={`@import "tailwindcss";\n@import "nr-ui-kit/theme.css";`} />
        <p>Shunda o'z kodingizda ham {code("bg-surface")}, {code("text-muted")}, {code("bg-accent")}, {code("shadow-surface")} kabi tokenlar ishlaydi.</p>
        <p><b className="font-medium text-foreground">Tailwind'siz</b> — tayyor CSS:</p>
        <CodeBlock fileName="src/main.tsx" code={`import "nr-ui-kit/styles.css";`} />
      </Step>
      <Step n={3} title="Provider (Toast uchun)">
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
      <Step n={4} title="Ishlating">
        <CodeBlock
          fileName="src/App.tsx"
          code={`import { Button, Card, CardBody, Input, useToast } from "nr-ui-kit";

export default function App() {
  const { addToast } = useToast();

  return (
    <Card className="max-w-sm">
      <CardBody className="space-y-3">
        <Input label="Email" type="email" variant="secondary" />
        <Button fullWidth onClick={() => addToast({ title: "Yuborildi!", color: "success" })}>
          Yuborish
        </Button>
      </CardBody>
    </Card>
  );
}`}
        />
      </Step>

      <h2 id="theming" className="scroll-mt-28 mt-20 mb-4 text-[28px] font-semibold tracking-tight text-foreground">Dark mode va theme</h2>
      <p className="mb-4 text-[15px] text-muted">Dark mode — {code("<html>")} ga {code("dark")} klassi:</p>
      <CodeBlock code={`document.documentElement.classList.toggle("dark", isDark);`} lineNumbers={false} />
      <p className="mt-6 mb-4 text-[15px] text-muted">Brend rangini o'zgartirish:</p>
      <CodeBlock
        language="css"
        fileName="src/index.css"
        code={`@import "tailwindcss";
@import "nr-ui-kit/theme.css";

@theme {
  --color-accent: #7c3aed;
  --color-accent-hover: #8b5cf6;
  --color-accent-soft-foreground: #6d28d9;
}`}
      />

      <h2 className="mt-20 mb-6 text-[28px] font-semibold tracking-tight text-foreground">Komponentlar</h2>
      <div className="space-y-8">
        {GROUPS.map((g) => (
          <div key={g}>
            <p className="mb-3 text-sm font-medium text-muted">{g}</p>
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
