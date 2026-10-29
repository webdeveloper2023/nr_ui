import { useState } from "react";
import { PieChart, Tabs } from "nr-ui-kit";

const data = [
  { key: "mobile", label: "Mobile", value: 5820 },
  { key: "desktop", label: "Desktop", value: 3140 },
  { key: "tablet", label: "Tablet", value: 1260 },
];

// Five sizes: xs 96, sm 160, md 240, lg 320, xl 400 px. The center number, captions and legend scale with them.
export default function PieSizes() {
  const [variant, setVariant] = useState<"pie" | "donut" | "semi" | "polar">("donut");

  return (
    <div className="flex w-full flex-col gap-6">
      <Tabs
        size="sm"
        selectedKey={variant}
        onSelectionChange={(key) => setVariant(key as typeof variant)}
        tabs={["pie", "donut", "semi", "polar"].map((key) => ({ key, title: key }))}
      />
      <div className="flex flex-wrap items-end justify-center gap-x-8 gap-y-6">
        {(["xs", "sm", "md"] as const).map((size) => (
          <div key={size} className="flex flex-col items-center gap-2">
            <PieChart aria-label={`Visits by device, ${size}`} size={size} variant={variant} data={data} showLegend={false} />
            <span className="text-xs font-medium text-muted">{size}</span>
          </div>
        ))}
      </div>
      <div className="flex flex-wrap items-end justify-center gap-x-8 gap-y-6">
        {(["lg", "xl"] as const).map((size) => (
          <div key={size} className="flex flex-col items-center gap-2">
            <PieChart aria-label={`Visits by device, ${size}`} size={size} variant={variant} data={data} legendPosition="bottom" />
            <span className="text-xs font-medium text-muted">{size}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
