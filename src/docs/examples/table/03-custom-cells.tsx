import { Eye, Pencil, Trash2 } from "lucide-react";
import { Avatar, Button, Chip, Table, Tooltip, type TableColumn } from "nr-ui-kit";

type User = { id: string; name: string; email: string; role: string; team: string; status: "active" | "paused" | "vacation" };

const users: User[] = [
  { id: "1", name: "Ali Valiyev", email: "ali@acme.uz", role: "CEO", team: "Management", status: "active" },
  { id: "2", name: "Dilnoza Karimova", email: "dilnoza@acme.uz", role: "Tech Lead", team: "Engineering", status: "paused" },
  { id: "3", name: "Jasur Rahimov", email: "jasur@acme.uz", role: "Designer", team: "Design", status: "vacation" },
];

const status = {
  active: { color: "success", label: "Active" },
  paused: { color: "danger", label: "Paused" },
  vacation: { color: "warning", label: "On leave" },
} as const;

const columns: TableColumn<User>[] = [
  {
    key: "name",
    label: "Name",
    render: (_v, u) => (
      <div className="flex items-center gap-3">
        <Avatar size="sm" src={`https://i.pravatar.cc/150?u=${u.id}`} name={u.name} />
        <div>
          <p className="font-medium">{u.name}</p>
          <p className="text-xs text-muted">{u.email}</p>
        </div>
      </div>
    ),
  },
  {
    key: "role",
    label: "Role",
    render: (_v, u) => (
      <div>
        <p>{u.role}</p>
        <p className="text-xs text-muted">{u.team}</p>
      </div>
    ),
  },
  {
    key: "status",
    label: "Status",
    render: (_v, u) => (
      <Chip size="sm" color={status[u.status].color} dot>
        {status[u.status].label}
      </Chip>
    ),
  },
  {
    key: "actions",
    label: "",
    align: "end",
    render: () => (
      <div className="flex justify-end gap-0.5">
        <Tooltip content="View"><Button isIconOnly size="sm" variant="ghost" aria-label="View"><Eye size={16} /></Button></Tooltip>
        <Tooltip content="Edit"><Button isIconOnly size="sm" variant="ghost" aria-label="Edit"><Pencil size={16} /></Button></Tooltip>
        <Tooltip content="Delete"><Button isIconOnly size="sm" variant="ghost" className="text-danger" aria-label="Delete"><Trash2 size={16} /></Button></Tooltip>
      </div>
    ),
  },
];

export default function TableCustomCells() {
  return <Table aria-label="Users" columns={columns} rows={users} keyField="id" />;
}
