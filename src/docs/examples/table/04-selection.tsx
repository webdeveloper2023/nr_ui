import { useState } from "react";
import { Table } from "nr-ui-kit";

const columns = [
  { key: "product", label: "Mahsulot" },
  { key: "category", label: "Kategoriya" },
  { key: "price", label: "Narx", align: "end" as const },
];

const rows = [
  { id: "mbp", product: "Laptop Pro 14", category: "Noutbuk", price: "$1 999" },
  { id: "iph", product: "Phone X", category: "Telefon", price: "$999" },
  { id: "ipd", product: "Tablet Air 11", category: "Planshet", price: "$599" },
  { id: "aw", product: "Smartwatch S", category: "Soat", price: "$399" },
];

export default function TableSelection() {
  const [selected, setSelected] = useState<Set<string>>(new Set(["iph"]));

  return (
    <div className="space-y-3">
      <Table
        aria-label="Mahsulotlar"
        columns={columns}
        rows={rows}
        keyField="id"
        selectionMode="multiple"
        selectedKeys={selected}
        onSelectionChange={setSelected}
        disabledKeys={["aw"]}
      />
      <p className="text-sm text-muted">
        Tanlangan: <span className="font-medium text-foreground">{selected.size}</span> ta
        {selected.size > 0 && ` (${[...selected].join(", ")})`}
      </p>
    </div>
  );
}
