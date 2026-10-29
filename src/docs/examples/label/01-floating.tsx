import { Form, Input, Select, Textarea } from "nr-ui-kit";

// The label rests inside like a placeholder; on focus or with a value it moves onto the border,
// and the border opens around it. Works on any background.
export default function Floating() {
  return (
    <Form labelPlacement="floating" className="w-full">
      <div className="grid gap-4 sm:grid-cols-3">
        <Select
          label="Country"
          defaultSelectedKey="uz"
          items={[
            { key: "uz", label: "Uzbekistan" },
            { key: "kz", label: "Kazakhstan" },
          ]}
        />
        <Input label="Region" defaultValue="Tashkent city" />
        <Input label="District" defaultValue="Olmazor district" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Input label="Full name" defaultValue="Rafiqjon Nazirov" />
        <Input label="Home address" isRequired />
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <Input label="Diploma" defaultValue="PhD" />
        <Input label="Degree" defaultValue="Associate professor" />
        <Input label="Academic title" />
      </div>
      <Textarea label="About the employee" minRows={2} />
    </Form>
  );
}
