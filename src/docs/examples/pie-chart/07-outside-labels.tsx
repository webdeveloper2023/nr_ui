import { PieChart } from "nr-ui-kit";

const data = [
  { key: "rent", label: "Rent", value: 1400 },
  { key: "food", label: "Groceries", value: 620 },
  { key: "transport", label: "Transport", value: 280 },
  { key: "fun", label: "Leisure", value: 240 },
  { key: "health", label: "Health", value: 160 },
  { key: "other", label: "Other", value: 90 },
];

// Names and shares sit outside with leader lines; labels on each side push apart so they never overlap.
export default function OutsideLabels() {
  return <PieChart aria-label="Monthly budget by category" variant="donut" data={data} labels="outside" showLegend={false} />;
}
