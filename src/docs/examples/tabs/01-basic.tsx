import { Tabs } from "nr-ui-kit";

const tabs = [
  { key: "overview", title: "Overview" },
  { key: "analytics", title: "Analytics" },
  { key: "reports", title: "Reports" },
];

export default function TabsBasic() {
  return (
    <div className="flex justify-center">
      <Tabs tabs={tabs}>
        {(key) => <p className="text-center text-muted">{tabs.find((t) => t.key === key)?.title} section content.</p>}
      </Tabs>
    </div>
  );
}
