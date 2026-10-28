import { useState } from "react";
import { Inbox, RotateCw } from "lucide-react";
import { Button, Table } from "nr-ui-kit";

const columns = [
  { key: "order", label: "Order" },
  { key: "customer", label: "Customer" },
  { key: "total", label: "Total", align: "end" as const },
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
          Refresh
        </Button>
      </div>
      <Table
        aria-label="Orders"
        columns={columns}
        rows={[]}
        keyField="order"
        isLoading={loading}
        loadingRows={4}
        emptyContent={
          <div className="flex flex-col items-center gap-2">
            <Inbox size={28} className="text-muted" />
            <p className="font-medium text-foreground">No orders yet</p>
            <p className="text-xs">New orders will show up here.</p>
          </div>
        }
      />
    </div>
  );
}
