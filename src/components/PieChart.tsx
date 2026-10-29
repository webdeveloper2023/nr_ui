import { useState, type HTMLAttributes, type KeyboardEvent, type ReactNode } from "react";
import { cn } from "../lib/cn";
import { useResponsive, type ResponsiveProp } from "./breakpoints";
import { ChartLegend, ChartTable } from "./ChartParts";
import { CHART_COLORS, formatCompact, formatNumber, seriesColor, useChartLayout, useElementWidth, useHiddenSeries, useTween, type ChartColor } from "./chartUtils";
import { useLocale } from "./locale";

export interface PieSlice {
  /** Unique key */
  key: string;
  /** Name shown in the legend and tooltip */
  label: string;
  /** Size of the slice (negative values count as 0) */
  value: number;
  /** Palette color (defaults to the slot of its position) or any CSS color */
  color?: ChartColor | string;
}

type PieVariant = "pie" | "donut" | "semi" | "polar" | "radial" | "ring" | "gauge";
type PieSize = "xs" | "sm" | "md" | "lg" | "xl";
type LegendPosition = "auto" | "right" | "bottom";

export interface PieChartProps extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  /** Shows this component's own loading skeleton (same layout and shape) — set it while data is loading */
  skeleton?: boolean;
  /** Slices: { key, label, value, color? } */
  data: PieSlice[];
  /**
   * pie — full slices; donut — a ring with the total in the middle; semi — a half ring (gauge-like);
   * polar — equal angles, the radius shows the value; radial — one ring per item, the arc length shows the value;
   * ring — a full ring filled up to maxValue (progress / goal); gauge — a half ring filled up to maxValue (meter)
   */
  variant?: PieVariant;
  /** Diameter: xs (96), sm (160), md (240), lg (320), xl (400) or a number in px. Text and the legend scale with it; it shrinks to fit the container */
  size?: PieSize | number;
  /** Legend placement: auto (beside the chart when there is room), right (beside it unless the container is narrower than 380px) or bottom */
  legendPosition?: LegendPosition;
  /** Ring thickness of donut / semi as a share of the radius (0.1–0.6) */
  thickness?: number;
  /** Rounds the corners of every slice, in px */
  cornerRadius?: number;
  /** Space between slices (and between rings of the radial variant), in px */
  gap?: number;
  /** Labels on the chart: none, the share inside each slice, or names with leader lines outside */
  labels?: "none" | "inside" | "outside";
  /** Value that fills a whole ring: radial (defaults to the largest value), ring and gauge (defaults to 100) */
  maxValue?: number;
  /** Text under the number in the center (defaults to "Total") */
  centerLabel?: ReactNode;
  /** Replaces the number in the center (null hides it) */
  centerValue?: ReactNode;
  /** Legend beside the chart (below it when there is no room) */
  showLegend?: boolean;
  /** Shows each slice's share in the legend (the value for the radial variant) */
  showPercent?: boolean;
  /** Legend items show / hide their slice */
  isLegendInteractive?: boolean;
  /** Hidden slice keys (controlled) */
  hiddenSeries?: string[];
  /** Initially hidden slice keys */
  defaultHiddenSeries?: string[];
  /** Called with the hidden slice keys when a legend item is pressed */
  onHiddenSeriesChange?: (hidden: string[]) => void;
  /** Formats values in the legend, center and tooltip */
  valueFormatter?: (value: number) => string;
  /** Animates the slices when they are toggled */
  animate?: boolean;
  /** Adapts to the screen: smaller chart with the legend below on mobile, larger on desktop. true = all breakpoints or a list like ["m", "t"] */
  responsive?: ResponsiveProp;
  /** Accessible name of the chart (also the caption of its data table) */
  "aria-label"?: string;
}

const TAU = Math.PI * 2;

const SIZE_PX: Record<PieSize, number> = { xs: 96, sm: 160, md: 240, lg: 320, xl: 400 };

