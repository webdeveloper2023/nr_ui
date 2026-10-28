import { Tabs } from "nr-ui-kit";

const tabs = [
  { key: "day", title: "Kun" },
  { key: "week", title: "Hafta" },
  { key: "month", title: "Oy" },
  { key: "year", title: "Yil" },
];

export default function TabsSizes() {
  return (
    <div className="flex flex-col items-center gap-4">
      <Tabs size="xs" tabs={tabs} defaultSelectedKey="week" />
      <Tabs size="sm" tabs={tabs} defaultSelectedKey="week" />
      <Tabs size="md" tabs={tabs} defaultSelectedKey="week" />
      <Tabs size="lg" tabs={tabs} defaultSelectedKey="week" />
    </div>
  );
}
