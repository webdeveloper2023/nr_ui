import { Progress } from "nr-ui-kit";

export default function ProgressIndeterminateStriped() {
  return (
    <div className="mx-auto flex max-w-md flex-col gap-5">
      <Progress label="Server bilan bog'lanilmoqda" isIndeterminate />
      <Progress label="Eksport qilinmoqda" value={58} isStriped showValueLabel size="lg" color="success" />
    </div>
  );
}
