import { Accordion, AccordionItem } from "nr-ui-kit";

const faq = [
  { key: "1", title: "What is NR UI?", text: "A personal React component library built with Tailwind v4, TypeScript and dark mode." },
  { key: "2", title: "How do I turn on dark mode?", text: "Add the dark class to the <html> element — every color switches through tokens." },
  { key: "3", title: "Can I change the colors?", text: "Yes — redeclare --color-accent and the other tokens from theme.css." },
];

export default function AccordionBasic() {
  return (
    <div className="mx-auto max-w-xl">
      <Accordion defaultExpandedKeys={new Set(["1"])}>
        {faq.map((item) => (
          <AccordionItem key={item.key} itemKey={item.key} title={item.title}>
            {item.text}
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
