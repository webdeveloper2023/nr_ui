import { Card, CardHeader, Table } from "nr-ui-kit";

const columns = [
  { key: "invoice", label: "Invoice" },
  { key: "date", label: "Date" },
  { key: "amount", label: "Amount", align: "end" as const },
];

const rows = [
  { id: "1", invoice: "INV-1024", date: "Oct 12, 2026", amount: "$1,250.00" },
  { id: "2", invoice: "INV-1025", date: "Oct 18, 2026", amount: "$840.00" },
  { id: "3", invoice: "INV-1026", date: "Oct 24, 2026", amount: "$2,110.00" },
];

// secondary — for use inside a surface (card): no background or shadow of its own
export default function TableSecondary() {
  return (
    <Card className="mx-auto w-full max-w-xl">
      <CardHeader title="Recent payments" description="Last 30 days" />
      <div className="px-2 pb-2">
        <Table aria-label="Payments" variant="secondary" columns={columns} rows={rows} keyField="id" />
      </div>
    </Card>
  );
}
