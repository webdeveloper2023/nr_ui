import { PieChart } from "nr-ui-kit";

const data = [
  { key: "paid", label: "Paid", value: 7240, color: "green" },
  { key: "pending", label: "Pending", value: 2310, color: "amber" },
  { key: "overdue", label: "Overdue", value: 860, color: "pink" },
];

// A half ring: compact, reads like a gauge, total under the arc.
export default function SemiCircle() {
  return (
    <PieChart
      aria-label="Invoices by status, USD"
      variant="semi"
      data={data}
      thickness={0.3}
      centerLabel="invoiced"
      valueFormatter={(v) => `$${(v / 1000).toFixed(1)}K`}
    />
  );
}
