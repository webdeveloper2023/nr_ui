import { Table } from "nr-ui-kit";

const columns = [
  { key: "city", label: "City", sortable: true },
  { key: "region", label: "Region", sortable: true },
  { key: "population", label: "Population (K)", sortable: true, align: "end" as const },
];

const rows = [
  { id: "1", city: "Tashkent", region: "Tashkent city", population: 3040 },
  { id: "2", city: "Samarkand", region: "Samarkand", population: 551 },
  { id: "3", city: "Namangan", region: "Namangan", population: 680 },
  { id: "4", city: "Andijan", region: "Andijan", population: 456 },
  { id: "5", city: "Bukhara", region: "Bukhara", population: 285 },
];

// Without sortDescriptor the table sorts itself. Click a column header.
export default function TableSorting() {
  return <Table aria-label="Cities" columns={columns} rows={rows} keyField="id" />;
}
