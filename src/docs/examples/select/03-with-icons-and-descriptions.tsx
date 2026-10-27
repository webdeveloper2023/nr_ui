import { Select } from "nr-ui-kit";
import { Eye, PenLine, Shield, User } from "lucide-react";

const roles = [
  { key: "admin", label: "Admin", description: "To'liq ruxsat", startContent: <Shield size={16} /> },
  { key: "editor", label: "Muharrir", description: "Kontentni tahrirlash", startContent: <PenLine size={16} /> },
  { key: "viewer", label: "Kuzatuvchi", description: "Faqat ko'rish", startContent: <Eye size={16} /> },
];

export default function SelectWithIconsAndDescriptions() {
  return (
    <div className="mx-auto w-full max-w-xs">
      <Select label="Rol" items={roles} defaultSelectedKey="editor" startContent={<User size={16} />} />
    </div>
  );
}
