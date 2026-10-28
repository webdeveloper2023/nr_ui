import { useState } from "react";
import { Input } from "nr-ui-kit";

export default function InputControlled() {
  const [name, setName] = useState("Rafiqjon");

  return (
    <div className="mx-auto flex w-full max-w-xs flex-col gap-2">
      <Input label="Name" value={name} onValueChange={setName} isClearable />
      <p className="text-sm text-muted">
        Value: <span className="font-medium text-foreground">{name || "—"}</span>
      </p>
    </div>
  );
}
