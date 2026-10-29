import { useEffect, useRef, useState } from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import { Menu, Monitor, Moon, Search, Sun, X, Zap } from "lucide-react";
import { cn } from "../lib/cn";
import { GROUPS, GROUP_LABELS, registry } from "./registry";
import { NewTag } from "./NewTag";
import { useLang, useT } from "./i18n/lang";
import { LanguageSwitch } from "./LanguageSwitch";
import { Donate } from "./Donate";

type ThemeMode = "light" | "dark" | "system";

function useTheme() {
  const [mode, setMode] = useState<ThemeMode>(() => {
    const param = new URLSearchParams(window.location.search).get("theme");
    if (param === "dark" || param === "light") return param;
    try {
      const saved = localStorage.getItem("nr-theme") as ThemeMode | null;
      if (saved) return saved;
    } catch { /* ignore */ }
    return "system";
  });

  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const apply = () => document.documentElement.classList.toggle("dark", mode === "dark" || (mode === "system" && media.matches));
    apply();
    try { localStorage.setItem("nr-theme", mode); } catch { /* ignore */ }
    media.addEventListener("change", apply);
    return () => media.removeEventListener("change", apply);
  }, [mode]);

  return [mode, setMode] as const;
}

function ThemeSwitch({ mode, onChange }: { mode: ThemeMode; onChange: (m: ThemeMode) => void }) {
  const t = useT();
  const items: { key: ThemeMode; icon: typeof Sun; label: string }[] = [
    { key: "light", icon: Sun, label: t({ en: "Light", uz: "Yorug'", ru: "Светлая" }) },
    { key: "dark", icon: Moon, label: t({ en: "Dark", uz: "Qorong'i", ru: "Тёмная" }) },
    { key: "system", icon: Monitor, label: t({ en: "System", uz: "Tizim", ru: "Системная" }) },
  ];
  return (
    <div className="flex items-center gap-0.5 rounded-full bg-default p-0.5">
      {items.map(({ key, icon: Icon, label }) => (
        <button
          key={key}
          onClick={() => onChange(key)}
          aria-label={label}
          aria-pressed={mode === key}
          className={cn(
            "flex h-7 w-7 items-center justify-center rounded-full transition-colors cursor-pointer",
            mode === key ? "bg-segment text-foreground shadow-field" : "text-muted hover:text-foreground"
          )}
        >
          <Icon size={14} />
        </button>
      ))}
    </div>
  );
}

