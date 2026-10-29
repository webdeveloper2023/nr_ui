import { useState } from "react";
import { Button, Form, Input, Select } from "nr-ui-kit";

// Flip a whole form between viewing and editing with one prop.
export default function ReadOnly() {
  const [editing, setEditing] = useState(false);
  return (
    <Form isReadOnly={!editing} labelPlacement="inside" variant="secondary" className="max-w-md" onSubmit={(e) => { e.preventDefault(); setEditing(false); }}>
      <Input label="Legal name" defaultValue="Nur Trade LLC" />
      <Input label="Tax ID" defaultValue="305 112 948" />
      <Select label="Currency" defaultSelectedKey="uzs" items={[{ key: "uzs", label: "UZS" }, { key: "usd", label: "USD" }]} />
      {editing ? (
        <Button type="submit" className="self-start">Save</Button>
      ) : (
        <Button variant="secondary" className="self-start" onClick={() => setEditing(true)}>
          Edit
        </Button>
      )}
    </Form>
  );
}
