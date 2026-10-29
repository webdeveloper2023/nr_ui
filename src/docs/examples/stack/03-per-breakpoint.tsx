import { Stack } from "nr-ui-kit";

const Box = ({ children }: { children: string }) => (
  <div className="flex h-14 flex-1 items-center justify-center rounded-xl bg-accent-soft text-sm font-medium text-accent-soft-foreground">{children}</div>
);

// Column on mobile, row from tablet up; the gap grows from sm to lg.
export default function PerBreakpoint() {
  return (
    <Stack direction={{ m: "column", t: "row" }} gap={{ m: "sm", l: "lg" }} className="w-full">
      <Box>One</Box>
      <Box>Two</Box>
      <Box>Three</Box>
    </Stack>
  );
}
