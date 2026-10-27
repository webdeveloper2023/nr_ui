import { Eye, Pencil, Trash2 } from "lucide-react";
import { Avatar, Button, Chip, Table, Tooltip, type TableColumn } from "nr-ui-kit";

type User = { id: string; name: string; email: string; role: string; team: string; status: "active" | "paused" | "vacation" };

const users: User[] = [
  { id: "1", name: "Ali Valiyev", email: "ali@acme.uz", role: "CEO", team: "Boshqaruv", status: "active" },
  { id: "2", name: "Dilnoza Karimova", email: "dilnoza@acme.uz", role: "Tech Lead", team: "Dasturlash", status: "paused" },
  { id: "3", name: "Jasur Rahimov", email: "jasur@acme.uz", role: "Dizayner", team: "Dizayn", status: "vacation" },
];

const status = {
  active: { color: "success", label: "Faol" },
  paused: { color: "danger", label: "To'xtatilgan" },
  vacation: { color: "warning", label: "Ta'tilda" },
} as const;

const columns: TableColumn<User>[] = [
  {
    key: "name",
    label: "Ism",
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
    label: "Lavozim",
    render: (_v, u) => (
      <div>
        <p>{u.role}</p>
        <p className="text-xs text-muted">{u.team}</p>
      </div>
    ),
  },
  {
    key: "status",
    label: "Holat",
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
        <Tooltip content="Ko'rish"><Button isIconOnly size="sm" variant="ghost" aria-label="Ko'rish"><Eye size={16} /></Button></Tooltip>
        <Tooltip content="Tahrirlash"><Button isIconOnly size="sm" variant="ghost" aria-label="Tahrirlash"><Pencil size={16} /></Button></Tooltip>
        <Tooltip content="O'chirish"><Button isIconOnly size="sm" variant="ghost" className="text-danger" aria-label="O'chirish"><Trash2 size={16} /></Button></Tooltip>
      </div>
    ),
  },
];

export default function TableCustomCells() {
  return <Table aria-label="Foydalanuvchilar" columns={columns} rows={users} keyField="id" />;
}
