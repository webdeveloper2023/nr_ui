import { Button, Card, CardBody, CardFooter, CardHeader } from "nr-ui-kit";

// Four sizes: padding, title, text and the default corner radius grow together
const sizes = [
  { size: "sm", note: "Lists, sidebars and dense dashboards" },
  { size: "md", note: "The default for most screens" },
  { size: "lg", note: "Settings sections and forms" },
  { size: "xl", note: "Landing pages and hero blocks" },
] as const;

export default function CardSizes() {
  return (
    <div className="grid w-full items-start gap-4 md:grid-cols-2">
      {sizes.map(({ size, note }) => (
        <Card key={size} size={size}>
          <CardHeader title={`Size ${size}`} description={note} />
          <CardBody className="text-muted">Your order has been packed and will be handed to the courier today.</CardBody>
          <CardFooter>
            <Button size={size === "xl" ? "lg" : size === "sm" ? "xs" : "sm"} variant="tertiary">Details</Button>
            <Button size={size === "xl" ? "lg" : size === "sm" ? "xs" : "sm"}>Track</Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
