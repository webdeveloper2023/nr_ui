import { Checkbox } from "nr-ui-kit";

export default function CheckboxColorsAndSizes() {
  return (
    <div className="flex flex-wrap items-start justify-center gap-12">
      <div className="flex flex-col gap-3">
        <Checkbox color="accent" defaultSelected>Accent</Checkbox>
        <Checkbox color="default" defaultSelected>Default</Checkbox>
        <Checkbox color="success" defaultSelected>Success</Checkbox>
        <Checkbox color="warning" defaultSelected>Warning</Checkbox>
        <Checkbox color="danger" defaultSelected>Danger</Checkbox>
      </div>
      <div className="flex flex-col gap-3">
        <Checkbox size="xs" defaultSelected>Extra small</Checkbox>
        <Checkbox size="sm" defaultSelected>Small</Checkbox>
        <Checkbox size="md" defaultSelected>Medium</Checkbox>
        <Checkbox size="lg" defaultSelected>Large</Checkbox>
      </div>
    </div>
  );
}
