import { PieChart } from "nr-ui-kit";

const data = [
  { key: "card", label: "Card", value: 5240 },
  { key: "wallet", label: "Wallet", value: 3180 },
  { key: "transfer", label: "Bank transfer", value: 1460 },
  { key: "cash", label: "Cash on delivery", value: 820 },
];

// Rounded slices with the share inside. Hover (or tap) a slice to read it; the legend toggles slices.
export default function Pie() {
  return <PieChart aria-label="Payments by method" data={data} labels="inside" />;
}
