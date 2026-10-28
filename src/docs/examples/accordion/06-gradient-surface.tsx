import { Accordion, AccordionItem } from "nr-ui-kit";

const faq = [
  { key: "1", title: "How strong is the gradient?", text: "Very subtle — a few percent shift from the surface color toward the accent. You notice it, but it never grabs attention." },
  { key: "2", title: "Can I turn it off?", text: "Yes: set --nr-gradient-surface: none; in your CSS and every card becomes flat." },
  { key: "3", title: "What about dark mode?", text: "Dark mode uses its own, slightly stronger gradient token." },
];

export default function AccordionGradientSurface() {
  return (
    <div className="grid w-full gap-6 md:grid-cols-2">
      <Accordion variant="surface" defaultExpandedKeys={new Set(["1"])}>
        {faq.map((f) => (
          <AccordionItem key={f.key} itemKey={f.key} title={f.title}>{f.text}</AccordionItem>
        ))}
      </Accordion>
      <Accordion variant="splitted">
        {faq.map((f) => (
          <AccordionItem key={f.key} itemKey={f.key} title={f.title}>{f.text}</AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
