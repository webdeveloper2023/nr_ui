import { useState } from "react";
import { Label } from "nr-ui-kit";

// Use Label on its own for any control — same markers, tooltip, description and end slot as the fields.
export default function Standalone() {
  const [limit, setLimit] = useState(40);
  return (
    <div className="flex w-full max-w-md flex-col gap-3 rounded-2xl bg-surface p-4 shadow-surface">
      <Label
        htmlFor="daily-limit"
        description="Orders above this amount need a second approval."
        tooltip="Applies to every member of the team."
        endContent={<span className="font-semibold tabular-nums text-foreground">${limit}K</span>}
        isOptional
      >
        Daily limit
      </Label>
      <input
        id="daily-limit"
        type="range"
        min={5}
        max={100}
        step={5}
        value={limit}
        onChange={(e) => setLimit(Number(e.target.value))}
        className="w-full accent-[var(--color-accent)]"
      />
    </div>
  );
}
