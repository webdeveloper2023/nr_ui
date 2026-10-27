import { ArrowRight, CreditCard, Server } from "lucide-react";
import { StatCard } from "nr-ui-kit";

const link = (label: string) => (
  <a href="#" className="flex items-center justify-between text-sm font-medium text-foreground hover:text-accent">
    {label} <ArrowRight size={15} />
  </a>
);

export default function StatCardWithFooter() {
  return (
    <div className="grid w-full max-w-2xl gap-4 sm:grid-cols-2">
      <StatCard title="Faol obunalar" value="2,350" change={18} icon={<CreditCard />} footer={link("Obunalarni ko'rish")} />
      <StatCard title="Server uptime" value="99.98%" change={0} color="success" icon={<Server />} footer={link("Status sahifasi")} />
    </div>
  );
}
