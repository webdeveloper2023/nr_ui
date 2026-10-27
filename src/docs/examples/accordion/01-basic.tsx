import { Accordion, AccordionItem } from "nr-ui-kit";

const faq = [
  { key: "1", title: "NR UI nima?", text: "Shaxsiy React komponent kutubxonasi — Tailwind v4, TypeScript va dark mode bilan." },
  { key: "2", title: "Dark mode qanday yoqiladi?", text: "<html> elementiga dark klassini qo'shing — barcha ranglar tokenlar orqali almashadi." },
  { key: "3", title: "Ranglarni o'zgartirsa bo'ladimi?", text: "Ha, theme.css dagi --color-accent va boshqa tokenlarni qayta e'lon qiling." },
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
