import { Card, CardHeader, Table } from "nr-ui-kit";

const columns = [
  { key: "invoice", label: "Hisob-faktura" },
  { key: "date", label: "Sana" },
  { key: "amount", label: "Summa", align: "end" as const },
];

const rows = [
  { id: "1", invoice: "INV-1024", date: "12 okt 2026", amount: "$1 250.00" },
  { id: "2", invoice: "INV-1025", date: "18 okt 2026", amount: "$840.00" },
  { id: "3", invoice: "INV-1026", date: "24 okt 2026", amount: "$2 110.00" },
];

// secondary — surface (karta) ichida ishlatish uchun: o'z foni va soyasi yo'q
export default function TableSecondary() {
  return (
    <Card className="mx-auto w-full max-w-xl">
      <CardHeader title="So'nggi to'lovlar" description="Oxirgi 30 kun" />
      <div className="px-2 pb-2">
        <Table aria-label="To'lovlar" variant="secondary" columns={columns} rows={rows} keyField="id" />
      </div>
    </Card>
  );
}
