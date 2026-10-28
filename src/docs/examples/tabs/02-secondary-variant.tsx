import { Tabs } from "nr-ui-kit";

const tabs = [
  { key: "all", title: "All" },
  { key: "unread", title: "Unread" },
  { key: "mentions", title: "Mentions" },
  { key: "archive", title: "Archive" },
];

export default function TabsSecondary() {
  return (
    <div className="mx-auto w-full max-w-md">
      <Tabs variant="secondary" tabs={tabs}>
        {(key) => <p className="text-muted">Selected: <span className="font-medium text-foreground">{key}</span></p>}
      </Tabs>
    </div>
  );
}
