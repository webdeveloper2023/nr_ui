import { useState } from "react";
import { Table } from "nr-ui-kit";

const columns = [
  { key: "product", label: "Product" },
  { key: "category", label: "Category" },
  { key: "price", label: "Price", align: "end" as const },
];

const rows = [
  { id: "lap", product: "Laptop Pro 14", category: "Laptop", price: "$1,999" },
  { id: "pho", product: "Phone X", category: "Phone", price: "$999" },
  { id: "tab", product: "Tablet Air 11", category: "Tablet", price: "$599" },
  { id: "aw", product: "Smartwatch S", category: "Watch", price: "$399" },
];

export default function TableSelection() {
  const [selected, setSelected] = useState<Set<string>>(new Set(["iph"]));

  return (
    <div className="space-y-3">
      <Table
        aria-label="Products"
        columns={columns}
        rows={rows}
        keyField="id"
        selectionMode="multiple"
        selectedKeys={selected}
        onSelectionChange={setSelected}
        disabledKeys={["aw"]}
      />
      <p className="text-sm text-muted">
        Selected: <span className="font-medium text-foreground">{selected.size}</span>
        {selected.size > 0 && ` (${[...selected].join(", ")})`}
      </p>
    </div>
  );
}
