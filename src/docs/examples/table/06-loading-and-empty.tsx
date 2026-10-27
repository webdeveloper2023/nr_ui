import { useState } from "react";
import { Inbox, RotateCw } from "lucide-react";
import { Button, Table } from "nr-ui-kit";

const columns = [
  { key: "order", label: "Buyurtma" },
  { key: "customer", label: "Mijoz" },
  { key: "total", label: "Jami", align: "end" as const },
];

export default function TableLoadingEmpty() {
  const [loading, setLoading] = useState(false);

  const reload = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 1500);
  };

  return (
    <div className="space-y-3">
      <div className="flex justify-end">
        <Button size="sm" variant="tertiary" startContent={<RotateCw size={14} />} onClick={reload}>
          Yangilash
        </Button>
      </div>
      <Table
        aria-label="Buyurtmalar"
        columns={columns}
        rows={[]}
        keyField="order"
        isLoading={loading}
        loadingRows={4}
        emptyContent={
          <div className="flex flex-col items-center gap-2">
            <Inbox size={28} className="text-muted" />
            <p className="font-medium text-foreground">Buyurtmalar yo'q</p>
            <p className="text-xs">Yangi buyurtmalar shu yerda paydo bo'ladi.</p>
          </div>
        }
      />
    </div>
  );
}
