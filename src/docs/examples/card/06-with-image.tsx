import { Button, Card, CardFooter } from "nr-ui-kit";

export default function CardWithImage() {
  return (
    <Card isFooterBlurred className="mx-auto h-[280px] w-full max-w-sm">
      <img
        src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&h=600&fit=crop"
        alt="Sneaker"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <CardFooter>
        <div className="flex-1">
          <p className="text-sm font-medium text-foreground">Running Pro 2</p>
          <p className="text-xs text-muted">New collection</p>
        </div>
        <Button size="sm">$129 · Buy now</Button>
      </CardFooter>
    </Card>
  );
}
