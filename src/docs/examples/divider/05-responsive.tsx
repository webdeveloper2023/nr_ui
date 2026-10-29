import { Divider, Stack } from "nr-ui-kit";

// Resize the window: on mobile the row stacks and the vertical dividers turn horizontal.
export default function DividerResponsive() {
  return (
    <Stack direction="row" gap="md" align="center" responsive className="w-full max-w-md text-sm">
      <span>Profile</span>
      <Divider orientation="vertical" responsive className="min-h-5" />
      <span>Security</span>
      <Divider orientation="vertical" responsive className="min-h-5" />
      <span>Billing</span>
    </Stack>
  );
}
