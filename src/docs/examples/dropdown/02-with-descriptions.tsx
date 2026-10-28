import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from "nr-ui-kit";
import { Copy, Pencil, Share2, Trash2 } from "lucide-react";

export default function DropdownWithDescriptions() {
  return (
    <div className="flex justify-center">
      <Dropdown>
        <DropdownTrigger>
          <Button variant="secondary">Actions</Button>
        </DropdownTrigger>
        <DropdownMenu aria-label="Document actions" className="w-72">
          <DropdownItem itemKey="edit" startContent={<Pencil size={16} />} description="Edit the document">
            Edit
          </DropdownItem>
          <DropdownItem itemKey="copy" startContent={<Copy size={16} />} description="Create a copy">
            Duplicate
          </DropdownItem>
          <DropdownItem itemKey="share" startContent={<Share2 size={16} />} description="Share with your team" showDivider>
            Share
          </DropdownItem>
          <DropdownItem itemKey="delete" color="danger" startContent={<Trash2 size={16} />} description="Delete permanently">
            Delete
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </div>
  );
}
