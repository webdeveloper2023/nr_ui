import { useState } from "react";
import { Button, Checkbox, Form, Input, Select, Textarea, type FormValues } from "nr-ui-kit";

// onValues hands you every named field on submit — no state per field needed.
export default function FormBasic() {
  const [values, setValues] = useState<FormValues | null>(null);
  return (
    <div className="grid w-full gap-6 md:grid-cols-2">
      <Form onValues={setValues} className="max-w-md">
        <Input name="name" label="Name" isRequired />
        <Input name="email" type="email" label="Email" isRequired />
        <Select
          name="plan"
          label="Plan"
          defaultSelectedKey="pro"
          items={[
            { key: "free", label: "Free" },
            { key: "pro", label: "Pro" },
            { key: "team", label: "Team" },
          ]}
        />
        <Textarea name="note" label="Note" minRows={2} />
        <Checkbox name="terms" value="yes">I agree to the terms</Checkbox>
        <Button type="submit">Create account</Button>
      </Form>
      <pre className="min-h-24 overflow-auto rounded-2xl bg-surface-secondary p-4 text-xs">{values ? JSON.stringify(values, null, 2) : "Submit to see the values"}</pre>
    </div>
  );
}
