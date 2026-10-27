import { useState } from "react";
import { Button, Tabs } from "nr-ui-kit";

const keys = ["monthly", "quarterly", "yearly"];

export default function TabsControlled() {
  const [selected, setSelected] = useState("monthly");

  return (
    <div className="flex flex-col items-center gap-4">
      <Tabs
        fullWidth
        className="w-full max-w-sm"
        selectedKey={selected}
        onSelectionChange={setSelected}
        tabs={[
          { key: "monthly", title: "Oylik" },
          { key: "quarterly", title: "Choraklik" },
          { key: "yearly", title: "Yillik" },
        ]}
      />
      <div className="flex items-center gap-3 text-sm text-muted">
        Tanlangan: <span className="font-medium text-foreground">{selected}</span>
        <Button size="sm" variant="tertiary" onClick={() => setSelected(keys[(keys.indexOf(selected) + 1) % keys.length])}>
          Keyingisi
        </Button>
      </div>
    </div>
  );
}
