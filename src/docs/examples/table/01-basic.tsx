import { Table } from "nr-ui-kit";

const columns = [
  { key: "name", label: "Name" },
  { key: "role", label: "Role" },
  { key: "status", label: "Status" },
  { key: "email", label: "Email" },
];

const rows = [
  { id: "1", name: "Rafiqjon Nazirov", role: "CEO", status: "Active", email: "rafiqjon@acme.uz" },
  { id: "2", name: "Dilnoza Karimova", role: "CTO", status: "Active", email: "dilnoza@acme.uz" },
  { id: "3", name: "Jasur Rahimov", role: "Designer", status: "On leave", email: "jasur@acme.uz" },
  { id: "4", name: "Madina Usmonova", role: "QA", status: "Active", email: "madina@acme.uz" },
];

export default function TableBasic() {
  return <Table aria-label="Team" columns={columns} rows={rows} keyField="id" />;
}
