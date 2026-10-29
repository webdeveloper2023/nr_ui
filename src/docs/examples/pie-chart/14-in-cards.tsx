import { Card, CardBody, CardHeader, PieChart } from "nr-ui-kit";

// A 72px ring next to the numbers inside small cards
const kpis = [
  { key: "conversion", title: "Conversion", value: 3.8, max: 5, text: "Target 5%", format: (v: number) => `${v}%`, color: "blue" },
  { key: "retention", title: "Retention", value: 81, max: 100, text: "Users back after 30 days", format: (v: number) => `${v}%`, color: "green" },
  { key: "tickets", title: "Tickets closed", value: 146, max: 180, text: "This week", format: (v: number) => `${v}`, color: "purple" },
] as const;

export default function InCards() {
  return (
    <div className="grid w-full gap-3 sm:grid-cols-3">
      {kpis.map((k) => (
        <Card key={k.key} size="sm" variant="bordered">
          <CardHeader title={k.title} description={k.text} />
          <CardBody className="flex-row items-center justify-between pb-3">
            <p className="text-2xl font-semibold tabular-nums text-foreground">{k.format(k.value)}</p>
            <div className="w-[72px]">
              <PieChart
                aria-label={k.title}
                variant="ring"
                size={72}
                thickness={0.28}
                maxValue={k.max}
                data={[{ key: k.key, label: k.title, value: k.value, color: k.color }]}
                showLegend={false}
              />
            </div>
          </CardBody>
        </Card>
      ))}
    </div>
  );
}
