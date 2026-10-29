import { DollarSign, Users } from "lucide-react";
import { Grid, StatCard } from "nr-ui-kit";

// Resize the window: compact on mobile, roomier with a larger value on desktop.
export default function StatCardResponsive() {
  return (
    <Grid cols={2} gap="md" responsive className="w-full">
      <StatCard title="Total revenue" value="$156,540" change={12.4} icon={<DollarSign />} responsive />
      <StatCard title="New customers" value="1,234" change={-2.1} color="success" icon={<Users />} responsive />
    </Grid>
  );
}
