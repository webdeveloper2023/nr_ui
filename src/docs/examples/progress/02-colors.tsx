import { Progress } from "nr-ui-kit";

const colors = ["default", "accent", "success", "warning", "danger"] as const;

export default function ProgressColors() {
  return (
    <div className="mx-auto flex max-w-md flex-col gap-5">
      {colors.map((color, i) => (
        <Progress key={color} color={color} label={color} value={30 + i * 15} showValueLabel />
      ))}
    </div>
  );
}
