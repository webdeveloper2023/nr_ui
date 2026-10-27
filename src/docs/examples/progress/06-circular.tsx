import { CircularProgress } from "nr-ui-kit";

export default function ProgressCircular() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-10">
      <CircularProgress value={25} size="md" showValueLabel />
      <CircularProgress value={62} size="lg" color="success" showValueLabel />
      <CircularProgress value={88} size="xl" color="warning" showValueLabel label="Xotira" />
      <CircularProgress isIndeterminate size="lg" color="default" label="Kutilmoqda" />
    </div>
  );
}
