import { Tabs } from "nr-ui-kit";

const tabs = [
  { key: "overview", title: "Umumiy" },
  { key: "analytics", title: "Analitika" },
  { key: "reports", title: "Hisobotlar" },
];

export default function TabsBasic() {
  return (
    <div className="flex justify-center">
      <Tabs tabs={tabs}>
        {(key) => <p className="text-center text-muted">{tabs.find((t) => t.key === key)?.title} bo'limi kontenti.</p>}
      </Tabs>
    </div>
  );
}
