import { useState } from "react";
import { Button, Form, Input, PhoneInput, Select, Switch, Textarea } from "nr-ui-kit";

const placements = ["outside", "outside-left", "inside", "floating", "floating-inside"] as const;
const sizes = ["sm", "md", "lg"] as const;

// One prop on the Form changes every field inside; a field's own prop still wins.
export default function ControlEveryField() {
  const [placement, setPlacement] = useState<(typeof placements)[number]>("floating");
  const [size, setSize] = useState<(typeof sizes)[number]>("md");
  const [disabled, setDisabled] = useState(false);
  return (
    <div className="flex w-full max-w-lg flex-col gap-5">
      <div className="flex flex-wrap items-center gap-2">
        {placements.map((p) => (
          <Button key={p} size="sm" variant={p === placement ? "primary" : "tertiary"} onClick={() => setPlacement(p)}>
            {p}
          </Button>
        ))}
        <span className="mx-1 h-5 w-px bg-separator" />
        {sizes.map((s) => (
          <Button key={s} size="sm" variant={s === size ? "secondary" : "ghost"} onClick={() => setSize(s)}>
            {s}
          </Button>
        ))}
        <Switch size="sm" isSelected={disabled} onValueChange={setDisabled}>
          Disabled
        </Switch>
      </div>
      <Form labelPlacement={placement} size={size} isDisabled={disabled} labelWidth={110}>
        <Input label="First name" isRequired />
        <Input label="Last name" />
        <PhoneInput label="Phone" country="UZ" />
        <Select label="City" items={[{ key: "tas", label: "Tashkent" }, { key: "sam", label: "Samarkand" }]} />
        <Textarea label="Address" minRows={2} />
      </Form>
    </div>
  );
}
