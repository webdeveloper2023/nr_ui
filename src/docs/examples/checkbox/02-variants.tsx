import { Checkbox } from "nr-ui-kit";

// primary — on the gray canvas; secondary — inside a white card
export default function CheckboxVariants() {
  return (
    <div className="mx-auto grid w-full max-w-2xl gap-6 sm:grid-cols-2">
      <div className="flex flex-col justify-center gap-3">
        <Checkbox variant="primary" description="White box with a soft shadow">
          Primary checkbox
        </Checkbox>
        <Checkbox variant="primary" defaultSelected>
          Selected
        </Checkbox>
      </div>
      <div className="flex flex-col gap-3 rounded-3xl bg-surface p-5 shadow-surface">
        <Checkbox variant="secondary" description="For use inside cards">
          Secondary checkbox
        </Checkbox>
        <Checkbox variant="secondary" defaultSelected>
          Selected
        </Checkbox>
      </div>
    </div>
  );
}
