import { AreaChart } from "nr-ui-kit";

const data = Array.from({ length: 14 }, (_, i) => ({
  day: `Oct ${i + 1}`,
  downloads: Math.round(5200 + Math.sin(i / 1.8) * 900 + i * 120),
}));

export default function AreaChartBasic() {
  return (
    <AreaChart
      aria-label="Downloads per day"
      data={data}
      xKey="day"
      series={[{ key: "downloads", label: "Downloads" }]}
      showDots="end"
    />
  );
}
