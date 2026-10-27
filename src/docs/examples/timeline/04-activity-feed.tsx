import { CreditCard, ShoppingBag, UserPlus } from "lucide-react";
import { Timeline } from "nr-ui-kit";

export default function TimelineActivityFeed() {
  return (
    <div className="mx-auto w-full max-w-md rounded-3xl bg-surface p-5 shadow-surface">
      <div className="mb-5 flex items-center justify-between">
        <p className="text-base font-medium text-foreground">So'nggi faollik</p>
        <a href="#" className="text-sm text-muted hover:text-foreground">Barchasi</a>
      </div>
      <Timeline
        items={[
          { id: "1", title: "Yangi buyurtma #4821", description: "Ali Valiyev · $129", time: "2 daq", icon: <ShoppingBag />, color: "accent" },
          { id: "2", title: "To'lov qabul qilindi", description: "Pro tarif · yillik", time: "1 soat", icon: <CreditCard />, color: "success" },
          { id: "3", title: "Yangi a'zo qo'shildi", description: "madina@acme.uz", time: "3 soat", icon: <UserPlus /> },
        ]}
      />
    </div>
  );
}
