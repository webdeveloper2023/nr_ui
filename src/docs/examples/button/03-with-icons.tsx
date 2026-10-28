import { Button } from "nr-ui-kit";
import { Mail, Plus, Search, Trash2 } from "lucide-react";

export default function ButtonWithIcons() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      <Button startContent={<Search size={16} />}>Search</Button>
      <Button variant="secondary" startContent={<Plus size={16} />}>Add member</Button>
      <Button variant="tertiary" startContent={<Mail size={16} />}>Email</Button>
      <Button variant="danger" startContent={<Trash2 size={16} />}>Delete</Button>
    </div>
  );
}
