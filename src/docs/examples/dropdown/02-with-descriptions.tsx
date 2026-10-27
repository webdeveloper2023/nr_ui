import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from "nr-ui-kit";
import { Copy, Pencil, Share2, Trash2 } from "lucide-react";

export default function DropdownWithDescriptions() {
  return (
    <div className="flex justify-center">
      <Dropdown>
        <DropdownTrigger>
          <Button variant="secondary">Amallar</Button>
        </DropdownTrigger>
        <DropdownMenu aria-label="Hujjat amallari" className="w-72">
          <DropdownItem itemKey="edit" startContent={<Pencil size={16} />} description="Hujjatni tahrirlash">
            Tahrirlash
          </DropdownItem>
          <DropdownItem itemKey="copy" startContent={<Copy size={16} />} description="Nusxa yaratish">
            Nusxalash
          </DropdownItem>
          <DropdownItem itemKey="share" startContent={<Share2 size={16} />} description="Jamoa bilan ulashish" showDivider>
            Ulashish
          </DropdownItem>
          <DropdownItem itemKey="delete" color="danger" startContent={<Trash2 size={16} />} description="Butunlay o'chirish">
            O'chirish
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </div>
  );
}
