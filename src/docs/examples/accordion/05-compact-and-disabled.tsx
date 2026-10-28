import { Accordion, AccordionItem } from "nr-ui-kit";

export default function AccordionCompactDisabled() {
  return (
    <div className="mx-auto max-w-md">
      <Accordion variant="surface" isCompact disabledKeys={new Set(["3"])}>
        <AccordionItem itemKey="1" title="Shipping">
          1 day within Tashkent, 2–3 days to other regions.
        </AccordionItem>
        <AccordionItem itemKey="2" title="Returns">
          Return any item within 14 days, no questions asked.
        </AccordionItem>
        <AccordionItem itemKey="3" title="Warranty (coming soon)">
          This section isn't available yet.
        </AccordionItem>
      </Accordion>
    </div>
  );
}
