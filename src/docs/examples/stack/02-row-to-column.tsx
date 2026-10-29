import { Button, Input, Stack } from "nr-ui-kit";

// Below 768px the row becomes a column and every part is touch-sized.
export default function RowToColumn() {
  return (
    <Stack direction="row" align="end" gap="sm" responsive className="w-full">
      <Input label="Email" placeholder="you@example.com" responsive />
      <Button responsive>Subscribe</Button>
    </Stack>
  );
}
