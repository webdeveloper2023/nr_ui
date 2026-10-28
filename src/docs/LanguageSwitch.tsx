import { cn } from "../lib/cn";
import { LANGS, type Lang } from "./i18n/lang";

const LABELS: Record<Lang, { short: string; name: string }> = {
  en: { short: "EN", name: "English" },
  uz: { short: "UZ", name: "O'zbekcha" },
  ru: { short: "RU", name: "Русский" },
};

export function LanguageSwitch({ lang, onChange, className = "" }: { lang: Lang; onChange: (l: Lang) => void; className?: string }) {
  return (
    <div className={cn("flex items-center gap-0.5 rounded-full bg-default p-0.5", className)} role="group" aria-label="Language">
      {LANGS.map((l) => (
        <button
          key={l}
          onClick={() => onChange(l)}
          aria-pressed={lang === l}
          aria-label={LABELS[l].name}
          title={LABELS[l].name}
          className={cn(
            "flex h-7 min-w-8 items-center justify-center rounded-full px-2 text-xs font-semibold transition-colors cursor-pointer",
            lang === l ? "bg-segment text-foreground shadow-field" : "text-muted hover:text-foreground"
          )}
        >
          {LABELS[l].short}
        </button>
      ))}
    </div>
  );
}
