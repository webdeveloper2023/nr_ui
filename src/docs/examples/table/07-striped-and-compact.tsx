import { Table } from "nr-ui-kit";

const columns = [
  { key: "time", label: "Time" },
  { key: "event", label: "Event" },
  { key: "user", label: "User" },
];

const rows = [
  { id: "1", time: "09:12", event: "Signed in", user: "ali" },
  { id: "2", time: "09:30", event: "Uploaded a file", user: "dilnoza" },
  { id: "3", time: "10:05", event: "Changed password", user: "jasur" },
  { id: "4", time: "10:47", event: "Created a report", user: "madina" },
  { id: "5", time: "11:20", event: "Signed out", user: "ali" },
];

export default function TableStripedCompact() {
  return <Table aria-label="Audit log" columns={columns} rows={rows} keyField="id" isStriped isCompact />;
}
