import { DollarSign } from "lucide-react";
import { StatCard } from "nr-ui-kit";

// Three sizes: padding, value text and the sparkline height follow the size
export default function StatCardSizes() {
  return (
    <div className="grid w-full items-start gap-4 md:grid-cols-3">
      {(["sm", "md", "lg"] as const).map((size) => (
        <StatCard
          key={size}
          size={size}
          title={`Revenue · ${size}`}
          value="$48,230"
          change={12.5}
          icon={<DollarSign />}
          chartData={[22, 28, 25, 31, 36, 33, 40, 44]}
        />
      ))}
    </div>
  );
}
