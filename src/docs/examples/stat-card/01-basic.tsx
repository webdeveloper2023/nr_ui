import { DollarSign, ShoppingCart, Users } from "lucide-react";
import { StatCard } from "nr-ui-kit";

export default function StatCardBasic() {
  return (
    <div className="grid w-full gap-4 sm:grid-cols-3">
      <StatCard title="Jami daromad" value="$156,540" change={12.4} icon={<DollarSign />} />
      <StatCard title="Yangi mijozlar" value="1,234" change={1.0} color="success" icon={<Users />} />
      <StatCard title="Buyurtmalar" value="842" change={0} color="warning" icon={<ShoppingCart />} />
    </div>
  );
}
