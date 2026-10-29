import { AreaChart } from "nr-ui-kit";

const data = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep"].map((month, i) => ({
  month,
  organic: Math.round(3200 + i * 260 + Math.sin(i) * 300),
  ads: Math.round(1800 + i * 120 + Math.cos(i / 1.5) * 260),
  referral: Math.round(900 + i * 90 + Math.sin(i / 2) * 140),
}));

// Each band sits on the one below; the tooltip shows every source and the total.
export default function Stacked() {
  return (
    <AreaChart
      aria-label="Visitors by source, stacked"
      data={data}
      xKey="month"
      isStacked
      series={[
        { key: "organic", label: "Organic" },
        { key: "ads", label: "Ads" },
        { key: "referral", label: "Referral" },
      ]}
      tooltipFooter={(row) => `Total ${Number(row.organic) + Number(row.ads) + Number(row.referral)}`}
    />
  );
}
