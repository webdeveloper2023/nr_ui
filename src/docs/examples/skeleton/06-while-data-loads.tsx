import { useEffect, useState } from "react";
import { Button, Card, CardBody, CardHeader, PieChart, Table } from "nr-ui-kit";

type Order = { id: string; customer: string; amount: string; status: string };

const ORDERS: Order[] = [
  { id: "#3210", customer: "Rafiqjon Nazirov", amount: "$1,999", status: "Paid" },
  { id: "#3209", customer: "Dilnoza Karimova", amount: "$1,199", status: "Shipped" },
  { id: "#3208", customer: "Jasur Rahimov", amount: "$249", status: "Pending" },
];

// Tie skeleton to the request: true until the data arrives. A table without rows shows placeholder rows.
export default function WhileDataLoads() {
  const [orders, setOrders] = useState<Order[] | null>(null);
  const [request, setRequest] = useState(0);

  // A fake request: the data arrives after 1.6 s
  useEffect(() => {
    const timer = setTimeout(() => setOrders(ORDERS), 1600);
    return () => clearTimeout(timer);
  }, [request]);
  const load = () => {
    setOrders(null);
    setRequest((r) => r + 1);
  };
  const loading = orders === null;

  return (
    <div className="grid w-full gap-4 lg:grid-cols-3">
      <Card skeleton={loading} className="lg:col-span-2">
        <CardHeader title="Recent orders" description="Updated just now" endContent={<Button size="sm" variant="tertiary" onClick={load}>Reload</Button>} />
        <CardBody>
          <Table aria-label="Orders" keyField="id" rows={orders ?? []} variant="secondary" columns={[
            { key: "id", label: "ID" },
            { key: "customer", label: "Customer" },
            { key: "amount", label: "Amount", align: "end" },
            { key: "status", label: "Status" },
          ]} />
        </CardBody>
      </Card>
      <Card skeleton={loading}>
        <CardHeader title="Sales channels" description="Last 30 days" />
        <CardBody className="items-center pb-5">
          <PieChart aria-label="Sales channels" variant="donut" size="sm" legendPosition="bottom" data={[
            { key: "online", label: "Online", value: 31420 },
            { key: "store", label: "In-store", value: 12610 },
            { key: "wholesale", label: "Wholesale", value: 4200 },
          ]} />
        </CardBody>
      </Card>
    </div>
  );
}
