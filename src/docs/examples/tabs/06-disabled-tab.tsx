import { Tabs } from "nr-ui-kit";

export default function TabsDisabled() {
  return (
    <div className="flex justify-center">
      <Tabs
        disabledKeys={["reports"]}
        tabs={[
          { key: "overview", title: "Umumiy" },
          { key: "analytics", title: "Analitika" },
          { key: "reports", title: "Hisobotlar" },
          { key: "settings", title: "Sozlamalar" },
        ]}
      />
    </div>
  );
}
