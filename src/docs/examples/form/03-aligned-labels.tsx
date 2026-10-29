import { Button, Form, Input, Select } from "nr-ui-kit";

// Side labels share one width, so every field starts on the same line. On a phone they move on top.
export default function AlignedLabels() {
  return (
    <Form labelPlacement="outside-left" labelWidth={140} variant="secondary" responsive className="max-w-lg">
      <Input label="Display name" defaultValue="Rafiqjon Nazirov" />
      <Input label="Username" startContent={<span className="text-sm">@</span>} defaultValue="rafiqjon" />
      <Input label="Email address" type="email" isRequired />
      <Select
        label="Time zone"
        defaultSelectedKey="tas"
        items={[
          { key: "tas", label: "Tashkent (GMT+5)" },
          { key: "ist", label: "Istanbul (GMT+3)" },
        ]}
      />
      <div className="flex justify-end gap-2">
        <Button variant="tertiary">Cancel</Button>
        <Button type="submit">Save</Button>
      </div>
    </Form>
  );
}
