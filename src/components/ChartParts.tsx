// Pieces shared by every chart: the toggleable legend, the hover tooltip and the
// visually hidden data table (so values never depend on hovering or on color).
import type { ReactNode } from "react";
import { cn } from "../lib/cn";
import { useLocale } from "./locale";

export interface LegendItem {
  key: string;
  label: string;
  color: string;
  hidden?: boolean;
  /** Extra text after the label (e.g. a value or a percent) */
  detail?: ReactNode;
}

/** Pills with a color key. With `onToggle` each pill shows / hides its series. */
export function ChartLegend({
  items,
  onToggle,
  compact = false,
  vertical = false,
  shape = "dot",
}: {
  items: LegendItem[];
  onToggle?: (key: string) => void;
  compact?: boolean;
  vertical?: boolean;
  shape?: "dot" | "square" | "line";
}) {
  const t = useLocale();
  return (
    <ul className={cn("flex gap-1.5", vertical ? "flex-col" : "flex-wrap", compact && !vertical && "gap-1")}>
      {items.map((item) => {
        const key = (
          <span
            aria-hidden
            className={cn("shrink-0 transition-[background-color,box-shadow] duration-200", shape === "line" ? "h-0.5 w-3 rounded-full" : shape === "square" ? "size-2.5 rounded-[3px]" : "size-2.5 rounded-full")}
            style={item.hidden ? { boxShadow: `inset 0 0 0 1.5px ${item.color}` } : { backgroundColor: item.color }}
          />
        );
        const text = (
          <>
            {key}
            <span className={cn("truncate", item.hidden ? "text-muted" : "text-foreground")}>{item.label}</span>
            {item.detail != null && <span className="ml-auto pl-2 tabular-nums text-muted">{item.detail}</span>}
          </>
        );
        return (
          <li key={item.key} className={cn(vertical && "w-full")}>
            {onToggle ? (
              <button
                type="button"
                aria-pressed={!item.hidden}
                aria-label={t.chart.toggle(item.label, Boolean(item.hidden))}
                onClick={() => onToggle(item.key)}
                className={cn(
                  "flex w-full items-center gap-2 rounded-full text-[13px] font-medium select-none cursor-pointer",
                  "transition-[background-color,color,box-shadow] duration-200 outline-none focus-visible:ring-2 focus-visible:ring-focus",
                  compact ? "h-9 px-3" : "h-8 px-3",
                  item.hidden ? "bg-transparent shadow-[inset_0_0_0_1px_var(--color-separator)] hover:bg-default" : "bg-default hover:bg-default-hover"
                )}
              >
                {text}
              </button>
            ) : (
              <span className={cn("flex items-center gap-2 text-[13px]", compact ? "h-7" : "h-6")}>{text}</span>
            )}
          </li>
        );
      })}
    </ul>
  );
}

export interface TooltipRow {
  key: string;
  label: string;
  color: string;
  value: string;
}

/** Floating readout: values lead, series names follow. `x` / `y` are px inside the chart box. */
export function ChartTooltip({
  x,
  y,
  boxWidth,
  title,
  rows,
  footer,
}: {
  x: number;
  y: number;
  boxWidth: number;
  title?: ReactNode;
  rows: TooltipRow[];
  footer?: ReactNode;
}) {
  // Flip to the left of the pointer in the right half, so the readout never leaves the chart
  const flip = x > boxWidth / 2;
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute z-10 min-w-36 rounded-xl bg-overlay/95 px-3 py-2 text-xs shadow-overlay backdrop-blur-md animate-fade-in"
      style={{ top: y, left: flip ? undefined : x + 12, right: flip ? boxWidth - x + 12 : undefined }}
    >
      {title != null && <div className="mb-1.5 font-medium text-muted">{title}</div>}
      <div className="flex flex-col gap-1">
        {rows.map((r) => (
          <div key={r.key} className="flex items-center gap-2">
            <span aria-hidden className="h-0.5 w-3 shrink-0 rounded-full" style={{ backgroundColor: r.color }} />
            <span className="text-muted">{r.label}</span>
            <span className="ml-auto pl-3 text-[13px] font-semibold tabular-nums text-foreground">{r.value}</span>
          </div>
        ))}
      </div>
      {footer != null && <div className="mt-1.5 border-t border-separator pt-1.5 text-muted">{footer}</div>}
    </div>
  );
}

/** The data as a table for screen readers (charts are images to them otherwise). */
export function ChartTable({ caption, columns, rows }: { caption: string; columns: string[]; rows: string[][] }) {
  return (
    // The wrapper is visually hidden: a table ignores width limits, so it cannot carry sr-only itself
    <div className="sr-only">
      <table>
        <caption>{caption}</caption>
        <thead>
          <tr>
            {columns.map((c, i) => (
              <th key={i} scope="col">
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i}>
              {row.map((cell, j) => (j === 0 ? <th key={j} scope="row">{cell}</th> : <td key={j}>{cell}</td>))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
