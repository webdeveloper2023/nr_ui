import { Avatar, Button, Stack } from "nr-ui-kit";

export default function Alignment() {
  return (
    <Stack direction="row" align="center" justify="between" className="w-full max-w-md rounded-2xl bg-surface p-3 shadow-surface">
      <Stack direction="row" align="center" gap="sm">
        <Avatar name="Aziza Karimova" size="sm" />
        <div className="text-sm">
          <div className="font-medium">Aziza Karimova</div>
          <div className="text-muted">Designer</div>
        </div>
      </Stack>
      <Button size="sm" variant="secondary">Follow</Button>
    </Stack>
  );
}
