import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from "nr-ui-kit";
import { Copy, Pencil, Share, Trash2 } from "lucide-react";

function Menu({ isBlurred }: { isBlurred: boolean }) {
  return (
    <Dropdown>
      <DropdownTrigger>
        <Button variant="secondary">{isBlurred ? "Glass menu" : "Solid menu"}</Button>
      </DropdownTrigger>
      <DropdownMenu aria-label="Actions" isBlurred={isBlurred}>
        <DropdownItem itemKey="edit" startContent={<Pencil size={16} />} shortcut="⌘E">Edit</DropdownItem>
        <DropdownItem itemKey="copy" startContent={<Copy size={16} />} shortcut="⌘D">Duplicate</DropdownItem>
        <DropdownItem itemKey="share" startContent={<Share size={16} />}>Share</DropdownItem>
        <DropdownItem itemKey="delete" color="danger" startContent={<Trash2 size={16} />}>Delete</DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
}

export default function DropdownGlassAndSolid() {
  return (
    <div className="relative h-72 overflow-hidden rounded-3xl p-8">
      <div className="absolute left-6 top-4 size-48 rounded-full bg-blue blur-2xl opacity-70" />
      <div className="absolute right-6 top-10 size-56 rounded-full bg-pink blur-2xl opacity-60" />
      <div className="absolute bottom-0 left-1/3 size-48 rounded-full bg-mint blur-2xl opacity-60" />
      <div className="relative flex flex-wrap justify-center gap-4">
        <Menu isBlurred />
        <Menu isBlurred={false} />
      </div>
    </div>
  );
}
