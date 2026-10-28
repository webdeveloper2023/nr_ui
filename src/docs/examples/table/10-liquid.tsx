import { useState } from "react";
import { Chip, Table, Tabs } from "nr-ui-kit";

const rows = [
  { id: "1", order: "#3201", customer: "Ali Valiyev", total: "$129", status: "Delivered" },
  { id: "2", order: "#3202", customer: "Dilnoza Karimova", total: "$54", status: "In transit" },
  { id: "3", order: "#3203", customer: "Jasur Rahimov", total: "$310", status: "Delivered" },
];

export default function TableLiquidGlass() {
  const [material, setMaterial] = useState<"frosted" | "liquid">("liquid");

  return (
    <div className="relative w-full overflow-hidden rounded-3xl p-6 sm:p-10">
      <div aria-hidden className="absolute inset-0 text-foreground opacity-[0.07] [background-image:repeating-linear-gradient(135deg,currentColor_0_1px,transparent_1px_12px)]" />
      <div aria-hidden className="absolute -left-10 -top-12 size-56 rounded-full bg-blue opacity-80 blur-2xl" />
      <div aria-hidden className="absolute -right-6 top-4 size-60 rounded-full bg-pink opacity-70 blur-2xl" />
      <div aria-hidden className="absolute -bottom-16 left-1/3 size-56 rounded-full bg-orange opacity-60 blur-2xl" />
      <div aria-hidden className="absolute bottom-6 right-1/4 size-32 rounded-full bg-mint opacity-70 blur-xl" />
      <div className="relative mb-4 flex justify-center">
        <Tabs
          tabs={[{ key: "frosted", title: "Frosted" }, { key: "liquid", title: "Liquid" }]}
          selectedKey={material}
          onSelectionChange={(k) => setMaterial(k as "frosted" | "liquid")}
          isBlurred
          material={material}
        />
      </div>
      <div className="relative">
        <Table
          aria-label="Orders"
          keyField="id"
          rows={rows}
          isBlurred
          material={material}
          columns={[
            { key: "order", label: "Order" },
            { key: "customer", label: "Customer" },
            { key: "total", label: "Total" },
            {
              key: "status",
              label: "Status",
              render: (v) => <Chip size="sm" color={v === "Delivered" ? "success" : "warning"}>{String(v)}</Chip>,
            },
          ]}
        />
      </div>
    </div>
  );
}
