import { BarChart } from "nr-ui-kit";

const data = Array.from({ length: 24 }, (_, h) => ({
  hour: `${String(h).padStart(2, "0")}:00`,
  calls: Math.round(30 + Math.max(0, Math.sin(((h - 6) / 24) * Math.PI * 2)) * 220 + (h % 3) * 12),
}));

// Resize the window: on a phone the chart is shorter and labels thin out so they never collide.
export default function BarResponsive() {
  return <BarChart aria-label="Support calls per hour" data={data} xKey="hour" series={[{ key: "calls", label: "Calls", color: "orange" }]} responsive />;
}
