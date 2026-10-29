import { BarChart } from "nr-ui-kit";

const data = [
  { month: "Jan", sales: 120 },
  { month: "Feb", sales: 162 },
  { month: "Mar", sales: 148 },
  { month: "Apr", sales: 196 },
  { month: "May", sales: 214 },
  { month: "Jun", sales: 188 },
  { month: "Jul", sales: 243 },
];

export default function BarChartBasic() {
  return <BarChart aria-label="Units sold per month" data={data} xKey="month" series={[{ key: "sales", label: "Units sold" }]} showValues />;
}
