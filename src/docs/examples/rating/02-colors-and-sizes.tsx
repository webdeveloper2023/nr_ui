import { Rating } from "nr-ui-kit";

export default function RatingColorsAndSizes() {
  return (
    <div className="flex flex-col items-center gap-4">
      <Rating size="xs" defaultValue={3} />
      <Rating size="sm" defaultValue={3} />
      <Rating size="md" defaultValue={4} color="accent" />
      <Rating size="lg" defaultValue={5} color="danger" />
      <Rating defaultValue={2} color="default" />
    </div>
  );
}
