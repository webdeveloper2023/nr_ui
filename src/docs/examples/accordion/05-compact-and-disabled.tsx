import { Accordion, AccordionItem } from "nr-ui-kit";

export default function AccordionCompactDisabled() {
  return (
    <div className="mx-auto max-w-md">
      <Accordion variant="surface" isCompact disabledKeys={new Set(["3"])}>
        <AccordionItem itemKey="1" title="Yetkazib berish">
          Toshkent bo'ylab 1 kunda, viloyatlarga 2–3 kunda.
        </AccordionItem>
        <AccordionItem itemKey="2" title="Qaytarish">
          14 kun ichida sababsiz qaytarish mumkin.
        </AccordionItem>
        <AccordionItem itemKey="3" title="Kafolat (tez orada)">
          Bu bo'lim hali faol emas.
        </AccordionItem>
      </Accordion>
    </div>
  );
}
