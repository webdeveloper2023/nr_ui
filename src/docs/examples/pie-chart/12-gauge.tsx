import { useState } from "react";
import { Button, PieChart } from "nr-ui-kit";

// variant="gauge": a half ring filled up to maxValue, with the scale ends below it. Several items stack along the arc.
export default function Gauge() {
  const [score, setScore] = useState(68);

  return (
    <div className="grid w-full items-end gap-8 md:grid-cols-2">
      <div className="flex flex-col items-center gap-3">
        <PieChart
          aria-label="Customer satisfaction"
          variant="gauge"
          size="md"
          data={[{ key: "score", label: "Satisfaction", value: score, color: score >= 70 ? "green" : "orange" }]}
          centerLabel="Satisfaction"
          showLegend={false}
        />
        <div className="flex gap-2">
          <Button size="sm" variant="tertiary" onClick={() => setScore((v) => Math.max(0, v - 8))}>−8</Button>
          <Button size="sm" variant="tertiary" onClick={() => setScore((v) => Math.min(100, v + 8))}>+8</Button>
        </div>
      </div>
      <PieChart
        aria-label="Monthly plan by channel"
        variant="gauge"
        size="md"
        maxValue={60000}
        valueFormatter={(v) => `$${Math.round(v / 1000)}k`}
        data={[
          { key: "online", label: "Online", value: 24800 },
          { key: "store", label: "In-store", value: 12600 },
          { key: "wholesale", label: "Wholesale", value: 6100 },
        ]}
        centerLabel="of the monthly plan"
        legendPosition="bottom"
      />
    </div>
  );
}
