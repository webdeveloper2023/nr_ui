import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { cn } from "../lib/cn";
import { rx, useResponsive, type BreakpointClasses, type ResponsiveProp } from "./breakpoints";

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
  /** Modifier key(s): command, shift, ctrl, etc. */
  keys?: KbdKey | KbdKey[];
  /** Primary button text */
  children?: ReactNode;
  /** Adapts to the screen: hidden on mobile and tablet (touch screens have no keyboard shortcuts), a step larger on desktop. true = all breakpoints or a list like ["m", "t"] */
  responsive?: ResponsiveProp;
}

const kbdR: BreakpointClasses = {
  m: "mobile:hidden",
  t: "tablet:hidden",
  d: "desktop:h-7 desktop:min-w-7 desktop:px-2 desktop:text-sm",
};

export const Kbd = forwardRef<HTMLElement, KbdProps>(({ keys, children, className = "", responsive, ...props }, ref) => {
  const bps = useResponsive(responsive);
  const keyList = keys ? (Array.isArray(keys) ? keys : [keys]) : [];

  return (
    <kbd
      ref={ref}
      className={cn(
        "inline-flex items-center gap-0.5 px-1.5 h-6 min-w-6 justify-center",
        "rounded-md bg-surface text-muted font-sans text-xs font-medium shadow-field",
        "dark:bg-default",
        rx(bps, kbdR),
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
