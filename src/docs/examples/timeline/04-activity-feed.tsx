import { CreditCard, ShoppingBag, UserPlus } from "lucide-react";
import { Timeline } from "nr-ui-kit";

export default function TimelineActivityFeed() {
  return (
    <div className="mx-auto w-full max-w-md rounded-3xl bg-surface p-5 shadow-surface">
      <div className="mb-5 flex items-center justify-between">
        <p className="text-base font-medium text-foreground">Recent activity</p>
        <a href="#" className="text-sm text-muted hover:text-foreground">View all</a>
      </div>
      <Timeline
        items={[
          { id: "1", title: "New order #4821", description: "Ali Valiyev · $129", time: "2 min", icon: <ShoppingBag />, color: "accent" },
          { id: "2", title: "Payment received", description: "Pro plan · yearly", time: "1 hour", icon: <CreditCard />, color: "success" },
          { id: "3", title: "New member joined", description: "madina@acme.uz", time: "3 hours", icon: <UserPlus /> },
        ]}
      />
    </div>
  );
}
