import { Grid } from "nr-ui-kit";

const Cell = ({ n }: { n: number }) => (
  <div className="flex h-20 items-center justify-center rounded-xl bg-accent-soft text-sm font-medium text-accent-soft-foreground">{n}</div>
);

// As many columns as fit, each at least 160px wide — no breakpoints needed.
export default function AutoFit() {
  return (
    <Grid minChildWidth={160} gap="sm" className="w-full">
      {Array.from({ length: 7 }, (_, i) => (
        <Cell key={i} n={i + 1} />
      ))}
    </Grid>
  );
}
