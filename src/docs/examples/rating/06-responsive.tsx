import { Rating } from "nr-ui-kit";

export default function RatingResponsive() {
  return (
    <div className="flex flex-col items-center gap-4">
      {/* Larger, spaced-out stars with a 44px tap area on mobile */}
      <Rating defaultValue={4} showValue responsive />
      {/* Mobile only */}
      <Rating defaultValue={3} responsive={["m"]} />
      <p className="text-xs text-muted">Resize the window (or open on a phone) to see the difference.</p>
    </div>
  );
}
