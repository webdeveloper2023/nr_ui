import { useDesignStyle } from "../designStyle";
import SolidDashboard from "./dashboards/SolidDashboard";
import FrostedDashboard from "./dashboards/FrostedDashboard";
import LiquidDashboard from "./dashboards/LiquidDashboard";

// One dashboard per design style — switched from the style control in each dashboard's header.
export default function Dashboard() {
  const [style] = useDesignStyle();
  if (style === "liquid") return <LiquidDashboard />;
  if (style === "frosted") return <FrostedDashboard />;
  return <SolidDashboard />;
}
