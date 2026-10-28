import { Card, CardHeader, CardBody } from "nr-ui-kit";

const variants = [
  { variant: "transparent", title: "Transparent", text: "No background — for nested cards" },
  { variant: "default", title: "Default", text: "White surface — for most cases" },
  { variant: "secondary", title: "Secondary", text: "Content that needs moderate emphasis" },
  { variant: "tertiary", title: "Tertiary", text: "Important or highlighted content" },
] as const;

export default function CardVariants() {
  return (
    <div className="mx-auto grid w-full max-w-md gap-3">
      {variants.map((v) => (
        <Card key={v.variant} variant={v.variant}>
          <CardHeader title={v.title} description={v.text} />
          <CardBody />
        </Card>
      ))}
    </div>
  );
}
