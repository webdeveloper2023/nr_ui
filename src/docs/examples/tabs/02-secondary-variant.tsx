import { Tabs } from "nr-ui-kit";

const tabs = [
  { key: "all", title: "Barchasi" },
  { key: "unread", title: "O'qilmagan" },
  { key: "mentions", title: "Eslatmalar" },
  { key: "archive", title: "Arxiv" },
];

export default function TabsSecondary() {
  return (
    <div className="mx-auto w-full max-w-md">
      <Tabs variant="secondary" tabs={tabs}>
        {(key) => <p className="text-muted">Tanlangan: <span className="font-medium text-foreground">{key}</span></p>}
      </Tabs>
    </div>
  );
}