/** Text steps that follow the drawn diameter: center number, center caption, labels on the chart */
function textScale(d: number) {
  if (d < 130) return { value: "text-sm", caption: "text-[10px]", label: 9 };
  if (d < 200) return { value: "text-lg", caption: "text-[11px]", label: 10 };
  if (d < 290) return { value: "text-2xl", caption: "text-xs", label: 11 };
  if (d < 370) return { value: "text-3xl", caption: "text-sm", label: 12 };
  return { value: "text-4xl", caption: "text-sm", label: 13 };
}
const pt = (cx: number, cy: number, rad: number, a: number) => `${(cx + rad * Math.sin(a)).toFixed(2)},${(cy - rad * Math.cos(a)).toFixed(2)}`;

/**
 * A slice with rounded corners and a constant-width gap. The outline is drawn shrunk by the
 * corner radius and stroked with a round join of twice that width in the fill color, which
 * grows it back to full size with every corner rounded.
 */
function roundedSlice(cx: number, cy: number, r: number, inner: number, a0: number, a1: number, gap: number, rc: number) {
  const sweep = a1 - a0;
  if (sweep <= 1e-4) return { d: "", stroke: 0 };
  if (sweep >= TAU - 1e-4) {
    // A single visible slice: a plain circle or ring
    const ring = `M${cx},${cy - r}A${r},${r} 0 1 1 ${cx - 0.01},${cy - r}Z`;
    return { d: inner > 0 ? `${ring}M${cx},${cy - inner}A${inner},${inner} 0 1 0 ${cx - 0.01},${cy - inner}Z` : ring, stroke: 0 };
  }
  const band = r - inner;
  const c = Math.max(0, Math.min(rc, band / 2 - 0.5));
  const off = gap / 2 + c;
  const R = r - c;
  const I = inner > 0 ? inner + c : 0;
  const edge = (rad: number) => (rad <= off ? Math.PI / 2 : Math.asin(off / rad));
  const o0 = a0 + edge(R);
  const o1 = a1 - edge(R);
  const mid = (a0 + a1) / 2;
  if (o1 <= o0) {
    // Too thin for corners: a short capsule along the middle
    const rad = inner > 0 ? (R + I) / 2 : R * 0.7;
    return { d: `M${pt(cx, cy, rad, mid)}L${pt(cx, cy, rad + 0.01, mid)}`, stroke: Math.max(1, Math.min(2 * c, sweep * rad)) };
  }
  const large = o1 - o0 > Math.PI ? 1 : 0;
  let d = `M${pt(cx, cy, R, o0)}A${R},${R} 0 ${large} 1 ${pt(cx, cy, R, o1)}`;
  if (I > 0) {
    const i0 = a0 + edge(I);
    const i1 = a1 - edge(I);
    if (i1 > i0) d += `L${pt(cx, cy, I, i1)}A${I},${I} 0 ${i1 - i0 > Math.PI ? 1 : 0} 0 ${pt(cx, cy, I, i0)}Z`;
    else d += `L${pt(cx, cy, Math.min(R, off / Math.sin(sweep / 2)), mid)}Z`;
  } else if (sweep < Math.PI) {
    d += `L${pt(cx, cy, Math.min(R, off / Math.sin(sweep / 2)), mid)}Z`;
  } else {
    // The two offset edges pass beside the center
    d += `L${pt(cx, cy, off, a1 - Math.PI / 2)}L${pt(cx, cy, off, a0 + Math.PI / 2)}Z`;
  }
  return { d, stroke: 2 * c };
}

/** Text color inside a slice: white on deep palette fills, near-black on light ones (white on custom colors) */
function insideInk(i: number, color?: string) {
  const slot = color ? CHART_COLORS.indexOf(color as ChartColor) : i % CHART_COLORS.length;
  if (slot < 0) return "#ffffff";
  return [0, 2, 6, 7].includes(slot) ? "#ffffff" : "#1d1d1f";
}

