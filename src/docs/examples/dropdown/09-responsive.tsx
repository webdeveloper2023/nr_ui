import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from "nr-ui-kit";
import { Copy, Pencil, Trash2 } from "lucide-react";

// Resize the window: on mobile and tablet the items are 44px touch targets and shortcuts hide on mobile.
export default function DropdownResponsive() {
  return (
    <div className="flex justify-center">
      <Dropdown responsive>
        <DropdownTrigger>
          <Button variant="secondary" responsive>
            Edit
          </Button>
        </DropdownTrigger>
        <DropdownMenu aria-label="Edit actions">
          <DropdownItem itemKey="rename" startContent={<Pencil size={16} />} shortcut="⌘R">
            Rename
          </DropdownItem>
          <DropdownItem itemKey="duplicate" startContent={<Copy size={16} />} shortcut="⌘D">
            Duplicate
          </DropdownItem>
          <DropdownItem itemKey="delete" color="danger" startContent={<Trash2 size={16} />} shortcut="⌫">
            Delete
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </div>
  );
}
