import { Progress } from "nr-ui-kit";

export default function ProgressSizes() {
  return (
    <div className="mx-auto flex max-w-md flex-col gap-5">
      <Progress size="xs" label="Extra small" value={40} />
      <Progress size="sm" label="Small" value={40} />
      <Progress size="md" label="Medium" value={55} />
      <Progress size="lg" label="Large" value={70} />
      <Progress size="lg" radius="sm" label="Radius: sm" value={85} />
    </div>
  );
}
