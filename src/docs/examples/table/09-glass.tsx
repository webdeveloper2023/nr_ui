import { Chip, Table } from "nr-ui-kit";

const rows = [
  { id: "1", name: "Laptop Pro 14", status: "Yetkazildi", total: "$1,999" },
  { id: "2", name: "Phone X Pro", status: "Yo'lda", total: "$1,099" },
  { id: "3", name: "Wireless earbuds", status: "Yetkazildi", total: "$249" },
];

export default function TableGlass() {
  return (
    <div className="relative w-full overflow-hidden rounded-3xl p-6 sm:p-8">
      <div aria-hidden className="absolute -left-10 -top-12 size-56 rounded-full bg-blue opacity-70 blur-3xl" />
      <div aria-hidden className="absolute -right-8 top-6 size-60 rounded-full bg-pink opacity-60 blur-3xl" />
      <div aria-hidden className="absolute -bottom-16 left-1/3 size-56 rounded-full bg-mint opacity-60 blur-3xl" />
      <div className="relative">
        <Table
          aria-label="Buyurtmalar"
          isBlurred
          keyField="id"
          rows={rows}
          columns={[
            { key: "name", label: "Mahsulot" },
            {
              key: "status",
              label: "Holat",
              render: (v) => <Chip size="sm" color={v === "Yetkazildi" ? "success" : "warning"}>{String(v)}</Chip>,
            },
            { key: "total", label: "Summa", align: "end" },
          ]}
        />
      </div>
    </div>
  );
}
