import { Table } from "nr-ui-kit";

const columns = [
  { key: "time", label: "Vaqt" },
  { key: "event", label: "Hodisa" },
  { key: "user", label: "Foydalanuvchi" },
];

const rows = [
  { id: "1", time: "09:12", event: "Tizimga kirdi", user: "ali" },
  { id: "2", time: "09:30", event: "Fayl yukladi", user: "dilnoza" },
  { id: "3", time: "10:05", event: "Parolni o'zgartirdi", user: "jasur" },
  { id: "4", time: "10:47", event: "Hisobot yaratdi", user: "madina" },
  { id: "5", time: "11:20", event: "Tizimdan chiqdi", user: "ali" },
];

export default function TableStripedCompact() {
  return <Table aria-label="Audit log" columns={columns} rows={rows} keyField="id" isStriped isCompact />;
}
