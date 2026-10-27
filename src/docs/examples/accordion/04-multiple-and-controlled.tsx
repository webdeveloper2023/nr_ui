import { useState } from "react";
import { Accordion, AccordionItem, Button } from "nr-ui-kit";

const items = [
  { key: "a", title: "1-bosqich: Rejalashtirish", text: "Talablar yig'iladi va reja tuziladi." },
  { key: "b", title: "2-bosqich: Dizayn", text: "Figma'da maketlar tayyorlanadi." },
  { key: "c", title: "3-bosqich: Ishlab chiqish", text: "Komponentlar va API yoziladi." },
];

export default function AccordionMultipleControlled() {
  const [expanded, setExpanded] = useState<Set<string>>(new Set(["a", "b"]));

  return (
    <div className="mx-auto flex max-w-xl flex-col gap-4">
      <div className="flex gap-2">
        <Button size="sm" variant="tertiary" onClick={() => setExpanded(new Set(items.map((i) => i.key)))}>
          Hammasini ochish
        </Button>
        <Button size="sm" variant="ghost" onClick={() => setExpanded(new Set())}>
          Hammasini yopish
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
