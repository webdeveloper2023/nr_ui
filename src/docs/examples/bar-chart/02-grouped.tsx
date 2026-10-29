import { BarChart } from "nr-ui-kit";

const data = [
  { quarter: "Q1", plan: 420, actual: 388 },
  { quarter: "Q2", plan: 460, actual: 471 },
  { quarter: "Q3", plan: 500, actual: 523 },
  { quarter: "Q4", plan: 560, actual: 540 },
];

// Hide a series from the legend: the remaining bars widen and the axis rescales.
export default function Grouped() {
  return (
    <BarChart
      aria-label="Plan and actual revenue per quarter"
      data={data}
      xKey="quarter"
      series={[
        { key: "plan", label: "Plan", color: "indigo" },
        { key: "actual", label: "Actual" },
      ]}
      valueFormatter={(v) => `$${v}K`}
    />
  );
}
