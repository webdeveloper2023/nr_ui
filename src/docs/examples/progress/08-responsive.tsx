import { CircularProgress, Progress } from "nr-ui-kit";

// Resize the window: thin bars thicken on mobile, bars, labels and rings grow on desktop.
export default function ProgressResponsive() {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-8">
      <Progress responsive size="xs" value={40} label="Syncing photos" showValueLabel />
      <Progress responsive size="md" value={72} color="success" label="Storage used" showValueLabel />
      <CircularProgress responsive size="xl" value={64} showValueLabel label="Weekly goal" />
    </div>
  );
}
