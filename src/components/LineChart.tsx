import { useId, useRef, useState, type HTMLAttributes, type KeyboardEvent, type PointerEvent, type ReactNode } from "react";
import { cn } from "../lib/cn";
import { useResponsive, type ResponsiveProp } from "./breakpoints";
import { ChartLegend, ChartTable, ChartTooltip } from "./ChartParts";
import {
  areaPath,
  formatCompact,
  formatNumber,
  formatX,
  linePath,
  niceTicks,
  scaleLinear,
  seriesColor,
  smoothPath,
  toNumber,
  useChartLayout,
  useElementWidth,
  useHiddenSeries,
  useTween,
  type ChartDatum,
  type ChartSeries,
  type Point,
} from "./chartUtils";
import { useLocale } from "./locale";

export interface LineChartProps extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  /** Shows this component's own loading skeleton (same layout and shape) — set it while data is loading */
  skeleton?: boolean;
  /** Rows of data; each row has the x value (`xKey`) and one field per series */
  data: ChartDatum[];
  /** Field of each row used for the x axis (string, number or Date) */
  xKey: string;
  /** Plotted measures: { key, label, color? }; colors follow the fixed palette order */
  series: ChartSeries[];
  /** Plot height in px (the range selector and legend come on top of it) */
  height?: number;
  /** Line shape: smooth (never overshoots the data) or straight */
  curve?: "smooth" | "linear";
  /** Fills the area under each line with a soft wash */
  showArea?: boolean;
  /** Stacks the series on top of each other (an area chart of parts of a whole) */
  isStacked?: boolean;
  /** Markers: none, the last point of each line, or every point */
  showDots?: "none" | "end" | "all";
  /** Y axis starts at zero, or fits the visible data (auto) */
  baseline?: "zero" | "auto";
  /** Shows a mini chart under the plot with a draggable window to zoom into a range */
  showRangeSelector?: boolean;
  /** Initial visible range as [first, last] row index (with the range selector) */
  defaultRange?: [number, number];
  /** Called with the visible [first, last] row index while the range changes */
  onRangeChange?: (range: [number, number]) => void;
  /** Legend under the chart: shown for two or more series by default */
  showLegend?: boolean;
  /** Legend pills show / hide their series */
  isLegendInteractive?: boolean;
  /** Hidden series keys (controlled) */
  hiddenSeries?: string[];
  /** Initially hidden series keys */
  defaultHiddenSeries?: string[];
  /** Called with the hidden series keys when a legend pill is pressed */
  onHiddenSeriesChange?: (hidden: string[]) => void;
  /** Horizontal grid lines */
  showGrid?: boolean;
  /** Formats values on the axis and in the tooltip */
  valueFormatter?: (value: number) => string;
  /** Formats x values on the axis and in the tooltip */
  xFormatter?: (value: unknown, index: number) => string;
  /** Extra content at the bottom of the tooltip, e.g. a total */
  tooltipFooter?: (row: ChartDatum, index: number) => ReactNode;
  /** Animates the axis when series are toggled or the range moves */
  animate?: boolean;
  /** Adapts to the screen: shorter plot, fewer ticks and touch-sized legend on mobile; a bit shorter on tablet; taller on desktop. true = all breakpoints or a list like ["m", "t"] */
  responsive?: ResponsiveProp;
  /** Accessible name of the chart (also the caption of its data table) */
  "aria-label"?: string;
}

const TOP = 18; // room for the top tick label
const AXIS_H = 26;

