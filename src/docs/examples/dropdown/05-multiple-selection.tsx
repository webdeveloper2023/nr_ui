import { useState } from "react";
import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from "nr-ui-kit";
import { Columns3 } from "lucide-react";

const columns = ["Name", "Email", "Role", "Team", "Status", "Date"];

// closeOnSelect={false} — the menu stays open so you can pick several items.
export default function DropdownMultipleSelection() {
  const [visible, setVisible] = useState(new Set(["Name", "Email", "Status"]));

  return (
    <div className="flex flex-col items-center gap-3">
      <Dropdown closeOnSelect={false}>
        <DropdownTrigger>
          <Button variant="tertiary" startContent={<Columns3 size={16} />}>
            Columns ({visible.size})
          </Button>
        </DropdownTrigger>
        <DropdownMenu aria-label="Columns" selectionMode="multiple" selectedKeys={visible} onSelectionChange={setVisible}>
          {columns.map((c) => (
            <DropdownItem key={c} itemKey={c}>
              {c}
            </DropdownItem>
          ))}
        </DropdownMenu>
      </Dropdown>
      <p className="text-sm text-muted">{[...visible].join(", ") || "Nothing selected"}</p>
    </div>
  );
}
