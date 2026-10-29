import { AreaChart } from "nr-ui-kit";

const start = new Date(2026, 0, 1);
const data = Array.from({ length: 180 }, (_, i) => ({
  date: new Date(start.getFullYear(), start.getMonth(), start.getDate() + i),
  messages: Math.round(14000 + i * 55 + Math.sin(i / 3.5) * 2400 + Math.sin(i / 17) * 3100),
}));

export default function AreaRangeSelector() {
  return (
    <AreaChart
      aria-label="Messages sent per day"
      data={data}
      xKey="date"
      series={[{ key: "messages", label: "Messages", color: "purple" }]}
      showRangeSelector
      defaultRange={[120, 179]}
    />
  );
}
