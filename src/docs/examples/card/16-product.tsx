import { Heart, ShoppingBag } from "lucide-react";
import { Button, Card, CardBody, CardFooter, CardMedia, Chip, Rating } from "nr-ui-kit";

const products = [
  { seed: "nr-shoe", name: "Trail runner", price: 89, old: 120, rating: 4.5, tag: "-25%" },
  { seed: "nr-bag", name: "City backpack", price: 64, rating: 4, tag: "New" },
  { seed: "nr-watch", name: "Classic watch", price: 149, rating: 5 },
];

export default function CardProduct() {
  return (
    <div className="grid w-full gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {products.map((p) => (
        <Card key={p.seed} variant="flat" isHoverable>
          <CardMedia src={`https://picsum.photos/seed/${p.seed}/600/600`} alt={p.name} aspect="square" isInset>
            <div className="flex items-start justify-between p-2.5">
              {p.tag ? <Chip size="sm" variant="primary" color={p.old ? "danger" : "accent"}>{p.tag}</Chip> : <span />}
              <Button isIconOnly size="sm" variant="glass" aria-label={`Save ${p.name}`}>
                <Heart size={15} />
              </Button>
            </div>
          </CardMedia>
          <CardBody className="pt-3">
            <p className="font-medium text-foreground">{p.name}</p>
            <Rating value={p.rating} size="xs" isReadOnly />
          </CardBody>
          <CardFooter className="justify-between">
            <p className="text-base font-semibold text-foreground">
              ${p.price} {p.old && <span className="text-sm font-normal text-muted line-through">${p.old}</span>}
            </p>
            <Button size="sm" startContent={<ShoppingBag size={14} />}>Add</Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
