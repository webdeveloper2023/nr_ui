import { BarChart } from "nr-ui-kit";

const data = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, i) => ({
  day,
  new: [32, 41, 38, 45, 52, 28, 24][i],
  returning: [58, 61, 66, 70, 74, 49, 44][i],
  reactivated: [8, 11, 9, 14, 12, 7, 6][i],
}));

export default function Stacked() {
  return (
    <BarChart
      aria-label="Customers per day by type, stacked"
      data={data}
      xKey="day"
      isStacked
      showValues
      series={[
        { key: "returning", label: "Returning" },
        { key: "new", label: "New" },
        { key: "reactivated", label: "Reactivated" },
      ]}
    />
  );
}
