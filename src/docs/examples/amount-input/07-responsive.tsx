import { AmountInput } from "nr-ui-kit";

export default function AmountInputResponsive() {
  return (
    <div className="mx-auto flex w-full max-w-sm flex-col gap-4">
      {/* Touch-sized field and preset buttons on mobile and tablet */}
      <AmountInput label="Amount" presets={[50000, 100000, 500000]} responsive />
      {/* Mobile only */}
      <AmountInput label="Tip" currency="USD" responsive={["m"]} />
      <p className="text-xs text-muted">Resize the window (or open on a phone) to see the difference.</p>
    </div>
  );
}
