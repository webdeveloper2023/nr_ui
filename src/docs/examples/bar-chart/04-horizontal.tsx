import { BarChart } from "nr-ui-kit";

const data = [
  { city: "Tashkent", orders: 4820 },
  { city: "Samarkand", orders: 2140 },
  { city: "Namangan", orders: 1660 },
  { city: "Andijan", orders: 1490 },
  { city: "Bukhara", orders: 1210 },
  { city: "Fergana", orders: 980 },
];

// Long category names read best on horizontal bars.
export default function Horizontal() {
  return (
    <BarChart
      aria-label="Orders by city"
      data={data}
      xKey="city"
      layout="horizontal"
      series={[{ key: "orders", label: "Orders", color: "green" }]}
      showValues
      responsive
    />
  );
}
