import { useState, type HTMLAttributes, type KeyboardEvent, type ReactNode } from "react";
import { cn } from "../lib/cn";
import { useResponsive, type ResponsiveProp } from "./breakpoints";
import { ChartLegend, ChartTable, ChartTooltip } from "./ChartParts";
import {
  barPath,
  formatCompact,
  formatNumber,
  formatX,
  niceTicks,
  scaleLinear,
  seriesColor,
  toNumber,
  useChartLayout,
  useElementWidth,
  useHiddenSeries,
  useTween,
  type ChartDatum,
  type ChartSeries,
} from "./chartUtils";
import { useLocale } from "./locale";

export interface BarChartProps extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  /** Shows this component's own loading skeleton (same layout and shape) — set it while data is loading */
  skeleton?: boolean;
  /** Rows of data; each row has the category (`xKey`) and one field per series */
  data: ChartDatum[];
  /** Field of each row holding the category */
  xKey: string;
  /** Plotted measures: { key, label, color? }; colors follow the fixed palette order */
  series: ChartSeries[];
  /** vertical — columns rising from the bottom; horizontal — bars growing to the right (good for long names) */
  layout?: "vertical" | "horizontal";
  /** Stacks the series in one bar per category instead of side by side */
  isStacked?: boolean;
  /** Chart height in px (horizontal charts grow with the number of rows when omitted) */
  height?: number;
  /** Maximum bar thickness in px */
  barSize?: number;
  /** Corner radius of the bar ends in px (capped at half the bar thickness) */
  radius?: number;
  /** Writes the value at the end of each bar (the total for stacked bars) */
  showValues?: boolean;
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
  /** Grid lines along the value axis */
  showGrid?: boolean;
  /** Formats values on the axis, labels and tooltip */
  valueFormatter?: (value: number) => string;
  /** Formats category names */
  xFormatter?: (value: unknown, index: number) => string;
  /** Extra content at the bottom of the tooltip */
  tooltipFooter?: (row: ChartDatum, index: number) => ReactNode;
  /** Animates bars when series are toggled */
  animate?: boolean;
  /** Adapts to the screen: shorter chart, fewer ticks, narrower name column and touch-sized legend on mobile; taller on desktop. true = all breakpoints or a list like ["m", "t"] */
  responsive?: ResponsiveProp;
  /** Accessible name of the chart (also the caption of its data table) */
  "aria-label"?: string;
}

const GAP = 2; // surface gap between touching bars and stacked segments

