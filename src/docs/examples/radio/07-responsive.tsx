import { Radio, RadioGroup } from "nr-ui-kit";

export default function RadioResponsive() {
  return (
    <div className="mx-auto flex w-full max-w-sm flex-col gap-4">
      {/* Horizontal on larger screens, stacked 44px rows on mobile */}
      <RadioGroup label="Delivery" orientation="horizontal" defaultValue="courier" responsive>
        <Radio value="courier">Courier</Radio>
        <Radio value="pickup">Pickup</Radio>
        <Radio value="post">Post</Radio>
      </RadioGroup>
      {/* Mobile and tablet only */}
      <RadioGroup label="Payment" defaultValue="card" responsive={["m", "t"]}>
        <Radio value="card">Card</Radio>
        <Radio value="cash">Cash</Radio>
      </RadioGroup>
      <p className="text-xs text-muted">Resize the window (or open on a phone) to see the difference.</p>
    </div>
  );
}
