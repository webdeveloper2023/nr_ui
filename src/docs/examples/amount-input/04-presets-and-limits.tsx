import { AmountInput } from "nr-ui-kit";

export default function AmountInputPresetsAndLimits() {
  return (
    <div className="max-w-sm">
      <AmountInput
        label="Top up balance"
        description="From 1 000 to 5 000 000"
        min={1000}
        max={5000000}
        presets={[50000, 100000, 500000, 1000000]}
        isClearable
      />
    </div>
  );
}
