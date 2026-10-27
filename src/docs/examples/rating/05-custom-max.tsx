import { Rating } from "nr-ui-kit";

export default function RatingCustomMax() {
  return (
    <div className="flex flex-col items-center gap-4">
      <Rating max={10} defaultValue={7} size="sm" showValue />
      <Rating max={3} defaultValue={2} size="lg" isDisabled />
    </div>
  );
}
