import { Tabs } from "nr-ui-kit";

export default function TabsDisabled() {
  return (
    <div className="flex justify-center">
      <Tabs
        disabledKeys={["reports"]}
        tabs={[
          { key: "overview", title: "Overview" },
          { key: "analytics", title: "Analytics" },
          { key: "reports", title: "Reports" },
          { key: "settings", title: "Settings" },
        ]}
      />
    </div>
  );
}
