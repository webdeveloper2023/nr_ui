import { CheckCircle2, CreditCard, MessageCircle } from "lucide-react";
import { Avatar, Card, CardHeader } from "nr-ui-kit";

const items = [
  { start: <Avatar name="Aziz Rahimov" size="sm" />, title: "Aziz Rahimov commented", text: "Looks great, ship it!", time: "2m" },
  { start: <CheckCircle2 size={20} className="text-success" />, title: "Payment received", text: "Order #1048 · $129.00", time: "1h" },
  { start: <CreditCard size={20} className="text-warning" />, title: "Card expires soon", text: "Update it before 30 November", time: "3h" },
  { start: <MessageCircle size={20} className="text-accent" />, title: "New support ticket", text: "“Can I change my delivery address?”", time: "1d" },
];

// Dense list of sm cards: startContent for the icon, endContent for the time
export default function CardNotifications() {
  return (
    <div className="mx-auto flex w-full max-w-md flex-col gap-2">
      {items.map((n) => (
        <Card key={n.title} size="sm" variant="flat" isPressable>
          <CardHeader
            className="items-center pb-3"
            startContent={<span className="flex h-8 w-8 items-center justify-center">{n.start}</span>}
            title={n.title}
            description={n.text}
            endContent={<span className="text-xs text-muted">{n.time}</span>}
          />
        </Card>
      ))}
    </div>
  );
}
