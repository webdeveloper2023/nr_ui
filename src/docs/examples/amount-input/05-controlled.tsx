import { useState } from "react";
import { AmountInput, type AmountValueInfo } from "nr-ui-kit";

export default function AmountInputControlled() {
  const [value, setValue] = useState<number | null>(99.9);
  const [info, setInfo] = useState<AmountValueInfo | null>(null);

  return (
    <div className="grid max-w-sm gap-4">
      <AmountInput
        label="Invoice total"
        currency="USD"
        showWords={false}
        value={value}
        onValueChange={(next, details) => {
          setValue(next);
          setInfo(details);
        }}
      />
      <div className="rounded-2xl bg-default p-4 font-mono text-xs leading-6 text-muted">
        <div>value: {String(value)}</div>
        <div>formatted: {info?.formatted ?? "—"}</div>
        <div>words: {info?.words ?? "—"}</div>
      </div>
    </div>
  );
}
