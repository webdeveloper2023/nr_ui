import { PieChart } from "nr-ui-kit";

const data = [
  { key: "mon", label: "Mon", value: 42 },
  { key: "tue", label: "Tue", value: 58 },
  { key: "wed", label: "Wed", value: 51 },
  { key: "thu", label: "Thu", value: 74 },
  { key: "fri", label: "Fri", value: 88 },
  { key: "sat", label: "Sat", value: 36 },
  { key: "sun", label: "Sun", value: 29 },
];

// Every slice gets the same angle; its length (area) shows the value.
export default function PolarArea() {
  return <PieChart aria-label="Orders per weekday" variant="polar" data={data} labels="inside" showPercent={false} />;
}