/** Parts of a whole as a pie, donut, half ring, polar area, radial rings, a goal ring or a gauge, with a hover readout and legend toggles. */
export function PieChart(props: PieChartProps) {
  const {
    data,
    variant = "pie",
    size = "md",
    legendPosition = "auto",
    thickness = 0.32,
    cornerRadius = variant === "pie" ? 4 : 6,
    gap = 2,
    labels = "none",
    maxValue,
    centerLabel,
    centerValue,
    showLegend = true,
    showPercent = variant !== "radial",
    isLegendInteractive = true,
    hiddenSeries,
    defaultHiddenSeries,
    onHiddenSeriesChange,
    valueFormatter,
    animate = true,
    responsive,
    "aria-label": ariaLabel = "Chart",
    className,
    ...rest
  } = props;

  const t = useLocale();
  const bps = useResponsive(responsive);
  const layout = useChartLayout(typeof size === "number" ? size : SIZE_PX[size], bps);
  const [boxRef, width] = useElementWidth<HTMLDivElement>();
  const fmt = valueFormatter ?? ((v: number) => formatCompact(v, t.locale));
  const fmtFull = valueFormatter ?? ((v: number) => formatNumber(v, t.locale));

  const [hidden, toggle] = useHiddenSeries(data.map((d) => d.key), hiddenSeries, defaultHiddenSeries, onHiddenSeriesChange);
  const values = data.map((d) => Math.max(0, d.value));
  const weights = useTween(data.map((d) => (hidden.has(d.key) ? 0 : 1)), { enabled: animate });
  const shown = values.map((v, i) => v * weights[i]);
  const total = shown.reduce((a, v) => a + v, 0);
  const visibleTotal = values.reduce((a, v, i) => a + (hidden.has(data[i].key) ? 0 : v), 0);
  const visibleMax = Math.max(1e-9, ...values.filter((_, i) => !hidden.has(data[i].key)));
  const metered = variant === "ring" || variant === "gauge";
  const meterMax = Math.max(maxValue ?? 100, visibleTotal, 1e-9);
  const base = metered ? meterMax : visibleTotal;
  const pct = (v: number) => (base > 0 ? `${Math.round((v / base) * 1000) / 10}%` : "0%");

  // ── Size: legend beside the chart when there is room, outside labels need side room ──
  const outside = labels === "outside" && variant !== "radial";
  const labelRoom = outside ? (layout.compact ? 64 : 92) : 0;
  const side =
    showLegend && legendPosition !== "bottom" && (legendPosition === "right" ? width >= 380 : !layout.compact && width >= layout.height + labelRoom * 2 + 220);
  const avail = Math.max(40, (side ? width - 220 : width || layout.height) - labelRoom * 2);
  const diameter = Math.max(40, Math.min(layout.height, avail));
  const ts = textScale(diameter);
  const semi = variant === "semi" || variant === "gauge";
  const gauge = variant === "gauge";
  const svgW = diameter + labelRoom * 2;
  const vPad = outside ? 24 : 0; // room above and below for outside labels
  const svgH = semi ? diameter / 2 + 10 + vPad + (gauge ? 16 : 0) : diameter + vPad * 2;
  const cx = svgW / 2;
  const cy = diameter / 2 + vPad;
  const popRoom = diameter < 120 ? 3 : 6;
  const r = diameter / 2 - popRoom; // room for the hovered slice to pop out
  const ringed = variant === "donut" || semi || variant === "ring";
  const inner = ringed ? r * (1 - Math.min(0.6, Math.max(0.1, thickness))) : variant === "polar" ? r * 0.12 : 0;
  const [start, sweepAll] = semi ? [-Math.PI / 2, Math.PI] : [0, TAU];

  const [active, setActive] = useState<number | null>(null);
  const [viaKeyboard, setViaKeyboard] = useState(false);
  const hover = (i: number) => () => {
    setActive(i);
    setViaKeyboard(false);
  };

  // ── Slices ──
  type Shape = { i: number; d: string; stroke: number; mid: number; labelR: number; outerR: number };
  const shapes: Shape[] = [];
  if (variant === "radial") {
    // One ring per visible item, outermost first; rings close up smoothly when one is hidden
    const count = weights.reduce((a, w) => a + w, 0);
    const hole = r * 0.36;
    const ringW = Math.max(4, (r - hole - gap * Math.max(0, count - 1)) / Math.max(1, count));
    let offset = 0;
    data.forEach((_, i) => {
      const w = weights[i];
      if (w < 0.01) return;
      const rad = r - offset - (ringW * w) / 2;
      offset += (ringW + gap) * w;
      const max = maxValue ?? visibleMax;
      const a = Math.min(1, shown[i] / Math.max(1e-9, max)) * TAU * 0.75;
      const d = a < 1e-3 ? "" : `M${pt(cx, cy, rad, 0)}A${rad},${rad} 0 ${a > Math.PI ? 1 : 0} 1 ${pt(cx, cy, rad, a)}`;
      shapes.push({ i, d, stroke: ringW * w, mid: a / 2, labelR: rad, outerR: rad });
    });
  } else if (variant === "polar") {
    const visibleCount = weights.reduce((a, w) => a + w, 0);
    let angle = start;
    data.forEach((_, i) => {
      const sweep = (weights[i] / Math.max(1e-9, visibleCount)) * sweepAll;
      const outer = inner + (r - inner) * Math.sqrt(values[i] / visibleMax); // area grows with the value
      const s = roundedSlice(cx, cy, Math.max(inner + 4, outer), inner, angle, angle + sweep, gap, cornerRadius);
      shapes.push({ i, ...s, mid: angle + sweep / 2, labelR: (inner + outer) / 2, outerR: outer });
      angle += sweep;
    });
  } else {
    // ring / gauge fill up to maxValue, the rest stays as the track
    let angle = start;
    const denom = metered ? meterMax : total;
    data.forEach((_, i) => {
      const sweep = denom > 0 ? (shown[i] / denom) * sweepAll : 0;
      const s = roundedSlice(cx, cy, r, inner, angle, angle + sweep, gap, cornerRadius);
      shapes.push({ i, ...s, mid: angle + sweep / 2, labelR: inner > 0 ? (r + inner) / 2 : r * 0.64, outerR: r });
      angle += sweep;
    });
  }

  // ── Outside labels: leader lines, pushed apart on each side so they never overlap ──
  const outsideLabels = outside
    ? (() => {
        const items = shapes
          .filter((s) => weights[s.i] > 0.5 && shown[s.i] > 0)
          .map((s) => {
            const right = Math.sin(s.mid) >= 0;
            const ex = cx + (s.outerR + 4) * Math.sin(s.mid);
            const ey = cy - (s.outerR + 4) * Math.cos(s.mid);
            return { s, right, ex, ey, y: cy - (s.outerR + 14) * Math.cos(s.mid) };
          });
        for (const side of [true, false]) {
          const list = items.filter((l) => l.right === side).sort((a, b) => a.y - b.y);
          for (let k = 1; k < list.length; k++) list[k].y = Math.max(list[k].y, list[k - 1].y + 16);
        }
        return items;
      })()
    : [];

  const visibleIdx = data.map((_, i) => i).filter((i) => !hidden.has(data[i].key));
  const onKeyDown = (e: KeyboardEvent<SVGSVGElement>) => {
    const step = e.key === "ArrowRight" || e.key === "ArrowDown" ? 1 : e.key === "ArrowLeft" || e.key === "ArrowUp" ? -1 : 0;
    if (step) {
      e.preventDefault();
      const pos = active == null ? (step > 0 ? -1 : visibleIdx.length) : visibleIdx.indexOf(active);
      setActive(visibleIdx[(pos + step + visibleIdx.length) % visibleIdx.length] ?? null);
      setViaKeyboard(true);
    } else if (e.key === "Escape") setActive(null);
  };

  const track = metered ? roundedSlice(cx, cy, r, inner, start, start + sweepAll, 0, cornerRadius) : null;
  const activeSlice = active != null && !hidden.has(data[active].key) ? data[active] : null;
  const share = (v: number) => (variant === "radial" ? fmt(v) : pct(v));
  const centered = ringed || variant === "radial";
  const ready = width > 0;

  const legend = showLegend && (
    <div className={cn(side ? "min-w-0 max-w-xs flex-1" : "w-full")}>
      <ChartLegend
        compact={layout.compact || diameter < 130}
        vertical={side}
        onToggle={isLegendInteractive ? toggle : undefined}
        items={data.map((d, i) => ({
          key: d.key,
          label: d.label,
          color: seriesColor(i, d.color),
          hidden: hidden.has(d.key),
          detail: hidden.has(d.key) ? null : showPercent ? pct(values[i]) : fmt(values[i]),
        }))}
      />
    </div>
  );

  return (
    <div className={cn("w-full", className)} role="figure" aria-label={ariaLabel} {...rest}>
      <div ref={boxRef} className={cn("flex w-full gap-6", side ? "flex-row items-center" : "flex-col items-center")}>
        <div className="relative shrink-0" style={{ width: svgW, height: svgH }}>
          {ready && (
            <svg
              data-skeleton-shape={outside ? undefined : semi ? "half" : "circle"}
              width={svgW}
              height={svgH}
              className="block overflow-visible rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-focus"
              tabIndex={0}
              role="img"
              aria-label={ariaLabel}
              onKeyDown={onKeyDown}
              onPointerLeave={() => !viaKeyboard && setActive(null)}
              onBlur={() => setActive(null)}
            >
              {/* Empty state and radial tracks */}
              {total === 0 && variant !== "radial" && !metered && <circle cx={cx} cy={cy} r={r} fill="var(--color-default)" />}
              {track && !semi && <circle cx={cx} cy={cy} r={(r + inner) / 2} fill="none" stroke="var(--color-default)" strokeWidth={r - inner} />}
              {track && semi && <path d={track.d} fill="var(--color-default)" stroke={track.stroke ? "var(--color-default)" : undefined} strokeWidth={track.stroke || undefined} strokeLinejoin="round" fillRule="evenodd" />}
              {variant === "radial" &&
                shapes.map((s) => (
                  <path
                    key={`t${s.i}`}
                    d={`M${pt(cx, cy, s.labelR, 0)}A${s.labelR},${s.labelR} 0 1 1 ${pt(cx, cy, s.labelR, TAU * 0.75)}`}
                    fill="none"
                    stroke="var(--color-default)"
                    strokeWidth={s.stroke}
                    strokeLinecap="round"
                  />
                ))}

              {shapes.map((s) => {
                const d = data[s.i];
                const color = seriesColor(s.i, d.color);
                const pop = active === s.i && variant !== "radial" && !metered ? popRoom - 1 : 0;
                const radial = variant === "radial";
                return (
                  <path
                    key={d.key}
                    d={s.d}
                    fill={radial ? "none" : color}
                    stroke={radial || s.stroke > 0 ? color : undefined}
                    strokeWidth={s.stroke || undefined}
                    strokeLinejoin="round"
                    strokeLinecap="round"
                    fillRule="evenodd"
                    className="cursor-pointer transition-[transform,opacity] duration-200 ease-out"
                    style={{ transform: `translate(${(Math.sin(s.mid) * pop).toFixed(2)}px, ${(-Math.cos(s.mid) * pop).toFixed(2)}px)` }}
                    opacity={active == null || active === s.i ? 1 : 0.45}
                    onPointerEnter={hover(s.i)}
                    onPointerDown={hover(s.i)}
                  />
                );
              })}

              {/* Radial: names at the start of each ring */}
              {variant === "radial" &&
                diameter >= 160 &&
                shapes.map((s) =>
                  s.stroke >= 10 ? (
                    <text key={`n${s.i}`} x={cx - s.stroke / 2 - 6} y={cy - s.labelR} textAnchor="end" dominantBaseline="middle" className="fill-muted" style={{ fontSize: ts.label }}>
                      {data[s.i].label}
                    </text>
                  ) : null
                )}

              {/* Shares inside the slices, where they fit */}
              {labels === "inside" &&
                variant !== "radial" &&
                shapes.map((s) => {
                  const a = variant === "polar" ? sweepAll / Math.max(1, visibleIdx.length) : total > 0 ? (shown[s.i] / total) * sweepAll : 0;
                  if (weights[s.i] < 0.5 || a * s.labelR < ts.label * 2.8 || (variant === "polar" && s.outerR - inner < 26)) return null;
                  return (
                    <text
                      key={`v${s.i}`}
                      x={cx + s.labelR * Math.sin(s.mid)}
                      y={cy - s.labelR * Math.cos(s.mid)}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fill={insideInk(s.i, data[s.i].color)}
                      className="pointer-events-none font-semibold tabular-nums"
                      style={{ fontSize: ts.label }}
                    >
                      {variant === "polar" ? fmt(values[s.i]) : pct(values[s.i])}
                    </text>
                  );
                })}

              {outsideLabels.map(({ s, right, ex, ey, y }) => {
                const x2 = cx + (s.outerR + 14) * Math.sin(s.mid);
                const x3 = right ? Math.max(x2, cx) + 10 : Math.min(x2, cx) - 10;
                return (
                  <g key={`o${s.i}`} className="pointer-events-none">
                    <path d={`M${ex},${ey}L${x2},${y}L${x3},${y}`} fill="none" stroke="var(--color-border)" strokeWidth={1} />
                    <text x={x3 + (right ? 4 : -4)} y={y} textAnchor={right ? "start" : "end"} dominantBaseline="middle" style={{ fontSize: ts.label }}>
                      <tspan className="fill-foreground">{data[s.i].label}</tspan>
                      <tspan className="fill-muted"> {share(values[s.i])}</tspan>
                    </text>
                  </g>
                );
              })}
              {gauge && diameter >= 120 && (
                <g className="fill-muted" style={{ fontSize: ts.label }}>
                  <text x={cx - (r + inner) / 2} y={cy + 14} textAnchor="middle">{fmt(0)}</text>
                  <text x={cx + (r + inner) / 2} y={cy + 14} textAnchor="middle">{fmt(meterMax)}</text>
                </g>
              )}
            </svg>
          )}

          {/* Center readout (donut, semi, radial) or floating readout (pie, polar) */}
          {ready && centered && (
            <div
              aria-hidden
              className={cn("pointer-events-none absolute flex flex-col items-center text-center", semi ? "justify-end" : "justify-center")}
              style={
                semi
                  ? { left: cx - inner + 8, width: (inner - 8) * 2, top: cy - inner, height: inner + 4 }
                  : { left: cx - (variant === "radial" ? r * 0.36 : inner) + 6, width: ((variant === "radial" ? r * 0.36 : inner) - 6) * 2, top: cy - (variant === "radial" ? r * 0.36 : inner), height: (variant === "radial" ? r * 0.36 : inner) * 2 }
              }
            >
              <span className={cn("font-semibold leading-tight tracking-tight text-foreground tabular-nums", variant === "radial" ? textScale(diameter * 0.6).value : ts.value)}>
                {activeSlice ? fmt(activeSlice.value) : (centerValue !== undefined ? centerValue : metered ? pct(visibleTotal) : fmt(visibleTotal))}
              </span>
              {diameter >= 110 && (
                <span className={cn("mt-0.5 max-w-full truncate text-muted", ts.caption)}>
                  {activeSlice
                    ? variant === "radial"
                      ? activeSlice.label
                      : `${activeSlice.label} · ${pct(activeSlice.value)}`
                    : (centerLabel ?? (metered ? `${fmt(visibleTotal)} / ${fmt(meterMax)}` : t.chart.total))}
                </span>
              )}
            </div>
          )}
          {ready && !centered && activeSlice && (
            <div
              aria-hidden
              className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-1/2 rounded-xl bg-overlay/95 px-3 py-2 text-center shadow-overlay backdrop-blur-md animate-fade-in"
              style={{ left: cx, top: cy }}
            >
              <div className="text-[13px] font-semibold tabular-nums text-foreground">{fmtFull(activeSlice.value)}</div>
              <div className="text-xs text-muted">
                {activeSlice.label} · {pct(activeSlice.value)}
              </div>
            </div>
          )}
        </div>
        {legend}
      </div>
      <div aria-live="polite" className="sr-only">
        {viaKeyboard && activeSlice ? `${activeSlice.label}: ${fmtFull(activeSlice.value)}, ${pct(activeSlice.value)}` : ""}
      </div>
      <ChartTable caption={ariaLabel} columns={["", ariaLabel, "%"]} rows={data.map((d, i) => [d.label, fmtFull(values[i]), pct(values[i])])} />
    </div>
  );
}

PieChart.displayName = "PieChart";
