import { Table } from "nr-ui-kit";

const columns = [
  { key: "city", label: "Shahar", sortable: true },
  { key: "region", label: "Viloyat", sortable: true },
  { key: "population", label: "Aholi (ming)", sortable: true, align: "end" as const },
];

const rows = [
  { id: "1", city: "Toshkent", region: "Toshkent sh.", population: 3040 },
  { id: "2", city: "Samarqand", region: "Samarqand", population: 551 },
  { id: "3", city: "Namangan", region: "Namangan", population: 680 },
  { id: "4", city: "Andijon", region: "Andijon", population: 456 },
  { id: "5", city: "Buxoro", region: "Buxoro", population: 285 },
];

// sortDescriptor berilmasa, jadval o'zi saralaydi. Sarlavhani bosing.
export default function TableSorting() {
  return <Table aria-label="Shaharlar" columns={columns} rows={rows} keyField="id" />;
}
