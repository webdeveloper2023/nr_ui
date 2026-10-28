import { Accordion, AccordionItem } from "nr-ui-kit";

const faq = [
  { key: "1", title: "Gradient qanchalik kuchli?", text: "Juda yengil — surface rangidan accent tomon bir necha foiz farq. Ko'z sezadi, lekin e'tiborni tortmaydi." },
  { key: "2", title: "O'chirsa bo'ladimi?", text: "Ha: CSS'da --nr-gradient-surface: none; deb yozing — barcha kartalar tekis bo'ladi." },
  { key: "3", title: "Dark mode'da-chi?", text: "Dark mode uchun alohida, biroz kuchliroq gradient tokeni ishlatiladi." },
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