/** Lines over time or categories, with a crosshair tooltip, legend toggles and an optional range selector. */
export function LineChart(props: LineChartProps) {
  const {
    data,
    xKey,
    series,
    height = 280,
    curve = "smooth",
    showArea = false,
    isStacked = false,
    showDots = "none",
    baseline = isStacked || showArea ? "zero" : "auto",
    showRangeSelector = false,
    defaultRange,
    onRangeChange,
    showLegend = series.length > 1,
    isLegendInteractive = true,
    hiddenSeries,
    defaultHiddenSeries,
    onHiddenSeriesChange,
    showGrid = true,
    valueFormatter,
    xFormatter,
    tooltipFooter,
    animate = true,
    responsive,
    "aria-label": ariaLabel = "Chart",
    className,
    ...rest
  } = props;

  const t = useLocale();
  const uid = `nrc${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;
  const bps = useResponsive(responsive);
  const layout = useChartLayout(height, bps);
  const [boxRef, width] = useElementWidth<HTMLDivElement>();
  const n = data.length;
  const fmtValue = valueFormatter ?? ((v: number) => formatCompact(v, t.locale));
  const fmtFull = valueFormatter ?? ((v: number) => formatNumber(v, t.locale));
  const fmtX = (i: number) => (xFormatter ? xFormatter(data[i]?.[xKey], i) : formatX(data[i]?.[xKey], t.locale));

  const [hidden, toggle] = useHiddenSeries(series.map((s) => s.key), hiddenSeries, defaultHiddenSeries, onHiddenSeriesChange);
  const visible = series.filter((s) => !hidden.has(s.key));

  // ── Range (fractional row indexes, so panning is smooth) ──
  const full: [number, number] = [0, Math.max(0, n - 1)];
  const [range, setRangeState] = useState<[number, number]>(() => clampRange(defaultRange ?? full, n));
  const r = showRangeSelector ? clampRange(range, n) : full;
  const setRange = (next: [number, number]) => {
    const c = clampRange(next, n);
    setRangeState(c);
    onRangeChange?.([Math.round(c[0]), Math.round(c[1])]);
  };

  // ── Values (stacked → cumulative) ──
  const values: { top: Record<string, (number | null)[]> } = { top: {} };
  {
    const base = new Array(n).fill(0);
    for (const s of series) {
      const raw = data.map((d) => toNumber(d[s.key]));
      values.top[s.key] = isStacked && !hidden.has(s.key) ? raw.map((v, i) => (base[i] += v ?? 0)) : raw;
    }
  }

  const lower = (key: string): number[] => {
    // Baseline of a stacked series = the visible series below it
    const idx = visible.findIndex((s) => s.key === key);
    if (!isStacked || idx <= 0) return new Array(n).fill(0);
    return values.top[visible[idx - 1].key].map((v) => v ?? 0);
  };

  // ── Y domain over the visible rows ──
  const i0 = Math.max(0, Math.floor(r[0]));
  const i1 = Math.min(n - 1, Math.ceil(r[1]));
  let lo = Infinity;
  let hi = -Infinity;
  for (const s of visible) {
    for (let i = i0; i <= i1; i++) {
      const v = values.top[s.key][i];
      if (v == null) continue;
      lo = Math.min(lo, v);
      hi = Math.max(hi, v);
    }
  }
  if (!Number.isFinite(lo)) [lo, hi] = [0, 1];
  if (baseline === "zero") lo = Math.min(0, lo);
  else if (hi > lo) lo -= (hi - lo) * 0.08; // a little air under the lowest point
  const tickCount = layout.compact ? 3 : 4;
  const nice = niceTicks(lo, hi, tickCount);
  const [d0, d1] = useTween(nice.domain, { enabled: animate });

  // ── Geometry ──
  const plotH = layout.height - TOP - AXIS_H;
  const plotW = Math.max(0, width);
  const span = Math.max(1e-6, r[1] - r[0]);
  const xOf = (i: number) => (n <= 1 ? plotW / 2 : ((i - r[0]) / span) * plotW);
  const yOf = scaleLinear([d0, d1], [TOP + plotH, TOP]);

  const drawFrom = Math.max(0, i0 - 1);
  const drawTo = Math.min(n - 1, i1 + 1);
  const pathOf = (pts: Point[]) => (curve === "smooth" ? smoothPath(pts) : linePath(pts));

  // ── X labels: as many as fit ──
  const minGap = layout.compact ? 64 : 84;
  const perLabel = Math.max(1, Math.ceil((span / Math.max(1, plotW)) * minGap));
  const xTicks: number[] = [];
  for (let i = Math.ceil(r[0] / perLabel) * perLabel; i <= r[1] + 1e-6; i += perLabel) xTicks.push(i);

  // ── Hover / keyboard ──
  const [active, setActive] = useState<number | null>(null);
  const [viaKeyboard, setViaKeyboard] = useState(false);
  const pick = (clientX: number, el: Element) => {
    const rect = el.getBoundingClientRect();
    const i = Math.round(r[0] + ((clientX - rect.left) / Math.max(1, rect.width)) * span);
    setActive(Math.min(i1, Math.max(i0, i)));
    setViaKeyboard(false);
  };
  const onKeyDown = (e: KeyboardEvent<SVGSVGElement>) => {
    const keys: Record<string, number> = { ArrowRight: 1, ArrowLeft: -1 };
    if (e.key in keys) {
      e.preventDefault();
      setActive((a) => Math.min(i1, Math.max(i0, (a ?? (keys[e.key] > 0 ? i0 - 1 : i1 + 1)) + keys[e.key])));
      setViaKeyboard(true);
    } else if (e.key === "Home" || e.key === "End") {
      e.preventDefault();
      setActive(e.key === "Home" ? i0 : i1);
      setViaKeyboard(true);
    } else if (e.key === "Escape") setActive(null);
  };

  const activeRows =
    active == null
      ? []
      : visible.map((s) => {
          const raw = toNumber(data[active]?.[s.key]);
          return { key: s.key, label: s.label, color: seriesColor(series.indexOf(s), s.color), value: raw == null ? "—" : fmtFull(raw) };
        });

  const ready = width > 0 && n > 0;

  return (
    <div className={cn("relative flex w-full flex-col gap-3", className)} role="figure" aria-label={ariaLabel} {...rest}>
      <div ref={boxRef} className="relative w-full" style={{ height: layout.height }}>
        {n === 0 && <div className="flex h-full items-center justify-center text-sm text-muted">{t.chart.empty}</div>}
        {ready && (
          <svg
            width={plotW}
            height={layout.height}
            className="block overflow-visible rounded-md outline-none focus-visible:ring-2 focus-visible:ring-focus"
            tabIndex={0}
            role="img"
            aria-label={ariaLabel}
            onKeyDown={onKeyDown}
            onPointerMove={(e) => pick(e.clientX, e.currentTarget)}
            onPointerDown={(e) => pick(e.clientX, e.currentTarget)}
            onPointerLeave={() => !viaKeyboard && setActive(null)}
            onBlur={() => setActive(null)}
          >
            <defs>
              <clipPath id={`${uid}-clip`}>
                <rect x={-6} y={0} width={plotW + 12} height={layout.height} />
              </clipPath>
              {series.map((s, si) => (
                <linearGradient key={s.key} id={`${uid}-g${si}`} x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor={seriesColor(si, s.color)} stopOpacity={isStacked ? 0.32 : 0.2} />
                  <stop offset="100%" stopColor={seriesColor(si, s.color)} stopOpacity={isStacked ? 0.12 : 0} />
                </linearGradient>
              ))}
            </defs>

            {/* Grid + y labels sit on the lines, inside the plot */}
            {showGrid &&
              nice.ticks.map((v) => {
                const y = yOf(v);
                if (y < TOP - 1 || y > TOP + plotH + 1) return null;
                return (
                  <g key={v}>
                    <line x1={0} x2={plotW} y1={Math.round(y) + 0.5} y2={Math.round(y) + 0.5} stroke="var(--color-separator)" strokeWidth={1} />
                    <text x={0} y={y - 5} className="fill-muted text-[11px] tabular-nums">
                      {fmtValue(v)}
                    </text>
                  </g>
                );
              })}

            <g clipPath={`url(#${uid}-clip)`}>
              {series.map((s, si) => {
                const isHidden = hidden.has(s.key);
                const color = seriesColor(si, s.color);
                const top: Point[] = [];
                const bottom: Point[] = [];
                const base = lower(s.key);
                for (let i = drawFrom; i <= drawTo; i++) {
                  const v = values.top[s.key][i];
                  if (v == null) continue;
                  top.push([xOf(i), yOf(v)]);
                  bottom.push([xOf(i), yOf(isStacked ? base[i] : Math.max(d0, 0))]);
                }
                return (
                  <g key={s.key} className="transition-opacity duration-300" style={{ opacity: isHidden ? 0 : 1 }}>
                    {(showArea || isStacked) && <path d={areaPath(top, bottom, curve === "smooth")} fill={`url(#${uid}-g${si})`} />}
                    <path d={pathOf(top)} fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                    {!isHidden &&
                      showDots !== "none" &&
                      top
                        .filter((_, k) => showDots === "all" || k === top.length - 1 - (drawTo > i1 ? 1 : 0))
                        .map(([x, y], k) => <circle key={k} cx={x} cy={y} r={4} fill={color} stroke="var(--color-surface)" strokeWidth={2} />)}
                  </g>
                );
              })}
            </g>

            {/* X labels */}
            {xTicks.map((i) => {
              const x = xOf(i);
              const anchor = x < 24 ? "start" : x > plotW - 24 ? "end" : "middle";
              return (
                <text key={i} x={x} y={layout.height - 8} textAnchor={anchor} className="fill-muted text-[11px]">
                  {fmtX(i)}
                </text>
              );
            })}

            {/* Crosshair */}
            {active != null && (
              <g pointerEvents="none">
                <line x1={xOf(active)} x2={xOf(active)} y1={TOP} y2={TOP + plotH} stroke="var(--color-border)" strokeWidth={1} />
                {visible.map((s) => {
                  const v = values.top[s.key][active];
                  if (v == null) return null;
                  return <circle key={s.key} cx={xOf(active)} cy={yOf(v)} r={4.5} fill={seriesColor(series.indexOf(s), s.color)} stroke="var(--color-surface)" strokeWidth={2} />;
                })}
              </g>
            )}
          </svg>
        )}
        {ready && active != null && (
          <ChartTooltip
            x={xOf(active)}
            y={TOP}
            boxWidth={plotW}
            title={fmtX(active)}
            rows={activeRows}
            footer={tooltipFooter?.(data[active], active)}
          />
        )}
        <div aria-live="polite" className="sr-only">
          {viaKeyboard && active != null ? `${fmtX(active)}: ${activeRows.map((row) => `${row.label} ${row.value}`).join(", ")}` : ""}
        </div>
      </div>

      {showRangeSelector && ready && n > 2 && (
        <RangeSelector
          width={plotW}
          height={layout.compact ? 36 : 44}
          n={n}
          range={r}
          onChange={setRange}
          lines={visible.map((s) => ({ key: s.key, color: seriesColor(series.indexOf(s), s.color), values: values.top[s.key] }))}
          label={t.chart}
        />
      )}

      {showLegend && (
        <ChartLegend
          compact={layout.compact}
          shape="line"
          onToggle={isLegendInteractive ? toggle : undefined}
          items={series.map((s, si) => ({ key: s.key, label: s.label, color: seriesColor(si, s.color), hidden: hidden.has(s.key) }))}
        />
      )}

      <ChartTable
        caption={ariaLabel}
        columns={["", ...series.map((s) => s.label)]}
        rows={data.map((d, i) => [fmtX(i), ...series.map((s) => {
          const v = toNumber(d[s.key]);
          return v == null ? "—" : fmtFull(v);
        })])}
      />
    </div>
  );
}

