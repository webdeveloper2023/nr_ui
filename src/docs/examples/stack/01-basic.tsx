import { Button, Stack } from "nr-ui-kit";

export default function StackBasic() {
  return (
    <Stack gap="sm" className="w-full max-w-xs">
      <Button variant="tertiary" fullWidth>Profile</Button>
      <Button variant="tertiary" fullWidth>Security</Button>
      <Button variant="tertiary" fullWidth>Billing</Button>
    </Stack>
  );
}
