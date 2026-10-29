import { PieChart } from "nr-ui-kit";

const data = [
  { key: "photos", label: "Photos", value: 48.2 },
  { key: "videos", label: "Videos", value: 31.5 },
  { key: "documents", label: "Documents", value: 12.8 },
  { key: "music", label: "Music", value: 6.1 },
  { key: "other", label: "Other", value: 3.4 },
];

// The center shows the total, or the slice under the pointer.
export default function Donut() {
  return (
    <PieChart
      aria-label="Storage used by type, GB"
      variant="donut"
      data={data}
      centerLabel="GB used"
      valueFormatter={(v) => `${v.toFixed(1)}`}
      showPercent={false}
    />
  );
}
