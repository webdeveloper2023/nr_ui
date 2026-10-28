import { useState } from "react";
import { Accordion, AccordionItem, Button } from "nr-ui-kit";

const items = [
  { key: "a", title: "Step 1: Planning", text: "Requirements are gathered and a plan is made." },
  { key: "b", title: "Step 2: Design", text: "Mockups are prepared in Figma." },
  { key: "c", title: "Step 3: Development", text: "Components and the API are built." },
];

export default function AccordionMultipleControlled() {
  const [expanded, setExpanded] = useState<Set<string>>(new Set(["a", "b"]));

  return (
    <div className="mx-auto flex max-w-xl flex-col gap-4">
      <div className="flex gap-2">
        <Button size="sm" variant="tertiary" onClick={() => setExpanded(new Set(items.map((i) => i.key)))}>
          Expand all
        </Button>
        <Button size="sm" variant="ghost" onClick={() => setExpanded(new Set())}>
          Collapse all
        </Button>
      </div>
      <Accordion variant="splitted" selectionMode="multiple" expandedKeys={expanded} onExpandedChange={setExpanded}>
        {items.map((item) => (
          <AccordionItem key={item.key} itemKey={item.key} title={item.title}>
            {item.text}
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
