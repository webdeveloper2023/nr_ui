import { Checkbox } from "nr-ui-kit";

export default function CheckboxRounded() {
  return (
    <div className="flex flex-col items-center gap-3">
      <Checkbox radius="full" size="sm">Small</Checkbox>
      <Checkbox radius="full" defaultSelected>Medium</Checkbox>
      <Checkbox radius="full" size="lg">Large</Checkbox>
    </div>
  );
}
