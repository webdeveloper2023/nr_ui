import { Grid, PieChart } from "nr-ui-kit";

const data = [
  { key: "a", label: "Design", value: 34 },
  { key: "b", label: "Engineering", value: 41 },
  { key: "c", label: "Marketing", value: 15 },
  { key: "d", label: "Support", value: 10 },
];

const looks = [
  { title: "Sharp", cornerRadius: 0, gap: 0 },
  { title: "Soft (default)", cornerRadius: 6, gap: 2 },
  { title: "Rounded", cornerRadius: 12, gap: 4 },
  { title: "Pills", cornerRadius: 24, gap: 6 },
];

// cornerRadius rounds every slice corner; gap sets the space between slices.
export default function CornersAndGaps() {
  return (
    <Grid cols={4} responsive gap="lg" className="w-full">
      {looks.map((look) => (
        <div key={look.title} className="flex flex-col items-center gap-2">
          <PieChart
            aria-label={`Team budget, ${look.title}`}
            variant="donut"
            data={data}
            size={150}
            thickness={0.42}
            cornerRadius={look.cornerRadius}
            gap={look.gap}
            showLegend={false}
            centerLabel="%"
          />
          <span className="text-sm text-muted">{look.title}</span>
        </div>
      ))}
    </Grid>
  );
}
