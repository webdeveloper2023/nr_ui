import { Tabs } from "nr-ui-kit";

const tabs = [
  { key: "day", title: "Kun" },
  { key: "week", title: "Hafta" },
  { key: "month", title: "Oy" },
  { key: "year", title: "Yil" },
];

export default function TabsGlass() {
  return (
    <div className="relative flex w-full justify-center overflow-hidden rounded-3xl px-6 py-12">
      <div aria-hidden className="absolute -left-10 -top-12 size-56 rounded-full bg-blue opacity-70 blur-3xl" />
      <div aria-hidden className="absolute -right-8 top-6 size-60 rounded-full bg-pink opacity-60 blur-3xl" />
      <div aria-hidden className="absolute -bottom-16 left-1/3 size-56 rounded-full bg-mint opacity-60 blur-3xl" />
      <div className="relative">
        <Tabs tabs={tabs} isBlurred defaultSelectedKey="week">
          {(key) => <p className="pt-3 text-center text-sm text-foreground/80">{tabs.find((t) => t.key === key)?.title} bo'yicha hisobot</p>}
        </Tabs>
      </div>
    </div>
  );
}
