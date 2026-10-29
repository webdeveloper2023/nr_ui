import { useState } from "react";
import { Bell, Download, Plus } from "lucide-react";
import {
  Alert, Avatar, Badge, Button, Card, CardBody, CardFooter, CardHeader, Checkbox, Chip, Input, Progress,
  Rating, Select, StatCard, Switch, Tabs,
} from "nr-ui-kit";

// Every component takes skeleton={true}: it keeps its own layout and shape while the data loads.
// Put it on a parent (here the Card) and everything inside follows.
export default function SkeletonProp() {
  const [loading, setLoading] = useState(true);

  return (
    <div className="flex w-full flex-col gap-5">
      <Switch isSelected={loading} onChange={setLoading}>skeleton</Switch>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card skeleton={loading}>
          <CardHeader
            startContent={<Avatar name="Rafiqjon Nazirov" />}
            title="Rafiqjon Nazirov"
            description="Frontend developer · Tashkent"
            endContent={<Chip size="sm" color="success" dot>Online</Chip>}
          />
          <CardBody>
            <p className="text-muted">Builds the store admin and the docs site. Ships every Friday.</p>
            <Progress value={72} size="sm" label="Profile filled" showValueLabel />
          </CardBody>
          <CardFooter className="justify-between">
            <Rating value={4.5} size="sm" isReadOnly />
            <Button size="sm" startContent={<Plus size={14} />}>Follow</Button>
          </CardFooter>
        </Card>

        <div className="flex flex-col gap-4">
          <StatCard skeleton={loading} title="Revenue" value="$48,230" change={12.5} chartData={[22, 28, 25, 31, 36, 33, 40, 44]} />
          <Alert skeleton={loading} color="accent" variant="soft" title="Payout on Friday" description="$3,420 will reach your card in two days." />
        </div>

        <Card skeleton={loading}>
          <CardHeader title="Settings" description="Applied to the whole store" />
          <CardBody className="gap-4">
            <Tabs size="sm" tabs={[{ key: "a", title: "General" }, { key: "b", title: "Payments" }, { key: "c", title: "Team" }]} />
            <Input label="Store name" defaultValue="Acme Store" />
            <Select label="Currency" defaultSelectedKey="uzs" items={[{ key: "uzs", label: "UZS — so'm" }, { key: "usd", label: "USD — $" }]} />
            <div className="flex items-center justify-between">
              <Checkbox defaultSelected>Email receipts</Checkbox>
              <Switch defaultSelected aria-label="Notifications" />
            </div>
          </CardBody>
        </Card>

        <div className="flex flex-wrap items-center gap-3">
          <Button skeleton={loading} startContent={<Download size={16} />}>Export</Button>
          <Button skeleton={loading} variant="tertiary">Cancel</Button>
          <Chip skeleton={loading} color="accent">New</Chip>
          <Badge skeleton={loading} content={3} color="danger">
            <Button isIconOnly variant="tertiary" aria-label="Notifications"><Bell size={16} /></Button>
          </Badge>
          <Avatar skeleton={loading} name="Dilnoza Karimova" />
        </div>
      </div>
    </div>
  );
}
