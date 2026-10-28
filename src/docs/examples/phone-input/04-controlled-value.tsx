import { useState } from "react";
import { Chip, PhoneInput, type PhoneValueInfo } from "nr-ui-kit";

export default function PhoneInputControlled() {
  const [value, setValue] = useState("+998901234567");
  const [info, setInfo] = useState<PhoneValueInfo | null>(null);
  const isComplete = info ? info.isComplete : true; // boshlang'ich qiymat to'liq

  return (
    <div className="max-w-sm space-y-4">
      <PhoneInput
        label="Telefon"
        country="UZ"
        value={value}
        onValueChange={(v, i) => {
          setValue(v);
          setInfo(i);
        }}
        isClearable
      />
      <div className="space-y-1.5 rounded-xl bg-surface-secondary p-3 font-mono text-xs text-muted">
        <p>value (E.164): <span className="text-foreground">{value || "—"}</span></p>
        <p>formatted: <span className="text-foreground">{info?.formatted || "—"}</span></p>
        <p className="flex items-center gap-2">
          isComplete:
          <Chip size="sm" variant="soft" color={isComplete ? "success" : "warning"}>
            {String(isComplete)}
          </Chip>
        </p>
      </div>
    </div>
  );
}
