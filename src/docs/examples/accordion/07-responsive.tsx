import { Accordion, AccordionItem } from "nr-ui-kit";

const items = [
  { key: "1", title: "Does it work on phones?", text: "Yes — with responsive every trigger is at least 48px tall, easy to tap." },
  { key: "2", title: "And on large screens?", text: "On desktop the padding and the text grow a step." },
  { key: "3", title: "Can I pick the breakpoints?", text: 'Pass a list: responsive={["m", "t"]} adapts on mobile and tablet only.' },
];

// Resize the window to see the triggers and padding change.
export default function AccordionResponsive() {
  return (
    <Accordion responsive variant="surface" defaultExpandedKeys={new Set(["1"])}>
      {items.map((item) => (
        <AccordionItem key={item.key} itemKey={item.key} title={item.title}>
          {item.text}
        </AccordionItem>
      ))}
    </Accordion>
  );
}
