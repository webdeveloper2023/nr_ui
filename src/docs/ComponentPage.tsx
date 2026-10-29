import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { AlignLeft, ChevronLeft, ChevronRight, FileCode2 } from "lucide-react";
import { cn } from "../lib/cn";
import { CodeBlock } from "./CodeBlock";
import { ExampleBlock } from "./ExampleBlock";
import { PropsTable } from "./PropsTable";
import { getExamples, loadSource } from "./modules";
import { findEntry, registry } from "./registry";
import { NewTag } from "./NewTag";
import { useT } from "./i18n/lang";
import { Switch } from "../components";

const L = {
  usage: { en: "Usage", uz: "Ishlatish", ru: "Использование" },
  examples: { en: "Examples", uz: "Misollar", ru: "Примеры" },
  api: { en: "API Reference", uz: "API ma'lumotnomasi", ru: "Справочник API" },
  source: { en: "Source code", uz: "Manba kodi", ru: "Исходный код" },
};

function SourceViewer({ files }: { files: string[] }) {
  const [active, setActive] = useState(files[0]);
  const [code, setCode] = useState<Record<string, string>>({});
  const [expanded, setExpanded] = useState(false);
  const t = useT();

  useEffect(() => {
    let alive = true;
    Promise.all(files.map(async (f) => [f, await loadSource(f)] as const)).then((pairs) => {
      if (alive) setCode(Object.fromEntries(pairs));
    });
    return () => {
      alive = false;
    };
  }, [files]);

  const current = files.includes(active) ? active : files[0];

  return (
    <div className="overflow-hidden rounded-3xl border border-border bg-background">
      <div className="flex flex-wrap gap-1 border-b border-border p-2">
        {files.map((f) => (
          <button
            key={f}
            onClick={() => setActive(f)}
            className={cn(
              "flex h-8 items-center gap-1.5 rounded-full px-3 font-mono text-xs transition-colors cursor-pointer",
              f === current ? "bg-segment text-foreground shadow-field" : "text-muted hover:text-foreground"
            )}
          >
            <FileCode2 size={13} />
            {f}
          </button>
        ))}
      </div>
      <div className="relative" style={{ ["--nr-code-bg" as string]: "var(--color-background)" }}>
        <CodeBlock code={code[current] ?? "// loading…"} bare collapsedHeight={expanded ? undefined : 280} maxHeight={expanded ? 720 : undefined} />
        <div className={expanded ? "flex justify-center pb-4" : "absolute inset-x-0 bottom-3 flex justify-center"}>
          <button
            onClick={() => setExpanded(!expanded)}
            className="h-8 rounded-full bg-overlay px-3.5 text-xs font-medium text-foreground shadow-overlay cursor-pointer"
          >
            {expanded ? t({ en: "Collapse", uz: "Yig'ish", ru: "Свернуть" }) : t({ en: "Expand source", uz: "To'liq kodni ochish", ru: "Показать весь код" })}
          </button>
        </div>
      </div>
    </div>
  );
}

function H2({ id, children }: { id?: string; children: React.ReactNode }) {
  return (
    <h2 id={id} className="scroll-mt-28 text-[28px] font-semibold tracking-tight text-foreground">
      {children}
    </h2>
  );
}

