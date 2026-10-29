import { PieChart } from "nr-ui-kit";

// variant="ring": fills up to maxValue (100 by default); the center shows the share of the goal
const goals = [
  { key: "storage", label: "Storage", value: 72, color: "blue", note: "72 of 100 GB" },
  { key: "tasks", label: "Tasks done", value: 18, max: 24, color: "green", note: "18 of 24 tasks" },
  { key: "budget", label: "Budget spent", value: 4100, max: 5000, color: "orange", note: "$4,100 of $5,000" },
] as const;

export default function Ring() {
  return (
    <div className="grid w-full gap-6 sm:grid-cols-3">
      {goals.map((g) => (
        <div key={g.key} className="flex flex-col items-center gap-2">
          <PieChart
            aria-label={g.label}
            variant="ring"
            size="sm"
            maxValue={"max" in g ? g.max : undefined}
            data={[{ key: g.key, label: g.label, value: g.value, color: g.color }]}
            centerLabel={g.label}
            showLegend={false}
          />
          <span className="text-xs text-muted">{g.note}</span>
        </div>
      ))}
    </div>
  );
}
