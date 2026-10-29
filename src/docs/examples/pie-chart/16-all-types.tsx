import { PieChart } from "nr-ui-kit";

const data = [
  { key: "a", label: "North", value: 42 },
  { key: "b", label: "South", value: 27 },
  { key: "c", label: "East", value: 18 },
  { key: "d", label: "West", value: 13 },
];

// Every variant at size="sm" with the same data
const types = [
  { variant: "pie", note: "Parts of a whole" },
  { variant: "donut", note: "Total in the middle" },
  { variant: "semi", note: "Half ring" },
  { variant: "polar", note: "Radius shows the value" },
  { variant: "radial", note: "One ring per item" },
  { variant: "ring", note: "Filled up to a goal" },
  { variant: "gauge", note: "Half ring meter" },
] as const;

export default function AllTypes() {
  return (
    <div className="grid w-full grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4">
      {types.map(({ variant, note }) => (
        <div key={variant} className="flex flex-col items-center gap-2 text-center">
          <PieChart aria-label={`Sales by region, ${variant}`} variant={variant} size="sm" data={data} showLegend={false} maxValue={variant === "radial" ? 50 : variant === "ring" || variant === "gauge" ? 140 : undefined} />
          <div>
            <p className="text-sm font-medium text-foreground">{variant}</p>
            <p className="text-xs text-muted">{note}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