export default function ComponentPage() {
  const { slug = "" } = useParams();
  const entry = findEntry(slug);
  const t = useT();
  // Tied to the page, so the switch turns off when another component opens
  const [skeletonSlug, setSkeletonSlug] = useState<string | null>(null);

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [slug]);

  if (!entry) {
    return (
      <div className="py-24 text-center">
        <p className="text-2xl font-semibold text-foreground">{t({ en: "Not found", uz: "Topilmadi", ru: "Не найдено" })}</p>
        <Link to="/" className="mt-3 inline-block text-accent hover:underline">{t({ en: "Home", uz: "Bosh sahifa", ru: "Главная" })}</Link>
      </div>
    );
  }

  const examples = getExamples(entry.slug);
  const allSkeleton = skeletonSlug === entry.slug;
  const setAllSkeleton = (on: boolean) => setSkeletonSlug(on ? entry.slug : null);
  const index = registry.indexOf(entry);
  const prev = registry[index - 1];
  const next = registry[index + 1];
  const importCode = `import { ${entry.imports.join(", ")} } from "nr-ui-kit";`;

  const toc = [
    { id: "usage", label: t(L.usage), depth: 0 },
    { id: "examples", label: t(L.examples), depth: 0 },
    ...examples.map((e) => ({ id: e.id, label: e.title, depth: 1 })),
    { id: "api", label: t(L.api), depth: 0 },
    ...entry.props.map((p) => ({ id: `props-${p.toLowerCase()}`, label: p, depth: 1 })),
    { id: "source", label: t(L.source), depth: 0 },
  ];

  return (
    <div className="flex gap-12">
      <article className="min-w-0 flex-1 max-w-[860px]">
        <h1 className="flex items-center gap-3 text-4xl font-semibold tracking-tight text-foreground">
          {entry.name}
          {entry.isNew && <NewTag size="md" />}
        </h1>
        <p className="mt-3 text-lg text-muted">{t(entry.description)}</p>

        <section id="usage" className="scroll-mt-28 mt-10">
          <H2>{t(L.usage)}</H2>
          <CodeBlock code={importCode} lineNumbers={false} className="mt-5" />
        </section>

        <section id="examples" className="scroll-mt-28 mt-14">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <H2>{t(L.examples)}</H2>
            {examples.length > 0 && (
              <Switch size="sm" isSelected={allSkeleton} onChange={setAllSkeleton}>
                {t({ en: "Show all as skeleton", uz: "Hammasini skeletonda ko'rsatish", ru: "Показать все как скелетон" })}
              </Switch>
            )}
          </div>
          <p className="mt-2 text-[15px] text-muted">
            {t({
              en: "Every example has a Skeleton view: the same component with skeleton={true}, as it looks while its data loads.",
              uz: "Har bir misolda Skeleton ko'rinishi bor: o'sha komponentning skeleton={true} holati — ma'lumot yuklanayotganda shunday ko'rinadi.",
              ru: "У каждого примера есть вид Skeleton: тот же компонент с skeleton={true} — так он выглядит, пока загружаются данные.",
            })}
          </p>
          <div className="mt-6 space-y-12">
            {examples.length ? (
              // Remounting on the page switch lets every example follow it
              examples.map((ex) => <ExampleBlock key={`${ex.id}-${allSkeleton}`} example={ex} skeleton={allSkeleton} />)
            ) : (
              <p className="text-sm text-muted">{t({ en: "No examples yet.", uz: "Misollar hali qo'shilmagan.", ru: "Примеров пока нет." })}</p>
            )}
          </div>
        </section>

        <section id="api" className="scroll-mt-28 mt-16">
          <H2>{t(L.api)}</H2>
          <p className="mt-2 mb-6 text-[15px] text-muted">
            {t({ en: "The component's own props. Standard HTML attributes", uz: "Komponentning o'z prop'lari. Standart HTML atributlari", ru: "Собственные свойства компонента. Стандартные HTML-атрибуты" })} (<code className="font-mono text-[13px]">className</code>, <code className="font-mono text-[13px]">onClick</code>, <code className="font-mono text-[13px]">aria-*</code>…) {t({ en: "are passed through as well.", uz: "ham uzatiladi.", ru: "также передаются." })}
          </p>
          <div className="space-y-10">
            {entry.props.map((p) => (
              <PropsTable key={p} component={p} />
            ))}
          </div>
        </section>

        <section id="source" className="scroll-mt-28 mt-16">
          <H2>{t(L.source)}</H2>
          <p className="mt-2 mb-6 text-[15px] text-muted">
            {t({ en: "To use without the package, copy these files into your project. Components rely on", uz: "Paketsiz ishlatish uchun fayllarni loyihangizga ko'chiring. Komponentlar tayanadi:", ru: "Чтобы использовать без пакета, скопируйте файлы в проект. Компоненты используют" })} <code className="font-mono text-[13px]">src/lib/cn.ts</code> {t({ en: "and the theme CSS.", uz: "va theme CSS.", ru: "и CSS темы." })}
          </p>
          <SourceViewer key={entry.slug} files={[...entry.sources, "cn.ts"]} />
        </section>

        <nav className="mt-16 grid grid-cols-2 gap-4 border-t border-separator pt-8">
          {prev ? (
            <Link to={`/components/${prev.slug}`} className="group rounded-2xl bg-surface p-4 shadow-surface transition-transform hover:-translate-y-0.5">
              <span className="flex items-center gap-1 text-xs text-muted"><ChevronLeft size={14} /> {t({ en: "Previous", uz: "Oldingi", ru: "Назад" })}</span>
              <span className="mt-1 block font-medium text-foreground">{prev.name}</span>
            </Link>
          ) : <span />}
          {next && (
            <Link to={`/components/${next.slug}`} className="group rounded-2xl bg-surface p-4 text-right shadow-surface transition-transform hover:-translate-y-0.5">
              <span className="flex items-center justify-end gap-1 text-xs text-muted">{t({ en: "Next", uz: "Keyingi", ru: "Далее" })} <ChevronRight size={14} /></span>
              <span className="mt-1 block font-medium text-foreground">{next.name}</span>
            </Link>
          )}
        </nav>
      </article>

      <aside className="hidden xl:block w-56 shrink-0">
        <div className="sticky top-24">
          <p className="mb-3 flex items-center gap-2 text-sm text-muted"><AlignLeft size={14} /> {t({ en: "On this page", uz: "Sahifada", ru: "На странице" })}</p>
          <ul className="space-y-1">
            {toc.map((t) => (
              <li key={t.id}>
                <a
                  href={`#${t.id}`}
                  className={cn("block truncate py-1 text-sm text-muted hover:text-foreground transition-colors", t.depth ? "pl-6" : "pl-3")}
                >
                  {t.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </aside>
    </div>
  );
}
