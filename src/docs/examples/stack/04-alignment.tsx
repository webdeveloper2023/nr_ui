import { Avatar, Button, Stack } from "nr-ui-kit";

export default function Alignment() {
  return (
    <Stack direction="row" align="center" justify="between" className="w-full max-w-md rounded-2xl bg-surface p-3 shadow-surface">
      <Stack direction="row" align="center" gap="sm">
        <Avatar name="Rafiqjon Nazirov" size="sm" />
        <div className="text-sm">
          <div className="font-medium">Rafiqjon Nazirov</div>
          <div className="text-muted">Frontend developer</div>
        </div>
      </Stack>
      <Button size="sm" variant="secondary">Message</Button>
    </Stack>
  );
}
