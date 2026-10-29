import { BREAKPOINTS, BREAKPOINT_INFO, useBreakpoint } from "nr-ui-kit";

// Resize the window: the highlighted breakpoint follows it.
export default function CurrentBreakpoint() {
  const bp = useBreakpoint();
  return (
    <div className="grid w-full grid-cols-2 gap-2 sm:grid-cols-4">
      {BREAKPOINTS.map((key) => {
        const { name, min, max } = BREAKPOINT_INFO[key];
        const active = key === bp;
        return (
          <div
            key={key}
            className={
              active
                ? "rounded-2xl bg-accent p-3 text-accent-foreground"
                : "rounded-2xl bg-surface-secondary p-3 text-muted"
            }
          >
            <div className="text-lg font-semibold">"{key}"</div>
            <div className="text-sm capitalize">{name}</div>
            <div className="text-xs opacity-80">{max === null ? `≥ ${min}px` : `${min}–${max}px`}</div>
          </div>
        );
      })}
    </div>
  );
}
