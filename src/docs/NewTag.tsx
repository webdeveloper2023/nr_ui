import { cn } from "../lib/cn";

/** Small "New" pill for recently added components. */
export function NewTag({ size = "sm", className }: { size?: "sm" | "md"; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center rounded-full bg-accent/15 font-semibold uppercase tracking-wide text-accent",
        size === "sm" ? "h-[18px] px-1.5 text-[10px]" : "h-6 px-2.5 text-xs",
        className
      )}
    >
      New
    </span>
  );
}
