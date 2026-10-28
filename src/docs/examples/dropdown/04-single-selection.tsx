import { useState } from "react";
import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from "nr-ui-kit";
import { ChevronDown } from "lucide-react";

const options = [
  { key: "newest", label: "Newest" },
  { key: "oldest", label: "Oldest" },
  { key: "popular", label: "Popular" },
  { key: "price", label: "By price" },
];

export default function DropdownSingleSelection() {
  const [selected, setSelected] = useState(new Set(["newest"]));
  const label = options.find((o) => selected.has(o.key))?.label;

  return (
    <div className="flex justify-center">
      <Dropdown>
        <DropdownTrigger>
          <Button variant="outline" endContent={<ChevronDown size={16} />}>
            Sort: {label}
          </Button>
        </DropdownTrigger>
        <DropdownMenu aria-label="Sort" selectionMode="single" selectedKeys={selected} onSelectionChange={setSelected}>
          {options.map((o) => (
            <DropdownItem key={o.key} itemKey={o.key}>
              {o.label}
            </DropdownItem>
          ))}
        </DropdownMenu>
      </Dropdown>
    </div>
  );
}
