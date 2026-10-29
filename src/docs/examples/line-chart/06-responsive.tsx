import { LineChart } from "nr-ui-kit";

const data = Array.from({ length: 30 }, (_, i) => ({
  day: `${i + 1}`,
  visits: Math.round(2400 + Math.sin(i / 2.4) * 600 + i * 40),
}));

// Resize the window: on a phone the chart is shorter, shows fewer ticks and a touch-sized legend.
export default function Responsive() {
  return (
    <LineChart
      aria-label="Visits per day this month"
      data={data}
      xKey="day"
      series={[{ key: "visits", label: "Visits", color: "cyan" }]}
      xFormatter={(day) => `Oct ${day}`}
      showRangeSelector
      responsive
    />
  );
}
