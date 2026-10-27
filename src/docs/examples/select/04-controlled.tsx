import { useState } from "react";
import { Select } from "nr-ui-kit";

const plans = [
  { key: "free", label: "Free" },
  { key: "pro", label: "Pro" },
  { key: "team", label: "Team" },
  { key: "enterprise", label: "Enterprise" },
];

export default function SelectControlled() {
  const [plan, setPlan] = useState("pro");

  return (
    <div className="mx-auto flex w-full max-w-xs flex-col gap-2">
      <Select label="Tarif" items={plans} selectedKey={plan} onSelectionChange={setPlan} />
      <p className="text-sm text-muted">
        Tanlangan: <span className="font-medium text-foreground">{plan}</span>
      </p>
    </div>
  );
}