function SideNav({ query, onNavigate }: { query: string; onNavigate?: () => void }) {
  const t = useT();
  const q = query.trim().toLowerCase();
  const link = ({ isActive }: { isActive: boolean }) =>
    cn(
      "flex h-9 items-center rounded-xl px-3 text-sm transition-colors",
      isActive ? "bg-surface font-medium text-foreground shadow-surface" : "text-muted hover:text-foreground"
    );

  return (
    <nav className="space-y-6">
      {!q && (
        <div>
          <p className="mb-1 px-3 text-sm font-medium text-foreground">{t({ en: "Getting started", uz: "Boshlash", ru: "Начало работы" })}</p>
          <NavLink to="/" end className={link} onClick={onNavigate}>{t({ en: "Installation & setup", uz: "O'rnatish va sozlash", ru: "Установка и настройка" })}</NavLink>
          <NavLink to="/colors" className={link} onClick={onNavigate}>{t({ en: "Colors & materials", uz: "Ranglar va materiallar", ru: "Цвета и материалы" })}</NavLink>
          <NavLink to="/dashboard" className={link} onClick={onNavigate}>{t({ en: "Dashboard template", uz: "Dashboard namunasi", ru: "Шаблон дашборда" })}</NavLink>
        </div>
      )}
      {GROUPS.map((g) => {
        const items = registry.filter((e) => e.group === g && (!q || e.name.toLowerCase().includes(q)));
        if (!items.length) return null;
        return (
          <div key={g}>
            <p className="mb-1 px-3 text-sm font-medium text-foreground">{t(GROUP_LABELS[g])}</p>
            <ul className="space-y-0.5">
              {items.map((e) => (
                <li key={e.slug}>
                  <NavLink to={`/components/${e.slug}`} className={link} onClick={onNavigate}>
                    {e.name}
                    {e.isNew && <NewTag className="ml-auto" />}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        );
      })}
    </nav>
  );
}

function SearchField({ value, onChange, inputRef, className = "" }: { value: string; onChange: (v: string) => void; inputRef?: React.Ref<HTMLInputElement>; className?: string }) {
  const t = useT();
  return (
    <label className={cn("flex h-9 items-center gap-2 rounded-full bg-field px-3.5 text-sm shadow-field focus-within:ring-2 focus-within:ring-focus/40", className)}>
      <Search size={15} className="text-muted" />
      <input
        ref={inputRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={t({ en: "Search", uz: "Qidirish", ru: "Поиск" })}
        className="min-w-0 flex-1 bg-transparent text-foreground outline-none placeholder:text-field-placeholder"
      />
      <span className="flex items-center gap-1 text-[11px] text-muted">
        <kbd className="rounded-md bg-default px-1.5 py-0.5 font-sans">Ctrl</kbd>
        <kbd className="rounded-md bg-default px-1.5 py-0.5 font-sans">K</kbd>
      </span>
    </label>
  );
}

export default function DocsLayout() {
  const [lang, setLang] = useLang();
  const [mode, setMode] = useTheme();
  // Docs pages always use the default frosted material; the Solid / Frosted / Liquid
  // switch lives only in the dashboard templates.
  useEffect(() => {
    document.documentElement.dataset.glass = "frosted";
  }, []);
  const [query, setQuery] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);
  const location = useLocation();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        searchRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (location.hash) document.getElementById(location.hash.slice(1))?.scrollIntoView();
  }, [location]);

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-40 border-b border-separator glass">
        <div className="mx-auto flex h-16 max-w-[1440px] items-center gap-2 px-4 sm:gap-4 sm:px-8">
          <button className="lg:hidden flex h-9 w-9 items-center justify-center rounded-full text-muted hover:bg-default cursor-pointer" onClick={() => setMobileOpen(true)} aria-label="Menu">
            <Menu size={18} />
          </button>
          <NavLink to="/" className="flex shrink-0 items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-foreground text-background">
              <Zap size={15} strokeWidth={2.5} />
            </span>
            <span className="whitespace-nowrap text-lg font-bold tracking-tight text-foreground">nr ui</span>
            <span className="rounded-md bg-default px-1.5 py-0.5 text-xs font-medium text-muted max-sm:hidden">v1.0</span>
          </NavLink>
          <div className="flex-1 hidden md:flex justify-center">
            <SearchField value={query} onChange={setQuery} inputRef={searchRef} className="w-full max-w-md" />
          </div>
          <NavLink to="/dashboard" className="hidden sm:inline-flex h-9 items-center rounded-full px-3.5 text-sm font-medium text-muted hover:text-foreground transition-colors">Dashboard</NavLink>
          <Donate />
          <div className="ml-auto md:ml-0 flex items-center gap-2">
            <LanguageSwitch lang={lang} onChange={setLang} />
            <div className="max-sm:hidden">
              <ThemeSwitch mode={mode} onChange={setMode} />
            </div>
          </div>
        </div>
      </header>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-backdrop animate-fade-in" onClick={() => setMobileOpen(false)} />
          <div className="absolute inset-y-0 left-0 w-72 overflow-y-auto glass-thick p-4 animate-slide-up">
            <div className="mb-4 flex items-center justify-between">
              <span className="font-bold text-foreground">nr ui</span>
              <button className="flex h-8 w-8 items-center justify-center rounded-full text-muted hover:bg-default cursor-pointer" onClick={() => setMobileOpen(false)} aria-label="Close">
                <X size={16} />
              </button>
            </div>
            <SearchField value={query} onChange={setQuery} className="mb-4" />
            <div className="mb-5 sm:hidden">
              <ThemeSwitch mode={mode} onChange={setMode} />
            </div>
            <SideNav query={query} onNavigate={() => setMobileOpen(false)} />
          </div>
        </div>
      )}

      <div className="mx-auto flex max-w-[1440px]">
        <aside className="hidden lg:block w-64 shrink-0 sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto py-8 pl-5 pr-4">
          <SideNav query={query} />
        </aside>
        <main className="min-w-0 flex-1 px-5 sm:px-8 lg:px-12 py-10">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
