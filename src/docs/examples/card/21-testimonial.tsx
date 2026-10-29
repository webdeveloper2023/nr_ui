import { Quote } from "lucide-react";
import { Avatar, Card, CardBody, CardFooter, Rating } from "nr-ui-kit";

const reviews = [
  { name: "Malika Yusupova", role: "Shop owner", text: "We moved our whole store admin to it in a week. The forms and tables just work on a phone." },
  { name: "Javohir Tursunov", role: "Frontend lead", text: "Clean defaults, sensible props, and every component already adapts to the screen." },
];

export default function CardTestimonial() {
  return (
    <div className="grid w-full gap-4 md:grid-cols-2">
      {reviews.map((r, i) => (
        <Card key={r.name} size="lg" variant={i === 0 ? "accent" : "elevated"}>
          <CardBody className="pt-6">
            <Quote size={24} className="text-accent" />
            <p className="text-foreground">{r.text}</p>
            <Rating value={5} size="xs" isReadOnly />
          </CardBody>
          <CardFooter>
            <Avatar name={r.name} size="sm" />
            <div>
              <p className="text-sm font-medium text-foreground">{r.name}</p>
              <p className="text-xs text-muted">{r.role}</p>
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
