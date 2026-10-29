import { LineChart } from "nr-ui-kit";

const data = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, i) => ({
  day,
  web: [4200, 4800, 4500, 5300, 6100, 3900, 3500][i],
  mobile: [3100, 3400, 3900, 3700, 4400, 4800, 5200][i],
  desktop: [2600, 2900, 2800, 3300, 3600, 4100, 4300][i],
}));

// Press a legend pill to hide a series — the axis rescales smoothly to what is left.
export default function MultipleSeries() {
  return (
    <LineChart
      aria-label="Daily active users by platform"
      data={data}
      xKey="day"
      series={[
        { key: "web", label: "Web" },
        { key: "mobile", label: "Mobile app" },
        { key: "desktop", label: "Desktop app" },
      ]}
    />
  );
}
