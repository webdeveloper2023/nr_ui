import { amountToWords, formatAmount, numberToWords } from "nr-ui-kit";

// The same helpers work without the field — e.g. for printed invoices and payment orders
export default function AmountUtilities() {
  const total = 4750300;
  return (
    <div className="max-w-xl rounded-3xl bg-surface p-6 shadow-surface">
      <p className="text-xs font-medium uppercase tracking-wide text-muted">Payment order</p>
      <p className="mt-2 text-3xl font-semibold tabular-nums text-foreground">{formatAmount(total, { locale: "uz" })} so'm</p>
      <dl className="mt-4 grid gap-2 text-sm">
        <div>
          <dt className="text-muted">Amount in words (uz)</dt>
          <dd className="text-foreground">{amountToWords(total, { locale: "uz" })}</dd>
        </div>
        <div>
          <dt className="text-muted">Сумма прописью (ru)</dt>
          <dd className="text-foreground">{amountToWords(total, { locale: "ru" })}</dd>
        </div>
        <div>
          <dt className="text-muted">numberToWords(21, "ru")</dt>
          <dd className="text-foreground">{numberToWords(21, "ru")}</dd>
        </div>
      </dl>
    </div>
  );
}
