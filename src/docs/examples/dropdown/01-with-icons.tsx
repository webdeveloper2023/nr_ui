import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, useToast } from "nr-ui-kit";
import { FilePlus, FolderOpen, Save, Trash2 } from "lucide-react";

export default function DropdownWithIcons() {
  const { addToast } = useToast();

  return (
    <div className="flex justify-center">
      <Dropdown>
        <DropdownTrigger>
          <Button variant="secondary">Amallar</Button>
        </DropdownTrigger>
        <DropdownMenu aria-label="Fayl amallari" onAction={(key) => addToast({ title: `Tanlandi: ${key}` })}>
          <DropdownItem itemKey="new" startContent={<FilePlus size={16} />}>
            Yangi fayl
          </DropdownItem>
          <DropdownItem itemKey="open" startContent={<FolderOpen size={16} />}>
            Ochish
          </DropdownItem>
          <DropdownItem itemKey="save" startContent={<Save size={16} />}>
            Saqlash
          </DropdownItem>
          <DropdownItem itemKey="delete" color="danger" startContent={<Trash2 size={16} />}>
            O'chirish
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </div>
  );
}
