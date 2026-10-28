import { Copy, Pencil, Share, Trash2 } from "lucide-react";
import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from "nr-ui-kit";

function Menu({ material }: { material: "frosted" | "liquid" }) {
  return (
    <Dropdown>
      <DropdownTrigger>
        <Button variant="glass" material={material} className="capitalize">{material}</Button>
      </DropdownTrigger>
      <DropdownMenu aria-label="Actions" material={material}>
        <DropdownItem itemKey="edit" startContent={<Pencil size={16} />} shortcut="⌘E">Edit</DropdownItem>
        <DropdownItem itemKey="copy" startContent={<Copy size={16} />} shortcut="⌘D">Duplicate</DropdownItem>
        <DropdownItem itemKey="share" startContent={<Share size={16} />}>Share</DropdownItem>
        <DropdownItem itemKey="delete" color="danger" startContent={<Trash2 size={16} />}>Delete</DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
}

export default function DropdownLiquidGlass() {
  return (
    <div className="relative h-80 overflow-hidden rounded-3xl p-8">
      <div aria-hidden className="absolute inset-0 text-foreground opacity-[0.07] [background-image:repeating-linear-gradient(135deg,currentColor_0_1px,transparent_1px_12px)]" />
      <div aria-hidden className="absolute -left-10 -top-12 size-56 rounded-full bg-blue opacity-80 blur-2xl" />
      <div aria-hidden className="absolute -right-6 top-4 size-60 rounded-full bg-pink opacity-70 blur-2xl" />
      <div aria-hidden className="absolute -bottom-16 left-1/3 size-56 rounded-full bg-orange opacity-60 blur-2xl" />
      <div aria-hidden className="absolute bottom-6 right-1/4 size-32 rounded-full bg-mint opacity-70 blur-xl" />
      <div className="relative flex flex-wrap justify-center gap-4">
        <Menu material="frosted" />
        <Menu material="liquid" />
      </div>
    </div>
  );
}
