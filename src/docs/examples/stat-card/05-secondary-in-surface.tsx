import { Activity, Eye, MousePointerClick } from "lucide-react";
import { StatCard } from "nr-ui-kit";

export default function StatCardSecondaryInSurface() {
  return (
    <div className="w-full rounded-3xl bg-surface p-4 shadow-surface">
      <p className="mb-3 px-1 text-sm font-medium text-foreground">This week</p>
      <div className="grid gap-3 sm:grid-cols-3">
        <StatCard variant="secondary" title="Views" value="91.4K" change={6.3} icon={<Eye />} />
        <StatCard variant="secondary" title="Clicks" value="7,021" change={-2.1} color="danger" icon={<MousePointerClick />} />
        <StatCard variant="secondary" title="Session" value="4m 12s" change={0.8} color="success" icon={<Activity />} />
      </div>
    </div>
  );
}
