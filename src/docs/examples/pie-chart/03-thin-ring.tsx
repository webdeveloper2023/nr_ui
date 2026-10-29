import { PieChart } from "nr-ui-kit";

const data = [
  { key: "done", label: "Done", value: 64, color: "green" },
  { key: "progress", label: "In progress", value: 23, color: "blue" },
  { key: "blocked", label: "Blocked", value: 13, color: "pink" },
];

export default function ThinRing() {
  return (
    <PieChart
      aria-label="Tasks by status"
      variant="donut"
      thickness={0.16}
      size={200}
      data={data}
      centerValue="100"
      centerLabel="tasks"
    />
  );
}
