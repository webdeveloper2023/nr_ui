import { Droplet, Snowflake, Square } from "lucide-react";
import { cn } from "../lib/cn";
import type { DesignStyle } from "./designStyle";

const DESIGN_STYLES: { key: DesignStyle; label: string; hint: string; icon: typeof Square }[] = [
  { key: "solid", label: "Solid", hint: "Shishasiz, tekis surface'lar", icon: Square },
  { key: "frosted", label: "Frosted", hint: "Klassik xira shisha", icon: Snowflake },
  { key: "liquid", label: "Liquid", hint: "Liquid (clear glass)", icon: Droplet },
];

export function DesignStyleSwitch({ style, onChange, className = "" }: { style: DesignStyle; onChange: (s: DesignStyle) => void; className?: string }) {
  return (
    <div className={cn("flex items-center gap-0.5 rounded-full bg-default p-0.5", className)} role="group" aria-label="Dizayn uslubi">
      {DESIGN_STYLES.map(({ key, label, hint, icon: Icon }) => (
        <button
          key={key}
          onClick={() => onChange(key)}
          aria-label={`${label} — ${hint}`}
          title={hint}
          aria-pressed={style === key}
          className={cn(
            "flex h-7 items-center gap-1.5 rounded-full px-2.5 text-xs font-medium transition-colors cursor-pointer",
            style === key ? "bg-segment text-foreground shadow-field" : "text-muted hover:text-foreground"
          )}
        >
          <Icon size={13} />
          <span className="hidden xl:inline">{label}</span>
        </button>
      ))}
    </div>
  );
}
