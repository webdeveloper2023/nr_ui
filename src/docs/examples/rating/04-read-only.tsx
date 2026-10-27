import { Rating } from "nr-ui-kit";

export default function RatingReadOnly() {
  return (
    <div className="mx-auto flex w-full max-w-xs items-center justify-between rounded-3xl bg-surface p-4 shadow-surface">
      <div>
        <p className="text-sm font-medium text-foreground">Brunello Cucinelli</p>
        <p className="text-xs text-muted">1,204 ta sharh</p>
      </div>
      <Rating value={4.6} isReadOnly size="sm" showValue />
    </div>
  );
}
