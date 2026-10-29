import { MapPin } from "lucide-react";
import { Avatar, Button, Card, CardBody, CardFooter, CardMedia } from "nr-ui-kit";

// Cover image, an avatar that overlaps it, then the details
export default function CardProfile() {
  return (
    <Card size="lg" className="mx-auto w-full max-w-sm">
      <CardMedia src="https://picsum.photos/seed/nr-cover/900/300" alt="" aspect="wide" />
      <CardBody className="-mt-12 items-center text-center">
        <span className="rounded-full bg-surface p-1">
          <Avatar name="Dilnoza Karimova" size="xl" />
        </span>
        <div>
          <p className="text-lg font-semibold text-foreground">Dilnoza Karimova</p>
          <p className="text-sm text-muted">Product designer</p>
          <p className="mt-1 inline-flex items-center gap-1 text-xs text-muted">
            <MapPin size={12} /> Samarkand
          </p>
        </div>
        <div className="mt-2 grid w-full grid-cols-3 divide-x divide-separator rounded-2xl bg-default py-2.5">
          {[["128", "Projects"], ["4.9k", "Followers"], ["312", "Following"]].map(([n, l]) => (
            <div key={l}>
              <p className="font-semibold tabular-nums text-foreground">{n}</p>
              <p className="text-xs text-muted">{l}</p>
            </div>
          ))}
        </div>
      </CardBody>
      <CardFooter>
        <Button variant="tertiary" className="flex-1">Message</Button>
        <Button className="flex-1">Follow</Button>
      </CardFooter>
    </Card>
  );
}
