import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { cn } from "../lib/cn";

export type KbdKey =
  | "command" | "shift" | "ctrl" | "option" | "alt" | "enter" | "delete" | "escape" | "tab"
  | "capslock" | "up" | "down" | "left" | "right" | "pageup" | "pagedown" | "home" | "end"
  | "help" | "space" | "fn" | "win";

const kbdKeySymbols: Record<KbdKey, string> = {
  command: "⌘",
  shift: "⇧",
  ctrl: "⌃",
  option: "⌥",
  alt: "⌥",
  enter: "↵",
  delete: "⌫",
  escape: "⎋",
  tab: "⇥",
  capslock: "⇪",
  up: "↑",
  down: "↓",
  left: "←",
  right: "→",
  pageup: "⇞",
  pagedown: "⇟",
  home: "↖",
  end: "↘",
  help: "?",
  space: "␣",
  fn: "fn",
  win: "⊞",
};

export interface KbdProps extends HTMLAttributes<HTMLElement> {
  /** Modifikator tugma(lar): command, shift, ctrl va h.k. */
  keys?: KbdKey | KbdKey[];
  /** Asosiy tugma matni */
  children?: ReactNode;
}

export const Kbd = forwardRef<HTMLElement, KbdProps>(({ keys, children, className = "", ...props }, ref) => {
  const keyList = keys ? (Array.isArray(keys) ? keys : [keys]) : [];

  return (
    <kbd
      ref={ref}
      className={cn(
        "inline-flex items-center gap-0.5 px-1.5 h-6 min-w-6 justify-center",
        "rounded-md bg-surface text-muted font-sans text-xs font-medium shadow-field",
        "dark:bg-default",
        className
      )}
      {...props}
    >
      {keyList.map((k) => (
        <abbr key={k} title={k} className="no-underline">
          {kbdKeySymbols[k]}
        </abbr>
      ))}
      {children && <span>{children}</span>}
    </kbd>
  );
});

Kbd.displayName = "Kbd";
export default Kbd;
