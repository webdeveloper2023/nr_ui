import { Button, Card, CardBody, CardFooter, CardHeader, CardMedia } from "nr-ui-kit";

// orientation="horizontal": the media fills the side, its width follows the size. On a phone it stacks again.
export default function CardHorizontalSizes() {
  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-4">
      {(["sm", "md", "lg"] as const).map((size, i) => (
        <Card key={size} size={size} orientation="horizontal" responsive>
          <CardMedia src={`https://picsum.photos/seed/nr-room-${i}/600/600`} alt="Apartment" />
          <div className="flex min-w-0 flex-1 flex-col">
            <CardHeader title={["Studio in Chilonzor", "Two rooms near the metro", "Family flat with a balcony"][i]} description={`Size ${size} · Tashkent`} />
            <CardBody className="text-muted">Furnished, freshly renovated, internet and parking included.</CardBody>
            <CardFooter className="mt-auto justify-between">
              <span className="font-medium text-foreground">${[320, 450, 610][i]} / month</span>
              <Button size={size === "lg" ? "md" : "sm"}>View</Button>
            </CardFooter>
          </div>
        </Card>
      ))}
    </div>
  );
}