/** Columns or bars, grouped or stacked, with a per-category tooltip and legend toggles. */
export function BarChart(props: BarChartProps) {
  const {
    data,
    xKey,
    series,
    layout: orientation = "vertical",
    isStacked = false,
    height: heightProp,
    barSize = 24,
    radius = 6,
    showValues = false,
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
  const horizontal = orientation === "horizontal";
  const n = data.length;
  const bps = useResponsive(responsive);
  const autoHeight = horizontal ? Math.max(160, n * (isStacked ? 36 : 28 + 12 * series.length)) : 280;
  const layout = useChartLayout(heightProp ?? autoHeight, horizontal && heightProp === undefined ? [] : bps);
  const [boxRef, width] = useElementWidth<HTMLDivElement>();
  const fmtValue = valueFormatter ?? ((v: number) => formatCompact(v, t.locale));
  const fmtFull = valueFormatter ?? ((v: number) => formatNumber(v, t.locale));
  const fmtX = (i: number) => (xFormatter ? xFormatter(data[i]?.[xKey], i) : formatX(data[i]?.[xKey], t.locale));

  const [hidden, toggle] = useHiddenSeries(series.map((s) => s.key), hiddenSeries, defaultHiddenSeries, onHiddenSeriesChange);
  const values = series.map((s) => data.map((d) => toNumber(d[s.key]) ?? 0));

  // Domain over visible series
  let lo = 0;
  let hi = 0;
  data.forEach((_, i) => {
    let pos = 0;
    let neg = 0;
    series.forEach((s, si) => {
      if (hidden.has(s.key)) return;
      const v = values[si][i];
      if (isStacked) {
        if (v >= 0) pos += v;
        else neg += v;
      } else {
        hi = Math.max(hi, v);
        lo = Math.min(lo, v);
      }
    });
    if (isStacked) {
      hi = Math.max(hi, pos);
      lo = Math.min(lo, neg);
    }
  });
  const nice = niceTicks(lo, hi, layout.compact ? 3 : 4);
  // Tweened: the domain and each series' weight (0 = hidden), so toggling glides
  const tweened = useTween([...nice.domain, ...series.map((s) => (hidden.has(s.key) ? 0 : 1))], { enabled: animate });
  const [d0, d1] = tweened;
  const weights = tweened.slice(2);
  const visibleCount = weights.reduce((a, w) => a + w, 0);

  // ── Geometry ──
  const AXIS = 26;
  const TOP = horizontal ? 4 : 18;
  const labelChars = layout.compact ? 10 : 18;
  const nameW = horizontal ? Math.min(width * 0.38, Math.max(...data.map((_, i) => Math.min(fmtX(i).length, labelChars))) * 6.8 + 12) : 0;
  const valuePad = showValues ? 40 : 8;
  // Columns leave a gutter on the left for the value labels, so bars never cover them
  const gutter = !horizontal && showGrid ? Math.max(...nice.ticks.map((v) => fmtValue(v).length)) * 6.4 + 10 : 0;
  const plotX0 = horizontal ? nameW : gutter;
  const plotW = Math.max(0, width - plotX0 - (horizontal ? valuePad : 0));
  const plotH = Math.max(0, layout.height - TOP - AXIS);
  const bandLen = (horizontal ? plotH : plotW) / Math.max(1, n);
  const inner = bandLen * (isStacked ? 0.6 : 0.78);
  const scale = horizontal ? scaleLinear([d0, d1], [plotX0, plotX0 + plotW]) : scaleLinear([d0, d1], [TOP + plotH, TOP]);
  const zero = scale(0);
  const thick = isStacked
    ? Math.min(barSize, inner)
    : Math.max(1, Math.min(barSize, (inner - GAP * Math.max(0, visibleCount - 1)) / Math.max(1, visibleCount)));

  type Bar = { si: number; i: number; d: string; value: number; label?: { x: number; y: number; text: string } };
  const bars: Bar[] = [];
  data.forEach((_, i) => {
    const bandStart = (horizontal ? TOP : plotX0) + i * bandLen;
    if (isStacked) {
      const across = bandStart + (bandLen - thick) / 2;
      let pos = 0;
      let neg = 0;
      // The outermost visible segment on each side gets the rounded end
      const lastPos = series.map((_, si) => si).filter((si) => weights[si] > 0.01 && values[si][i] > 0).pop();
      const lastNeg = series.map((_, si) => si).filter((si) => weights[si] > 0.01 && values[si][i] < 0).pop();
      series.forEach((_, si) => {
        const v = values[si][i] * weights[si];
        if (Math.abs(v) < 1e-9) return;
        const from = v >= 0 ? pos : neg;
        const to = from + v;
        if (v >= 0) pos = to;
        else neg = to;
        const a = scale(from);
        const b = scale(to);
        const outer = si === (v >= 0 ? lastPos : lastNeg);
        const len = Math.abs(b - a) - (outer ? 0 : GAP);
        if (len <= 0.5) return;
        const d = horizontal
          ? barPath(v >= 0 ? a : a - len, across, len, thick, outer ? radius : 0, v >= 0 ? "right" : "left")
          : barPath(across, v >= 0 ? a - len : a, thick, len, outer ? radius : 0, v >= 0 ? "top" : "bottom");
        bars.push({ si, i, d, value: values[si][i] });
      });
      if (showValues && pos > 0) {
        const end = scale(pos);
        bars.push({
          si: -1,
          i,
          d: "",
          value: pos,
          label: horizontal
            ? { x: end + 6, y: across + thick / 2, text: fmtValue(pos) }
            : { x: across + thick / 2, y: end - 6, text: fmtValue(pos) },
        });
      }
    } else {
      const groupLen = weights.reduce((acc, w) => acc + thick * w, 0) + GAP * Math.max(0, visibleCount - 1);
      let cursor = bandStart + (bandLen - groupLen) / 2;
      series.forEach((_, si) => {
        const w = weights[si];
        if (w < 0.01) return;
        const size = thick * w;
        const v = values[si][i];
        const end = scale(v);
        const len = Math.abs(end - zero);
        const d = horizontal
          ? barPath(v >= 0 ? zero : end, cursor, len, size, radius, v >= 0 ? "right" : "left")
          : barPath(cursor, v >= 0 ? end : zero, size, len, radius, v >= 0 ? "top" : "bottom");
        const label =
          showValues && w > 0.99
            ? horizontal
              ? { x: (v >= 0 ? end + 6 : end - 6), y: cursor + size / 2, text: fmtValue(v) }
              : { x: cursor + size / 2, y: v >= 0 ? end - 6 : end + 14, text: fmtValue(v) }
            : undefined;
        bars.push({ si, i, d, value: v, label });
        cursor += size + GAP * Math.min(1, w);
      });
    }
  });

  // ── Hover / keyboard ──
  const [active, setActive] = useState<number | null>(null);
  const [viaKeyboard, setViaKeyboard] = useState(false);
  const pick = (clientX: number, clientY: number, el: Element) => {
    const rect = el.getBoundingClientRect();
    const pos = horizontal ? clientY - rect.top - TOP : clientX - rect.left - plotX0;
    const i = Math.floor(pos / Math.max(1, bandLen));
    setActive(i >= 0 && i < n ? i : null);
    setViaKeyboard(false);
  };
  const onKeyDown = (e: KeyboardEvent<SVGSVGElement>) => {
    const next = horizontal ? { ArrowDown: 1, ArrowUp: -1 } : { ArrowRight: 1, ArrowLeft: -1 };
    const step = next[e.key as keyof typeof next];
    if (step) {
      e.preventDefault();
      setActive((a) => Math.min(n - 1, Math.max(0, (a ?? (step > 0 ? -1 : n)) + step)));
      setViaKeyboard(true);
    } else if (e.key === "Escape") setActive(null);
  };

  const visibleSeries = series.filter((s) => !hidden.has(s.key));
  const rowsAt = (i: number) =>
    visibleSeries.map((s) => ({ key: s.key, label: s.label, color: seriesColor(series.indexOf(s), s.color), value: fmtFull(values[series.indexOf(s)][i]) }));
  const totalAt = (i: number) => visibleSeries.reduce((a, s) => a + values[series.indexOf(s)][i], 0);

  // Category labels on the band axis, skipping some when they would collide
  const perLabel = horizontal ? 1 : Math.max(1, Math.ceil((layout.compact ? 56 : 72) / Math.max(1, bandLen)));
  const truncate = (s: string) => (s.length > labelChars ? `${s.slice(0, labelChars - 1)}…` : s);
  const ready = width > 0 && n > 0;
  const tipPos =
    active == null
      ? null
      : horizontal
        ? { x: plotX0 + plotW / 2, y: TOP + active * bandLen + bandLen }
        : { x: plotX0 + active * bandLen + bandLen / 2, y: TOP };

  return (
    <div className={cn("relative flex w-full flex-col gap-3", className)} role="figure" aria-label={ariaLabel} {...rest}>
      <div ref={boxRef} className="relative w-full" style={{ height: layout.height }}>
        {n === 0 && <div className="flex h-full items-center justify-center text-sm text-muted">{t.chart.empty}</div>}
        {ready && (
          <svg
            width={width}
            height={layout.height}
            className="block overflow-visible rounded-md outline-none focus-visible:ring-2 focus-visible:ring-focus"
            tabIndex={0}
            role="img"
            aria-label={ariaLabel}
            onKeyDown={onKeyDown}
            onPointerMove={(e) => pick(e.clientX, e.clientY, e.currentTarget)}
            onPointerDown={(e) => pick(e.clientX, e.clientY, e.currentTarget)}
            onPointerLeave={() => !viaKeyboard && setActive(null)}
            onBlur={() => setActive(null)}
          >
            {/* Hovered band */}
            {active != null && (
              <rect
                x={horizontal ? 0 : plotX0 + active * bandLen}
                y={horizontal ? TOP + active * bandLen : TOP}
                width={horizontal ? width : bandLen}
                height={horizontal ? bandLen : plotH}
                rx={8}
                fill="var(--color-default)"
                opacity={0.6}
              />
            )}

            {/* Grid + value labels */}
            {showGrid &&
              nice.ticks.map((v) => {
                const p = scale(v);
                return horizontal ? (
                  <g key={v}>
                    <line x1={Math.round(p) + 0.5} x2={Math.round(p) + 0.5} y1={TOP} y2={TOP + plotH} stroke="var(--color-separator)" strokeWidth={1} />
                    <text x={p} y={layout.height - 8} textAnchor="middle" className="fill-muted text-[11px] tabular-nums">
                      {fmtValue(v)}
                    </text>
                  </g>
                ) : (
                  <g key={v}>
                    <line x1={0} x2={width} y1={Math.round(p) + 0.5} y2={Math.round(p) + 0.5} stroke="var(--color-separator)" strokeWidth={1} />
                    <text x={0} y={p - 5} className="fill-muted text-[11px] tabular-nums">
                      {fmtValue(v)}
                    </text>
                  </g>
                );
              })}

            {bars.map((b, k) =>
              b.d ? (
                <path
                  key={k}
                  d={b.d}
                  fill={seriesColor(b.si, series[b.si].color)}
                  className="transition-opacity duration-200"
                  opacity={active == null || active === b.i ? 1 : 0.55}
                />
              ) : null
            )}
            {bars.map((b, k) =>
              b.label ? (
                <text
                  key={`l${k}`}
                  x={b.label.x}
                  y={b.label.y}
                  textAnchor={horizontal ? (b.value >= 0 ? "start" : "end") : "middle"}
                  dominantBaseline={horizontal ? "middle" : undefined}
                  className="fill-foreground text-[11px] font-medium tabular-nums"
                >
                  {b.label.text}
                </text>
              ) : null
            )}

            {/* Category labels */}
            {data.map((_, i) => {
              if (i % perLabel) return null;
              const text = horizontal ? truncate(fmtX(i)) : fmtX(i);
              return horizontal ? (
                <text key={i} x={0} y={TOP + i * bandLen + bandLen / 2} dominantBaseline="middle" className="fill-muted text-[12px]">
                  <title>{fmtX(i)}</title>
                  {text}
                </text>
              ) : (
                <text key={i} x={plotX0 + i * bandLen + bandLen / 2} y={layout.height - 8} textAnchor="middle" className="fill-muted text-[11px]">
                  {text}
                </text>
              );
            })}
            {!horizontal && <line x1={0} x2={width} y1={Math.round(zero) + 0.5} y2={Math.round(zero) + 0.5} stroke="var(--color-border)" strokeWidth={1} />}
          </svg>
        )}
        {ready && active != null && tipPos && (
          <ChartTooltip
            x={tipPos.x}
            y={horizontal ? Math.min(tipPos.y, layout.height - 80) : tipPos.y}
            boxWidth={width}
            title={fmtX(active)}
            rows={rowsAt(active)}
            footer={
              tooltipFooter?.(data[active], active) ??
              (isStacked && visibleSeries.length > 1 ? (
                <span className="flex justify-between gap-3">
                  {t.chart.total}
                  <span className="font-semibold tabular-nums text-foreground">{fmtFull(totalAt(active))}</span>
                </span>
              ) : undefined)
            }
          />
        )}
        <div aria-live="polite" className="sr-only">
          {viaKeyboard && active != null ? `${fmtX(active)}: ${rowsAt(active).map((row) => `${row.label} ${row.value}`).join(", ")}` : ""}
        </div>
      </div>

      {showLegend && (
        <ChartLegend
          compact={layout.compact}
          shape="square"
          onToggle={isLegendInteractive ? toggle : undefined}
          items={series.map((s, si) => ({ key: s.key, label: s.label, color: seriesColor(si, s.color), hidden: hidden.has(s.key) }))}
        />
      )}

      <ChartTable
        caption={ariaLabel}
        columns={["", ...series.map((s) => s.label)]}
        rows={data.map((_, i) => [fmtX(i), ...series.map((_, si) => fmtFull(values[si][i]))])}
      />
    </div>
  );
}

BarChart.displayName = "BarChart";
