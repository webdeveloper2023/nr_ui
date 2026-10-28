import { AmountInput } from "nr-ui-kit";

export default function AmountInputCurrencies() {
  return (
    <div className="grid max-w-2xl gap-6 sm:grid-cols-2">
      <AmountInput label="Sum" currency="UZS" defaultValue={350000} />
      <AmountInput label="Dollars" currency="USD" defaultValue={21.5} />
      <AmountInput label="Euros" currency="EUR" defaultValue={1001} />
      <AmountInput label="Rubles" currency="RUB" defaultValue={2022.05} />
    </div>
  );
}
