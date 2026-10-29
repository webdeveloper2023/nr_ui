import { PieChart } from "nr-ui-kit";

const data = [
  { key: "rent", label: "Rent", value: 1200 },
  { key: "food", label: "Food", value: 640 },
  { key: "transport", label: "Transport", value: 210 },
  { key: "fun", label: "Leisure", value: 340 },
  { key: "savings", label: "Savings", value: 500 },
];

// legendPosition: auto (beside when there is room), right or bottom
export default function LegendPosition() {
  const money = (v: number) => `$${v.toLocaleString("en-US")}`;
  return (
    <div className="grid w-full gap-8 lg:grid-cols-2">
      <PieChart aria-label="Monthly spending" variant="donut" size="sm" data={data} legendPosition="right" valueFormatter={money} />
      <PieChart aria-label="Monthly spending" variant="pie" size="sm" data={data} legendPosition="bottom" labels="inside" valueFormatter={money} />
    </div>
  );
}
