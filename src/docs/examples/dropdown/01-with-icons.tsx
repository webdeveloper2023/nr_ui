import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, useToast } from "nr-ui-kit";
import { FilePlus, FolderOpen, Save, Trash2 } from "lucide-react";

export default function DropdownWithIcons() {
  const { addToast } = useToast();

  return (
    <div className="flex justify-center">
      <Dropdown>
        <DropdownTrigger>
          <Button variant="secondary">Actions</Button>
        </DropdownTrigger>
        <DropdownMenu aria-label="File actions" onAction={(key) => addToast({ title: `Selected: ${key}` })}>
          <DropdownItem itemKey="new" startContent={<FilePlus size={16} />}>
            New file
          </DropdownItem>
          <DropdownItem itemKey="open" startContent={<FolderOpen size={16} />}>
            Open
          </DropdownItem>
          <DropdownItem itemKey="save" startContent={<Save size={16} />}>
            Save
          </DropdownItem>
          <DropdownItem itemKey="delete" color="danger" startContent={<Trash2 size={16} />}>
            Delete
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </div>
  );
}
