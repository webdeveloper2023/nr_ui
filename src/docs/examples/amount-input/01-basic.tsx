import { AmountInput } from "nr-ui-kit";

export default function AmountInputBasic() {
  return (
    <div className="max-w-sm">
      <AmountInput label="Payment amount" placeholder="0" defaultValue={1250000} />
    </div>
  );
}
