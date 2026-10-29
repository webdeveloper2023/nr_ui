import { LineChart } from "nr-ui-kit";

const data = [
  { month: "Jan", revenue: 18400 },
  { month: "Feb", revenue: 21900 },
  { month: "Mar", revenue: 20300 },
  { month: "Apr", revenue: 26800 },
  { month: "May", revenue: 31200 },
  { month: "Jun", revenue: 29400 },
  { month: "Jul", revenue: 35800 },
  { month: "Aug", revenue: 39100 },
];

export default function LineChartBasic() {
  return (
    <LineChart
      aria-label="Monthly revenue"
      data={data}
      xKey="month"
      series={[{ key: "revenue", label: "Revenue" }]}
      valueFormatter={(v) => `$${(v / 1000).toFixed(1)}K`}
      showDots="end"
    />
  );
}
