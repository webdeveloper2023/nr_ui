import { CircularProgress } from "nr-ui-kit";

const sizes = ["xs", "sm", "md", "lg", "xl"] as const;

export default function CircularProgressSizes() {
  return (
    <div className="flex flex-wrap items-center gap-6">
      {sizes.map((size) => (
        <CircularProgress key={size} size={size} value={68} showValueLabel aria-label={`Progress ${size}`} />
      ))}
    </div>
  );
}
