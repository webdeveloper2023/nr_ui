import { Grid } from "nr-ui-kit";

const Cell = ({ n }: { n: number }) => (
  <div className="flex h-20 items-center justify-center rounded-xl bg-accent-soft text-sm font-medium text-accent-soft-foreground">{n}</div>
);

// cols={4} + responsive: 1 column on mobile, 2 on tablet, 4 on laptop and desktop.
export default function CollapsingColumns() {
  return (
    <Grid cols={4} responsive className="w-full">
      {Array.from({ length: 8 }, (_, i) => (
        <Cell key={i} n={i + 1} />
      ))}
    </Grid>
  );
}
