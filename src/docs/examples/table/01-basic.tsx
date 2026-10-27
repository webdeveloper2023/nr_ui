import { Table } from "nr-ui-kit";

const columns = [
  { key: "name", label: "Ism" },
  { key: "role", label: "Lavozim" },
  { key: "status", label: "Holat" },
  { key: "email", label: "Email" },
];

const rows = [
  { id: "1", name: "Ali Valiyev", role: "CEO", status: "Faol", email: "ali@acme.uz" },
  { id: "2", name: "Dilnoza Karimova", role: "CTO", status: "Faol", email: "dilnoza@acme.uz" },
  { id: "3", name: "Jasur Rahimov", role: "Dizayner", status: "Ta'tilda", email: "jasur@acme.uz" },
  { id: "4", name: "Madina Usmonova", role: "QA", status: "Faol", email: "madina@acme.uz" },
];

export default function TableBasic() {
  return <Table aria-label="Jamoa" columns={columns} rows={rows} keyField="id" />;
}
