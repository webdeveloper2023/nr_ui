import { Card, CardBody, CardHeader, Chip, LineChart } from "nr-ui-kit";

const data = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].map((month, i) => ({
  month,
  thisYear: Math.round(120 + i * 14 + Math.sin(i / 1.6) * 18),
  lastYear: Math.round(104 + i * 9 + Math.cos(i / 2) * 12),
}));

export default function InACard() {
  return (
    <Card className="w-full">
      <CardHeader title="Orders" description="Thousands per month" endContent={<Chip color="success" size="sm">+18.4%</Chip>} />
      <CardBody className="pb-4">
        <LineChart
          aria-label="Orders per month, this year and last year"
          data={data}
          xKey="month"
          series={[
            { key: "thisYear", label: "2026" },
            { key: "lastYear", label: "2025", color: "indigo" },
          ]}
          valueFormatter={(v) => `${v}K`}
          height={240}
          responsive
        />
      </CardBody>
    </Card>
  );
}
