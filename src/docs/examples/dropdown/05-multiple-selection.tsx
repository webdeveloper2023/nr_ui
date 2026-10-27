import { useState } from "react";
import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from "nr-ui-kit";
import { Columns3 } from "lucide-react";

const columns = ["Ism", "Email", "Lavozim", "Jamoa", "Holat", "Sana"];

// closeOnSelect={false} — bir nechta element tanlash uchun menyu ochiq qoladi.
export default function DropdownMultipleSelection() {
  const [visible, setVisible] = useState(new Set(["Ism", "Email", "Holat"]));

  return (
    <div className="flex flex-col items-center gap-3">
      <Dropdown closeOnSelect={false}>
        <DropdownTrigger>
          <Button variant="tertiary" startContent={<Columns3 size={16} />}>
            Ustunlar ({visible.size})
          </Button>
        </DropdownTrigger>
        <DropdownMenu aria-label="Ustunlar" selectionMode="multiple" selectedKeys={visible} onSelectionChange={setVisible}>
          {columns.map((c) => (
            <DropdownItem key={c} itemKey={c}>
              {c}
            </DropdownItem>
          ))}
        </DropdownMenu>
      </Dropdown>
      <p className="text-sm text-muted">{[...visible].join(", ") || "Hech narsa tanlanmagan"}</p>
    </div>
  );
}
