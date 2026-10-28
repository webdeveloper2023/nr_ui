import { Activity, DollarSign, Users } from "lucide-react";
import { StatCard } from "nr-ui-kit";

export default function StatCardGlassAndGradient() {
  return (
    <div className="relative grid w-full gap-4 overflow-hidden rounded-3xl p-6 sm:grid-cols-3 sm:p-8">
      <div aria-hidden className="absolute -left-10 -top-12 size-56 rounded-full bg-blue opacity-70 blur-3xl" />
      <div aria-hidden className="absolute -right-8 top-6 size-60 rounded-full bg-pink opacity-60 blur-3xl" />
      <div aria-hidden className="absolute -bottom-16 left-1/3 size-56 rounded-full bg-mint opacity-60 blur-3xl" />
      <StatCard className="relative" title="Daromad" value="$48,210" change={8.4} icon={<DollarSign />} chartData={[4, 6, 5, 8, 7, 10, 12]} />
      <StatCard className="relative" variant="glass" title="Faol foydalanuvchi" value="3,942" change={4.1} color="success" icon={<Users />} chartData={[3, 4, 4, 6, 5, 7, 8]} />
      <StatCard className="relative" variant="gradient" title="Konversiya" value="12.8%" change={2.3} icon={<Activity />} progress={64} />
    </div>
  );
}
