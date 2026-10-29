import { LineChart } from "nr-ui-kit";

// 120 days of data; deterministic so the page renders the same every time
const start = new Date(2026, 4, 1);
const data = Array.from({ length: 120 }, (_, i) => ({
  date: new Date(start.getFullYear(), start.getMonth(), start.getDate() + i),
  joined: Math.round(820 + i * 6 + Math.sin(i / 3) * 140 + Math.sin(i / 11) * 210),
  left: Math.round(310 + i * 1.5 + Math.cos(i / 4) * 70 + Math.sin(i / 9) * 90),
}));

// Drag the window (or its edges) under the chart to zoom into a period.
export default function RangeSelector() {
  return (
    <LineChart
      aria-label="Members joined and left per day"
      data={data}
      xKey="date"
      series={[
        { key: "joined", label: "Joined" },
        { key: "left", label: "Left", color: "pink" },
      ]}
      showRangeSelector
      defaultRange={[60, 119]}
    />
  );
}
