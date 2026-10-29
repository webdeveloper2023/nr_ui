import { Table } from "nr-ui-kit";

const columns = [
  { key: "name", label: "Name" },
  { key: "role", label: "Role" },
  { key: "email", label: "Email" },
  { key: "city", label: "City" },
];

const rows = [
  { id: "1", name: "Ali Valiyev", role: "CEO", email: "ali@acme.uz", city: "Tashkent" },
  { id: "2", name: "Dilnoza Karimova", role: "CTO", email: "dilnoza@acme.uz", city: "Samarkand" },
  { id: "3", name: "Jasur Rahimov", role: "Designer", email: "jasur@acme.uz", city: "Bukhara" },
];

// Resize the window: on mobile cells stop wrapping and the table scrolls sideways; on desktop cells get roomier.
export default function TableResponsive() {
  return <Table aria-label="Team" columns={columns} rows={rows} keyField="id" responsive />;
}
