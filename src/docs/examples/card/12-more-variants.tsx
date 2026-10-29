import { Card, CardBody, CardHeader } from "nr-ui-kit";

const variants = [
  { variant: "flat", title: "Flat", text: "White surface without the gradient" },
  { variant: "bordered", title: "Bordered", text: "Thin border instead of a shadow" },
  { variant: "elevated", title: "Elevated", text: "Deep shadow — floats above the page" },
  { variant: "accent", title: "Accent", text: "Tinted — for a tip or a promo" },
  { variant: "dashed", title: "Dashed", text: "Placeholder or empty slot" },
  { variant: "glass", title: "Glass", text: "Frosted, shows what is behind" },
] as const;

export default function CardMoreVariants() {
  return (
    <div className="grid w-full gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {variants.map((v) => (
        <Card key={v.variant} variant={v.variant} size="sm">
          <CardHeader title={v.title} description={v.text} />
          <CardBody />
        </Card>
      ))}
    </div>
  );
}
