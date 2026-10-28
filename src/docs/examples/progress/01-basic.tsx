import { Progress } from "nr-ui-kit";

export default function ProgressBasic() {
  return (
    <div className="mx-auto max-w-md">
      <Progress label="Loading" value={64} showValueLabel />
    </div>
  );
}
