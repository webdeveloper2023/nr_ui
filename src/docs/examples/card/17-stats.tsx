import { ArrowDownRight, ArrowUpRight, Package, Users, Wallet } from "lucide-react";
import { Card, CardBody, CardHeader, Progress } from "nr-ui-kit";

const stats = [
  { icon: Wallet, label: "Revenue", value: "$48,230", change: "+12.4%", up: true, goal: 78 },
  { icon: Users, label: "Customers", value: "1,284", change: "+4.1%", up: true, goal: 64 },
  { icon: Package, label: "Returns", value: "37", change: "-2.3%", up: false, goal: 22 },
];

// Small cards with an icon in startContent and the change on the right
export default function CardStats() {
  return (
    <div className="grid w-full gap-3 sm:grid-cols-3">
      {stats.map(({ icon: Icon, label, value, change, up, goal }) => (
        <Card key={label} size="sm" variant="bordered">
          <CardHeader
            startContent={
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent-soft text-accent-soft-foreground">
                <Icon size={15} />
              </span>
            }
            title={label}
            endContent={
              <span className={`inline-flex items-center gap-0.5 text-xs font-medium ${up ? "text-success" : "text-danger"}`}>
                {up ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />} {change}
              </span>
            }
          />
          <CardBody className="pb-3">
            <p className="text-2xl font-semibold tabular-nums text-foreground">{value}</p>
            <Progress value={goal} size="xs" aria-label={`${label} goal`} />
            <p className="text-xs text-muted">{goal}% of the monthly goal</p>
          </CardBody>
        </Card>
      ))}
    </div>
  );
}
