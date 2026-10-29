import { BarChart } from "nr-ui-kit";

const data = [
  { month: "Jan", change: 12 },
  { month: "Feb", change: -8 },
  { month: "Mar", change: 5 },
  { month: "Apr", change: 18 },
  { month: "May", change: -14 },
  { month: "Jun", change: 9 },
];

// Bars grow up or down from zero; the rounded end always points away from the baseline.
export default function NegativeValues() {
  return (
    <BarChart
      aria-label="Monthly change in subscribers, percent"
      data={data}
      xKey="month"
      series={[{ key: "change", label: "Change", color: "cyan" }]}
      valueFormatter={(v) => `${v > 0 ? "+" : ""}${v}%`}
      showValues
      height={240}
    />
  );
}
