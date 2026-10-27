import { Progress } from "nr-ui-kit";

export default function ProgressBasic() {
  return (
    <div className="mx-auto max-w-md">
      <Progress label="Yuklanmoqda" value={64} showValueLabel />
    </div>
  );
}
