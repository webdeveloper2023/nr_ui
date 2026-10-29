import { PieChart } from "nr-ui-kit";

const data = [
  { key: "north", label: "North", value: 84 },
  { key: "south", label: "South", value: 61 },
  { key: "east", label: "East", value: 72 },
  { key: "west", label: "West", value: 47 },
];

// One ring per item; the arc shows the value against `maxValue` (the largest value by default).
export default function Radial() {
  return (
    <PieChart
      aria-label="Sales plan done by region, percent"
      variant="radial"
      data={data}
      maxValue={100}
      valueFormatter={(v) => `${v}%`}
      centerLabel="of plan"
      centerValue="66%"
      size={260}
    />
  );
}
