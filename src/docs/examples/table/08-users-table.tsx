import { useMemo, useState } from "react";
import { Plus, Search } from "lucide-react";
import { Avatar, Button, Chip, Input, Pagination, Table, type TableColumn } from "nr-ui-kit";

type Member = { id: string; name: string; email: string; role: string; status: "active" | "invited" | "inactive" };

const members: Member[] = [
  { id: "1", name: "Rafiqjon Nazirov", email: "rafiqjon@acme.uz", role: "Owner", status: "active" },
  { id: "2", name: "Dilnoza Karimova", email: "dilnoza@acme.uz", role: "Admin", status: "active" },
  { id: "3", name: "Jasur Rahimov", email: "jasur@acme.uz", role: "Editor", status: "invited" },
  { id: "4", name: "Madina Usmonova", email: "madina@acme.uz", role: "Viewer", status: "active" },
  { id: "5", name: "Bekzod Tursunov", email: "bekzod@acme.uz", role: "Editor", status: "inactive" },
  { id: "6", name: "Nigora Aliyeva", email: "nigora@acme.uz", role: "Viewer", status: "active" },
  { id: "7", name: "Sardor Qodirov", email: "sardor@acme.uz", role: "Admin", status: "invited" },
  { id: "8", name: "Zarina Ergasheva", email: "zarina@acme.uz", role: "Editor", status: "active" },
];

const statusMap = {
  active: { color: "success", label: "Active" },
  invited: { color: "accent", label: "Invited" },
  inactive: { color: "default", label: "Inactive" },
} as const;

const columns: TableColumn<Member>[] = [
  {
    key: "name",
    label: "Member",
    sortable: true,
    render: (_v, m) => (
      <div className="flex items-center gap-3">
        <Avatar size="sm" name={m.name} src={`https://i.pravatar.cc/150?u=member${m.id}`} />
        <div>
          <p className="font-medium">{m.name}</p>
          <p className="text-xs text-muted">{m.email}</p>
        </div>
      </div>
    ),
  },
  { key: "role", label: "Role", sortable: true },
  {
    key: "status",
    label: "Status",
    render: (_v, m) => (
      <Chip size="sm" color={statusMap[m.status].color} dot>
        {statusMap[m.status].label}
      </Chip>
    ),
  },
];

const PAGE_SIZE = 5;

export default function UsersTable() {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const filtered = useMemo(
    () => members.filter((m) => `${m.name} ${m.email}`.toLowerCase().includes(query.toLowerCase())),
    [query]
  );
  const pages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const visible = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <Table
      aria-label="Team members"
      columns={columns}
      rows={visible}
      keyField="id"
      selectionMode="multiple"
      selectedKeys={selected}
      onSelectionChange={setSelected}
      emptyContent="No one found"
      topContent={
        <div className="flex items-center justify-between gap-3">
          <Input
            className="max-w-xs"
            placeholder="Name or email..."
            startContent={<Search size={16} />}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(1);
            }}
          />
          <Button startContent={<Plus size={16} />}>Invite</Button>
        </div>
      }
      bottomContent={
        <div className="flex items-center justify-between px-1 text-sm text-muted">
          <span>{selected.size > 0 ? `${selected.size} selected` : `${filtered.length} members total`}</span>
          <Pagination total={pages} page={page} onChange={setPage} size="sm" />
        </div>
      }
    />
  );
}
