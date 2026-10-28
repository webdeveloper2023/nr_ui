import { Select } from "nr-ui-kit";
import { Eye, PenLine, Shield, User } from "lucide-react";

const roles = [
  { key: "admin", label: "Admin", description: "Full access", startContent: <Shield size={16} /> },
  { key: "editor", label: "Editor", description: "Edit content", startContent: <PenLine size={16} /> },
  { key: "viewer", label: "Viewer", description: "View only", startContent: <Eye size={16} /> },
];

export default function SelectWithIconsAndDescriptions() {
  return (
    <div className="mx-auto w-full max-w-xs">
      <Select label="Role" items={roles} defaultSelectedKey="editor" startContent={<User size={16} />} />
    </div>
  );
}
