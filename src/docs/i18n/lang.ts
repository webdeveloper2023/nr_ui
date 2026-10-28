import { useEffect, useState } from "react";

/** Docs site languages — English is the default. */
export type Lang = "en" | "uz" | "ru";
export const LANGS: Lang[] = ["en", "uz", "ru"];

/** An inline translation: `t({ en: "Save", uz: "Saqlash", ru: "Сохранить" })` */
export type Tr<T = string> = Record<Lang, T>;

const isLang = (v: string | null): v is Lang => v === "en" || v === "uz" || v === "ru";
const EVENT = "nr-lang";

// Shared by every hook instance; ?lang= is honoured on first load only.
let current: Lang | null = null;

function readInitial(): Lang {
  if (current) return current;
  const param = new URLSearchParams(window.location.search).get("lang");
  if (isLang(param)) return (current = param);
  try {
    const saved = localStorage.getItem("nr-lang");
    if (isLang(saved)) return (current = saved);
  } catch { /* ignore */ }
  return (current = "en");
}

export function useLang() {
  const [lang, setLangState] = useState<Lang>(readInitial);

  useEffect(() => {
    document.documentElement.lang = lang;
    try { localStorage.setItem("nr-lang", lang); } catch { /* ignore */ }
  }, [lang]);

  useEffect(() => {
    const onChange = (e: Event) => setLangState((e as CustomEvent<Lang>).detail);
    window.addEventListener(EVENT, onChange);
    return () => window.removeEventListener(EVENT, onChange);
  }, []);

  const setLang = (next: Lang) => {
    current = next;
    setLangState(next);
    window.dispatchEvent(new CustomEvent(EVENT, { detail: next }));
  };

  return [lang, setLang] as const;
}

/** `const t = useT(); t({ en, uz, ru })` — works for strings and ReactNodes. */
export function useT() {
  const [lang] = useLang();
  return <T,>(m: Tr<T>): T => m[lang] ?? m.en;
}
