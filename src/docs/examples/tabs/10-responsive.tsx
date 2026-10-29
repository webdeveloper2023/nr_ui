import { Tabs } from "nr-ui-kit";

const tabs = ["Overview", "Analytics", "Reports", "Notifications", "Integrations", "Settings"].map((title) => ({
  key: title.toLowerCase(),
  title,
}));

// Resize the window: on mobile the list scrolls sideways with touch-sized tabs instead of overflowing.
export default function TabsResponsive() {
  return (
    <div className="flex w-full flex-col gap-6">
      <Tabs tabs={tabs} responsive />
      <Tabs variant="secondary" tabs={tabs} responsive={["m"]} />
    </div>
  );
}
