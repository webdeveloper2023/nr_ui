import { Accordion, AccordionItem } from "nr-ui-kit";

const faq = [
  { key: "1", title: "NR UI nima?", text: "Shaxsiy React komponent kutubxonasi — Tailwind v4, TypeScript va dark mode bilan." },
  { key: "2", title: "Dark mode qanday yoqiladi?", text: "<html> elementiga dark klassini qo'shing — barcha ranglar tokenlar orqali almashadi." },
  { key: "3", title: "Ranglarni o'zgartirsa bo'ladimi?", text: "Ha, theme.css dagi --color-accent va boshqa tokenlarni qayta e'lon qiling." },
];

const variants = ["default", "surface", "bordered", "splitted"] as const;

export default function AccordionVariants() {
  return (
    <div className="mx-auto flex max-w-xl flex-col gap-8">
      {variants.map((variant) => (
        <div key={variant}>
          <p className="mb-2 text-xs font-medium text-muted">variant="{variant}"</p>
          <Accordion variant={variant}>
            {faq.map((item) => (
              <AccordionItem key={item.key} itemKey={item.key} title={item.title}>
                {item.text}
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      ))}
    </div>
  );
}
