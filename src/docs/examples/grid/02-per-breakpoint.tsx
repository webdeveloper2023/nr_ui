import { Grid } from "nr-ui-kit";

const Cell = ({ n }: { n: number }) => (
  <div className="flex h-16 items-center justify-center rounded-xl bg-surface-secondary text-sm font-medium">{n}</div>
);

// Exact columns per breakpoint; a missing one takes the nearest smaller value.
export default function PerBreakpoint() {
  return (
    <Grid cols={{ m: 2, t: 3, l: 4, d: 6 }} gap="sm" className="w-full">
      {Array.from({ length: 12 }, (_, i) => (
        <Cell key={i} n={i + 1} />
      ))}
    </Grid>
  );
}
