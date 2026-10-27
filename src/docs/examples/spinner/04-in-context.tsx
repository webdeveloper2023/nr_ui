import { useState } from "react";
import { Button, Spinner } from "nr-ui-kit";

export default function SpinnerInContext() {
  const [loading, setLoading] = useState(false);

  const run = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 2000);
  };

  return (
    <div className="mx-auto flex max-w-sm flex-col gap-4">
      <div className="flex items-center gap-3 rounded-2xl bg-surface p-4 shadow-surface">
        <Spinner size="sm" color="current" className="text-muted" />
        <span className="text-sm text-muted">Ma'lumotlar sinxronlanmoqda…</span>
      </div>
      <Button isLoading={loading} onClick={run}>
        {loading ? "Saqlanmoqda" : "Saqlash"}
      </Button>
    </div>
  );
}
