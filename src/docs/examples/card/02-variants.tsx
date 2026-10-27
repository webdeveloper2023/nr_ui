import { Card, CardHeader, CardBody } from "nr-ui-kit";

const variants = [
  { variant: "transparent", title: "Transparent", text: "Fonsiz — ichma-ich kartalar uchun" },
  { variant: "default", title: "Default", text: "Oq surface — ko'p holatlar uchun" },
  { variant: "secondary", title: "Secondary", text: "O'rtacha e'tibor talab qiladigan kontent" },
  { variant: "tertiary", title: "Tertiary", text: "Muhim yoki ajratilgan kontent" },
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
