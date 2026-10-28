import { Clock, MoreVertical, ShoppingCart, TrendingDown } from "lucide-react";
import { Button, StatCard } from "nr-ui-kit";

const menu = (
  <Button isIconOnly size="sm" variant="ghost" aria-label="Actions">
    <MoreVertical size={16} />
  </Button>
);

export default function StatCardWithActions() {
  return (
    <div className="grid w-full max-w-2xl gap-4 sm:grid-cols-2">
      <StatCard title="Conversion" value="3.8%" change={1.7} color="success" icon={<ShoppingCart />} actions={menu} />
      <StatCard title="Bounce rate" value="42.3%" change={-5.9} isInverted color="danger" icon={<TrendingDown />} actions={menu} />
      <StatCard title="Load time" value="856 ms" color="warning" icon={<Clock />} actions={menu} progress={56} />
    </div>
  );
}
