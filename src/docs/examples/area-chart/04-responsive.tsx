import { AreaChart, Card, CardBody, CardHeader, Grid } from "nr-ui-kit";

const make = (seed: number) =>
  Array.from({ length: 12 }, (_, i) => ({ m: `${i + 1}`, v: Math.round(400 + Math.sin(i / 1.7 + seed) * 120 + i * 18) }));

const cards = [
  { title: "Sign-ups", color: "blue", data: make(0) },
  { title: "Trials", color: "green", data: make(1.2) },
  { title: "Upgrades", color: "orange", data: make(2.4) },
] as const;

// Grid + charts with `responsive`: one column and shorter charts on a phone.
export default function AreaResponsive() {
  return (
    <Grid cols={3} responsive className="w-full">
      {cards.map((c) => (
        <Card key={c.title} responsive>
          <CardHeader title={c.title} description="Last 12 months" />
          <CardBody className="pb-4">
            <AreaChart
              aria-label={`${c.title}, last 12 months`}
              data={c.data}
              xKey="m"
              series={[{ key: "v", label: c.title, color: c.color }]}
              height={140}
              responsive
            />
          </CardBody>
        </Card>
      ))}
    </Grid>
  );
}