LineChart.displayName = "LineChart";

function clampRange([a, b]: [number, number], n: number): [number, number] {
  const max = Math.max(0, n - 1);
  const minSpan = Math.min(max, Math.max(2, max * 0.06));
  let lo = Math.max(0, Math.min(a, b));
  let hi = Math.min(max, Math.max(a, b));
  if (hi - lo < minSpan) {
    hi = Math.min(max, lo + minSpan);
    lo = Math.max(0, hi - minSpan);
  }
  return [lo, hi];
}

// ── Range selector ─────────────────────────────────────────
function RangeSelector({
  width,
  height,
  n,
  range,
  onChange,
  lines,
  label,
}: {
  width: number;
  height: number;
  n: number;
  range: [number, number];
  onChange: (r: [number, number]) => void;
  lines: { key: string; color: string; values: (number | null)[] }[];
  label: { range: string; rangeStart: string; rangeEnd: string };
}) {
  const drag = useRef<{ mode: "start" | "end" | "move"; x: number; range: [number, number] } | null>(null);
  const max = n - 1;
  const xOf = (i: number) => (i / max) * width;
  const all = lines.flatMap((l) => l.values.filter((v): v is number => v != null));
  const lo = Math.min(0, ...all);
  const hi = Math.max(1, ...all);
  const yOf = scaleLinear([lo, hi], [height - 4, 4]);
  const [x0, x1] = [xOf(range[0]), xOf(range[1])];
  const HANDLE = 10;

  const begin = (mode: "start" | "end" | "move") => (e: PointerEvent<Element>) => {
    e.stopPropagation();
    (e.currentTarget as Element).setPointerCapture(e.pointerId);
    drag.current = { mode, x: e.clientX, range };
  };
  const move = (e: PointerEvent<Element>) => {
    const d = drag.current;
    if (!d) return;
    const delta = ((e.clientX - d.x) / Math.max(1, width)) * max;
    const [a, b] = d.range;
    if (d.mode === "move") {
      const shift = Math.max(-a, Math.min(max - b, delta));
      onChange([a + shift, b + shift]);
    } else if (d.mode === "start") onChange([Math.min(a + delta, b - 1), b]);
    else onChange([a, Math.max(b + delta, a + 1)]);
  };
  const end = () => (drag.current = null);

  const keyStep = (which: "start" | "end") => (e: KeyboardEvent<SVGRectElement>) => {
    const step = e.shiftKey ? Math.max(1, Math.round(max / 10)) : 1;
    const dir = e.key === "ArrowRight" || e.key === "ArrowUp" ? 1 : e.key === "ArrowLeft" || e.key === "ArrowDown" ? -1 : 0;
    if (!dir) return;
    e.preventDefault();
    onChange(which === "start" ? [range[0] + dir * step, range[1]] : [range[0], range[1] + dir * step]);
  };

  return (
    <svg
      width={width}
      height={height}
      role="group"
      aria-label={label.range}
      className="block touch-none select-none"
      onPointerMove={move}
      onPointerUp={end}
      onPointerCancel={end}
    >
      <rect x={0} y={0} width={width} height={height} rx={8} fill="var(--color-default)" opacity={0.5} />
      {lines.map((l) => {
        const pts: Point[] = [];
        l.values.forEach((v, i) => v != null && pts.push([xOf(i), yOf(v)]));
        return <path key={l.key} d={linePath(pts)} fill="none" stroke={l.color} strokeWidth={1.25} strokeLinejoin="round" opacity={0.9} />;
      })}
      {/* Dim what is outside the window */}
      <path d={`M0,0H${x0}V${height}H0Z M${x1},0H${width}V${height}H${x1}Z`} fill="var(--color-background)" opacity={0.72} />
      {/* Window frame (drag to pan) */}
      <rect
        x={x0}
        y={1}
        width={Math.max(0, x1 - x0)}
        height={height - 2}
        rx={8}
        fill="transparent"
        stroke="var(--color-accent)"
        strokeOpacity={0.55}
        strokeWidth={2}
        className="cursor-grab active:cursor-grabbing"
        onPointerDown={begin("move")}
      />
      {(["start", "end"] as const).map((which) => {
        const x = which === "start" ? x0 : x1;
        const value = Math.round(which === "start" ? range[0] : range[1]);
        return (
          <g key={which}>
            <rect
              x={which === "start" ? x : x - HANDLE}
              y={1}
              width={HANDLE}
              height={height - 2}
              rx={4}
              fill="var(--color-accent)"
              fillOpacity={0.55}
              tabIndex={0}
              role="slider"
              aria-label={which === "start" ? label.rangeStart : label.rangeEnd}
              aria-valuemin={0}
              aria-valuemax={max}
              aria-valuenow={value}
              className="cursor-ew-resize outline-none focus-visible:[fill-opacity:1]"
              onPointerDown={begin(which)}
              onKeyDown={keyStep(which)}
            />
            <line
              x1={which === "start" ? x + HANDLE / 2 : x - HANDLE / 2}
              x2={which === "start" ? x + HANDLE / 2 : x - HANDLE / 2}
              y1={height / 2 - 6}
              y2={height / 2 + 6}
              stroke="var(--color-accent-foreground)"
              strokeWidth={1.5}
              strokeLinecap="round"
              pointerEvents="none"
            />
          </g>
        );
      })}
    </svg>
  );
}

export interface AreaChartProps extends Omit<LineChartProps, "showArea"> {}

/** Filled lines: a soft wash under each series, or stacked parts of a whole with `isStacked`. */
export function AreaChart(props: AreaChartProps) {
  return <LineChart {...props} showArea />;
}

AreaChart.displayName = "AreaChart";
