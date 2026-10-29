import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, fireEvent, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BarChart } from "../src/components/BarChart";
import { LineChart } from "../src/components/LineChart";
import { PieChart } from "../src/components/PieChart";
import { formatCompact, niceTicks, seriesColor, smoothPath } from "../src/components/chartUtils";

// jsdom has no layout: give every element a 600px wide box so charts draw
let rectSpy: ReturnType<typeof vi.spyOn>;
beforeEach(() => {
  rectSpy = vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockReturnValue({
    x: 0, y: 0, top: 0, left: 0, right: 600, bottom: 300, width: 600, height: 300, toJSON: () => ({}),
  } as DOMRect);
});
afterEach(() => rectSpy.mockRestore());

const data = [
  { m: "Jan", a: 10, b: 4 },
  { m: "Feb", a: 30, b: 6 },
  { m: "Mar", a: 20, b: 8 },
];
const series = [
  { key: "a", label: "Alpha" },
  { key: "b", label: "Beta" },
];

describe("chart utils", () => {
  it("rounds ticks to clean numbers", () => {
    expect(niceTicks(0, 37, 4)).toEqual({ domain: [0, 40], ticks: [0, 10, 20, 30, 40] });
    expect(niceTicks(-8, 18, 4).ticks).toEqual([-10, 0, 10, 20]);
  });

  it("smooths without overshooting the data", () => {
    const d = smoothPath([[0, 100], [10, 0], [20, 0], [30, 100]]);
    const ys = [...d.matchAll(/[\d.]+,([\d.-]+)/g)].map((m) => Number(m[1]));
    expect(Math.min(...ys)).toBeGreaterThanOrEqual(0);
    expect(Math.max(...ys)).toBeLessThanOrEqual(100);
  });

  it("formats compact numbers per language and picks palette colors", () => {
    expect(formatCompact(1284, "en")).toBe("1.3K");
    expect(formatCompact(950, "en")).toBe("950");
    expect(seriesColor(0)).toBe("var(--color-chart-1)");
    expect(seriesColor(9)).toBe("var(--color-chart-2)");
    expect(seriesColor(0, "pink")).toBe("var(--color-chart-8)");
    expect(seriesColor(0, "#123456")).toBe("#123456");
  });
});

describe("LineChart", () => {
  it("draws one line per series and offers the data as a table", () => {
    const { container } = render(<LineChart aria-label="Sales" data={data} xKey="m" series={series} animate={false} />);
    expect(container.querySelectorAll("path[stroke-width='2']")).toHaveLength(2);
    const table = screen.getByRole("table", { name: "Sales" });
    expect(within(table).getByRole("rowheader", { name: "Feb" })).toBeInTheDocument();
    expect(within(table).getAllByRole("cell").map((c) => c.textContent)).toContain("30");
  });

  it("hides a series from the legend but never the last one", async () => {
    const onHiddenSeriesChange = vi.fn();
    render(<LineChart data={data} xKey="m" series={series} animate={false} onHiddenSeriesChange={onHiddenSeriesChange} />);
    const alpha = screen.getByRole("button", { name: "Hide Alpha" });
    await userEvent.click(alpha);
    expect(onHiddenSeriesChange).toHaveBeenLastCalledWith(["a"]);
    expect(screen.getByRole("button", { name: "Show Alpha" })).toHaveAttribute("aria-pressed", "false");
    await userEvent.click(screen.getByRole("button", { name: "Hide Beta" }));
    expect(onHiddenSeriesChange).toHaveBeenCalledTimes(1); // Beta is the last visible one
  });

  it("reads values with the keyboard", async () => {
    render(<LineChart aria-label="Sales" data={data} xKey="m" series={series} animate={false} />);
    const plot = screen.getByRole("img", { name: "Sales" });
    plot.focus();
    await userEvent.keyboard("{ArrowRight}{ArrowRight}");
    expect(screen.getByText("Feb: Alpha 30, Beta 6")).toBeInTheDocument();
  });

  it("moves the visible range from the keyboard", async () => {
    const onRangeChange = vi.fn();
    const long = Array.from({ length: 50 }, (_, i) => ({ d: i, v: i }));
    render(<LineChart data={long} xKey="d" series={[{ key: "v", label: "V" }]} showRangeSelector defaultRange={[10, 30]} onRangeChange={onRangeChange} />);
    const start = screen.getByRole("slider", { name: "Range start" });
    expect(start).toHaveAttribute("aria-valuenow", "10");
    fireEvent.keyDown(start, { key: "ArrowRight" });
    expect(onRangeChange).toHaveBeenLastCalledWith([11, 30]);
  });
});

describe("BarChart", () => {
  it("draws a bar per value, grouped or stacked", () => {
    const { container, rerender } = render(<BarChart data={data} xKey="m" series={series} animate={false} />);
    expect(container.querySelectorAll("svg path")).toHaveLength(6);
    rerender(<BarChart data={data} xKey="m" series={series} isStacked showValues animate={false} />);
    expect(container.querySelectorAll("svg path")).toHaveLength(6);
    expect(screen.getByText("36")).toBeInTheDocument(); // stacked total of Feb
  });

  it("shows a total for stacked bars in the keyboard readout", async () => {
    render(<BarChart aria-label="Mix" data={data} xKey="m" series={series} isStacked animate={false} />);
    screen.getByRole("img", { name: "Mix" }).focus();
    await userEvent.keyboard("{ArrowRight}");
    expect(screen.getByText("Jan: Alpha 10, Beta 4")).toBeInTheDocument();
  });
});

describe("PieChart", () => {
  const slices = [
    { key: "x", label: "X", value: 60 },
    { key: "y", label: "Y", value: 30 },
    { key: "z", label: "Z", value: 10 },
  ];

  it("draws a slice per item and shows shares in the legend", () => {
    const { container } = render(<PieChart data={slices} animate={false} />);
    expect(container.querySelectorAll("svg path")).toHaveLength(3);
    expect(screen.getByRole("button", { name: "Hide X" })).toHaveTextContent("60%");
  });

  it("recomputes shares when a slice is hidden and shows the total in the donut", async () => {
    render(<PieChart data={slices} variant="donut" animate={false} />);
    expect(screen.getByText("100")).toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: "Hide X" }));
    expect(screen.getByRole("button", { name: "Hide Y" })).toHaveTextContent("75%");
    expect(screen.getByText("40")).toBeInTheDocument();
  });
});

describe("responsive charts", () => {
  it("are shorter on a phone only when responsive includes mobile", () => {
    const original = window.matchMedia;
    window.matchMedia = vi.fn((query: string) => ({
      matches: query === "(max-width: 767px)",
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    })) as unknown as typeof window.matchMedia;
    const { container, rerender } = render(<LineChart data={data} xKey="m" series={series} height={300} responsive />);
    expect(container.querySelector("svg")).toHaveAttribute("height", "234");
    act(() => rerender(<LineChart data={data} xKey="m" series={series} height={300} responsive={["d"]} />));
    expect(container.querySelector("svg")).toHaveAttribute("height", "300");
    window.matchMedia = original;
  });
});
